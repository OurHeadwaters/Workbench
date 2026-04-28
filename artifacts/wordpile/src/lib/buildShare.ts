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
 * Convenience wrapper that triggers a browser download of the PNG.
 * Filename is derived from the pile name and current date.
 */
export function downloadShareImage(input: ShareInput) {
  const dataUrl = renderShareImage(input);
  if (!dataUrl) return;
  const safeName = input.pileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "wordpile";
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${safeName}-build-${stamp}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
