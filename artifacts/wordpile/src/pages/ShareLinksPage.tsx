/**
 * /wordpile/share-links — single "kill switch" view for every short link
 * the signed-in user owns, regardless of which pile (or which signed-in
 * session) created it.
 *
 * The pile editor's share panel only surfaces short links whose `pileId`
 * matches the pile being edited. That hides:
 *   - links to piles the user has since deleted from this device,
 *   - links the user made anonymously and only later signed in to claim,
 *   - links sitting in piles the user just hasn't opened on this device.
 *
 * This page lists the lot — server-truth, sorted newest first — and lets
 * the user revoke any of them in one place. Pile name is whatever was
 * captured at create time, so revocation is meaningful even if the local
 * pile is gone.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Check, Loader2, Trash2 } from "lucide-react";
import {
  buildShortUrl,
  listShortLinks,
  revokeShortLink,
  type ShortLinkSummary,
} from "@/lib/shortLink";
import { getCloudUserId } from "@/lib/cloudSync";
import { useWordpile } from "@/lib/useStore";

type ListState =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "error"; message: string }
  | { kind: "ready"; links: ShortLinkSummary[] };

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
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

export function ShareLinksPage() {
  const [state, setState] = useState<ListState>({ kind: "loading" });
  // Per-row revoke / copy feedback. Keyed by slug so multiple rows can
  // surface their own status without a global "last action" footgun.
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  // We use the local pile cache only as a hint — to mark which links
  // still point at a pile the user can open right now versus ones whose
  // pile is no longer in this browser's snapshot. The list of links
  // itself comes from the server, not from local state.
  const { piles } = useWordpile();

  const isSignedIn = getCloudUserId() !== null;

  useEffect(() => {
    if (!isSignedIn) {
      setState({ kind: "signed-out" });
      return;
    }
    let cancelled = false;
    setState({ kind: "loading" });
    void listShortLinks().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        if (result.reason === "unauthenticated") {
          setState({ kind: "signed-out" });
          return;
        }
        setState({
          kind: "error",
          message:
            result.reason === "network"
              ? "Couldn't reach the server. Check your connection and try again."
              : "Couldn't load your short links. Try again in a moment.",
        });
        return;
      }
      // Newest first — `createdAt` is ISO so a string sort is fine, but
      // we parse to be explicit and resilient to any future format
      // changes upstream.
      const sorted = [...result.links].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setState({ kind: "ready", links: sorted });
    });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  async function handleRevoke(slug: string) {
    setRowError((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    setRowBusy((prev) => ({ ...prev, [slug]: true }));
    const result = await revokeShortLink(slug);
    setRowBusy((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    if (!result.ok) {
      // 404 means the link was already gone (perhaps revoked from
      // another browser tab). Treat that as a success — drop it from
      // the list so the user's mental model and the server agree.
      if (result.reason === "not-found") {
        setState((prev) =>
          prev.kind === "ready"
            ? { ...prev, links: prev.links.filter((l) => l.slug !== slug) }
            : prev,
        );
        return;
      }
      if (result.reason === "unauthenticated") {
        setState({ kind: "signed-out" });
        return;
      }
      setRowError((prev) => ({
        ...prev,
        [slug]:
          result.reason === "network"
            ? "Couldn't reach the server. Try again."
            : "Couldn't revoke that link. Try again.",
      }));
      return;
    }
    setState((prev) =>
      prev.kind === "ready"
        ? { ...prev, links: prev.links.filter((l) => l.slug !== slug) }
        : prev,
    );
  }

  async function handleCopy(slug: string) {
    const url = buildShortUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(slug);
      window.setTimeout(() => {
        setCopied((current) => (current === slug ? null : current));
      }, 2500);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="eyebrow mb-3">Wordpile · your short links</p>
      <h1
        className="text-4xl mb-3"
        style={{ fontWeight: 600, lineHeight: 1.1 }}
      >
        Manage shared links
      </h1>
      <p
        className="text-lg leading-relaxed mb-6"
        style={{ color: "var(--color-stone)", maxWidth: 620 }}
      >
        Every short link you've ever created lives here, across every pile.
        Revoke any one and the URL stops working immediately — the recipient
        will see a "this link has been revoked" message instead of the pile.
      </p>

      <hr className="divider" />

      {state.kind === "signed-out" && (
        <SignedOutPanel />
      )}

      {state.kind === "loading" && (
        <div
          className="flex items-center gap-2 text-sm py-6"
          style={{ color: "var(--color-stone)" }}
          data-testid="text-share-links-loading"
        >
          <Loader2 size={16} className="animate-spin" /> Loading your short
          links…
        </div>
      )}

      {state.kind === "error" && (
        <div
          className="rounded p-4 my-4"
          style={{
            backgroundColor: "var(--color-paper)",
            border: "1px solid var(--color-avoid)",
            color: "var(--color-avoid)",
          }}
          data-testid="text-share-links-error"
        >
          {state.message}
        </div>
      )}

      {state.kind === "ready" && state.links.length === 0 && (
        <EmptyState piles={piles} />
      )}

      {state.kind === "ready" && state.links.length > 0 && (
        <section className="my-6 flex flex-col gap-3">
          <p className="eyebrow" data-testid="text-share-links-count">
            {state.links.length} active short link
            {state.links.length === 1 ? "" : "s"}
          </p>
          <ul className="flex flex-col gap-2">
            {state.links.map((link) => {
              const url = buildShortUrl(link.slug);
              const pileExists =
                link.pileId !== null && piles[link.pileId] !== undefined;
              const created = new Date(link.createdAt);
              const createdLabel = isNaN(created.getTime())
                ? link.createdAt
                : created.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
              return (
                <li
                  key={link.slug}
                  className="rounded p-3 flex flex-col gap-2"
                  style={{
                    backgroundColor: "var(--color-paper)",
                    border: "1px solid var(--color-rule)",
                  }}
                  data-testid={`row-share-link-${link.slug}`}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p
                      className="text-base"
                      style={{ fontWeight: 600 }}
                      data-testid={`text-share-link-pile-${link.slug}`}
                    >
                      {link.pileName || "Untitled pile"}
                    </p>
                    {pileExists && link.pileId && (
                      <Link
                        href={`/pile/${link.pileId}`}
                        className="link text-sm"
                        data-testid={`link-share-link-open-${link.slug}`}
                      >
                        Open pile
                      </Link>
                    )}
                    {!pileExists && (
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-stone)" }}
                        title="The pile this link points to isn't on this device. The link still works for whoever you sent it to."
                        data-testid={`text-share-link-orphan-${link.slug}`}
                      >
                        · pile not on this device
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--color-stone)",
                        wordBreak: "break-all",
                        flex: "1 1 220px",
                      }}
                      title={url}
                      data-testid={`text-share-link-url-${link.slug}`}
                    >
                      {url}
                    </code>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => handleCopy(link.slug)}
                      data-testid={`button-share-link-copy-${link.slug}`}
                    >
                      {copied === link.slug ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>Copy</>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ color: "var(--color-avoid)" }}
                      onClick={() => handleRevoke(link.slug)}
                      disabled={rowBusy[link.slug]}
                      data-testid={`button-share-link-revoke-${link.slug}`}
                      title="Revoke this short link. The URL stops working immediately."
                    >
                      {rowBusy[link.slug] ? (
                        <>
                          <Loader2 size={11} className="animate-spin" />{" "}
                          Revoking…
                        </>
                      ) : (
                        <>
                          <Trash2 size={11} /> Revoke
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-stone)" }}
                  >
                    Created {createdLabel}
                  </p>
                  {rowError[link.slug] && (
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-avoid)" }}
                      data-testid={`text-share-link-error-${link.slug}`}
                    >
                      {rowError[link.slug]}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function SignedOutPanel() {
  // Clerk is optional at build time. When the publishable key isn't set,
  // there's no `/sign-in` route to send people to — App.tsx omits it
  // entirely — so we skip the Sign-in CTA to avoid a 404 dead-end and
  // explain why short links are unavailable instead.
  const clerkEnabled = Boolean(
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  );
  return (
    <div
      className="rounded p-4 my-6 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-rule)",
      }}
      data-testid="panel-share-links-signed-out"
    >
      <p className="text-base" style={{ fontWeight: 600 }}>
        {clerkEnabled
          ? "Sign in to manage your short links."
          : "Short links aren't available on this installation."}
      </p>
      <p className="text-sm" style={{ color: "var(--color-stone)" }}>
        {clerkEnabled
          ? "Short links are tied to the account that made them — only you can see them, and only you can revoke them. Long share links don't need an account, but they also can't be revoked."
          : "This copy of Wordpile is running without an account system, so there's no way to make or revoke short links from this device. Long share links still work — they ride inside the URL itself and don't need an account."}
      </p>
      <div className="flex gap-2">
        {clerkEnabled && (
          <Link
            href="/sign-in"
            className="btn-primary"
            data-testid="link-share-links-sign-in"
          >
            Sign in
          </Link>
        )}
        <Link
          href="/"
          className={clerkEnabled ? "btn-ghost" : "btn-primary"}
          data-testid="link-share-links-back-piles"
        >
          Back to your piles
        </Link>
      </div>
    </div>
  );
}

function EmptyState({
  piles,
}: {
  piles: Record<string, { id: string; name: string }>;
}) {
  // If the user has at least one local pile, point them at it so they
  // can make their first short link without bouncing back to the index.
  const firstPile = Object.values(piles)[0] ?? null;
  return (
    <div
      className="rounded p-4 my-6 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-rule)",
      }}
      data-testid="panel-share-links-empty"
    >
      <p className="text-base" style={{ fontWeight: 600 }}>
        No active short links.
      </p>
      <p className="text-sm" style={{ color: "var(--color-stone)" }}>
        You haven't made any short links yet — or you've revoked all the ones
        you had. Short links live on our server until you revoke them, so
        leaving them lying around means whoever has the URL can still open
        the pile. The trade-off for that risk is a tiny URL that survives
        Signal, SMS, and email clients that mangle long links.
      </p>
      <div className="flex gap-2 flex-wrap">
        {firstPile ? (
          <Link
            href={`/pile/${firstPile.id}`}
            className="btn-primary"
            data-testid="link-share-links-empty-pile"
          >
            Open “{firstPile.name}” to make a link
          </Link>
        ) : (
          <Link
            href="/"
            className="btn-primary"
            data-testid="link-share-links-empty-piles"
          >
            Back to your piles
          </Link>
        )}
      </div>
    </div>
  );
}
