import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { extractCandidates } from "@/lib/extract";
import { WordpileStore } from "@/lib/store";
import { BUCKET_LABELS, type Bucket, type CommunityPile } from "@/data/types";

interface Props {
  pile: CommunityPile;
}

export function PasteExtractor({ pile }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const filed = useMemo(
    () => new Set(pile.words.map((w) => w.word)),
    [pile.words],
  );

  const candidates = useMemo(() => {
    if (!text.trim()) return [];
    return extractCandidates(text, filed).filter(
      (c) => !dismissed.has(c.word),
    );
  }, [text, filed, dismissed]);

  function fileWord(word: string, bucket: Bucket) {
    WordpileStore.addWord(pile.id, { word, bucket });
    // After filing it'll naturally drop out of `candidates` because it
    // shows up in `filed` on the next snapshot, but we also dismiss it
    // explicitly so the chip disappears immediately.
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });
  }

  function dismiss(word: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });
  }

  function reset() {
    setText("");
    setDismissed(new Set());
  }

  return (
    <section
      className="rounded"
      style={{
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-rule)",
      }}
    >
      <button
        type="button"
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ color: "var(--color-ink)" }}
        onClick={() => setOpen((v) => !v)}
        data-testid="button-toggle-paste"
      >
        <span className="flex items-baseline gap-3">
          <span className="eyebrow">Paste text</span>
          <span style={{ color: "var(--color-stone)" }} className="text-sm">
            Pull candidate words out of a transcript or doc.
          </span>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div
          className="px-4 pb-4 flex flex-col gap-3 border-t"
          style={{ borderColor: "var(--color-rule)" }}
        >
          <textarea
            className="textarea mt-3"
            placeholder="Paste a transcript, meeting notes, a draft document — anything that's likely to surface this community's vocabulary."
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="textarea-paste"
          />
          {candidates.length === 0 && text.trim() && (
            <p style={{ color: "var(--color-stone)" }} className="text-sm">
              No new candidate words. Everything in here is either a stop-word
              or already filed.
            </p>
          )}
          {candidates.length > 0 && (
            <>
              <p
                className="text-sm"
                style={{ color: "var(--color-stone)" }}
                data-testid="text-candidate-count"
              >
                {candidates.length} candidate
                {candidates.length === 1 ? "" : "s"}. Click a word to file it.
              </p>
              <ul className="flex flex-wrap gap-2">
                {candidates.map((c) => (
                  <li
                    key={c.word}
                    className="rounded p-2 flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      border: "1px solid var(--color-sand)",
                    }}
                    data-testid={`candidate-${c.word}`}
                  >
                    <span
                      className="timber"
                      style={{ fontSize: 14, paddingRight: 4 }}
                    >
                      {c.word}
                    </span>
                    {c.count > 1 && (
                      <span
                        className="eyebrow"
                        style={{ fontSize: 10 }}
                      >
                        ×{c.count}
                      </span>
                    )}
                    {(["load", "interior", "avoid", "unsorted"] as Bucket[]).map(
                      (b) => (
                        <button
                          key={b}
                          className="btn-ghost"
                          onClick={() => fileWord(c.word, b)}
                          data-testid={`button-file-${c.word}-${b}`}
                        >
                          {BUCKET_LABELS[b]}
                        </button>
                      ),
                    )}
                    <button
                      className="btn-ghost"
                      onClick={() => dismiss(c.word)}
                      aria-label={`Dismiss ${c.word}`}
                      data-testid={`button-dismiss-${c.word}`}
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
              <div>
                <button
                  className="btn-ghost"
                  onClick={reset}
                  data-testid="button-reset-paste"
                >
                  Clear text
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
