import { useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import {
  BUCKETS,
  BUCKET_LABELS,
  type Bucket,
  type WordEntry,
} from "@/data/types";
import { WordpileStore } from "@/lib/store";

interface Props {
  pileId: string;
  word: WordEntry;
}

export function WordCard({ pileId, word }: Props) {
  const [editing, setEditing] = useState(false);
  const [draftWord, setDraftWord] = useState(word.word);
  const [draftNote, setDraftNote] = useState(word.note);
  const [draftSafer, setDraftSafer] = useState(word.saferAlternative);

  function startEdit() {
    setDraftWord(word.word);
    setDraftNote(word.note);
    setDraftSafer(word.saferAlternative);
    setEditing(true);
  }

  function save() {
    WordpileStore.updateWord(pileId, word.id, {
      word: draftWord,
      note: draftNote,
      saferAlternative: word.bucket === "avoid" ? draftSafer : "",
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        className={`card-2x4 bucket-${word.bucket}`}
        data-testid={`card-word-${word.id}`}
      >
        <input
          className="input"
          style={{ marginBottom: 8 }}
          value={draftWord}
          onChange={(e) => setDraftWord(e.target.value)}
          aria-label="Word"
        />
        <input
          className="input"
          style={{ marginBottom: 8 }}
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          placeholder="What it means / how it's used here"
          aria-label="Note"
        />
        {word.bucket === "avoid" && (
          <input
            className="input"
            style={{ marginBottom: 8 }}
            value={draftSafer}
            onChange={(e) => setDraftSafer(e.target.value)}
            placeholder="Safer alternative to use instead"
            aria-label="Safer alternative"
          />
        )}
        <div className="flex gap-2">
          <button
            className="btn-ghost"
            onClick={save}
            data-testid={`button-save-word-${word.id}`}
          >
            <Check size={12} /> Save
          </button>
          <button
            className="btn-ghost"
            onClick={() => setEditing(false)}
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-2x4 bucket-${word.bucket}`}
      data-testid={`card-word-${word.id}`}
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className="timber"
          style={{ fontSize: 16 }}
          data-testid={`text-word-${word.id}`}
        >
          {word.word}
        </span>
      </div>
      {word.note && (
        <p
          className="text-sm leading-snug mt-1"
          style={{ color: "var(--color-stone)" }}
        >
          {word.note}
        </p>
      )}
      {word.bucket === "avoid" && word.saferAlternative && (
        <p
          className="text-sm leading-snug mt-1"
          style={{ color: "var(--color-ink)" }}
        >
          <span className="eyebrow" style={{ display: "inline-block", marginRight: 6 }}>
            Use instead
          </span>
          <span className="timber">{word.saferAlternative}</span>
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1">
        <span
          className="eyebrow"
          style={{ marginRight: 4 }}
        >
          Move
        </span>
        {BUCKETS.filter((b) => b !== word.bucket).map((b) => (
          <button
            key={b}
            className="btn-ghost"
            onClick={() => WordpileStore.moveWord(pileId, word.id, b)}
            data-testid={`button-move-${word.id}-${b}`}
          >
            {BUCKET_LABELS[b]}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button
          className="btn-ghost"
          onClick={startEdit}
          data-testid={`button-edit-${word.id}`}
        >
          Edit
        </button>
        <button
          className="btn-ghost"
          style={{ color: "var(--color-avoid)" }}
          onClick={() => {
            if (confirm(`Remove "${word.word}" from this pile?`)) {
              WordpileStore.deleteWord(pileId, word.id);
            }
          }}
          data-testid={`button-delete-word-${word.id}`}
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

export function bucketColor(bucket: Bucket): string {
  if (bucket === "load") return "var(--color-load)";
  if (bucket === "interior") return "var(--color-interior)";
  if (bucket === "avoid") return "var(--color-avoid)";
  return "var(--color-unsorted)";
}
