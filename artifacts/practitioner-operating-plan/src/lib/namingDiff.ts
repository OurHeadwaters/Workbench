// Naming Diff — surface load-bearing noun changes between two text
// versions, ignoring prose churn and layout edits.
//
// Pure function. Given a watch list of nouns the practitioner cares
// about and two pasted text blobs, returns:
//   - drops: watched nouns in A that are gone from the equivalent
//     position in B
//   - substitutions: A had the watched noun; B has a different word in
//     roughly the same position (the "envelope → category" case)
//   - newCandidates: other content words appearing in B near where a
//     watched noun used to sit, that didn't appear anywhere in A
//   - summary: per-term occurrence counts (A vs B) for the result
//     panel header
//
// The tokenizer and stopword list are kept in step with the Wordpile
// equivalents (`artifacts/wordpile/src/lib/extract.ts`,
// `artifacts/wordpile/src/lib/stopwords.ts`). They live here as a
// local copy so the workbench doesn't take a cross-artifact dep on
// Wordpile for what is, structurally, the same word-extraction job.
// If the Wordpile lists move, mirror the change here.

const WORD_PATTERN = "[A-Za-z][A-Za-z'\\-]*[A-Za-z]|[A-Za-z]";

const STOP_WORDS: ReadonlySet<string> = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "cannot", "could", "couldn",
  "did", "didn", "do", "does", "doesn", "doing", "don", "down", "during", "each",
  "few", "for", "from", "further", "had", "hadn", "has", "hasn", "have", "haven",
  "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
  "how", "i", "if", "in", "into", "is", "isn", "it", "its", "itself", "just",
  "let", "ll", "m", "me", "might", "more", "most", "must", "my", "myself", "no",
  "nor", "not", "now", "o", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "re", "s", "same",
  "shall", "she", "should", "shouldn", "so", "some", "such", "t", "than", "that",
  "the", "their", "theirs", "them", "themselves", "then", "there", "these",
  "they", "this", "those", "through", "to", "too", "under", "until", "up", "ve",
  "very", "was", "wasn", "we", "were", "weren", "what", "when", "where", "which",
  "while", "who", "whom", "why", "will", "with", "won", "would", "wouldn", "y",
  "you", "your", "yours", "yourself", "yourselves",
  "yeah", "yes", "ok", "okay", "uh", "um", "er", "ah", "oh", "hey",
  "like", "really", "kind", "sort", "thing", "things", "stuff", "lot",
  "going", "get", "got", "gets", "getting", "go", "goes", "went", "gone",
  "say", "said", "says", "saying", "see", "saw", "seen", "look", "looking",
  "way", "ways", "make", "made", "makes", "making", "take", "took", "taken",
  "give", "gave", "given", "use", "used", "using", "want", "wants", "wanted",
  "know", "knew", "known", "think", "thought", "thinking", "feel", "felt",
  "come", "came", "back", "even", "also", "still", "much", "many",
]);

export type Token = {
  text: string;       // original casing, as it appeared in the source
  lower: string;
  charStart: number;
  charEnd: number;
  wordIndex: number;  // 0-based index among word tokens (gaps don't count)
};

export type ParsedText = {
  raw: string;
  tokens: Token[];
  lowerSet: Set<string>;
};

export function parseText(text: string): ParsedText {
  const tokens: Token[] = [];
  const re = new RegExp(WORD_PATTERN, "g");
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(text)) !== null) {
    tokens.push({
      text: m[0],
      lower: m[0].toLowerCase(),
      charStart: m.index,
      charEnd: m.index + m[0].length,
      wordIndex: idx++,
    });
  }
  const lowerSet = new Set<string>();
  for (const t of tokens) lowerSet.add(t.lower);
  return { raw: text, tokens, lowerSet };
}

export type Occurrence = {
  /** The watched-list term this occurrence is associated with. For
   *  substitution candidates and new-candidate findings, this is the
   *  watched noun whose neighborhood the candidate showed up in. */
  term: string;
  /** Source-cased text of the matched span, suitable for display. */
  text: string;
  charStart: number;
  charEnd: number;
  /** Word index of the first word in the match. */
  wordIndex: number;
  /** Number of words in the match (1 for single-word matches). */
  wordSpan: number;
};

export type Drop = {
  kind: "drop";
  term: string;
  occurrence: Occurrence;
};

export type Substitution = {
  kind: "substitution";
  term: string;
  occurrenceInA: Occurrence;
  candidateInB: Occurrence;
};

