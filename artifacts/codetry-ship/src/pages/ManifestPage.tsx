import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ApiError,
  downloadManifestCsv,
  fetchManifest,
  getStoredOwnerToken,
  setStoredOwnerToken,
  type ManifestEntry,
} from "@/lib/api";

export function ManifestPage() {
  const [, navigate] = useLocation();
  const token = getStoredOwnerToken() ?? "";
  const [entries, setEntries] = useState<ManifestEntry[] | null>(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/sign-on");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchManifest(token)
      .then((res) => {
        if (cancelled) return;
        setEntries(res.entries);
        setCount(res.count);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setStoredOwnerToken(null);
            navigate("/sign-on");
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to load manifest.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (!token) return null;

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[64rem] px-6 sm:px-8 py-12 sm:py-16">
        <header
          className="flex flex-wrap items-baseline justify-between gap-4 border-b pb-6"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <div className="space-y-1">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              headwaters · operator
            </p>
            <h1 className="font-serif text-3xl tracking-tight">
              Crew manifest
            </h1>
            <p
              className="font-sans text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {count === 0
                ? "Nobody has signed on yet."
                : `${count} ${count === 1 ? "signer" : "signers"} on file. Newest first.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!token) return;
                downloadManifestCsv(token).catch((err) => {
                  setError(
                    err instanceof Error ? err.message : "CSV export failed",
                  );
                });
              }}
              className="inline-flex items-center px-4 py-2 rounded-sm font-sans text-sm bg-primary text-primary-foreground hover:opacity-90"
              data-testid="button-export-csv"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setStoredOwnerToken(null);
                navigate("/sign-on");
              }}
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              data-testid="button-signout"
            >
              sign out
            </button>
          </div>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-6 font-sans text-sm text-destructive"
            data-testid="manifest-error"
          >
            {error}
          </p>
        ) : null}

        {loading && entries === null ? (
          <p className="mt-12 signoff" data-testid="manifest-loading">
            loading manifest…
          </p>
        ) : null}

        {entries && entries.length === 0 ? (
          <p
            className="mt-12 font-serif text-lg"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="manifest-empty"
          >
            The manifest is empty. The first signer hasn&rsquo;t put their
            name on the ship yet.
          </p>
        ) : null}

        {entries && entries.length > 0 ? (
          <ul
            className="mt-8 space-y-4"
            data-testid="manifest-list"
          >
            {entries.map((e) => (
              <ManifestRow key={e.id} entry={e} />
            ))}
          </ul>
        ) : null}

        <footer
          className="mt-16 pt-8 border-t"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <a
            href="./"
            className="signoff underline underline-offset-4 hover:opacity-80"
            data-testid="link-back"
          >
            ← back to the sign-on page
          </a>
        </footer>
      </div>
    </main>
  );
}

function ManifestRow({ entry }: { entry: ManifestEntry }) {
  return (
    <li
      className="rounded-sm border px-5 py-5"
      style={{
        borderColor: "hsl(var(--card-border))",
        backgroundColor: "hsl(var(--card))",
      }}
      data-testid={`manifest-row-${entry.id}`}
    >
      {/* Top row — name + date/status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="font-serif text-xl leading-snug">{entry.name}</p>
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {entry.email}
            {entry.org ? (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                {entry.org}
              </>
            ) : null}
            {entry.role ? (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                {entry.role}
              </>
            ) : null}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {new Date(entry.createdAt).toISOString().slice(0, 10)}
          </p>
          <p className="font-mono text-[10px] mt-1 uppercase tracking-[0.15em]">
            <StatusPill label="op" status={entry.notificationStatus} />{" "}
            <StatusPill label="reply" status={entry.replyStatus} />
          </p>
        </div>
      </div>

      {/* Brings / Wants — stacked blocks, visually distinct */}
      {(entry.wouldBring || entry.wouldWant) ? (
        <div
          className="mt-4 grid gap-3"
          style={{
            gridTemplateColumns: entry.wouldBring && entry.wouldWant ? "1fr 1fr" : "1fr",
          }}
        >
          {entry.wouldBring ? (
            <div
              className="rounded-sm px-4 py-3"
              style={{ backgroundColor: "hsl(var(--accent) / 0.08)", borderLeft: "3px solid hsl(var(--accent))" }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5"
                style={{ color: "hsl(var(--accent))" }}
              >
                brings
              </p>
              <p className="font-serif text-base leading-snug">{entry.wouldBring}</p>
            </div>
          ) : null}
          {entry.wouldWant ? (
            <div
              className="rounded-sm px-4 py-3"
              style={{ backgroundColor: "hsl(var(--muted) / 0.5)", borderLeft: "3px solid hsl(var(--card-border))" }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                wants
              </p>
              <p className="font-serif text-base leading-snug">{entry.wouldWant}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function StatusPill({ label, status }: { label: string; status: string | null }) {
  const colour =
    status === "sent"
      ? "hsl(var(--primary))"
      : status === "failed"
        ? "hsl(var(--destructive))"
        : "hsl(var(--muted-foreground))";
  return (
    <span style={{ color: colour }}>
      {label}:{status ?? "—"}
    </span>
  );
}
