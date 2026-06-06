/**
 * practitionerApplications — public application form + owner review pipeline.
 *
 * POST /api/practitioner-applications        — public submission; notifies founder by email
 * GET  /api/practitioner-applications        — owner only, list all
 * PATCH /api/practitioner-applications/:id   — owner only, approve (triggers Stripe Connect
 *                                              onboarding link + Clerk invite + email) or decline
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, practitionerApplicationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireFounderOnlyAuth } from "../lib/kitAuth";
import { logger } from "../lib/logger";
import {
  notifyFounderOfApplication,
  notifyApplicantApproved,
  notifyApplicantDeclined,
} from "../lib/practitionerMailer";
import Stripe from "stripe";
import { clerkClient } from "@clerk/express";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getReviewUrl(): string {
  const base =
    process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:8081");
  return `${base}/north-star/arc/practitioners`;
}

// ── POST /practitioner-applications — public ──────────────────────────────────

const SubmitSchema = z.object({
  name: z.string().min(1).max(200),
  community: z.string().min(1).max(300),
  doctrineSummary: z.string().min(10).max(2000),
  contactEmail: z.string().email(),
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = SubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  try {
    const [app] = await db
      .insert(practitionerApplicationsTable)
      .values({
        name: parsed.data.name,
        community: parsed.data.community,
        doctrineSummary: parsed.data.doctrineSummary,
        contactEmail: parsed.data.contactEmail,
        status: "pending",
      })
      .returning();

    logger.info({ id: app?.id, email: parsed.data.contactEmail }, "practitioner application submitted");

    // Notify founder — fire-and-forget
    void notifyFounderOfApplication({
      applicantName: parsed.data.name,
      community: parsed.data.community,
      doctrineSummary: parsed.data.doctrineSummary,
      contactEmail: parsed.data.contactEmail,
      reviewUrl: getReviewUrl(),
    });

    res.status(201).json({ ok: true, id: app?.id });
  } catch (err) {
    logger.error({ err }, "practitionerApplications: POST failed");
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// ── GET /practitioner-applications — founder only ────────────────────────────

router.get("/", requireFounderOnlyAuth, async (_req: Request, res: Response) => {
  try {
    const apps = await db
      .select()
      .from(practitionerApplicationsTable)
      .orderBy(desc(practitionerApplicationsTable.createdAt));
    res.json({ applications: apps });
  } catch (err) {
    logger.error({ err }, "practitionerApplications: GET failed");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ── PATCH /practitioner-applications/:id — founder only, approve or decline ───
//
// On approve:
//   1. Create Stripe Connect Express account + return onboarding URL
//   2. Send Clerk invitation to the practitioner's email (note: stores invitationId,
//      NOT the Clerk user ID — the user ID is populated later when they accept and
//      first authenticate via the kit builder)
//   3. Send approval email with Connect onboarding link
// On decline:
//   1. Send decline email

const ReviewSchema = z.object({
  status: z.enum(["approved", "declined"]),
  reviewNote: z.string().max(2000).optional(),
});

router.patch("/:id", requireFounderOnlyAuth, async (req: Request, res: Response) => {
  const rawId = req.params["id"];
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    res.status(400).json({ error: "id required" });
    return;
  }

  const parsed = ReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(practitionerApplicationsTable)
      .where(eq(practitionerApplicationsTable.id, id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    let stripeAccountId: string | null = existing.stripeAccountId;
    let connectOnboardingUrl: string | undefined;
    let clerkUserId: string | null = existing.clerkUserId;

    if (parsed.data.status === "approved") {
      // ── 1. Create Stripe Connect account ──────────────────────────────────
      const stripe = getStripe();
      if (stripe && !stripeAccountId) {
        try {
          const base = process.env.API_BASE_URL ??
            (process.env.REPLIT_DEV_DOMAIN
              ? `https://${process.env.REPLIT_DEV_DOMAIN}`
              : "http://localhost:8081");

          const account = await stripe.accounts.create({ type: "express" });
          stripeAccountId = account.id;

          const link = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${base}/north-star/kits`,
            return_url: `${base}/north-star/kits`,
            type: "account_onboarding",
          });
          connectOnboardingUrl = link.url;

          logger.info({ applicantId: id, stripeAccountId }, "Stripe Connect account created for practitioner");
        } catch (stripeErr) {
          logger.error({ stripeErr }, "practitionerApplications: Stripe Connect creation failed (non-fatal)");
        }
      }

      // ── 2. Invite practitioner as a Clerk user (non-fatal if it fails) ────
      // Important: invitation.id is an invitation identifier, NOT the eventual
      // Clerk user ID. clerkUserId stays null here; it is populated the first time
      // the practitioner authenticates via the kit builder (self-healing lookup
      // by contact_email in POST /kits/draft).
      if (!clerkUserId) {
        try {
          const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: existing.contactEmail,
            publicMetadata: { role: "practitioner", community: existing.community },
            redirectUrl: process.env.CLERK_PRACTITIONER_REDIRECT_URL ?? undefined,
          });
          // Log the invitation ID for audit trail but do NOT store as clerkUserId
          logger.info({ applicantId: id, invitationId: invitation.id }, "Clerk invitation sent to practitioner");
        } catch (clerkErr) {
          logger.warn({ clerkErr }, "practitionerApplications: Clerk invitation failed (non-fatal)");
        }
      }
    }

    // ── Persist the decision ──────────────────────────────────────────────────
    const [updated] = await db
      .update(practitionerApplicationsTable)
      .set({
        status: parsed.data.status,
        reviewNote: parsed.data.reviewNote ?? null,
        reviewedAt: new Date(),
        stripeAccountId,
        // clerkUserId intentionally NOT updated here (still null until practitioner accepts)
        clerkUserId,
      })
      .where(eq(practitionerApplicationsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Application not found after update" });
      return;
    }

    // ── 3. Send notification email — fire-and-forget ──────────────────────────
    if (parsed.data.status === "approved") {
      void notifyApplicantApproved({
        to: existing.contactEmail,
        name: existing.name,
        connectOnboardingUrl,
      });
    } else {
      void notifyApplicantDeclined({
        to: existing.contactEmail,
        name: existing.name,
        note: parsed.data.reviewNote,
      });
    }

    logger.info({ id, status: parsed.data.status, stripeAccountId }, "practitioner application reviewed");
    res.json({ ok: true, application: updated, connectOnboardingUrl });
  } catch (err) {
    logger.error({ err }, "practitionerApplications: PATCH failed");
    res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