export type NewCandidate = {
  kind: "new";
  nearTerm: string;
  occurrenceInA: Occurrence;
  newWord: Occurrence;
};

export type WatchedSummary = {
  term: string;
  countA: number;
  countB: number;
  /** countB - countA. Negative means the watched noun lost ground. */
  delta: number;
};

export type DiffResult = {
  drops: Drop[];
  substitutions: Substitution[];
  newCandidates: NewCandidate[];
  summary: WatchedSummary[];
};

export type DiffOptions = {
  /** Window for matching A occurrences to B occurrences and for
   *  scanning B for substitution candidates, expressed as a fraction
   *  of total word count of B. Defaults to 0.15 (15% of B's length). */
  windowFraction?: number;
  /** Lower bound on the window (in words), so short documents still
   *  get a usable neighborhood. Defaults to 6. */
  windowMinWords?: number;
};

type NormalizedTerm = {
  term: string;       // original casing as the practitioner typed it
  tokens: string[];   // lowercased word tokens for matching
};

function normalizeWatchList(watchList: ReadonlyArray<string>): NormalizedTerm[] {
  const seen = new Set<string>();
  const out: NormalizedTerm[] = [];
  const re = new RegExp(WORD_PATTERN, "g");
  for (const raw of watchList) {
    const trimmed = (raw ?? "").trim();
    if (!trimmed) continue;
    const lowered = trimmed.toLowerCase();
    const tokens: string[] = [];
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(lowered)) !== null) tokens.push(m[0]);
    if (tokens.length === 0) continue;
    const key = tokens.join(" ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ term: trimmed, tokens });
  }
  return out;
}

function findOccurrences(
  parsed: ParsedText,
  lowerTokens: ReadonlyArray<string>,
  term: string,
): Occurrence[] {
  const out: Occurrence[] = [];
  const k = lowerTokens.length;
  const n = parsed.tokens.length;
  if (k === 0 || n < k) return out;
  for (let i = 0; i <= n - k; i++) {
    let match = true;
    for (let j = 0; j < k; j++) {
      if (parsed.tokens[i + j].lower !== lowerTokens[j]) {
        match = false;
        break;
      }
    }
    if (!match) continue;
    const first = parsed.tokens[i];
    const last = parsed.tokens[i + k - 1];
    out.push({
      term,
      text: parsed.raw.slice(first.charStart, last.charEnd),
      charStart: first.charStart,
      charEnd: last.charEnd,
      wordIndex: first.wordIndex,
      wordSpan: k,
    });
  }
  return out;
}

/** Build a Set of every lowercased word that appears in any watched
 *  term, single- or multi-word. Used to prevent the substitution / new-
 *  candidate scans from flagging another watched noun as a "new word". */
function watchedWordSet(normalized: NormalizedTerm[]): Set<string> {
  const out = new Set<string>();
  for (const n of normalized) for (const t of n.tokens) out.add(t);
  return out;
}

