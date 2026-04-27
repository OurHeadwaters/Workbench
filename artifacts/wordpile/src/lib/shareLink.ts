/**
 * Share-link encoding for piles.
 *
 * A pile export is small JSON; we gzip it, base64url-encode the bytes,
 * and stuff the result into the URL fragment (`#data=...`). The fragment
 * never reaches the server, so the pile contents stay client-side even
 * though the link can be copy-pasted anywhere.
 *
 * If the encoded payload is too long to be a friendly link (most
 * messaging apps choke past a few KB), we refuse to build/decode it
 * rather than handing the user a broken URL.
 */
import type { PileExport } from "@/data/types";
import { parsePileExport } from "./store";

export const SHARE_FRAGMENT_KEY = "data";

// Generous ceiling for the encoded payload. ~32KB of base64 is roughly a
// 24KB gzip blob, which decompresses to a few hundred KB of JSON — well
// past any reasonable pile size. Past this we ask the practitioner to
// fall back to the .wordpile.json export instead.
export const MAX_ENCODED_LENGTH = 32 * 1024;

export type ShareEncodeResult =
  | { ok: true; encoded: string }
  | { ok: false; reason: "too-large" | "unsupported" | "failed"; size?: number };

export type ShareDecodeResult =
  | { ok: true; payload: PileExport }
  | { ok: false; reason: "too-large" | "unsupported" | "invalid" };

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(encoded: string): Uint8Array {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLen);
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function hasCompressionStream(): boolean {
  return (
    typeof CompressionStream !== "undefined" &&
    typeof DecompressionStream !== "undefined"
  );
}

async function gzip(input: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  // Swallow the writer settlement promises locally so a downstream
  // failure (e.g. malformed input on gunzip) doesn't surface as an
  // unhandled rejection. The outer Response().arrayBuffer() below is
  // what we actually await for the result/error.
  writer.write(input as BufferSource).catch(() => {});
  writer.close().catch(() => {});
  const buf = await new Response(cs.readable).arrayBuffer();
  return new Uint8Array(buf);
}

async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(input as BufferSource).catch(() => {});
  writer.close().catch(() => {});
  const buf = await new Response(ds.readable).arrayBuffer();
  return new Uint8Array(buf);
}

/** Compress + base64url-encode a pile export, ready to drop into a URL. */
export async function encodePileShare(
  payload: PileExport,
): Promise<ShareEncodeResult> {
  if (!hasCompressionStream()) return { ok: false, reason: "unsupported" };
  try {
    const json = JSON.stringify(payload);
    const compressed = await gzip(new TextEncoder().encode(json));
    const encoded = base64UrlEncode(compressed);
    if (encoded.length > MAX_ENCODED_LENGTH) {
      return { ok: false, reason: "too-large", size: encoded.length };
    }
    return { ok: true, encoded };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** Inverse of `encodePileShare`: validate + decompress + reparse. */
export async function decodePileShare(
  encoded: string,
): Promise<ShareDecodeResult> {
  if (encoded.length > MAX_ENCODED_LENGTH) {
    return { ok: false, reason: "too-large" };
  }
  if (!hasCompressionStream()) return { ok: false, reason: "unsupported" };
  try {
    const bytes = base64UrlDecode(encoded);
    const decompressed = await gunzip(bytes);
    const json = new TextDecoder().decode(decompressed);
    const parsed = parsePileExport(json);
    if (!parsed) return { ok: false, reason: "invalid" };
    return { ok: true, payload: parsed };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

/**
 * Build the absolute share URL for an encoded payload, anchored at the
 * artifact's `/import` route so the importer page can pick it up.
 */
export function buildShareUrl(encoded: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "";
  return `${origin}${base}import#${SHARE_FRAGMENT_KEY}=${encoded}`;
}

/**
 * Extract the encoded payload from a `#data=...` fragment, if present.
 * Accepts either the full hash (with leading `#`) or the bare contents.
 */
export function readShareFragment(hash: string): string | null {
  if (!hash) return null;
  const stripped = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!stripped) return null;
  const params = new URLSearchParams(stripped);
  const raw = params.get(SHARE_FRAGMENT_KEY);
  if (!raw) return null;
  return raw;
}
