/**
 * Renders a share-ready PNG snapshot of a Stacker build. We don't depend on
 * html2canvas-style libraries — the structure is simple enough (foundation
 * slab, frame row, trim row, header) that drawing it directly on a canvas
 * gives us pixel-perfect output and full control over the wordpile palette.
 *
 * The returned `dataUrl` is a base64 PNG; callers can hand it to a
 * download-link or `navigator.share` for a system share sheet.
 */
import type { Bucket } from "@/data/types";

export interface SharePiece {
  /** Word as the kid placed it. */
  word: string;
  /** Bucket the word came from — drives the accent stripe color. */
  bucket: Bucket;
  /** True for "untreated" placements that haven't been filed yet. */
  untested?: boolean;
}

export interface ShareInput {
  pileName: string;
  /** Frame slots (in order). null for empty slots. */
  frame: (SharePiece | null)[];
  /** Trim items (in placement order). */
  trim: SharePiece[];
  /** True if the structure has reached the standing threshold. */
  standing: boolean;
  /** Optional override for the second-line subtitle. */
  subtitle?: string;
}

const PALETTE = {
  paper: "#ede4d2",
  cream: "#f4ede0",
  ink: "#1f3d2e",
  stone: "#6b7665",
  rule: "#d4ccb6",
  sand: "#c8bfa7",
  load: "#1f3d2e",
  interior: "#6b7665",
  avoid: "#7a2e2e",
  unsorted: "#957d50",
  grain: "#e3d8bf",
};

const BUCKET_COLOR: Record<Bucket, string> = {
  load: PALETTE.load,
  interior: PALETTE.interior,
  avoid: PALETTE.avoid,
  unsorted: PALETTE.unsorted,
};

