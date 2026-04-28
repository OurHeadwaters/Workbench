import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  Check,
  Download,
  Hammer,
  Link as LinkIcon,
  Pencil,
  Plus,
  ScanText,
  Trash2,
} from "lucide-react";
import { usePile } from "@/lib/useStore";
import { WordpileStore } from "@/lib/store";
import { buildShareUrl, encodePileShare } from "@/lib/shareLink";
import {
  BUCKETS,
  BUCKET_BLURB,
  BUCKET_LABELS,
  type Bucket,
} from "@/data/types";
import { WordCard } from "@/components/WordCard";
import { PasteExtractor } from "@/components/PasteExtractor";

export function PileEditorPage() {
  const params = useParams<{ pileId: string }>();
  const pile = usePile(params.pileId);
  const [, navigate] = useLocation();
  const [newWord, setNewWord] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [shareStatus, setShareStatus] = useState<
    | { kind: "idle" }
    | { kind: "copied" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function handleCopyShareLink() {
    if (!pile) return;
    setShareStatus({ kind: "idle" });
    const payload = WordpileStore.serializePile(pile.id);
    if (!payload) {
      setShareStatus({ kind: "error", message: "Couldn't read this pile." });
      return;
    }
    const result = await encodePileShare(payload);
    if (!result.ok) {
      const message =
        result.reason === "too-large"
          ? "This pile is too big to fit in a share link. Use Export to send it as a file instead."
          : result.reason === "unsupported"
            ? "This browser can't build share links. Try a newer browser, or use Export."
            : "Couldn't build a share link for this pile.";
      setShareStatus({ kind: "error", message });
      return;
    }
    const url = buildShareUrl(result.encoded);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers / insecure contexts: select-and-copy
        // via a temporary textarea.
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShareStatus({ kind: "copied" });
      window.setTimeout(() => {
        setShareStatus((s) => (s.kind === "copied" ? { kind: "idle" } : s));
      }, 2500);
    } catch {
      setShareStatus({
        kind: "error",
        message: "Couldn't copy to your clipboard. Long-press the link instead.",
      });
    }
  }

  if (!pile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="eyebrow mb-3">Wordpile</p>
        <h1 className="text-3xl mb-4">That community pile isn't here.</h1>
        <p className="mb-6" style={{ color: "var(--color-stone)" }}>
          It may have been deleted from this device, or you opened a link from
          another browser.
        </p>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to piles
        </button>
      </div>
    );
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newWord.trim()) return;
    WordpileStore.addWord(pile!.id, { word: newWord, bucket: "unsorted" });
    setNewWord("");
  }

  const wordsByBucket: Record<Bucket, typeof pile.words> = {
    unsorted: [],
    load: [],
    interior: [],
    avoid: [],
  };
  for (const w of pile.words) {
    wordsByBucket[w.bucket].push(w);
  }
  for (const b of BUCKETS) {
    wordsByBucket[b].sort((a, b) => a.word.localeCompare(b.word));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        {editingName ? (
          <>
            <input
              className="input"
              style={{ maxWidth: 360 }}
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  WordpileStore.renamePile(pile.id, draftName);
                  setEditingName(false);
                }
                if (e.key === "Escape") setEditingName(false);
              }}
            />
            <button
              className="btn-secondary"
              onClick={() => {
                WordpileStore.renamePile(pile.id, draftName);
                setEditingName(false);
              }}
            >
              Save
            </button>
            <button className="btn-ghost" onClick={() => setEditingName(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">Community pile</p>
            <h1
              className="text-4xl"
              style={{ fontWeight: 600, lineHeight: 1.05 }}
              data-testid="text-pile-title"
            >
              {pile.name}
            </h1>
            <button
              className="btn-ghost"
              onClick={() => {
                setDraftName(pile.name);
                setEditingName(true);
              }}
              data-testid="button-rename-pile"
            >
              <Pencil size={11} /> Rename
            </button>
            <button
              className="btn-ghost"
              style={{ color: "var(--color-avoid)" }}
              onClick={() => {
                if (
                  confirm(
                    `Delete the "${pile.name}" pile? This removes ${pile.words.length} word${
                      pile.words.length === 1 ? "" : "s"
                    } from this device.`,
                  )
                ) {
                  WordpileStore.deletePile(pile.id);
                  navigate("/");
                }
              }}
              data-testid="button-delete-pile"
            >
              <Trash2 size={11} /> Delete
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Link
          href={`/pile/${pile.id}/check`}
          className="btn-secondary"
          data-testid="link-check-draft"
        >
          <ScanText size={14} /> Check a draft
        </Link>
        <Link
          href={`/pile/${pile.id}/build`}
          className="btn-secondary"
          data-testid="link-build-game"
          title="Try building with these word-timbers — three little games to play with."
        >
          <Hammer size={14} /> Build
        </Link>
        <button
          className="btn-ghost"
          onClick={() => downloadPileExport(pile.id)}
          data-testid="button-export-pile"
          title="Download this pile as a .wordpile.json file you can hand to another practitioner."
        >
          <Download size={12} /> Export
        </button>
        <button
          className="btn-ghost"
          onClick={handleCopyShareLink}
          data-testid="button-copy-share-link"
          title="Copy a link that opens this pile on someone else's device — no file download needed."
        >
          {shareStatus.kind === "copied" ? (
            <>
              <Check size={12} /> Link copied
            </>
          ) : (
            <>
              <LinkIcon size={12} /> Copy share link
            </>
          )}
        </button>
        <span className="ml-2 eyebrow">
          {pile.words.length} word{pile.words.length === 1 ? "" : "s"} in this
          pile
        </span>
      </div>
      {shareStatus.kind === "error" && (
        <div
          className="mb-6 rounded p-3 text-sm"
          style={{
            backgroundColor: "var(--color-paper)",
            border: "1px solid var(--color-avoid)",
            color: "var(--color-avoid)",
          }}
          data-testid="text-share-link-error"
        >
          {shareStatus.message}
          <button
            className="btn-ghost ml-2"
            onClick={() => setShareStatus({ kind: "idle" })}
            style={{ color: "inherit" }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-10">
        <section
          className="rounded p-4"
          style={{
            backgroundColor: "var(--color-paper)",
            border: "1px solid var(--color-rule)",
          }}
        >
          <p className="eyebrow mb-2">Add a word directly</p>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              className="input"
              placeholder="Type a word, hit add — lands in Unsorted."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              data-testid="input-add-word"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
              disabled={!newWord.trim()}
              data-testid="button-add-word"
            >
              <Plus size={14} /> Add
            </button>
          </form>
        </section>

        <PasteExtractor pile={pile} />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {BUCKETS.map((bucket) => {
          const list = wordsByBucket[bucket];
          return (
            <div
              key={bucket}
              className="bucket-col"
              data-testid={`column-${bucket}`}
            >
              <header className="bucket-col-header">
                <div>
                  <p className="bucket-col-title">{BUCKET_LABELS[bucket]}</p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-stone)" }}
                  >
                    {BUCKET_BLURB[bucket]}
                  </p>
                </div>
                <span
                  className="bucket-col-count"
                  data-testid={`count-${bucket}`}
                >
                  {list.length}
                </span>
              </header>
              {list.length === 0 ? (
                <p
                  className="text-sm italic"
                  style={{ color: "var(--color-stone)" }}
                >
                  Empty stack.
                </p>
              ) : (
                list.map((w) => (
                  <WordCard key={w.id} pileId={pile.id} word={w} />
                ))
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "pile"
  );
}

function downloadPileExport(pileId: string) {
  const payload = WordpileStore.serializePile(pileId);
  if (!payload) return;
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(payload.pile.name)}.wordpile.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
