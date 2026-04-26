export type SourceTag =
  | { kind: "confirmed"; date: string; note?: string }
  | { kind: "provisional"; reason?: string }
  | { kind: "tbd"; reason?: string };

export const CONFIRMED_DATE = "2026-04-26";

export const confirmed = (note?: string): SourceTag => ({
  kind: "confirmed",
  date: CONFIRMED_DATE,
  note,
});

export const provisional = (reason?: string): SourceTag => ({
  kind: "provisional",
  reason,
});

export const tbd = (reason?: string): SourceTag => ({ kind: "tbd", reason });

export function formatTagDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((s) => Number(s));
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

/**
 * Compact human-readable summary of a tag, suitable for spreadsheet metadata
 * and sheet headers. Mirrors what the on-page ConfirmedTag component shows.
 */
export function tagSummary(tag: SourceTag): string {
  if (tag.kind === "confirmed") {
    return `Confirmed ${formatTagDate(tag.date)}`;
  }
  if (tag.kind === "provisional") {
    return tag.reason ? `Provisional — ${tag.reason}` : "Provisional";
  }
  return tag.reason ? `TBD — ${tag.reason}` : "TBD";
}

/** Only locked rows belong in board-pack exports. */
export function isLocked(tag: SourceTag): boolean {
  return tag.kind === "confirmed";
}
