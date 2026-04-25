import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { useAppState, useAppStateActions } from "../lib/storage";
import { useToast } from "../components/Toast";
import { getPlanForYear } from "../lib/planCurve";
import { formatUsd } from "../lib/format";

const DEFAULT_XRP_BALANCE = 15000;

type FormState = {
  year: string;
  watershedArr: string;
  ownerTakeHome: string;
  portfolioValue: string;
  xrpBalance: string;
  xrpPriceUsd: string;
  annualLivingExpenses: string;
  notes: string;
};

function emptyForm(year: number): FormState {
  return {
    year: String(year),
    watershedArr: "",
    ownerTakeHome: "",
    portfolioValue: "",
    xrpBalance: String(DEFAULT_XRP_BALANCE),
    xrpPriceUsd: "",
    annualLivingExpenses: "",
    notes: "",
  };
}

type ParseInt0 =
  | { ok: true; value: number }
  | { ok: false; reason: "blank" | "invalid" | "decimal" };

// Integer fields refuse decimals outright instead of rounding — these
// snapshots are immutable, so silently turning $215,499.50 into 215499 is
// the kind of bug you only notice years later.
function parseInt0(v: string): ParseInt0 {
  if (!v.trim()) return { ok: false, reason: "blank" };
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return { ok: false, reason: "invalid" };
  if (!Number.isInteger(n)) return { ok: false, reason: "decimal" };
  return { ok: true, value: n };
}
function parseNum0(v: string): number | null {
  if (!v.trim()) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export default function CheckInNewSnapshot() {
  const [, navigate] = useLocation();
  const state = useAppState();
  const { addSnapshot } = useAppStateActions();
  const { show } = useToast();
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<FormState>(() => emptyForm(currentYear));
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the XRP balance from the most recent snapshot. The field is
  // sticky year over year; only set it once and only if untouched.
  const xrpPrefilledRef = useRef(false);
  useEffect(() => {
    if (xrpPrefilledRef.current) return;
    const sortedDesc = [...state.snapshots].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    const prior = sortedDesc[0]?.xrpBalance;
    if (prior === undefined) return;
    xrpPrefilledRef.current = true;
    setForm((f) =>
      f.xrpBalance === String(DEFAULT_XRP_BALANCE)
        ? { ...f, xrpBalance: String(prior) }
        : f,
    );
  }, [state.snapshots]);

  const yearNum = Number(form.year);
  const planRow = Number.isFinite(yearNum) ? getPlanForYear(yearNum) : null;

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const intResults = {
      Year: parseInt0(form.year),
      "Watershed ARR": parseInt0(form.watershedArr),
      "Owner take-home": parseInt0(form.ownerTakeHome),
      "Portfolio value": parseInt0(form.portfolioValue),
      "XRP balance": parseInt0(form.xrpBalance),
      "Annual living expenses": parseInt0(form.annualLivingExpenses),
    };

    for (const [label, result] of Object.entries(intResults)) {
      if (!result.ok && result.reason === "decimal") {
        setError(`${label} must be a whole number — drop the cents.`);
        return;
      }
    }

    const xrpPriceUsd = parseNum0(form.xrpPriceUsd);
    if (
      !intResults.Year.ok ||
      !intResults["Watershed ARR"].ok ||
      !intResults["Owner take-home"].ok ||
      !intResults["Portfolio value"].ok ||
      !intResults["XRP balance"].ok ||
      !intResults["Annual living expenses"].ok ||
      xrpPriceUsd === null
    ) {
      setError("Every numeric field is required.");
      return;
    }

    addSnapshot({
      year: intResults.Year.value,
      watershedArr: intResults["Watershed ARR"].value,
      ownerTakeHome: intResults["Owner take-home"].value,
      portfolioValue: intResults["Portfolio value"].value,
      xrpBalance: intResults["XRP balance"].value,
      xrpPriceUsd,
      annualLivingExpenses: intResults["Annual living expenses"].value,
      notes: form.notes.trim(),
    });
    show("Snapshot saved");
    navigate("/year/check-in");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          Year · Annual check-in
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Record this year's snapshot
        </h1>
        <p className="max-w-2xl text-sm text-stone-700">
          One row per year. Past snapshots are immutable — they're a real
          paper trail of where things stood when you sat down.
        </p>
      </header>

      <section className="space-y-5 rounded-lg border border-stone-200 bg-white p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            The numbers
          </h2>
          {planRow ? (
            <p className="mt-1 text-xs text-stone-500">
              At age {planRow.age}, the plan targets a{" "}
              {formatUsd(planRow.portfolioTarget)} portfolio,{" "}
              {formatUsd(planRow.arrTarget)} ARR, and{" "}
              {formatUsd(planRow.takeHomeTarget)} take-home.
            </p>
          ) : (
            <p className="mt-1 text-xs text-stone-500">
              No plan row matches that year — you can still record the
              snapshot.
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="year"
              label="Year"
              hint="Calendar year this snapshot represents"
              value={form.year}
              onChange={(v) => update("year", v)}
              testId="input-year"
            />
            <Field
              id="portfolio"
              label="Portfolio value (USD)"
              hint="Total of brokerage, retirement, cash, crypto"
              value={form.portfolioValue}
              onChange={(v) => update("portfolioValue", v)}
              testId="input-portfolio"
            />
            <Field
              id="arr"
              label="Watershed ARR (USD)"
              hint="Annualized recurring revenue at year-end"
              value={form.watershedArr}
              onChange={(v) => update("watershedArr", v)}
              testId="input-arr"
            />
            <Field
              id="takeHome"
              label="Owner take-home (USD)"
              hint="What landed in your pocket this year"
              value={form.ownerTakeHome}
              onChange={(v) => update("ownerTakeHome", v)}
              testId="input-take-home"
            />
            <Field
              id="livingExpenses"
              label="Annual living expenses (USD)"
              hint="What it cost you to live this year"
              value={form.annualLivingExpenses}
              onChange={(v) => update("annualLivingExpenses", v)}
              testId="input-living-expenses"
            />
            <Field
              id="xrpBalance"
              label="XRP balance"
              hint={`Defaults to last year (${DEFAULT_XRP_BALANCE.toLocaleString()})`}
              value={form.xrpBalance}
              onChange={(v) => update("xrpBalance", v)}
              testId="input-xrp-balance"
            />
            <Field
              id="xrpPrice"
              label="XRP price (USD)"
              hint="Whatever XRP was at on the day you sat down"
              step="0.0001"
              value={form.xrpPriceUsd}
              onChange={(v) => update("xrpPriceUsd", v)}
              testId="input-xrp-price"
            />
          </div>

          <label htmlFor="notes" className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-600">
              Notes (optional)
            </span>
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="What's the story behind these numbers? What changed since last year?"
              className="mt-1.5 w-full resize-y rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-700"
              data-testid="input-notes"
            />
          </label>

          {error && (
            <p
              className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-900"
              data-testid="text-form-error"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/year/check-in")}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-stone-700 bg-stone-900 px-4 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
              data-testid="button-save-snapshot"
            >
              Save snapshot
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  step,
  value,
  onChange,
  testId,
}: {
  id: string;
  label: string;
  hint?: string;
  step?: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-stone-600">
        {label}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={step ?? "1"}
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testId}
        className="mt-1.5 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-700"
      />
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </label>
  );
}
