import { useState, type FormEvent, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { createSnapshot, listSnapshots } from "@/lib/api";
import { getPlanForYear } from "@/lib/planCurve";
import { formatUsd } from "@/lib/format";

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

export default function NewSnapshot() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<FormState>(() => emptyForm(currentYear));
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the XRP balance from the most recent snapshot — Robin doesn't
  // trade, so the field is "sticky" in real life and re-typing it would be
  // silly.  We do this once, only if she hasn't already touched the field.
  const snapshotsQuery = useQuery({
    queryKey: ["check-in", "snapshots"],
    queryFn: listSnapshots,
  });
  const xrpPrefilledRef = useRef(false);
  useEffect(() => {
    if (xrpPrefilledRef.current) return;
    const prior = snapshotsQuery.data?.[0]?.xrpBalance;
    if (prior === undefined) return;
    xrpPrefilledRef.current = true;
    setForm((f) =>
      f.xrpBalance === String(DEFAULT_XRP_BALANCE)
        ? { ...f, xrpBalance: String(prior) }
        : f,
    );
  }, [snapshotsQuery.data]);

  const yearNum = Number(form.year);
  const planRow = Number.isFinite(yearNum) ? getPlanForYear(yearNum) : null;

  const mutation = useMutation({
    mutationFn: createSnapshot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-in", "snapshots"] });
      navigate("/");
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not save snapshot");
    },
  });

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Integer fields refuse decimals outright instead of rounding — these
    // rows are immutable, so silently turning $215,499.50 into 215499 would
    // be the kind of bug you only notice years later.  Whole-dollar entry is
    // a deliberate constraint of the schema.
    function parseInt0(v: string): { ok: true; value: number } | { ok: false; reason: "blank" | "invalid" | "decimal" } {
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

    const year = intResults.Year.value;
    const watershedArr = intResults["Watershed ARR"].value;
    const ownerTakeHome = intResults["Owner take-home"].value;
    const portfolioValue = intResults["Portfolio value"].value;
    const xrpBalance = intResults["XRP balance"].value;
    const annualLivingExpenses = intResults["Annual living expenses"].value;

    mutation.mutate({
      year,
      watershedArr,
      ownerTakeHome,
      portfolioValue,
      xrpBalance,
      xrpPriceUsd,
      annualLivingExpenses,
      notes: form.notes.trim().length > 0 ? form.notes.trim() : null,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Record this year's snapshot
        </h1>
        <p className="text-muted-foreground mt-2">
          One row per year. Past snapshots are immutable — they're a real
          paper trail of where things stood when you sat down.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl">The numbers</CardTitle>
          {planRow ? (
            <CardDescription>
              At age {planRow.age}, the plan targets a{" "}
              {formatUsd(planRow.portfolioTarget)} portfolio,{" "}
              {formatUsd(planRow.arrTarget)} ARR, and{" "}
              {formatUsd(planRow.takeHomeTarget)} take-home.
            </CardDescription>
          ) : (
            <CardDescription>
              No plan row matches that year — you can still record the
              snapshot.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="year"
                label="Year"
                value={form.year}
                onChange={(v) => update("year", v)}
                hint="Calendar year this snapshot represents"
                step="1"
                testId="input-year"
              />
              <FormField
                id="portfolio"
                label="Portfolio value (USD)"
                value={form.portfolioValue}
                onChange={(v) => update("portfolioValue", v)}
                hint="Total of brokerage, retirement, cash, crypto"
                testId="input-portfolio"
              />
              <FormField
                id="arr"
                label="Watershed ARR (USD)"
                value={form.watershedArr}
                onChange={(v) => update("watershedArr", v)}
                hint="Annualized recurring revenue at year-end"
                testId="input-arr"
              />
              <FormField
                id="takeHome"
                label="Owner take-home (USD)"
                value={form.ownerTakeHome}
                onChange={(v) => update("ownerTakeHome", v)}
                hint="What landed in your pocket this year"
                testId="input-take-home"
              />
              <FormField
                id="livingExpenses"
                label="Annual living expenses (USD)"
                value={form.annualLivingExpenses}
                onChange={(v) => update("annualLivingExpenses", v)}
                hint="What it cost you to live this year"
                testId="input-living-expenses"
              />
              <FormField
                id="xrpBalance"
                label="XRP balance"
                value={form.xrpBalance}
                onChange={(v) => update("xrpBalance", v)}
                hint={`Defaults to last year (${DEFAULT_XRP_BALANCE.toLocaleString()})`}
                testId="input-xrp-balance"
              />
              <FormField
                id="xrpPrice"
                label="XRP price (USD)"
                value={form.xrpPriceUsd}
                onChange={(v) => update("xrpPriceUsd", v)}
                hint="Whatever XRP was at on the day you sat down"
                step="0.0001"
                testId="input-xrp-price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={4}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="What's the story behind these numbers? What changed since last year?"
                data-testid="input-notes"
              />
            </div>

            {error ? (
              <div
                className="flex items-start gap-2 text-sm text-destructive"
                data-testid="text-form-error"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-save-snapshot"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save snapshot
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/")}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  hint,
  step,
  testId,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  step?: string;
  testId: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step={step ?? "1"}
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testId}
      />
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
