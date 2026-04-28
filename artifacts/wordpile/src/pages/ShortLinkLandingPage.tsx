/**
 * Landing page for `/wordpile/s/:slug` short links.
 *
 * Recipients of a short link aren't necessarily users of the app — they
 * might just be the friend the practitioner is forwarding a pile to.
 * The shape of this page mirrors the empty state of the import preview:
 * we fetch the encoded payload from the server, then redirect to
 * `/import#data=<encoded>` so the existing PilesPage import flow handles
 * the decoded preview / new vs. merge / confirmation UX. Centralising
 * the import UX in one place keeps the two share-link modes (long
 * fragment, short server-stored) behaviourally identical from the
 * recipient's perspective.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Loader2 } from "lucide-react";
import {
  buildShortUrl,
  isShortLinkSlug,
  resolveShortLink,
} from "@/lib/shortLink";
import { SHARE_FRAGMENT_KEY } from "@/lib/shareLink";

type Status =
  | { kind: "loading" }
  | { kind: "error"; message: string };

export function ShortLinkLandingPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  // useRef so a hot-reload or duplicate effect (StrictMode in dev) doesn't
  // try to re-fetch + re-redirect; the slug is single-use per landing.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const slug = params.slug ?? "";
    if (!isShortLinkSlug(slug)) {
      setStatus({
        kind: "error",
        message:
          "That short link doesn't look right. Ask the sender to copy it again — it may have been truncated.",
      });
      return;
    }
    let cancelled = false;
    void resolveShortLink(slug).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setStatus({
          kind: "error",
          message:
            result.reason === "not-found"
              ? "This short link has been revoked or never existed. Ask the sender for a fresh link."
              : result.reason === "network"
                ? "Couldn't reach the server. Check your connection and refresh."
                : "Something went wrong loading that link. Try again in a moment.",
        });
        return;
      }
      // Hand off to the existing import flow by navigating to /import
      // with the encoded payload as a fragment. We use replaceState so
      // the back button doesn't bring the user back to this loading
      // page — there's nothing useful for them to do here once the
      // payload is in hand.
      const fragment = `#${SHARE_FRAGMENT_KEY}=${result.payload.payload}`;
      if (typeof window !== "undefined") {
        const base = import.meta.env.BASE_URL.endsWith("/")
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;
        window.location.replace(`${window.location.origin}${base}import${fragment}`);
      } else {
        // SSR fallback — shouldn't happen in this app, but keeps the
        // typechecker honest about the window guard above.
        navigate(`/import${fragment}`);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.slug, navigate]);

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="eyebrow mb-3">Wordpile · shared link</p>
      {status.kind === "loading" ? (
        <>
          <h1 className="text-3xl mb-4">Opening the shared pile…</h1>
          <p
            className="flex items-center justify-center gap-2 text-sm"
            style={{ color: "var(--color-stone)" }}
            data-testid="text-shortlink-loading"
          >
            <Loader2 size={16} className="animate-spin" /> Fetching{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>
              {buildShortUrl(params.slug ?? "")}
            </code>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl mb-4">Couldn't open that short link.</h1>
          <p
            className="mb-6"
            style={{ color: "var(--color-stone)" }}
            data-testid="text-shortlink-error"
          >
            {status.message}
          </p>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Go to your piles
          </button>
        </>
      )}
    </div>
  );
}
