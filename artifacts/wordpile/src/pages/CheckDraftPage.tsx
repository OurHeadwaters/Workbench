import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { usePile } from "@/lib/useStore";
import { tokenizeDraft, type DraftSegment } from "@/lib/extract";
import type { WordEntry } from "@/data/types";

const draftKeyFor = (pileId: string | undefined) =>
  pileId ? `wordpile:draft:${pileId}` : null;

export function CheckDraftPage() {
  const params = useParams<{ pileId: string }>();
  const pile = usePile(params.pileId);
  const [, navigate] = useLocation();
  const [draft, setDraft] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const key = draftKeyFor(params.pileId);
    if (!key) return "";
    return window.localStorage.getItem(key) ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = draftKeyFor(params.pileId);
    if (!key) return;
    window.localStorage.setItem(key, draft);
  }, [params.pileId, draft]);

  if (!pile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="eyebrow mb-3">Wordpile</p>
        <h1 className="text-3xl mb-4">That community pile isn't here.</h1>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to piles
        </button>
      </div>
    );
  }

  const wordsByLower = useMemo(() => {
    const map = new Map<string, WordEntry>();
    for (const w of pile.words) map.set(w.word, w);
    return map;
  }, [pile.words]);

  const segments = useMemo(() => tokenizeDraft(draft), [draft]);

  const analysis = useMemo(() => {
    const avoidHits = new Map<string, { entry: WordEntry; count: number }>();
    const loadHits = new Map<string, { entry: WordEntry; count: number }>();
    const interiorHits = new Map<string, { entry: WordEntry; count: number }>();
    for (const seg of segments) {
      if (seg.kind !== "word") continue;
      const entry = wordsByLower.get(seg.lower);
      if (!entry) continue;
      const target =
        entry.bucket === "avoid"
          ? avoidHits
          : entry.bucket === "load"
            ? loadHits
            : entry.bucket === "interior"
              ? interiorHits
              : null;
      if (!target) continue;
      const existing = target.get(entry.word);
      if (existing) existing.count += 1;
      else target.set(entry.word, { entry, count: 1 });
    }
    const loadAll = pile.words.filter((w) => w.bucket === "load");
    const loadMissing = loadAll.filter((w) => !loadHits.has(w.word));
    return {
      avoidHits: Array.from(avoidHits.values()).sort(
        (a, b) => b.count - a.count,
      ),
      loadHits: Array.from(loadHits.values()).sort(
        (a, b) => b.count - a.count,
      ),
      interiorHits: Array.from(interiorHits.values()),
      loadMissing,
      loadTotal: loadAll.length,
      avoidTotalHits: Array.from(avoidHits.values()).reduce(
        (s, x) => s + x.count,
        0,
      ),
    };
  }, [segments, wordsByLower, pile.words]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-baseline gap-3 mb-2">
        <Link
          href={`/pile/${pile.id}`}
          className="link"
          data-testid="link-back-to-pile"
        >
          <ArrowLeft size={11} style={{ display: "inline", marginRight: 4 }} />
          Back to {pile.name}
        </Link>
      </div>
      <p className="eyebrow mb-2">Check my draft against {pile.name}</p>
      <h1
        className="text-4xl mb-2"
        style={{ fontWeight: 600, lineHeight: 1.05 }}
      >
        Paste a draft. Catch wrong words before they ship.
      </h1>
      <p
        className="mb-8 text-lg leading-relaxed"
        style={{ color: "var(--color-stone)", maxWidth: 720 }}
      >
        Avoid words show up red — hover for the safer alternative. Load-bearing
        words show up green. The summary tells you which load-bearing words are
        missing entirely.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <p className="eyebrow">Your draft</p>
          <textarea
            className="textarea"
            style={{ minHeight: 280 }}
            placeholder="Paste a one-pager, an email, a slide bullet — anything you're about to send."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            data-testid="textarea-draft"
          />
        </section>

        <section className="flex flex-col gap-3">
          <p className="eyebrow">How it reads</p>
          <div className="draft-display" data-testid="text-rendered-draft">
            {draft.trim() === "" ? (
              <span style={{ color: "var(--color-stone)", fontStyle: "italic" }}>
                Your draft will render here with avoid-words flagged inline.
              </span>
            ) : (
              segments.map((seg, i) => (
                <RenderedSegment
                  key={i}
                  seg={seg}
                  entry={
                    seg.kind === "word" ? wordsByLower.get(seg.lower) : undefined
                  }
                />
              ))
            )}
          </div>
        </section>
      </div>

      <hr className="divider" />

      <section className="grid gap-6 md:grid-cols-3">
        <SummaryCard
          tone="avoid"
          icon={<AlertTriangle size={16} />}
          title="Avoid-word hits"
          countLabel={`${analysis.avoidTotalHits} hit${
            analysis.avoidTotalHits === 1 ? "" : "s"
          }`}
        >
          {analysis.avoidHits.length === 0 ? (
            <p style={{ color: "var(--color-stone)" }} className="text-sm italic">
              {draft.trim()
                ? "Clean — no avoid-words in this draft."
                : "Nothing to check yet."}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {analysis.avoidHits.map(({ entry, count }) => (
                <li
                  key={entry.id}
                  className="text-sm"
                  data-testid={`summary-avoid-${entry.word}`}
                >
                  <span className="timber">{entry.word}</span>
                  <span style={{ color: "var(--color-stone)" }}> · ×{count}</span>
                  {entry.saferAlternative && (
                    <div style={{ color: "var(--color-stone)" }}>
                      → use <span className="timber">{entry.saferAlternative}</span>
                    </div>
                  )}
                  {entry.note && (
                    <div style={{ color: "var(--color-stone)" }} className="italic">
                      {entry.note}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SummaryCard>

        <SummaryCard
          tone="load"
          icon={<CheckCircle2 size={16} />}
          title="Load-bearing words used"
          countLabel={`${analysis.loadHits.length} of ${analysis.loadTotal}`}
        >
          {analysis.loadHits.length === 0 ? (
            <p style={{ color: "var(--color-stone)" }} className="text-sm italic">
              {analysis.loadTotal === 0
                ? "No load-bearing words filed yet for this community."
                : "None of the load-bearing words show up here."}
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1">
              {analysis.loadHits.map(({ entry, count }) => (
                <li
                  key={entry.id}
                  className="rounded px-2 py-1 text-sm"
                  style={{
                    backgroundColor: "var(--color-cream)",
                    border: "1px solid var(--color-rule)",
                  }}
                  data-testid={`summary-load-${entry.word}`}
                >
                  <span className="timber">{entry.word}</span>
                  <span style={{ color: "var(--color-stone)" }}>
                    {" "}
                    ×{count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SummaryCard>

        <SummaryCard
          tone="missing"
          icon={<AlertTriangle size={16} />}
          title="Load-bearing missing"
          countLabel={`${analysis.loadMissing.length} of ${analysis.loadTotal}`}
        >
          {analysis.loadTotal === 0 ? (
            <p style={{ color: "var(--color-stone)" }} className="text-sm italic">
              No load-bearing words filed yet. Open the pile and sort some
              first.
            </p>
          ) : analysis.loadMissing.length === 0 ? (
            <p style={{ color: "var(--color-stone)" }} className="text-sm italic">
              Every load-bearing word appears at least once. Strong draft.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1">
              {analysis.loadMissing.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded px-2 py-1 text-sm"
                  style={{
                    backgroundColor: "var(--color-cream)",
                    border: "1px dashed var(--color-stone)",
                    color: "var(--color-stone)",
                  }}
                  data-testid={`summary-missing-${entry.word}`}
                >
                  <span className="timber">{entry.word}</span>
                </li>
              ))}
            </ul>
          )}
        </SummaryCard>
      </section>
    </div>
  );
}

function RenderedSegment({
  seg,
  entry,
}: {
  seg: DraftSegment;
  entry: WordEntry | undefined;
}) {
  if (seg.kind === "gap") return <span>{seg.text}</span>;
  if (!entry) return <span>{seg.text}</span>;
  if (entry.bucket === "avoid") {
    return (
      <Tooltipped
        title="Avoid"
        body={
          <>
            {entry.saferAlternative && (
              <div>
                Use <strong>{entry.saferAlternative}</strong>
              </div>
            )}
            {entry.note && <div style={{ opacity: 0.85 }}>{entry.note}</div>}
            {!entry.saferAlternative && !entry.note && (
              <div style={{ opacity: 0.85 }}>
                Reads wrong here. Add a safer alternative on the word card.
              </div>
            )}
          </>
        }
      >
        <span className="mark-avoid" data-testid={`mark-avoid-${entry.word}`}>
          {seg.text}
        </span>
      </Tooltipped>
    );
  }
  if (entry.bucket === "load") {
    return (
      <Tooltipped
        title="Load-bearing"
        body={
          entry.note ? <div>{entry.note}</div> : <div>Structural word.</div>
        }
      >
        <span className="mark-load" data-testid={`mark-load-${entry.word}`}>
          {seg.text}
        </span>
      </Tooltipped>
    );
  }
  if (entry.bucket === "interior") {
    return (
      <Tooltipped
        title="Interior"
        body={entry.note ? <div>{entry.note}</div> : <div>Swappable word.</div>}
      >
        <span className="mark-interior" data-testid={`mark-interior-${entry.word}`}>
          {seg.text}
        </span>
      </Tooltipped>
    );
  }
  return <span>{seg.text}</span>;
}

function Tooltipped({
  title,
  body,
  children,
}: {
  title: string;
  body: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      {open && (
        <span className="tip" role="tooltip">
          <span className="tip-title">{title}</span>
          {body}
        </span>
      )}
    </span>
  );
}

function SummaryCard({
  tone,
  icon,
  title,
  countLabel,
  children,
}: {
  tone: "avoid" | "load" | "missing";
  icon: React.ReactNode;
  title: string;
  countLabel: string;
  children: React.ReactNode;
}) {
  const accent =
    tone === "avoid"
      ? "var(--color-avoid)"
      : tone === "load"
        ? "var(--color-load)"
        : "var(--color-stone)";
  return (
    <div
      className="rounded p-4 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-paper)",
        borderTop: `3px solid ${accent}`,
        border: `1px solid var(--color-rule)`,
        borderTopWidth: 3,
        borderTopColor: accent,
      }}
    >
      <header className="flex items-center justify-between gap-2">
        <p
          className="eyebrow flex items-center gap-2"
          style={{ color: accent }}
        >
          <span>{icon}</span>
          {title}
        </p>
        <span className="eyebrow">{countLabel}</span>
      </header>
      {children}
    </div>
  );
}
