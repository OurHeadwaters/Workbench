import { STOP_WORDS } from "./stopwords";

/**
 * Tokenize a chunk of pasted text into the unique candidate words a
 * practitioner might want to file. Lower-cases, strips punctuation,
 * skips stopwords and very short words. Caller passes the set of words
 * already filed for this community so they don't reappear.
 */
export function extractCandidates(
  text: string,
  alreadyFiled: ReadonlySet<string>,
): { word: string; count: number }[] {
  const counts = new Map<string, number>();
  // Match runs of letters with optional internal apostrophes/hyphens.
  const tokens = text.toLowerCase().match(/[a-z][a-z'\-]*[a-z]|[a-z]/g) ?? [];
  for (const tok of tokens) {
    const cleaned = tok.replace(/^['-]+|['-]+$/g, "");
    if (cleaned.length < 3) continue;
    if (STOP_WORDS.has(cleaned)) continue;
    if (alreadyFiled.has(cleaned)) continue;
    if (/^\d+$/.test(cleaned)) continue;
    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.word.localeCompare(b.word);
    });
}

/**
 * Tokenize a draft into a stream of segments. Word segments preserve
 * their original casing/punctuation so the rendered draft reads back
 * exactly as pasted; the lowercased `lower` form is what we match
 * against the pile dictionary.
 */
export type DraftSegment =
  | { kind: "word"; text: string; lower: string }
  | { kind: "gap"; text: string };

export function tokenizeDraft(text: string): DraftSegment[] {
  const segments: DraftSegment[] = [];
  const re = /[A-Za-z][A-Za-z'\-]*[A-Za-z]|[A-Za-z]/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > cursor) {
      segments.push({ kind: "gap", text: text.slice(cursor, match.index) });
    }
    segments.push({
      kind: "word",
      text: match[0],
      lower: match[0].toLowerCase(),
    });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    segments.push({ kind: "gap", text: text.slice(cursor) });
  }
  return segments;
}
