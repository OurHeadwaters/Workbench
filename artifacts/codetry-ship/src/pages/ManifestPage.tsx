import { useEffect, useState, type FormEvent } from "react";
import {
  ApiError,
  downloadManifestCsv,
  fetchManifest,
  getStoredOwnerToken,
  setStoredOwnerToken,
  type ManifestEntry,
} from "@/lib/api";

export function ManifestPage() {
  const [token, setToken] = useState<string | null>(getStoredOwnerToken());
  const [entries, setEntries] = useState<ManifestEntry[] | null>(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
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
          setError(err.message);
          if (err.status === 401) {
            setStoredOwnerToken(null);
            setToken(null);
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
  }, [token]);

  if (!token) {
    return <LoginGate onAuthed={(t) => setToken(t)} />;
  }

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
              codetry · ship · operator
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
                setToken(null);
                setEntries(null);
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
            className="mt-8 divide-y"
            style={{ borderColor: "hsl(var(--card-border))" }}
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
    <li className="py-6" data-testid={`manifest-row-${entry.id}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="space-y-1">
          <p className="font-serif text-xl">{entry.name}</p>
          <p
            className="font-mono text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {entry.email}
            {entry.org ? ` · ${entry.org}` : ""}
            {entry.role ? ` · ${entry.role}` : ""}
          </p>
        </div>
        <div className="text-right">
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
      {entry.wouldBring ? (
        <p className="mt-3 font-serif text-base">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em] mr-2"
            style={{ color: "hsl(var(--accent))" }}
          >
            brings
          </span>
          {entry.wouldBring}
        </p>
      ) : null}
      {entry.wouldWant ? (
        <p className="mt-2 font-serif text-base">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em] mr-2"
            style={{ color: "hsl(var(--accent))" }}
          >
            wants
          </span>
          {entry.wouldWant}
        </p>
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

function LoginGate({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      // Validate by attempting a real fetch with the passphrase as token.
      await fetchManifest(pass);
      setStoredOwnerToken(pass);
      onAuthed(pass);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Wrong passphrase.");
      } else {
        setError("Could not verify just now. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground grid place-items-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-6"
        data-testid="form-login"
      >
        <div className="space-y-2">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · ship · operator
          </p>
          <h1 className="font-serif text-2xl">Operator passphrase</h1>
          <p
            className="font-sans text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The crew manifest is private. Sign in with the operator passphrase
            to read it.
          </p>
        </div>
        <input
          id="passphrase"
          type="password"
          required
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoFocus
          className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="input-passphrase"
        />
        {error ? (
          <p
            role="alert"
            className="font-sans text-sm text-destructive"
            data-testid="login-error"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-sm font-sans text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
          data-testid="button-login"
        >
          {submitting ? "Checking…" : "Sign in"}
        </button>
        <a
          href="./"
          className="signoff block text-center underline underline-offset-4 hover:opacity-80"
          data-testid="link-back"
        >
          ← back to the sign-on page
        </a>
      </form>
    </main>
  );
}
