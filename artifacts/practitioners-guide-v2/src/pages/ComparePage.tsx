/**
 * ComparePage — operating-framework workspace.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - The workspace table is always visible — this IS the decision tool.
 *   - "How we got here", "What this workspace is for": collapsed by default.
 *   - Scenario cards: always visible (1-line decision signal per card).
 *
 * NOTE on V3 vs V5:
 *   V3 is the **workspace anchor** — the left-column read-only baseline every
 *   alt-reality is measured against. V5 is the **guide's locked default** — the
 *   scenario the rest of the guide reads from (Index, Contracts, Salts, Brightside).
 *   These are different concepts: the workspace is anchored to V3 because it is
 *   the founding baseline used to build the alternative-reality math; the guide
 *   is locked to V5 because V5 is the current operating plan. Both can be true
 *   at once without contradiction.
 */

import { useEffect, useMemo, useState } from "react";
import { useScenario } from "@/lib/scenario";
import { SCENARIOS } from "@/data/scenarios";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { money, moneyDelta } from "@/lib/format";
import {
  METRICS,
  loadAltRealityState,
  saveAltRealityState,
  addAltReality,
  removeAltReality,
  renameAltReality,
  setAltRow,
  readV3Value,
  readAltValue,
  type AltReality,
  type AltRealityState,
  type MetricDef,
  type MetricKey,
  type MetricUnit,
} from "@/lib/altRealities";
import {
  GitCompareArrows,
  Lock,
  Unlock,
  Plus,
  X,
  History,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";
import { CONFIRMED_DATE, formatTagDate } from "@/data/tags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ComparePage() {
  const { scenarioId, setScenarioId } = useScenario();
  const v3 = SCENARIOS.v3;
  const v4 = SCENARIOS.v4;
  const v5 = SCENARIOS.v5;
  const v6 = SCENARIOS.v6;
  const v7 = SCENARIOS.v7;

  const [state, setState] = useState<AltRealityState>(() => loadAltRealityState());

  useEffect(() => {
    saveAltRealityState(state);
  }, [state]);

  const activeReality =
    state.realities.find((r) => r.id === state.activeId) ?? state.realities[0] ?? null;

  const groups = useMemo(() => {
    const out: Record<string, MetricDef[]> = {};
    for (const m of METRICS) {
      if (!out[m.bucket]) out[m.bucket] = [];
      out[m.bucket].push(m);
    }
    return out;
  }, []);

  function handleAdd() {
    const next = addAltReality(state, defaultNewName(state.realities.length + 1));
    setState(next);
  }
  function handleRemove(id: string) {
    if (!confirm("Remove this alternative reality? This can't be undone.")) return;
    setState(removeAltReality(state, id));
  }
  function handleRename(id: string, name: string) {
    setState(renameAltReality(state, id, name));
  }
  function handleSetValue(id: string, key: MetricKey, value: number) {
    setState(setAltRow(state, id, key, { value }));
  }
  function handleToggleLock(id: string, key: MetricKey, currentLocked: boolean) {
    setState(setAltRow(state, id, key, { locked: !currentLocked }));
  }
  function handleActivate(id: string) {
    setState({ ...state, activeId: id });
  }

  return (
    <div className="space-y-6" data-testid="page-compare">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>
      <header className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md bg-muted grid place-items-center flex-shrink-0">
          <GitCompareArrows className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Operating framework workspace
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            V3 anchored. Alternative realities to the right.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            <strong className="text-foreground">V7 is the guide's locked default</strong> — the
            rest of the guide (Index, Contracts, Salts, Brightside) reads V7 numbers.{" "}
            <strong className="text-foreground">V3 is the workspace anchor</strong> — the
            left-column baseline every alternative reality is measured against. Both can be true
            at once. Edit any row, lock what you've decided, and read the Δ-vs-V3 cell live.
          </p>
        </div>
      </header>

      {/* ── Scenario cards — always visible ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ScenarioCard
          scenario={v7}
          active={scenarioId === "v7"}
          onActivate={() => setScenarioId("v7")}
          locked
          subtitle="Guide locked default · all other pages read from this"
        />
        <ScenarioCard
          scenario={v6}
          active={scenarioId === "v6"}
          onActivate={() => setScenarioId("v6")}
          subtitle="Historical baseline · $150/hr Bobbie + $70/hr Tyler"
        />
        <ScenarioCard
          scenario={v5}
          active={scenarioId === "v5"}
          onActivate={() => setScenarioId("v5")}
          subtitle="Historical baseline · $90k/mo Codetry archetype"
        />
        <ScenarioCard
          scenario={v3}
          active={scenarioId === "v3"}
          onActivate={() => setScenarioId("v3")}
          subtitle="Workspace anchor · left column of the table below"
        />
      </div>

      {/* ── Workspace table — always visible ── */}
      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="border-b border-card-border px-4 py-3">
          <p className="text-sm font-semibold">Workspace</p>
          <p className="text-xs text-muted-foreground">
            V3 (left, locked anchor) vs alternative realities (right, editable)
          </p>
        </div>
        <div className="p-4">
          {/* Tab strip */}
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-card-border pb-3">
            {state.realities.map((r) => {
              const active = r.id === activeReality?.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleActivate(r.id)}
                  data-testid={`alt-tab-${r.id}`}
                  className={
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors " +
                    (active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-card-border hover:text-foreground")
                  }
                >
                  <span className="truncate max-w-[200px]">{r.name}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-dashed border-card-border text-muted-foreground hover:text-foreground"
              data-testid="alt-add"
            >
              <Plus className="h-4 w-4" /> New alternative reality
            </button>
          </div>

          {activeReality ? (
            <>
              {/* Active-reality controls */}
              <div className="mb-4 flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1 flex-1 min-w-[240px]">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </span>
                  <input
                    type="text"
                    value={activeReality.name}
                    onChange={(e) => handleRename(activeReality.id, e.target.value)}
                    className="px-3 py-1.5 rounded-md border border-card-border bg-background text-sm"
                    data-testid="alt-rename-input"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemove(activeReality.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-card-border text-muted-foreground hover:text-destructive hover:border-destructive"
                  data-testid="alt-remove"
                >
                  <X className="h-4 w-4" /> Remove this reality
                </button>
              </div>

              {Object.entries(groups).map(([bucket, items]) => (
                <div key={bucket} className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{bucket}</h3>
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full text-sm min-w-[720px]">
                      <thead className="text-left text-muted-foreground">
                        <tr className="border-b border-card-border">
                          <th className="py-2 pr-4 font-medium">Metric</th>
                          <th className="py-2 pr-4 font-medium text-right num w-[200px]">
                            <span style={{ color: v3.accent }}>V3 · Workspace anchor</span>
                          </th>
                          <th className="py-2 pr-4 font-medium text-right num w-[200px]">
                            {activeReality.name}
                          </th>
                          <th className="py-2 pr-2 font-medium text-center w-[120px]">State</th>
                          <th className="py-2 pr-4 font-medium text-right num w-[140px]">Δ vs V3</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((m) => {
                          const v3Val = readV3Value(m.key);
                          const altVal = readAltValue(activeReality, m.key);
                          const row = activeReality.rows[m.key];
                          const locked = row?.locked ?? false;
                          const delta = altVal - v3Val;
                          return (
                            <tr
                              key={m.key}
                              className="border-b border-card-border align-top"
                              data-testid={`alt-row-${m.key}`}
                            >
                              <td className="py-2 pr-4">
                                <div className="font-medium">{m.label}</div>
                                {m.hint ? (
                                  <div className="text-xs text-muted-foreground">{m.hint}</div>
                                ) : null}
                              </td>
                              <td className="py-2 pr-4 text-right num">
                                <div className="flex items-center justify-end gap-2">
                                  <span>{fmt(v3Val, m.unit)}</span>
                                  <RowConfirmedChip
                                    testId={`v3-confirmed-${m.key}`}
                                    title={`V3 baseline · confirmed ${formatTagDate(CONFIRMED_DATE)}`}
                                  />
                                </div>
                              </td>
                              <td className="py-2 pr-4 text-right">
                                <AltNumberInput
                                  value={altVal}
                                  disabled={locked}
                                  onCommit={(n) =>
                                    handleSetValue(activeReality.id, m.key, n)
                                  }
                                  className={
                                    "w-full px-2 py-1 rounded-md border bg-background text-sm num text-right disabled:cursor-not-allowed " +
                                    (locked
                                      ? "border-[hsl(167_30%_82%)] bg-[hsl(167_38%_97%)] text-foreground opacity-100"
                                      : "border-card-border")
                                  }
                                  testId={`alt-input-${m.key}`}
                                />
                              </td>
                              <td className="py-2 pr-2 text-center">
                                <RowStateChip
                                  locked={locked}
                                  onToggle={() =>
                                    handleToggleLock(activeReality.id, m.key, locked)
                                  }
                                  testId={`alt-lock-${m.key}`}
                                />
                              </td>
                              <td
                                className={
                                  "py-2 pr-4 text-right num font-medium " +
                                  (delta === 0
                                    ? "text-muted-foreground"
                                    : delta > 0
                                      ? "text-[hsl(167_60%_22%)]"
                                      : "text-destructive")
                                }
                                data-testid={`alt-delta-${m.key}`}
                              >
                                {fmtDelta(delta, m.unit)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-card-border p-8 text-center text-sm text-muted-foreground">
              <p>No alternative realities yet. Add one to start sketching a turn against V3.</p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-card-border hover:bg-muted"
                data-testid="alt-add-empty"
              >
                <Plus className="h-4 w-4" /> New alternative reality
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail sections — collapsed by default ── */}
      <Accordion type="multiple" className="space-y-3">

        <AccordionItem
          value="what-for"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">What this workspace is for</span>
              <span className="text-xs text-muted-foreground">
                Anchor · scratch space · persistence · when to commit a turn
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>
                <strong className="text-foreground">V3 is the workspace anchor, not the guide default.</strong>{" "}
                V7 (updated rates, $175/hr Bobbie) is the guide's locked default — every other page
                reads V7 numbers. V3 is the workspace anchor here: the left column mirrors V3
                exactly so any alternative reality you sketch is measured against the same
                founding baseline the V3→V4→V5→V6→V7 lineage was built on.
              </li>
              <li>
                <strong className="text-foreground">Alternative realities are scratch space.</strong>{" "}
                Edit any row, lock the rows you've decided, and let the Δ-vs-V3 cell do the math. The
                State chip flips between "draft" (muted) and "locked" (the same confirmed-tag colour
                the rest of the document uses); locking a row tints the input and disables editing —
                click the chip again to return it to draft.
              </li>
              <li>
                <strong className="text-foreground">Persistence is local.</strong> The workspace is
                saved to your browser's local storage. Clearing storage resets back to the V4 seed.
              </li>
              <li>
                <strong className="text-foreground">When you're ready to commit a turn,</strong> open the{" "}
                <Link
                  href="/contracts"
                  className="underline hover:text-foreground"
                  data-testid="link-contracts-from-compare"
                >
                  Contracts page <ArrowRight className="inline h-3 w-3" />
                </Link>{" "}
                and have the conversation against the locked V7 numbers, using your alt reality as the
                proposed counter-offer.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="history"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-start gap-2.5 text-left">
              <History className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex items-baseline gap-3">
                <span className="font-semibold text-sm">How we got here</span>
                <span className="text-xs text-muted-foreground">
                  V2 retired · V3 workspace anchor · V4 right-priced · V5 historical baseline · V6 historical baseline · V7 guide locked default
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-medium text-foreground mb-1">V7 — Updated rates (guide locked default · 2026-05-02)</p>
                <p>
                  Bobbie $175/hr + Tyler $70/hr (RFF sub), 160 hr/mo each. $39,200/mo total billed.
                  Bobbie nets $105/hr ($16,800/mo draw); Tyler's $70/hr is a direct pass-through.
                  Phase 1: $25,000 flat 8-week trial (intentionally below cost — $11,100 entry gap).
                  Lean overheads ($1,292/mo — client pays tech stack). Monthly surplus $5,988;
                  12-month surplus $71,856. Waterfall TBD. V7 is the scenario all other guide pages read from.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">V6 — Hourly subcontract (historical baseline · locked 2026-05-02)</p>
                <p>
                  Bobbie $150/hr + Tyler $70/hr (RFF sub), 160 hr/mo each. $35,200/mo total billed.
                  Bobbie nets $80/hr ($12,800/mo draw); Tyler's $70/hr is a direct pass-through.
                  Phase 1: $25,000 flat 8-week trial (intentionally below cost — $3,100 entry gap).
                  Lean overheads ($1,292/mo — client pays tech stack). Monthly surplus $6,388;
                  12-month surplus $76,656. Preserved as a historical baseline — V7 is the current plan.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">V5 — Codetry archetype (historical baseline · locked 2026-04-29)</p>
                <p>
                  $90k/mo × 12 months against a 4-role Day-1 team ($43.5k/mo payroll). Capital
                  Recovery split into two visible legs: $40k family-infusion m1 + $72k
                  business-loan Aug → Oct. Phase 3 Reserve / Innovation 75/25. Preserved as a
                  historical baseline — V7 is the current operating plan.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">V4 — Right-priced ($105k/mo · pre-seeded in workspace)</p>
                <p>
                  $105k/mo × 18 months against the 7-role roster. V4 is pre-seeded as the first
                  alternative reality in this workspace — V4's right-priced numbers make the
                  Δ-vs-V3 math read cleanly. Compare it in the workspace; the guide's operating
                  plan is V7.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">V3 — Lean team (workspace anchor · confirmed 2026-04-26)</p>
                <p>
                  $90k/mo × 18 months against a 6-role lean roster ($60k/mo payroll). V3 is the
                  workspace anchor — left column here, read-only, the baseline every alternative
                  reality is measured against. The rest of the guide reads V7, not V3.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  V2 — Full team ($115k/mo) <span className="text-xs font-normal text-muted-foreground">· retired 2026-04-26</span>
                </p>
                <p>
                  The earliest published version of the operating framework carried an 8-role roster
                  ($67k/mo payroll) and a $115k/mo engagement fee. Cost basis came in around
                  $79.5k/mo ($67k payroll + ~$12.5k overheads), so the steady-state engagement
                  threw off roughly{" "}
                  <span className="font-medium text-foreground">$35.5k/mo of Phase&nbsp;3 surplus</span>{" "}
                  — split 50/25/25 into Reserve, Innovation, and Giving against the same shared
                  buckets V3 uses today. (V3 has since moved Giving from a 25% Phase 3 slice to a
                  tithe-first 10% off the top — see the Contracts page; the V2 50/25/25 framing
                  describes V2 as it shipped.)
                </p>
                <p className="mt-1">
                  V2 was retired from the live scenario set on April 26, 2026 once the founder
                  settled on the lean roster and V3 was established as the workspace anchor. V2 is
                  no longer available in the scenario toggle. Salts (Parr's Jars) and Brightside
                  are unchanged across the transition.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function defaultNewName(n: number): string {
  return `Alternative reality ${n}`;
}

/**
 * Editable numeric cell that holds its own transient string state so that
 * clearing the field to retype a number does not silently coerce the row to
 * `0` (a previous bug). The committed value flows up only when the typed
 * string is a finite number; an empty / partial string is held locally until
 * the user finishes typing.
 */
function AltNumberInput({
  value,
  disabled,
  onCommit,
  className,
  testId,
}: {
  value: number;
  disabled: boolean;
  onCommit: (n: number) => void;
  className: string;
  testId: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft !== null ? draft : String(value);
  return (
    <input
      type="number"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        if (raw === "") return;
        const n = Number(raw);
        if (Number.isFinite(n)) {
          onCommit(n);
        }
      }}
      onBlur={() => setDraft(null)}
      disabled={disabled}
      className={className}
      data-testid={testId}
    />
  );
}

/**
 * Small "confirmed"-style chip used per V3 row to mirror the locked-tag visual
 * language the rest of the document uses (matches ConfirmedTag.tsx colours).
 * V3 is a fully-locked scenario, so every baseline cell carries this chip.
 */
function RowConfirmedChip({ testId, title }: { testId: string; title: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider whitespace-nowrap text-[10px] px-1.5 py-0.5 bg-[hsl(167_38%_94%)] text-[hsl(167_60%_18%)] border-[hsl(167_30%_82%)]"
      title={title}
      data-testid={testId}
    >
      <CheckCircle2 className="h-2.5 w-2.5" />
      locked
    </span>
  );
}

/**
 * Per-row lock control on the alternative-reality side. Renders a labeled
 * chip ("Locked" or "Draft") so the state is readable at a glance — when
 * locked the chip uses the same confirmed-tag colour treatment used across
 * the document; when draft it uses the muted/TBD treatment.
 */
function RowStateChip({
  locked,
  onToggle,
  testId,
}: {
  locked: boolean;
  onToggle: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={locked}
      aria-label={locked ? "Unlock row (return to draft)" : "Lock row (mark confirmed)"}
      data-testid={testId}
      className={
        "inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider whitespace-nowrap text-[10px] px-1.5 py-0.5 transition-colors " +
        (locked
          ? "bg-[hsl(167_38%_94%)] text-[hsl(167_60%_18%)] border-[hsl(167_30%_82%)] hover:bg-[hsl(167_38%_88%)]"
          : "bg-muted text-muted-foreground border-border hover:text-foreground")
      }
    >
      {locked ? (
        <>
          <Lock className="h-2.5 w-2.5" /> locked
        </>
      ) : (
        <>
          <Unlock className="h-2.5 w-2.5" /> draft
        </>
      )}
    </button>
  );
}

function fmt(n: number, unit: MetricUnit): string {
  if (unit === "months") return `${n} mo`;
  if (unit === "count") return String(n);
  return money(n);
}

function fmtDelta(n: number, unit: MetricUnit): string {
  if (unit === "months") {
    const sign = n > 0 ? "+" : n < 0 ? "−" : "";
    if (n === 0) return "—";
    return `${sign}${Math.abs(n)} mo`;
  }
  if (unit === "count") {
    const sign = n > 0 ? "+" : n < 0 ? "−" : "";
    if (n === 0) return "—";
    return `${sign}${Math.abs(n)}`;
  }
  if (n === 0) return "—";
  return moneyDelta(n);
}

function ScenarioCard({
  scenario,
  active,
  onActivate,
  locked,
  subtitle,
}: {
  scenario: import("@/data/types").Scenario;
  active: boolean;
  onActivate: () => void;
  locked?: boolean;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-xl border border-card-border bg-card p-4"
      style={{ borderTopColor: scenario.accent, borderTopWidth: "4px" }}
      data-testid={`compare-scenario-${scenario.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: scenario.accentInk }}>
            {scenario.name}
            {locked ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" /> guide default
              </span>
            ) : null}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle ?? scenario.tagline}</p>
        </div>
        <ConfirmedTag
          tag={
            scenario.status === "locked"
              ? { kind: "confirmed", date: "2026-04-29" }
              : { kind: "provisional", reason: scenario.statusNote }
          }
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
      <button
        type="button"
        onClick={onActivate}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: scenario.accentInk }}
        data-testid={`compare-activate-${scenario.id}`}
      >
        {active ? "Currently reading" : "Switch the rest of the guide to this scenario"}{" "}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
