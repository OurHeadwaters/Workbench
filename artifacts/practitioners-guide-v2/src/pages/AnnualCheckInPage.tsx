/**
 * AnnualCheckInPage — owner-gated annual financial snapshot recorder.
 *
 * Routes: /year/check-in
 * API:    /api/annual-check-in  (mounted in api-server/src/routes/index.ts)
 *
 * - Unauthenticated visitors see a passphrase login form.
 * - Authenticated owners see the snapshot history and a form to record a new
 *   snapshot.  The bearer token is persisted to localStorage so the page
 *   survives a hard-refresh.
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Lock,
  Plus,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Snapshot {
  id: number;
  year: number;
  takenAt: string;
  watershedArr: number;
  ownerTakeHome: number;
  portfolioValue: number;
  xrpBalance: number;
  xrpPriceUsd: number;
  annualLivingExpenses: number;
  notes: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const API = "/api/annual-check-in";
const TOKEN_KEY = "checkin_owner_token";

// ── Helpers ────────────────────────────────────────────────────────────────────

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function authHeaders(token: string): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Kpi({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1">
        {label}
      </div>
      <div
        className="text-lg font-bold tabular-nums"
        style={{ fontFamily: "var(--app-font-serif)", color }}
      >
        {value}
      </div>
    </div>
  );
}

function SnapshotCard({ snap }: { snap: Snapshot }) {
  const xrpValue = Math.round(snap.xrpBalance * snap.xrpPriceUsd);
  const totalWealth = snap.portfolioValue + xrpValue;
  const ratio =
    snap.annualLivingExpenses > 0
      ? (snap.ownerTakeHome / snap.annualLivingExpenses).toFixed(1)
      : "—";

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <div className="h-1" style={{ backgroundColor: "#0F766E" }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--app-font-serif)", color: "#0F766E" }}
            >
              {snap.year}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {shortDate(snap.takenAt)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Kpi label="Watershed ARR" value={money(snap.watershedArr)} color="#065f46" />
          <Kpi label="Owner take-home" value={money(snap.ownerTakeHome)} color="#1A5FA8" />
          <Kpi label="Portfolio value" value={money(snap.portfolioValue)} color="#7C3AED" />
          <Kpi label="Total wealth" value={money(totalWealth)} color="#B45309" />
        </div>

        <div
          className="rounded-lg p-3 grid grid-cols-3 gap-3"
          style={{ backgroundColor: "hsl(var(--muted)/0.4)" }}
        >
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-0.5">
              XRP balance
            </div>
            <div className="text-sm font-mono tabular-nums font-medium">
              {snap.xrpBalance.toLocaleString("en-CA")} XRP
            </div>
            <div className="text-[11px] text-muted-foreground">
              @ ${snap.xrpPriceUsd.toFixed(4)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-0.5">
              Annual expenses
            </div>
            <div className="text-sm font-mono tabular-nums font-medium">
              {money(snap.annualLivingExpenses)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-0.5">
              Income / expenses
            </div>
            <div
              className="text-sm font-mono tabular-nums font-bold"
              style={{ color: "#065f46" }}
            >
              {ratio}×
            </div>
          </div>
        </div>

        {snap.notes && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t pt-3" style={{ borderColor: "hsl(var(--card-border))" }}>
            {snap.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Login wall ─────────────────────────────────────────────────────────────────

function LoginWall({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/owner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      const json = (await res.json()) as { ok?: boolean; token?: string; error?: string };
      if (!res.ok || !json.ok || !json.token) {
        setError(json.error ?? "Login failed");
      } else {
        try {
          localStorage.setItem(TOKEN_KEY, json.token);
        } catch {
          // ignore
        }
        onSuccess(json.token);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div
        className="rounded-xl border p-8"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <div
          className="h-12 w-12 rounded-xl grid place-items-center mx-auto mb-5"
          style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
        >
          <Lock className="h-5 w-5" />
        </div>
        <h2
          className="text-xl font-semibold text-center mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Annual check-in
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Owner access only — enter your passphrase to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            autoComplete="current-password"
            className="w-full rounded-lg border px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal-600"
            style={{ borderColor: "hsl(var(--card-border))" }}
            data-testid="checkin-passphrase"
          />
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || passphrase.length === 0}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0F766E" }}
            data-testid="checkin-login-btn"
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── New snapshot form ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  year: new Date().getFullYear(),
  watershedArr: "",
  ownerTakeHome: "",
  portfolioValue: "",
  xrpBalance: "",
  xrpPriceUsd: "",
  annualLivingExpenses: "",
  notes: "",
};

type FormState = typeof EMPTY_FORM;

function NewSnapshotForm({
  token,
  onSaved,
}: {
  token: string;
  onSaved: (snap: Snapshot) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      year: Number(form.year),
      watershedArr: Math.round(Number(form.watershedArr)),
      ownerTakeHome: Math.round(Number(form.ownerTakeHome)),
      portfolioValue: Math.round(Number(form.portfolioValue)),
      xrpBalance: Math.round(Number(form.xrpBalance)),
      xrpPriceUsd: Number(form.xrpPriceUsd),
      annualLivingExpenses: Math.round(Number(form.annualLivingExpenses)),
      notes: form.notes.trim() || undefined,
    };

    try {
      const res = await fetch(`${API}/snapshots`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { snapshot?: Snapshot; error?: string };
      if (!res.ok || !json.snapshot) {
        setError(json.error ?? "Failed to save snapshot.");
      } else {
        onSaved(json.snapshot);
        setForm(EMPTY_FORM);
        setOpen(false);
      }
    } catch {
      setError("Network error — could not save snapshot.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity"
        style={{ backgroundColor: "#0F766E" }}
        data-testid="checkin-new-btn"
      >
        <Plus className="h-4 w-4" />
        Record this year's snapshot
      </button>
    );
  }

  const fieldClass =
    "w-full rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-teal-600";
  const labelClass = "block text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1";

  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <CheckCircle2 className="h-4 w-4 text-teal-600" />
        <h3 className="text-sm font-semibold">New annual snapshot</h3>
      </div>
      <form onSubmit={handleSubmit} data-testid="checkin-form">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Year</label>
            <input
              type="number"
              className={fieldClass}
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              min={2026}
              required
              data-testid="field-year"
            />
          </div>
          <div>
            <label className={labelClass}>Watershed ARR ($)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.watershedArr}
              onChange={(e) => set("watershedArr", e.target.value)}
              min={0}
              placeholder="0"
              required
              data-testid="field-watershedArr"
            />
          </div>
          <div>
            <label className={labelClass}>Owner take-home ($)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.ownerTakeHome}
              onChange={(e) => set("ownerTakeHome", e.target.value)}
              min={0}
              placeholder="0"
              required
              data-testid="field-ownerTakeHome"
            />
          </div>
          <div>
            <label className={labelClass}>Portfolio value ($)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.portfolioValue}
              onChange={(e) => set("portfolioValue", e.target.value)}
              min={0}
              placeholder="0"
              required
              data-testid="field-portfolioValue"
            />
          </div>
          <div>
            <label className={labelClass}>XRP balance</label>
            <input
              type="number"
              className={fieldClass}
              value={form.xrpBalance}
              onChange={(e) => set("xrpBalance", e.target.value)}
              min={0}
              placeholder="0"
              required
              data-testid="field-xrpBalance"
            />
          </div>
          <div>
            <label className={labelClass}>XRP price (USD)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.xrpPriceUsd}
              onChange={(e) => set("xrpPriceUsd", e.target.value)}
              min={0}
              step="0.0001"
              placeholder="0.0000"
              required
              data-testid="field-xrpPriceUsd"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>Annual living expenses ($)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.annualLivingExpenses}
              onChange={(e) => set("annualLivingExpenses", e.target.value)}
              min={0}
              placeholder="0"
              required
              data-testid="field-annualLivingExpenses"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            className={fieldClass}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Key context for this year's numbers…"
            data-testid="field-notes"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0F766E" }}
            data-testid="checkin-save-btn"
          >
            {saving ? "Saving…" : "Save snapshot"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="rounded-lg px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function AnnualCheckInPage() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchSnapshots = useCallback(
    async (activeToken: string) => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API}/snapshots`, {
          headers: authHeaders(activeToken),
        });
        if (res.status === 401) {
          setToken(null);
          try {
            localStorage.removeItem(TOKEN_KEY);
          } catch {
            // ignore
          }
          return;
        }
        const json = (await res.json()) as { snapshots?: Snapshot[]; error?: string };
        if (!res.ok || !json.snapshots) {
          setFetchError(json.error ?? "Failed to load snapshots.");
        } else {
          setSnapshots(json.snapshots);
        }
      } catch {
        setFetchError("Network error — could not load snapshots.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (token) {
      void fetchSnapshots(token);
    }
  }, [token, fetchSnapshots]);

  function handleLogin(newToken: string) {
    setToken(newToken);
  }

  function handleNewSnapshot(snap: Snapshot) {
    setSnapshots((prev) => {
      const without = prev.filter((s) => s.year !== snap.year);
      const updated = [snap, ...without];
      updated.sort((a, b) => b.year - a.year || new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
      return updated;
    });
  }

  function handleLogout() {
    setToken(null);
    setSnapshots([]);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  if (!token) {
    return (
      <div data-testid="page-annual-check-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="back-to-dashboard"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>
        <LoginWall onSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-annual-check-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* Header */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ background: "#d1fae5", color: "#065f46" }}
        >
          <TrendingUp className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Owner only · Annual record
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Annual check-in
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial snapshots recorded once a year — the permanent record of where the business stood.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => token && fetchSnapshots(token)}
            disabled={loading}
            className="h-8 w-8 rounded-md grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "hsl(var(--muted))" }}
            title="Refresh"
            data-testid="checkin-refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="h-8 rounded-md px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "hsl(var(--muted))" }}
            data-testid="checkin-logout"
          >
            Lock
          </button>
        </div>
      </header>

      {/* New snapshot form */}
      <NewSnapshotForm token={token} onSaved={handleNewSnapshot} />

      {/* Snapshot list */}
      {fetchError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          data-testid="checkin-fetch-error"
        >
          {fetchError}
        </div>
      )}

      {loading && snapshots.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading snapshots…</span>
        </div>
      )}

      {!loading && snapshots.length === 0 && !fetchError && (
        <div
          className="rounded-xl border p-10 text-center"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          data-testid="checkin-empty"
        >
          <DollarSign className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No snapshots yet — record this year's numbers above.
          </p>
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="space-y-4" data-testid="checkin-snapshot-list">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {snapshots.length} snapshot{snapshots.length !== 1 ? "s" : ""} · newest first
          </p>
          {snapshots.map((snap) => (
            <SnapshotCard key={snap.id} snap={snap} />
          ))}
        </div>
      )}
    </div>
  );
}
