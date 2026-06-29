/**
 * kitDeliveryRecovery — startup sweep for uncommitted email deliveries.
 *
 * The delivery flow commits the kit token to the DB atomically with the
 * idempotency claim row, then calls sendKitDeliveryEmail *outside* that
 * transaction.  If the process crashes between the commit and the email
 * send, the buyer has a committed token but never receives their link.
 * Because the Stripe event is already claimed, retries are silently dropped
 * as duplicates — this is the last remaining gap in crash-safety.
 *
 * Fix: emailSentAt column on kit_tokens (nullable).  After a successful
 * email send, the token row is stamped with the current timestamp.  On
 * startup, this module scans for any non-expired tokens where emailSentAt
 * IS NULL and re-sends those emails idempotently.
 *
 *   stampEmailSent(token)   — called by stripeWebhook after a confirmed send
 *   runKitDeliveryRecovery  — called once on server startup; safe to re-run
 */

import { isNull, gt, eq, and } from "drizzle-orm";
import { db, kitTokensTable, kitDeliveryFailuresTable } from "@workspace/db";
import { logger } from "./logger";
import { getKit } from "./kitsRegistry";
import { sendKitDeliveryEmail, sendKitDeliveryFailureAlert } from "./kitsMailer";

const API_BASE_URL =
  process.env.API_BASE_URL ??
  (process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "http://localhost:8081");

function accessUrl(token: string): string {
  return `${API_BASE_URL}/api/kits/access/${token}`;
}

/**
 * Stamp emailSentAt on a token row after the delivery email is confirmed sent.
 * Called by the Stripe webhook handler immediately after sendKitDeliveryEmail
 * returns status:"sent".  Failures are logged but not re-thrown — the email
 * was already sent so the buyer is safe; a missing stamp just means the
 * startup recovery sweep may attempt (and skip) a harmless resend.
 */
export async function stampEmailSent(token: string): Promise<void> {
  try {
    await db
      .update(kitTokensTable)
      .set({ emailSentAt: new Date() })
      .where(eq(kitTokensTable.token, token));
  } catch (err) {
    logger.error(
      { err, token },
      "[kit-delivery-recovery] failed to stamp emailSentAt — recovery sweep may resend",
    );
  }
}

/**
 * Re-send delivery emails for any non-expired tokens that were committed but
 * never confirmed sent (emailSentAt IS NULL).
 *
 * Called once at startup.  Safe to call multiple times — each successful
 * resend stamps emailSentAt so the row won't be picked up again.
 */
export async function runKitDeliveryRecovery(): Promise<void> {
  let pending: Array<{
    token: string;
    kitId: string;
    buyerEmail: string;
    buyerName: string;
    purchaseId: string;
    expiresAt: Date;
  }>;

  const now = new Date();
  try {
    pending = await db
      .select({
        token: kitTokensTable.token,
        kitId: kitTokensTable.kitId,
        buyerEmail: kitTokensTable.buyerEmail,
        buyerName: kitTokensTable.buyerName,
        purchaseId: kitTokensTable.purchaseId,
        expiresAt: kitTokensTable.expiresAt,
      })
      .from(kitTokensTable)
      .where(
        and(
          isNull(kitTokensTable.emailSentAt),
          gt(kitTokensTable.expiresAt, now),
        ),
      ) as Array<{
        token: string;
        kitId: string;
        buyerEmail: string;
        buyerName: string;
        purchaseId: string;
        expiresAt: Date;
      }>;
  } catch (err) {
    logger.error(
      { err },
      "[kit-delivery-recovery] failed to query uncommitted deliveries — skipping recovery",
    );
    return;
  }

  if (pending.length === 0) {
    logger.info("[kit-delivery-recovery] no uncommitted deliveries found");
    return;
  }

  logger.warn(
    { count: pending.length },
    "[kit-delivery-recovery] found uncommitted kit deliveries — re-sending",
  );

  for (const row of pending) {
    const kit = getKit(row.kitId);
    if (!kit) {
      logger.warn(
        { token: row.token, kitId: row.kitId },
        "[kit-delivery-recovery] unknown kitId — cannot resend, skipping",
      );
      continue;
    }

    const url = accessUrl(row.token);
    let mailResult: Awaited<ReturnType<typeof sendKitDeliveryEmail>>;

    try {
      mailResult = await sendKitDeliveryEmail({
        to: row.buyerEmail,
        buyerName: row.buyerName,
        kit,
        accessUrl: url,
        expiresAt: row.expiresAt,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      mailResult = { status: "failed", error: msg };
    }

    if (mailResult.status === "sent") {
      logger.info(
        { token: row.token, kitId: row.kitId, buyerEmail: row.buyerEmail },
        "[kit-delivery-recovery] resend succeeded",
      );
      await stampEmailSent(row.token);
    } else {
      logger.error(
        { token: row.token, kitId: row.kitId, buyerEmail: row.buyerEmail, error: mailResult.error },
        "[kit-delivery-recovery] resend failed — writing failure record and alerting founder",
      );

      try {
        await db.insert(kitDeliveryFailuresTable).values({
          buyerEmail: row.buyerEmail.toLowerCase(),
          kitId: row.kitId,
          purchaseId: row.purchaseId,
          error: mailResult.error ?? null,
        });
      } catch (dbErr) {
        logger.error(
          { dbErr, token: row.token },
          "[kit-delivery-recovery] failed to persist delivery failure record",
        );
      }

      await sendKitDeliveryFailureAlert({
        buyerEmail: row.buyerEmail,
        kitId: row.kitId,
        purchaseId: row.purchaseId,
        deliveryError: mailResult.error,
      });
    }
  }
}
