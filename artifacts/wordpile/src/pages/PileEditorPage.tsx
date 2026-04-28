import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  Check,
  Download,
  Hammer,
  Link as LinkIcon,
  Pencil,
  Plus,
  ScanText,
  Share2,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { usePile } from "@/lib/useStore";
import { WordpileStore } from "@/lib/store";
import { buildShareUrl, encodePileShare } from "@/lib/shareLink";
import {
  buildShortUrl,
  createShortLink,
  listShortLinks,
  revokeShortLink,
  type ShortLinkSummary,
} from "@/lib/shortLink";
import { getCloudUserId } from "@/lib/cloudSync";
import {
  BUCKETS,
  BUCKET_BLURB,
  BUCKET_LABELS,
  type Bucket,
} from "@/data/types";
import { WordCard } from "@/components/WordCard";
import { PasteExtractor } from "@/components/PasteExtractor";

// State machine for the inline share panel. Kept in this file because
// it's only used here and tightly coupled to the editor's UX.
type SharePanelState =
  | { kind: "closed" }
  | { kind: "open"; longLink: string | null; longError: string | null }
  | { kind: "shortening" }
  | { kind: "short-error"; message: string }
  | { kind: "ready"; longLink: string | null; shortLink: string };

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers / insecure contexts.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function PileEditorPage() {
  const params = useParams<{ pileId: string }>();
  const pile = usePile(params.pileId);
  const [, navigate] = useLocation();
  const [newWord, setNewWord] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [share, setShare] = useState<SharePanelState>({ kind: "closed" });
  const [copied, setCopied] = useState<"long" | "short" | null>(null);
  const [shortLinks, setShortLinks] = useState<ShortLinkSummary[] | null>(null);
  const [shortLinksError, setShortLinksError] = useState<string | null>(null);

  const isSignedIn = getCloudUserId() !== null;
  const pileId = pile?.id ?? null;

  // Whenever the share panel opens (or the pile changes underneath us),
  // refresh the list of existing short links for this pile so the user
  // can revoke ones they made earlier. Anonymous users skip this — they
  // can't have any short links to begin with.
  useEffect(() => {
    if (share.kind === "closed") return;
    if (!isSignedIn) {
      setShortLinks(null);
      return;
    }
    let cancelled = false;
    void listShortLinks().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setShortLinksError(
          result.reason === "unauthenticated"
            ? null
            : "Couldn't load your existing short links.",
        );
        return;
      }
      setShortLinksError(null);
      setShortLinks(result.links);
    });
    return () => {
      cancelled = true;
    };
  }, [share.kind, pileId, isSignedIn]);

  async function openShareAndCopyLong() {
    if (!pile) return;
    setCopied(null);
    const payload = WordpileStore.serializePile(pile.id);
    if (!payload) {
      setShare({
        kind: "open",
        longLink: null,
        longError: "Couldn't read this pile.",
      });
      return;
    }
    const result = await encodePileShare(payload);
    if (!result.ok) {
      const message =
        result.reason === "too-large"
          ? "This pile is too big for a long link. Use a short link below, or Export to send it as a file."
          : result.reason === "unsupported"
            ? "This browser can't build long share links. Try a newer browser, or use Export."
            : "Couldn't build a long share link for this pile.";
      setShare({ kind: "open", longLink: null, longError: message });
      return;
    }
    const url = buildShareUrl(result.encoded);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied("long");
      window.setTimeout(() => {
        setCopied((c) => (c === "long" ? null : c));
      }, 2500);
    }
    setShare({ kind: "open", longLink: url, longError: null });
  }

  async function makeShortLink() {
    if (!pile) return;
    if (!isSignedIn) {
      setShare({
        kind: "short-error",
        message:
          "Sign in to make short links. Long links don't need an account — they live entirely in the URL.",
      });
      return;
    }
    setShare({ kind: "shortening" });
    setCopied(null);
    const payload = WordpileStore.serializePile(pile.id);
    if (!payload) {
      setShare({
        kind: "short-error",
        message: "Couldn't read this pile.",
      });
      return;
    }
    const result = await createShortLink(payload, { pileId: pile.id });
    if (!result.ok) {
      const message =
        result.reason === "encode-too-large"
          ? "This pile is too big to share, even as a short link. Use Export to send it as a file instead."
          : result.reason === "encode-unsupported"
            ? "This browser can't build share links. Try a newer browser."
            : result.reason === "encode-failed"
              ? "Couldn't pack this pile into a share link."
              : result.reason === "too-large"
                ? "This pile is too big to short-link. Use Export instead."
                : result.reason === "unauthenticated"
                  ? "Your session expired. Sign in again and try once more."
                  : "Couldn't reach the server. Try again in a moment.";
      setShare({ kind: "short-error", message });
      return;
    }
    const shortUrl = buildShortUrl(result.summary.slug);
    const longUrl =
      share.kind === "ready" || share.kind === "open" ? share.longLink : null;
    const copyOk = await copyToClipboard(shortUrl);
    if (copyOk) {
      setCopied("short");
      window.setTimeout(() => {
        setCopied((c) => (c === "short" ? null : c));
      }, 2500);
    }
    setShare({ kind: "ready", longLink: longUrl, shortLink: shortUrl });
    setShortLinks((prev) =>
      prev ? [result.summary, ...prev] : [result.summary],
    );
  }

  async function copyAgain(text: string, which: "long" | "short") {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(which);
      window.setTimeout(() => {
        setCopied((c) => (c === which ? null : c));
      }, 2500);
    }
  }

  async function revokeFromList(slug: string) {
    setShortLinksError(null);
    const result = await revokeShortLink(slug);
    if (!result.ok) {
      setShortLinksError(
        result.reason === "not-found"
          ? "That link is already gone."
          : "Couldn't revoke that link. Try again.",
      );
      return;
    }
    setShortLinks((prev) => (prev ? prev.filter((l) => l.slug !== slug) : prev));
    // If we just revoked the freshly-created short link, swap the panel
    // back to the picker state so the user can make a new one.
    if (share.kind === "ready" && share.shortLink.endsWith(`/s/${slug}`)) {
      setShare({ kind: "open", longLink: share.longLink, longError: null });
    }
  }

  function closePanel() {
    setShare({ kind: "closed" });
    setCopied(null);
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

  // Existing short links for *this* pile only — the editor card is
  // pile-scoped, so we surface only matching ones. The "Manage all"
  // surface (other piles, anonymously-orphaned ones) can come later.
  const myShortLinksForThisPile =
    shortLinks?.filter((l) => l.pileId === pile.id) ?? [];

  const longUrl =
    (share.kind === "open" || share.kind === "ready") && share.longLink
      ? share.longLink
      : null;
  const shortUrl = share.kind === "ready" ? share.shortLink : null;

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

      <div className="flex flex-wrap items-center gap-2 mb-4">
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
          onClick={() => {
            if (share.kind === "closed") {
              void openShareAndCopyLong();
            } else {
              closePanel();
            }
          }}
          data-testid="button-copy-share-link"
          title="Get a link that opens this pile on someone else's device — no file download needed."
        >
          {share.kind === "closed" ? (
            <>
              <Share2 size={12} /> Share link
            </>
          ) : (
            <>
              <X size={12} /> Close share panel
            </>
          )}
        </button>
        <span className="ml-2 eyebrow">
          {pile.words.length} word{pile.words.length === 1 ? "" : "s"} in this
          pile
        </span>
      </div>

      {share.kind !== "closed" && (
        <div
          className="mb-6 rounded p-4 flex flex-col gap-3"
          style={{
            backgroundColor: "var(--color-paper)",
            border: "1px solid var(--color-rule)",
          }}
          data-testid="panel-share-link"
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="eyebrow">Share this pile</p>
            <span
              className="text-sm"
              style={{ color: "var(--color-stone)" }}
            >
              Both options open the same import preview on the other device.
            </span>
          </div>

          {/* ---- Long link section ---- */}
          <section className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p
                className="text-sm"
                style={{ fontWeight: 600 }}
              >
                <LinkIcon
                  size={11}
                  style={{ display: "inline", marginRight: 4 }}
                />
                Long link · stays on your device
              </p>
              <span
                className="text-sm"
                style={{ color: "var(--color-stone)" }}
              >
                The pile contents ride inside the URL itself. Nothing is
                stored on our server. Anyone with the URL can read the
                pile, forever.
              </span>
            </div>
            {share.kind === "open" || share.kind === "ready" ? (
              share.kind === "open" && share.longError ? (
                <p
                  className="text-sm"
                  style={{ color: "var(--color-avoid)" }}
                  data-testid="text-share-long-error"
                >
                  {share.longError}
                </p>
              ) : longUrl ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      color: "var(--color-stone)",
                      wordBreak: "break-all",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: "1 1 220px",
                    }}
                    data-testid="text-share-long-url"
                    title={longUrl}
                  >
                    {longUrl}
                  </code>
                  <button
                    className="btn-ghost"
                    onClick={() => copyAgain(longUrl, "long")}
                    data-testid="button-copy-long-link"
                  >
                    {copied === "long" ? (
                      <>
                        <Check size={12} /> Copied
                      </>
                    ) : (
                      <>Copy</>
                    )}
                  </button>
                </div>
              ) : null
            ) : null}
          </section>

          <hr className="divider" style={{ margin: "4px 0" }} />

          {/* ---- Short link section ---- */}
          <section className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-sm" style={{ fontWeight: 600 }}>
                <Zap
                  size={11}
                  style={{ display: "inline", marginRight: 4 }}
                />
                Short link · stored on our server
              </p>
              <span
                className="text-sm"
                style={{ color: "var(--color-stone)" }}
              >
                Tiny URL that survives Signal, SMS, and email clients
                that mangle long links. The pile contents are stored on
                our server, indexed by an unguessable random ID. Anyone
                with the link can read the pile <strong>until you
                revoke it below</strong>.
              </span>
            </div>
            {share.kind === "shortening" ? (
              <p
                className="text-sm"
                style={{ color: "var(--color-stone)" }}
                data-testid="text-share-shortening"
              >
                Creating short link…
              </p>
            ) : share.kind === "short-error" ? (
              <p
                className="text-sm"
                style={{ color: "var(--color-avoid)" }}
                data-testid="text-share-short-error"
              >
                {share.message}
              </p>
            ) : share.kind === "ready" && shortUrl ? (
              <div className="flex items-center gap-2 flex-wrap">
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "var(--color-stone)",
                    wordBreak: "break-all",
                  }}
                  data-testid="text-share-short-url"
                >
                  {shortUrl}
                </code>
                <button
                  className="btn-ghost"
                  onClick={() => copyAgain(shortUrl, "short")}
                  data-testid="button-copy-short-link"
                >
                  {copied === "short" ? (
                    <>
                      <Check size={12} /> Copied
                    </>
                  ) : (
                    <>Copy</>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn-secondary"
                  onClick={makeShortLink}
                  data-testid="button-make-short-link"
                  disabled={!isSignedIn}
                  title={
                    isSignedIn
                      ? undefined
                      : "Sign in to make short links."
                  }
                >
                  <Zap size={12} /> Make a short link
                </button>
                {!isSignedIn && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--color-stone)" }}
                    data-testid="text-share-short-signin"
                  >
                    Sign in to make short links — they need an account
                    so only you can revoke them later. Long links above
                    work without an account.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ---- Revoke list ---- */}
          {isSignedIn && myShortLinksForThisPile.length > 0 && (
            <>
              <hr className="divider" style={{ margin: "4px 0" }} />
              <section className="flex flex-col gap-2">
                <p className="eyebrow">
                  Active short links for this pile ·{" "}
                  {myShortLinksForThisPile.length}
                </p>
                <ul className="flex flex-col gap-1">
                  {myShortLinksForThisPile.map((link) => {
                    const url = buildShortUrl(link.slug);
                    return (
                      <li
                        key={link.slug}
                        className="flex items-center gap-2 flex-wrap"
                        data-testid={`row-short-link-${link.slug}`}
                      >
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.78rem",
                            color: "var(--color-stone)",
                            wordBreak: "break-all",
                            flex: "1 1 220px",
                          }}
                          title={url}
                        >
                          {url}
                        </code>
                        <span
                          className="text-sm"
                          style={{ color: "var(--color-stone)" }}
                        >
                          {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          className="btn-ghost"
                          style={{ color: "var(--color-avoid)" }}
                          onClick={() => revokeFromList(link.slug)}
                          data-testid={`button-revoke-${link.slug}`}
                          title="Revoke this short link. The URL stops working immediately."
                        >
                          <Trash2 size={11} /> Revoke
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {shortLinksError && (
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-avoid)" }}
                    data-testid="text-share-revoke-error"
                  >
                    {shortLinksError}
                  </p>
                )}
              </section>
            </>
          )}
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