const W = 1200;
const H = 900;

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  baseSize: number,
): { font: string; text: string } {
  let size = baseSize;
  while (size > 9) {
    const font = `600 ${size}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
    ctx.font = font;
    if (ctx.measureText(text).width <= maxWidth) return { font, text };
    size -= 1;
  }
  // Last resort: clip with an ellipsis.
  ctx.font = `600 9px "JetBrains Mono", ui-monospace, Menlo, monospace`;
  let clipped = text;
  while (clipped.length > 4 && ctx.measureText(clipped + "…").width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return {
    font: `600 9px "JetBrains Mono", ui-monospace, Menlo, monospace`,
    text: clipped + (clipped === text ? "" : "…"),
  };
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: SharePiece,
  x: number,
  y: number,
  w: number,
  h: number,
  baseFontSize: number,
) {
  const accent = BUCKET_COLOR[piece.bucket];
  // Body
  ctx.fillStyle = piece.bucket === "load" ? accent : PALETTE.paper;
  roundedRect(ctx, x, y, w, h, 6);
  ctx.fill();
  // Accent stripe (bottom edge for trim, full body fill for load)
  if (piece.bucket !== "load") {
    ctx.fillStyle = accent;
    ctx.fillRect(x + 4, y + h - 5, w - 8, 4);
  }
  // Outline
  ctx.strokeStyle = piece.bucket === "load" ? accent : PALETTE.sand;
  ctx.lineWidth = 1.5;
  roundedRect(ctx, x, y, w, h, 6);
  ctx.stroke();
  // Subtle wood grain
  ctx.strokeStyle = "rgba(31, 61, 46, 0.10)";
  ctx.lineWidth = 1;
  for (let g = 0; g < 3; g += 1) {
    const gy = y + 8 + g * Math.max(8, (h - 16) / 4);
    if (gy >= y + h - 6) break;
    ctx.beginPath();
    ctx.moveTo(x + 6, gy);
    ctx.lineTo(x + w - 6, gy);
    ctx.stroke();
  }
  // Word
  ctx.fillStyle = piece.bucket === "load" ? PALETTE.cream : PALETTE.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fitted = fitText(ctx, piece.word, w - 16, baseFontSize);
  ctx.font = fitted.font;
  ctx.fillText(fitted.text, x + w / 2, y + h / 2);
  // Untreated badge
  if (piece.untested) {
    ctx.fillStyle = PALETTE.unsorted;
    ctx.beginPath();
    ctx.arc(x + w - 10, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.cream;
    ctx.font = "700 11px ui-sans-serif, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("?", x + w - 10, y + 10);
  }
}

function drawScene(ctx: CanvasRenderingContext2D, input: ShareInput) {
  // Background — paper with a soft inset border.
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = PALETTE.rule;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Header
  ctx.fillStyle = PALETTE.stone;
  ctx.font = "600 18px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("WORDPILE · BUILD", 60, 80);

  ctx.fillStyle = PALETTE.ink;
  ctx.font = '700 56px "Lora", Georgia, serif';
  ctx.fillText(input.pileName, 60, 140);

  ctx.fillStyle = input.standing ? PALETTE.load : PALETTE.stone;
  ctx.font = '500 22px "Lora", Georgia, serif';
  const subtitle =
    input.subtitle ??
    (input.standing
      ? "It stands. Built with words from the pile."
      : "Working build. The frame isn't full yet.");
  ctx.fillText(subtitle, 60, 178);

  // Trim row
  const trimY = 260;
  const trimHeight = 96;
  const usableW = W - 120;
  const trimItems = input.trim.slice(0, 6);
  if (trimItems.length > 0) {
    const trimW = Math.min(180, (usableW - (trimItems.length - 1) * 14) / trimItems.length);
    const totalTrim = trimItems.length * trimW + (trimItems.length - 1) * 14;
    let tx = 60 + (usableW - totalTrim) / 2;
    for (const piece of trimItems) {
      drawPiece(ctx, piece, tx, trimY, trimW, trimHeight, 22);
      tx += trimW + 14;
    }
  } else {
    ctx.fillStyle = PALETTE.stone;
    ctx.font = '400 16px "Lora", Georgia, serif';
    ctx.textAlign = "center";
    ctx.fillText("(no trim placed yet)", W / 2, trimY + trimHeight / 2);
  }

  // Frame row
  const frameY = 400;
  const frameHeight = 180;
  const slotCount = input.frame.length || 5;
  const slotGap = 16;
  const slotW = (usableW - slotGap * (slotCount - 1)) / slotCount;
  ctx.fillStyle = PALETTE.cream;
  roundedRect(ctx, 50, frameY - 10, W - 100, frameHeight + 20, 8);
  ctx.fill();
  ctx.strokeStyle = PALETTE.rule;
  ctx.lineWidth = 1.5;
  roundedRect(ctx, 50, frameY - 10, W - 100, frameHeight + 20, 8);
  ctx.stroke();
  for (let i = 0; i < slotCount; i += 1) {
    const sx = 60 + i * (slotW + slotGap);
    const piece = input.frame[i];
    if (piece) {
      drawPiece(ctx, piece, sx, frameY, slotW, frameHeight, 30);
    } else {
      // Empty slot
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = PALETTE.sand;
      ctx.lineWidth = 1.5;
      roundedRect(ctx, sx, frameY, slotW, frameHeight, 6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = PALETTE.sand;
      ctx.font = "600 14px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`SLOT ${i + 1}`, sx + slotW / 2, frameY + frameHeight / 2);
    }
  }

  // Foundation
  const slabY = frameY + frameHeight + 24;
  ctx.fillStyle = PALETTE.stone;
  roundedRect(ctx, 50, slabY, W - 100, 56, 6);
  ctx.fill();
  ctx.fillStyle = PALETTE.cream;
  ctx.font = "600 14px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FOUNDATION", W / 2, slabY + 28);

  // Footer
  const filled = input.frame.filter((p) => !!p).length;
  const trimCount = input.trim.length;
  ctx.fillStyle = PALETTE.stone;
  ctx.font = "500 16px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    `${filled} load-bearing · ${trimCount} trim`,
    60,
    H - 60,
  );
  ctx.textAlign = "right";
  ctx.fillText("wordpile · workshop", W - 60, H - 60);
}

/**
 * Render the structure to a PNG data URL. Returns null only when the
 * runtime is missing (e.g. SSR) — callers should treat that as a no-op.
 */
export function renderShareImage(input: ShareInput): string | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawScene(ctx, input);
  return canvas.toDataURL("image/png");
}

/**
 * Render the structure to a PNG Blob. Returns null only when the runtime
 * is missing or the canvas can't encode (very old browsers). Used by the
 * Web Share / Clipboard paths, which both want a binary blob.
 */
export function renderShareBlob(input: ShareInput): Promise<Blob | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  drawScene(ctx, input);
  return new Promise((resolve) => {
    if (typeof canvas.toBlob === "function") {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    } else {
      resolve(null);
    }
  });
}

/**
 * Slug derived from the pile name for filenames / share titles.
 * Falls back to "wordpile" when the name reduces to nothing.
 */
function sharedFileName(pileName: string): string {
  const safeName =
    pileName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "wordpile";
  const stamp = new Date().toISOString().slice(0, 10);
  return `${safeName}-build-${stamp}.png`;
}

/**
 * Build a short, human-friendly caption that travels with the image when
 * shared. We highlight the load-bearing words because those are the
 * "holding it up" lesson — trim is decorative and would dilute the line.
 */
export function buildShareCaption(input: ShareInput): string {
  const loadWords = input.frame
    .filter((p): p is SharePiece => !!p && p.bucket === "load")
    .map((p) => p.word.trim())
    .filter((w) => w.length > 0);
  const pile = input.pileName.trim() || "Wordpile";

  if (loadWords.length === 0) {
    const placed =
      input.frame.filter((p) => !!p).length + input.trim.length;
    if (placed === 0) {
      return `Working build from ${pile}.`;
    }
    return `Working build from ${pile} — ${placed} ${
      placed === 1 ? "piece" : "pieces"
    } placed so far.`;
  }

  const noun = loadWords.length === 1 ? "word" : "words";
  return `Built from ${pile} — ${loadWords.length} load-bearing ${noun} holding it up: ${loadWords.join(
    ", ",
  )}.`;
}

/**
 * Build the ordered list of ClipboardItem payloads to try, in order
 * from richest to most conservative. The first entry attaches both the
 * image and the caption (`text/plain`) so apps that support multi-MIME
 * paste — Slack, Teams, modern email clients — receive the teaching
 * one-liner alongside the image. Older Safari / Firefox builds reject
 * multi-MIME items, so we fall back to image-only.
 *
 * Exported for unit tests; callers should normally use shareBuildImage.
 */
export function buildClipboardItems(
  imageBlob: Blob,
  caption: string,
): ClipboardItem[] {
  const items: ClipboardItem[] = [];
  if (caption.trim().length > 0) {
    const captionBlob = new Blob([caption], { type: "text/plain" });
    items.push(
      new ClipboardItem({
        "image/png": imageBlob,
        "text/plain": captionBlob,
      }),
    );
  }
  items.push(new ClipboardItem({ "image/png": imageBlob }));
  return items;
}

/**
 * Outcome of a share attempt. Lets the UI surface the right confirmation
 * (e.g. "Copied to clipboard" vs "Image saved").
 */
export type ShareOutcome =
  | { kind: "shared" }
  | { kind: "copied" }
  | { kind: "downloaded" }
  | { kind: "cancelled" }
  | { kind: "failed"; reason: string };

/**
 * Convenience wrapper that triggers a browser download of the PNG.
 * Filename is derived from the pile name and current date.
 */
export function downloadShareImage(input: ShareInput) {
  const dataUrl = renderShareImage(input);
  if (!dataUrl) return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = sharedFileName(input.pileName);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * The full share chain: try the system share sheet first (mobile), fall
 * back to copying the image to the clipboard, and fall back again to a
 * plain download. Returns an outcome the UI can use to confirm.
 *
 * The caption travels with the share payload via the `text` field on
 * `navigator.share` and is attached as a `text/plain` part of the
 * ClipboardItem on the clipboard path (with a single-MIME image-only
 * retry for browsers that don't accept multi-MIME ClipboardItems).
 */
export async function shareBuildImage(input: ShareInput): Promise<ShareOutcome> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { kind: "failed", reason: "no-runtime" };
  }
  const blob = await renderShareBlob(input);
  if (!blob) {
    return { kind: "failed", reason: "no-image" };
  }
  const filename = sharedFileName(input.pileName);
  const caption = buildShareCaption(input);
  const title = `${input.pileName.trim() || "Wordpile"} build`;

  // 1) Web Share API with a file attachment — best on mobile.
  const nav = window.navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };
  if (typeof File === "function" && typeof nav.share === "function") {
    try {
      const file = new File([blob], filename, { type: "image/png" });
      const shareData: ShareData = { files: [file], title, text: caption };
      const canShareFiles =
        typeof nav.canShare === "function" ? nav.canShare(shareData) : true;
      if (canShareFiles) {
        try {
          await nav.share(shareData);
          return { kind: "shared" };
        } catch (err) {
          // AbortError = user dismissed the sheet. Don't fall through to
          // an unwanted clipboard write or download in that case.
          if (
            err &&
            typeof err === "object" &&
            "name" in err &&
            (err as { name?: string }).name === "AbortError"
          ) {
            return { kind: "cancelled" };
          }
          // Otherwise fall through to clipboard / download fallbacks.
        }
      }
    } catch {
      // File constructor or canShare threw — try the next fallback.
    }
  }

  // 2) Clipboard image copy — desktop browsers that support ClipboardItem.
  const clipboard = nav.clipboard as
    | (Clipboard & { write?: (items: ClipboardItem[]) => Promise<void> })
    | undefined;
  if (
    clipboard &&
    typeof clipboard.write === "function" &&
    typeof ClipboardItem !== "undefined"
  ) {
    const items = buildClipboardItems(blob, caption);
    for (const item of items) {
      try {
        await clipboard.write([item]);
        return { kind: "copied" };
      } catch {
        // Try the next, more conservative payload (image-only).
      }
    }
  }

  // 3) Last-resort: trigger a regular download.
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Give the browser a tick to start the download before revoking.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { kind: "downloaded" };
  } catch (err) {
    return {
      kind: "failed",
      reason: err instanceof Error ? err.message : "download-failed",
    };
  }
}
