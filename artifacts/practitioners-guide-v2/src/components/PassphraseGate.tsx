import { useState, type ReactNode } from "react";
import { Lock, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "pg_v2_unlocked";
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { token, expires } = JSON.parse(raw) as { token: string; expires: number };
    if (Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function storeToken(token: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token, expires: Date.now() + EXPIRY_MS })
  );
}

function makeToken(passphrase: string): string {
  let hash = 0;
  for (let i = 0; i < passphrase.length; i++) {
    hash = (Math.imul(31, hash) + passphrase.charCodeAt(i)) | 0;
  }
  return `pg2_${hash.toString(16)}`;
}

const PASSPHRASE = import.meta.env.VITE_ACCESS_PASSPHRASE as string | undefined;

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      style={{ fontFamily: "var(--app-font-sans, system-ui, sans-serif)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-lg"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        {children}
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <CardShell>
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="h-12 w-12 rounded-xl grid place-items-center text-white"
          style={{ backgroundColor: "hsl(var(--destructive))" }}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h1
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--app-font-serif, Georgia, serif)" }}
          >
            Access not configured
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            The <code className="font-mono text-[11px]">VITE_ACCESS_PASSPHRASE</code> environment
            variable is not set. This app cannot be accessed until it is configured.
          </p>
        </div>
      </div>
    </CardShell>
  );
}

export function PassphraseGate({ children }: { children: ReactNode }) {
  const configured = Boolean(PASSPHRASE);
  const expectedToken = configured ? makeToken(PASSPHRASE!) : null;

  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (!expectedToken) return false;
    return getStoredToken() === expectedToken;
  });

  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  if (!configured) return <NotConfigured />;
  if (unlocked) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const attempt = makeToken(input.trim());
    if (attempt === expectedToken) {
      storeToken(attempt);
      setUnlocked(true);
    } else {
      setError(true);
      setShaking(true);
      setInput("");
      setTimeout(() => setShaking(false), 600);
    }
  }

  return (
    <CardShell>
      <div className="flex flex-col items-center gap-3 mb-8">
        <div
          className="h-12 w-12 rounded-xl grid place-items-center text-white"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        >
          <Lock className="h-5 w-5" />
        </div>
        <div className="text-center">
          <h1
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--app-font-serif, Georgia, serif)" }}
          >
            Practitioner's Guide
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
            Headwaters · Internal access only
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="passphrase"
            className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider"
          >
            Passphrase
          </label>
          <input
            id="passphrase"
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            autoFocus
            autoComplete="current-password"
            placeholder="Enter passphrase"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{
              borderColor: error
                ? "hsl(var(--destructive))"
                : "hsl(var(--input))",
              animation: shaking ? "shake 0.5s ease-in-out" : undefined,
            }}
          />
          {error && (
            <p className="mt-1.5 text-xs text-destructive">
              Incorrect passphrase. Please try again.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        >
          Unlock
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-6px); }
          30%       { transform: translateX(6px); }
          45%       { transform: translateX(-5px); }
          60%       { transform: translateX(5px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
      `}</style>
    </CardShell>
  );
}
