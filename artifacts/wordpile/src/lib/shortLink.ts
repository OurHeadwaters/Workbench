/**
 * Server-stored short links.
 *
 * Companion to `shareLink.ts`. Where `shareLink` keeps everything in the
 * URL fragment (zero server involvement, but URLs can grow past what some
 * messaging apps will accept), `shortLink` POSTs the same gzip+base64
 * payload to the API and gives back a tiny slug. The recipient hits
 * `/wordpile/s/<slug>`, the page fetches the payload, and the rest of
 * the import flow is unchanged.
 *
 * Privacy tradeoff (surfaced in the editor UI when the user opts in):
 *   - Fragment links: contents stay client-side; the server never sees
 *     them. Anyone with the URL can read it forever.
 *   - Short links: contents live on our server, indexed by the random
 *     slug. Anyone with the URL can read it until the owner revokes.
 */
import type { ShareEncodeResult } from "./shareLink";
import { encodePileShare } from "./shareLink";
import type { PileExport } from "@/data/types";

const API_PREFIX = "/api/wordpile/short-links";

export interface ShortLinkSummary {
  slug: string;
  pileId: string | null;
  pileName: string;
  payloadLength: number;
  createdAt: string;
}

export interface ShortLinkResolved {
  slug: string;
  payload: string;
  pileName: string;
}

export type CreateShortLinkResult =
  | { ok: true; summary: ShortLinkSummary }
  | {
      ok: false;
      reason:
        | "encode-failed"
        | "encode-too-large"
        | "encode-unsupported"
        | "unauthenticated"
        | "too-large"
        | "network"
        | "server";
    };

export type ListShortLinksResult =
  | { ok: true; links: ShortLinkSummary[] }
  | { ok: false; reason: "unauthenticated" | "network" | "server" };

export type RevokeShortLinkResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "not-found" | "network" | "server" };

export type ResolveShortLinkResult =
  | { ok: true; payload: ShortLinkResolved }
  | { ok: false; reason: "not-found" | "network" | "server" };

function reasonFromEncodeFailure(
  result: Exclude<ShareEncodeResult, { ok: true }>,
): CreateShortLinkResult {
  if (result.reason === "too-large") {
    return { ok: false, reason: "encode-too-large" };
  }
  if (result.reason === "unsupported") {
    return { ok: false, reason: "encode-unsupported" };
  }
  return { ok: false, reason: "encode-failed" };
}

/**
 * Create a short link for the given pile export. The pile is encoded
 * exactly the same way as a fragment-link share (gzip+base64url) so a
 * server-stored payload is byte-identical to what the URL would have
 * carried — only the storage location changes.
 */
export async function createShortLink(
  pile: PileExport,
  meta: { pileId?: string | null } = {},
): Promise<CreateShortLinkResult> {
  const enc = await encodePileShare(pile);
  if (!enc.ok) return reasonFromEncodeFailure(enc);
  try {
    const res = await fetch(API_PREFIX, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: enc.encoded,
        pileId: meta.pileId ?? undefined,
        pileName: pile.pile.name,
      }),
    });
    if (res.status === 401) return { ok: false, reason: "unauthenticated" };
    if (res.status === 413) return { ok: false, reason: "too-large" };
    if (!res.ok) return { ok: false, reason: "server" };
    const summary = (await res.json()) as ShortLinkSummary;
    return { ok: true, summary };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function listShortLinks(): Promise<ListShortLinksResult> {
  try {
    const res = await fetch(API_PREFIX, { credentials: "include" });
    if (res.status === 401) return { ok: false, reason: "unauthenticated" };
    if (!res.ok) return { ok: false, reason: "server" };
    const body = (await res.json()) as { links?: ShortLinkSummary[] };
    return { ok: true, links: Array.isArray(body.links) ? body.links : [] };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function revokeShortLink(
  slug: string,
): Promise<RevokeShortLinkResult> {
  try {
    const res = await fetch(`${API_PREFIX}/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) return { ok: false, reason: "unauthenticated" };
    if (res.status === 404) return { ok: false, reason: "not-found" };
    if (!res.ok) return { ok: false, reason: "server" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/**
 * Public lookup — recipients of a short link aren't necessarily users of
 * the app, so this endpoint is unauthenticated by design. The server
 * never returns the owner's identity, just the opaque payload + the
 * pile name captured at create time.
 */
export async function resolveShortLink(
  slug: string,
): Promise<ResolveShortLinkResult> {
  try {
    const res = await fetch(`${API_PREFIX}/${encodeURIComponent(slug)}`, {
      credentials: "include",
    });
    if (res.status === 404) return { ok: false, reason: "not-found" };
    if (!res.ok) return { ok: false, reason: "server" };
    const body = (await res.json()) as ShortLinkResolved;
    return { ok: true, payload: body };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/** Build the absolute short URL for a given slug. */
export function buildShortUrl(slug: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "";
  return `${origin}${base}s/${slug}`;
}

// Slug shape mirrors the server-side regex. We keep it narrow so a
// bogus path like `/s/<script>` never even reaches the resolve fetch.
const SLUG_RE = /^[A-Za-z0-9_-]{8,32}$/;

export function isShortLinkSlug(value: string): boolean {
  return SLUG_RE.test(value);
}