export function namingDiff(
  watchList: ReadonlyArray<string>,
  textA: string,
  textB: string,
  options: DiffOptions = {},
): DiffResult {
  const A = parseText(textA);
  const B = parseText(textB);
  const windowFraction = options.windowFraction ?? 0.15;
  const windowMinWords = options.windowMinWords ?? 6;

  const drops: Drop[] = [];
  const substitutions: Substitution[] = [];
  const newCandidates: NewCandidate[] = [];
  const summary: WatchedSummary[] = [];

  const normalized = normalizeWatchList(watchList);
  if (normalized.length === 0) {
    return { drops, substitutions, newCandidates, summary };
  }

  const watchedSet = watchedWordSet(normalized);

  const wA = Math.max(A.tokens.length, 1);
  const wB = Math.max(B.tokens.length, 1);
  const windowB = Math.max(windowMinWords, Math.floor(wB * windowFraction));

  for (const { term, tokens } of normalized) {
    const occA = findOccurrences(A, tokens, term);
    const occB = findOccurrences(B, tokens, term);
    summary.push({
      term,
      countA: occA.length,
      countB: occB.length,
      delta: occB.length - occA.length,
    });

    // Greedy positional match A→B. Any A occurrence without a B
    // partner inside the window is a drop, and we then look at B's
    // window to see what showed up in its place.
    const usedB = new Set<number>();
    for (const a of occA) {
      const projected = (a.wordIndex / wA) * wB;
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < occB.length; i++) {
        if (usedB.has(i)) continue;
        const d = Math.abs(occB[i].wordIndex - projected);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best >= 0 && bestDist <= windowB) {
        usedB.add(best);
        continue;
      }

      drops.push({ kind: "drop", term, occurrence: a });

      if (B.tokens.length === 0) continue;

      const center = Math.round(projected);
      const lo = Math.max(0, center - windowB);
      const hi = Math.min(B.tokens.length - 1, center + windowB);
      const windowTokens = B.tokens.slice(lo, hi + 1);

      // Content words in B's window that didn't appear in A and aren't
      // themselves part of any watched noun.
      const candidates = windowTokens.filter(
        (t) =>
          !STOP_WORDS.has(t.lower) &&
          t.lower.length >= 3 &&
          !A.lowerSet.has(t.lower) &&
          !watchedSet.has(t.lower),
      );

      if (candidates.length === 0) continue;

      // Closest content word to the projected position is the
      // substitution suspect. The rest become new candidates near the
      // same drop.
      let subBest = candidates[0];
      let subBestDist = Math.abs(subBest.wordIndex - projected);
      for (const c of candidates) {
        const d = Math.abs(c.wordIndex - projected);
        if (d < subBestDist) {
          subBest = c;
          subBestDist = d;
        }
      }
      substitutions.push({
        kind: "substitution",
        term,
        occurrenceInA: a,
        candidateInB: {
          term,
          text: subBest.text,
          charStart: subBest.charStart,
          charEnd: subBest.charEnd,
          wordIndex: subBest.wordIndex,
          wordSpan: 1,
        },
      });
      for (const c of candidates) {
        if (c === subBest) continue;
        newCandidates.push({
          kind: "new",
          nearTerm: term,
          occurrenceInA: a,
          newWord: {
            term,
            text: c.text,
            charStart: c.charStart,
            charEnd: c.charEnd,
            wordIndex: c.wordIndex,
            wordSpan: 1,
          },
        });
      }
    }
  }

  return { drops, substitutions, newCandidates, summary };
}

// ---------------------------------------------------------------------
// Wordpile JSON import
// ---------------------------------------------------------------------
// V1 supports paste-importing the JSON a Wordpile export produces, in
// either the single-pile or bundle shape. We seed the watch list from
// the load-bearing ("structural — don't substitute") words; that is
// the slice of the pile this tool is built to track.

export type WordpileImportResult = {
  /** Words pulled from the import, deduped and ordered. */
  words: string[];
  /** Per-pile breakdown, useful for the import preview UI. */
  piles: Array<{ name: string; words: string[] }>;
};

type WordpileBucket = "unsorted" | "load" | "interior" | "avoid";

type WordpileWord = {
  word?: unknown;
  bucket?: unknown;
};

type WordpilePilePayload = {
  name?: unknown;
  words?: unknown;
};

type WordpileEnvelope = {
  format?: unknown;
  pile?: unknown;
  piles?: unknown;
};

function extractLoadBearing(words: unknown): string[] {
  if (!Array.isArray(words)) return [];
  const out: string[] = [];
  for (const raw of words as WordpileWord[]) {
    if (!raw || typeof raw !== "object") continue;
    if (typeof raw.word !== "string") continue;
    if ((raw.bucket as WordpileBucket) !== "load") continue;
    const w = raw.word.trim();
    if (w) out.push(w);
  }
  return out;
}

export function parseWordpileImport(jsonText: string): WordpileImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(
      `Could not read that as JSON: ${(err as Error).message}`,
    );
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Expected a Wordpile export object.");
  }
  const env = parsed as WordpileEnvelope;
  const piles: Array<{ name: string; words: string[] }> = [];

  if (env.format === "wordpile-export" && env.pile && typeof env.pile === "object") {
    const p = env.pile as WordpilePilePayload;
    piles.push({
      name: typeof p.name === "string" && p.name.trim() ? p.name : "Pile",
      words: extractLoadBearing(p.words),
    });
  } else if (env.format === "wordpile-bundle" && Array.isArray(env.piles)) {
    for (const p of env.piles as WordpilePilePayload[]) {
      if (!p || typeof p !== "object") continue;
      piles.push({
        name: typeof p.name === "string" && p.name.trim() ? p.name : "Pile",
        words: extractLoadBearing(p.words),
      });
    }
  } else {
    throw new Error(
      'Unrecognized Wordpile JSON. Expected `format` of "wordpile-export" or "wordpile-bundle".',
    );
  }

  const seen = new Set<string>();
  const words: string[] = [];
  for (const p of piles) {
    for (const w of p.words) {
      const key = w.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      words.push(w);
    }
  }
  return { words, piles };
}
