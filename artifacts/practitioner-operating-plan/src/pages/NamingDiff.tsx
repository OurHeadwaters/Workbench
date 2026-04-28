import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";

import {
  namingDiff,
  parseWordpileImport,
  type DiffResult,
  type Drop,
  type NewCandidate,
  type Substitution,
} from "@/lib/namingDiff";

// Per-page localStorage slice. Following the standalone-doc pattern
// used by Checklist / LeaseTooling / StudioWindDown — a separate key
// rather than a slot inside the main `pop:v1` AppState, since this
// tool is self-contained and its own schema can evolve independently.
const STORAGE_KEY = "pop:naming-diff:v1";

type PersistedState = {
  version: 1;
  watchList: string[];
  watchInput: string;
  textA: string;
  textB: string;
  result: DiffResult | null;
  resultAt: string | null;
};

const EMPTY_STATE: PersistedState = {
  version: 1,
  watchList: [],
  watchInput: "",
  textA: "",
  textB: "",
  result: null,
  resultAt: null,
};

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.version === 1) {
      return {
        ...EMPTY_STATE,
        ...parsed,
        watchList: Array.isArray(parsed.watchList) ? parsed.watchList : [],
      };
    }
  } catch {
    // ignore
  }
  return EMPTY_STATE;
}

function savePersisted(state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy-mode failures
  }
}

// ---------------------------------------------------------------------
// Highlight rendering
// ---------------------------------------------------------------------
// Each text pane is rendered as a sequence of plain-text + highlighted
// spans. We compute the highlights from the diff result (charStart /
// charEnd offsets) and merge overlapping ranges so a single character
// is never wrapped twice.

type HighlightKind =
  | "kept"           // watched noun present in both panes (green)
  | "drop"           // watched noun in A that vanished from B
  | "substitution"   // B-side substitution suspect
  | "new";           // B-side new candidate near a drop

type Highlight = {
  start: number;
  end: number;
  kind: HighlightKind;
  label: string;
};

const TOKEN_RE = /[A-Za-z][A-Za-z'\-]*[A-Za-z]|[A-Za-z]/g;

function pushWatchedHighlights(
  text: string,
  watchList: ReadonlyArray<string>,
  out: Highlight[],
): void {
  for (const raw of watchList) {
    const term = raw.trim();
    if (!term) continue;
    const tokens = term.toLowerCase().match(TOKEN_RE);
    if (!tokens || tokens.length === 0) continue;
    const escapedTokens = tokens.map((t) =>
      t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const pattern = new RegExp(
      `\\b${escapedTokens.join("\\s+")}\\b`,
      "gi",
    );
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      out.push({
        start: m.index,
        end: m.index + m[0].length,
        kind: "kept",
        label: term,
      });
      if (m[0].length === 0) pattern.lastIndex += 1;
    }
  }
}

function buildHighlightsForA(
  result: DiffResult,
  watchList: ReadonlyArray<string>,
  textA: string,
): Highlight[] {
  const highlights: Highlight[] = [];
  pushWatchedHighlights(textA, watchList, highlights);
  // Stamp drops over the kept layer — same span, different colour wins
  // via the kind-priority merge in flattenHighlights.
  for (const d of result.drops) {
    highlights.push({
      start: d.occurrence.charStart,
      end: d.occurrence.charEnd,
      kind: "drop",
      label: d.term,
    });
  }
  return highlights;
}

function buildHighlightsForB(
  result: DiffResult,
  watchList: ReadonlyArray<string>,
  textB: string,
): Highlight[] {
  const highlights: Highlight[] = [];
  pushWatchedHighlights(textB, watchList, highlights);
  for (const s of result.substitutions) {
    highlights.push({
      start: s.candidateInB.charStart,
      end: s.candidateInB.charEnd,
      kind: "substitution",
      label: `${s.term} → ${s.candidateInB.text}`,
    });
  }
  for (const n of result.newCandidates) {
    highlights.push({
      start: n.newWord.charStart,
      end: n.newWord.charEnd,
      kind: "new",
      label: `near ${n.nearTerm}`,
    });
  }
  return highlights;
}

// Resolve overlapping highlights by priority — later-priority kinds
// win the visual stamp on a contested character, but every label is
// preserved on the merged span (joined with " · ") so the practitioner
// can still see what's underneath in the tooltip.
const KIND_PRIORITY: Record<HighlightKind, number> = {
  kept: 1,
  new: 2,
  substitution: 3,
  drop: 4,
};

type RenderSpan = {
  start: number;
  end: number;
  kind: HighlightKind | null;
  labels: string[];
};

function flattenHighlights(
  text: string,
  highlights: Highlight[],
): RenderSpan[] {
  if (highlights.length === 0) {
    return text.length > 0
      ? [{ start: 0, end: text.length, kind: null, labels: [] }]
      : [];
  }
  // Build a per-character "winner" map.
  const winner: (Highlight | null)[] = new Array(text.length).fill(null);
  const labelMap = new Map<number, Set<string>>();
  for (const h of highlights) {
    for (let i = h.start; i < h.end; i++) {
      const cur = winner[i];
      if (
        !cur ||
        KIND_PRIORITY[h.kind] > KIND_PRIORITY[cur.kind]
      ) {
        winner[i] = h;
      }
      let labels = labelMap.get(i);
      if (!labels) {
        labels = new Set<string>();
        labelMap.set(i, labels);
      }
      labels.add(h.label);
    }
  }
  const spans: RenderSpan[] = [];
  let i = 0;
  while (i < text.length) {
    const cur = winner[i];
    let j = i + 1;
    while (j < text.length) {
      const next = winner[j];
      if (cur === next) {
        j++;
        continue;
      }
      if (cur && next && cur.kind === next.kind && cur.label === next.label) {
        j++;
        continue;
      }
      break;
    }
    spans.push({
      start: i,
      end: j,
      kind: cur ? cur.kind : null,
      labels: cur ? Array.from(labelMap.get(i) ?? new Set([cur.label])) : [],
    });
    i = j;
  }
  return spans;
}

const KIND_CLASSES: Record<HighlightKind, string> = {
  kept: "bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200 rounded px-0.5",
  drop: "bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-300 rounded px-0.5",
  substitution:
    "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300 rounded px-0.5",
  new: "bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-200 rounded px-0.5",
};

function HighlightedText({
  text,
  highlights,
  emptyHint,
}: {
  text: string;
  highlights: Highlight[];
  emptyHint: string;
}) {
  if (!text) {
    return (
      <p className="text-sm italic text-stone-400">{emptyHint}</p>
    );
  }
  const spans = flattenHighlights(text, highlights);
  return (
    <div className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.55] text-stone-800">
      {spans.map((s, idx) => {
        const slice = text.slice(s.start, s.end);
        if (!s.kind) return <span key={idx}>{slice}</span>;
        return (
          <span
            key={idx}
            className={KIND_CLASSES[s.kind]}
            title={s.labels.join(" · ")}
          >
            {slice}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------

export default function NamingDiff() {
  // Persisted slice — read synchronously from localStorage during the
  // first render via lazy initializers so the save effect (which runs
  // after commit) never sees pre-hydration empty state. The
  // `hydrated` ref additionally guards the very first save call so we
  // never write back identical state on mount.
  const [watchList, setWatchList] = useState<string[]>(
    () => loadPersisted().watchList,
  );
  const [watchInput, setWatchInput] = useState(
    () => loadPersisted().watchInput,
  );
  const [textA, setTextA] = useState(() => loadPersisted().textA);
  const [textB, setTextB] = useState(() => loadPersisted().textB);
  const [result, setResult] = useState<DiffResult | null>(
    () => loadPersisted().result,
  );
  const [resultAt, setResultAt] = useState<string | null>(
    () => loadPersisted().resultAt,
  );
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importNote, setImportNote] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    savePersisted({
      version: 1,
      watchList,
      watchInput,
      textA,
      textB,
      result,
      resultAt,
    });
  }, [watchList, watchInput, textA, textB, result, resultAt]);

  const addFromInput = () => {
    const raw = watchInput;
    const incoming = raw
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (incoming.length === 0) return;
    setWatchList((prev) => {
      const seen = new Set(prev.map((w) => w.toLowerCase()));
      const next = [...prev];
      for (const w of incoming) {
        const key = w.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(w);
      }
      return next;
    });
    setWatchInput("");
  };

  const removeWatched = (term: string) => {
    setWatchList((prev) => prev.filter((w) => w !== term));
  };

  const clearWatchList = () => {
    if (watchList.length === 0) return;
    setWatchList([]);
  };

  const runDiff = () => {
    const r = namingDiff(watchList, textA, textB);
    setResult(r);
    setResultAt(new Date().toISOString());
  };

  const clearAll = () => {
    setTextA("");
    setTextB("");
    setResult(null);
    setResultAt(null);
  };

  const onImport = () => {
    setImportError(null);
    setImportNote(null);
    if (!importJson.trim()) {
      setImportError("Paste a Wordpile JSON export first.");
      return;
    }
    try {
      const parsed = parseWordpileImport(importJson);
      if (parsed.words.length === 0) {
        setImportError(
          "Import succeeded, but no load-bearing words were found in this pile.",
        );
        return;
      }
      setWatchList((prev) => {
        const seen = new Set(prev.map((w) => w.toLowerCase()));
        const next = [...prev];
        let added = 0;
        for (const w of parsed.words) {
          const key = w.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          next.push(w);
          added += 1;
        }
        const pileNames = parsed.piles.map((p) => p.name).join(", ");
        const skipped = parsed.words.length - added;
        setImportNote(
          `Added ${added} load-bearing word${added === 1 ? "" : "s"} from ${pileNames}` +
            (skipped > 0 ? ` (${skipped} already on the watch list).` : "."),
        );
        return next;
      });
      setImportJson("");
    } catch (err) {
      setImportError((err as Error).message);
    }
  };

  const highlightsA = useMemo(
    () => (result ? buildHighlightsForA(result, watchList, textA) : []),
    [result, watchList, textA],
  );
  const highlightsB = useMemo(
    () => (result ? buildHighlightsForB(result, watchList, textB) : []),
    [result, watchList, textB],
  );

  const totalFindings = result
    ? result.drops.length +
      result.substitutions.length +
      result.newCandidates.length
    : 0;

  return (
    <>
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          Workbench · Drift detection
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Naming Diff
        </h1>
        <p className="max-w-3xl text-sm text-stone-700">
          Catch the moment a load-bearing noun quietly drifts between
          versions. Build a watch list, paste two versions of a piece
          of writing, and see only the noun changes — drops, substitution
          suspects, and new words landing where a watched noun used to
          sit. Prose churn and layout edits stay invisible.
        </p>
        <p className="max-w-3xl text-xs text-stone-500">
          See also the companion working docs:{" "}
          <Link
            href="/codetry"
            className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
          >
            /codetry
          </Link>{" "}
          (the discipline) and{" "}
          <Link
            href="/codetry-test"
            className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
          >
            /codetry-test
          </Link>{" "}
          (audit of the names already settled).
        </p>
      </header>

      {/* Watch list editor ------------------------------------------- */}
      <section className="space-y-3" data-testid="section-watch-list">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Watch list
          </h2>
          <span className="text-xs text-stone-500">
            {watchList.length} word{watchList.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-3">
          {watchList.length === 0 ? (
            <p className="text-sm italic text-stone-500">
              Add the load-bearing nouns you want to track. One per line,
              or comma-separated. Multi-word phrases work too — try
              <span className="ml-1 font-mono text-xs">
                wisdom keeper
              </span>
              .
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {watchList.map((term) => (
                <li
                  key={term}
                  className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-800"
                  data-testid={`chip-watch-${term}`}
                >
                  <span className="font-mono">{term}</span>
                  <button
                    type="button"
                    onClick={() => removeWatched(term)}
                    className="rounded-full text-stone-500 hover:text-stone-900"
                    aria-label={`Remove ${term} from watch list`}
                    title="Remove"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <textarea
              value={watchInput}
              onChange={(e) => setWatchInput(e.target.value)}
              placeholder={
                'Paste or type words — one per line, or "envelope, saltbox, wisdom keeper"'
              }
              rows={2}
              className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-mono focus:border-stone-500 focus:outline-none"
              data-testid="input-watch"
            />
            <div className="flex gap-2 sm:flex-col">
              <button
                type="button"
                onClick={addFromInput}
                className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
                data-testid="button-add-watch"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowImport((v) => !v)}
                className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
                data-testid="button-toggle-import"
              >
                {showImport ? "Hide import" : "Import from Wordpile"}
              </button>
              {watchList.length > 0 && (
                <button
                  type="button"
                  onClick={clearWatchList}
                  className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {showImport && (
            <div className="space-y-2 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3">
              <div className="text-xs text-stone-600">
                Paste a Wordpile export JSON below — single pile or
                bundle. Only the load-bearing words are added.
              </div>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"format":"wordpile-export", "pile":{"name":"…","words":[…]}}'
                rows={5}
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-mono focus:border-stone-500 focus:outline-none"
                data-testid="input-import-json"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onImport}
                  className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
                  data-testid="button-import"
                >
                  Import load-bearing words
                </button>
                {importError && (
                  <span className="text-xs text-rose-700">{importError}</span>
                )}
                {importNote && !importError && (
                  <span className="text-xs text-emerald-800">{importNote}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* A and B panes ----------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            The two versions
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runDiff}
              disabled={watchList.length === 0 || (!textA && !textB)}
              className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-50 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              data-testid="button-run-diff"
            >
              Run diff
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
            >
              Clear texts
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="textA"
              className="text-xs font-mono uppercase tracking-widest text-stone-600"
            >
              Version A — earlier
            </label>
            <textarea
              id="textA"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste the earlier version here…"
              rows={14}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-mono focus:border-stone-500 focus:outline-none"
              data-testid="input-text-a"
            />
            <div className="text-xs text-stone-500">
              {textA.length.toLocaleString()} characters
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="textB"
              className="text-xs font-mono uppercase tracking-widest text-stone-600"
            >
              Version B — later
            </label>
            <textarea
              id="textB"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste the later version here…"
              rows={14}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-mono focus:border-stone-500 focus:outline-none"
              data-testid="input-text-b"
            />
            <div className="text-xs text-stone-500">
              {textB.length.toLocaleString()} characters
            </div>
          </div>
        </div>
      </section>

      {/* Result panel ------------------------------------------------ */}
      <section className="space-y-3" data-testid="section-result">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            What changed
          </h2>
          {resultAt && (
            <span className="text-xs text-stone-500">
              Diffed {new Date(resultAt).toLocaleString()}
            </span>
          )}
        </div>

        {!result ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            Add a watch list and paste two versions, then click{" "}
            <span className="font-mono">Run diff</span>.
          </div>
        ) : totalFindings === 0 && result.summary.length > 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            No watched nouns drifted between these two versions.
          </div>
        ) : (
          <div className="space-y-3">
            {result.summary.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 text-xs uppercase tracking-widest text-stone-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Watched noun</th>
                      <th className="px-3 py-2 text-right">In A</th>
                      <th className="px-3 py-2 text-right">In B</th>
                      <th className="px-3 py-2 text-right">Δ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {result.summary.map((s) => (
                      <tr key={s.term}>
                        <td className="px-3 py-1.5 font-mono">{s.term}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {s.countA}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {s.countB}
                        </td>
                        <td
                          className={
                            "px-3 py-1.5 text-right tabular-nums " +
                            (s.delta < 0
                              ? "text-rose-700"
                              : s.delta > 0
                                ? "text-emerald-700"
                                : "text-stone-500")
                          }
                        >
                          {s.delta > 0 ? `+${s.delta}` : s.delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FindingsCard
                title="Drops"
                emptyText="None — every watched noun in A is still in B."
                kind="drop"
                count={result.drops.length}
              >
                {result.drops.map((d, i) => (
                  <DropRow key={`drop-${i}`} drop={d} />
                ))}
              </FindingsCard>
              <FindingsCard
                title="Substitution suspects"
                emptyText="None — no watched noun was visibly replaced."
                kind="substitution"
                count={result.substitutions.length}
              >
                {result.substitutions.map((s, i) => (
                  <SubstitutionRow key={`sub-${i}`} sub={s} />
                ))}
              </FindingsCard>
              <FindingsCard
                title="New candidates"
                emptyText="None — no other content words appeared near the drops."
                kind="new"
                count={result.newCandidates.length}
              >
                {result.newCandidates.map((n, i) => (
                  <NewRow key={`new-${i}`} item={n} />
                ))}
              </FindingsCard>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600">
                    Version A — in context
                  </h3>
                  <Legend kinds={["kept", "drop"]} />
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <HighlightedText
                    text={textA}
                    highlights={highlightsA}
                    emptyHint="Version A is empty."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600">
                    Version B — in context
                  </h3>
                  <Legend kinds={["kept", "substitution", "new"]} />
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <HighlightedText
                    text={textB}
                    highlights={highlightsB}
                    emptyHint="Version B is empty."
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function FindingsCard({
  title,
  emptyText,
  kind,
  count,
  children,
}: {
  title: string;
  emptyText: string;
  kind: HighlightKind;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      <div className="flex items-baseline justify-between border-b border-stone-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={
              "inline-block h-2.5 w-2.5 rounded-sm " +
              (kind === "drop"
                ? "bg-rose-300"
                : kind === "substitution"
                  ? "bg-amber-300"
                  : kind === "new"
                    ? "bg-sky-300"
                    : "bg-emerald-300")
            }
          />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-700">
            {title}
          </h3>
        </div>
        <span className="text-xs tabular-nums text-stone-500">{count}</span>
      </div>
      <div className="px-3 py-2">
        {count === 0 ? (
          <p className="text-xs italic text-stone-500">{emptyText}</p>
        ) : (
          <ul className="space-y-2 text-sm">{children}</ul>
        )}
      </div>
    </div>
  );
}

function DropRow({ drop }: { drop: Drop }) {
  return (
    <li className="space-y-0.5">
      <div className="font-mono text-stone-900">{drop.term}</div>
      <div className="text-xs text-stone-500">
        Was in A near char {drop.occurrence.charStart}; gone from the
        same neighborhood in B.
      </div>
    </li>
  );
}

function SubstitutionRow({ sub }: { sub: Substitution }) {
  return (
    <li className="space-y-0.5">
      <div className="font-mono text-stone-900">
        {sub.term}{" "}
        <span className="text-stone-400">→</span>{" "}
        <span className="text-amber-800">{sub.candidateInB.text}</span>
      </div>
      <div className="text-xs text-stone-500">
        B has “{sub.candidateInB.text}” where A had “{sub.term}”.
      </div>
    </li>
  );
}

function NewRow({ item }: { item: NewCandidate }) {
  return (
    <li className="space-y-0.5">
      <div className="font-mono text-stone-900">
        {item.newWord.text}{" "}
        <span className="text-xs text-stone-400">
          (near {item.nearTerm})
        </span>
      </div>
      <div className="text-xs text-stone-500">
        Wasn’t in A; landed near where “{item.nearTerm}” used to sit.
      </div>
    </li>
  );
}

function Legend({ kinds }: { kinds: HighlightKind[] }) {
  const LABELS: Record<HighlightKind, string> = {
    kept: "Kept",
    drop: "Drop",
    substitution: "Substitution",
    new: "New",
  };
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500">
      {kinds.map((k) => (
        <span key={k} className="inline-flex items-center gap-1">
          <span
            className={
              "inline-block h-2 w-2 rounded-sm " +
              (k === "drop"
                ? "bg-rose-300"
                : k === "substitution"
                  ? "bg-amber-300"
                  : k === "new"
                    ? "bg-sky-300"
                    : "bg-emerald-300")
            }
          />
          {LABELS[k]}
        </span>
      ))}
    </div>
  );
}
