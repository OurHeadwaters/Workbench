import { useEffect, useMemo, useState } from "react";
import { useScenario } from "@/lib/scenario";
import { SCENARIOS } from "@/data/scenarios";
import { SectionCard } from "@/components/SectionCard";
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
  ChevronDown,
  ChevronRight,
  History,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";
import { CONFIRMED_DATE, formatTagDate } from "@/data/tags";

/**
 * Compare page — the operating-framework workspace.
 *
 * V3 (locked default operating framework) is anchored on the left as a
 * read-only column. To the right, "alternative reality" tabs let the
 * founder edit any row, lock what they've decided, and read the Δ-vs-V3
 * cell live as they talk a turn out. State persists to localStorage so
 * the workspace survives a refresh.
 *
 * V4 is pre-seeded as the first alternative reality on first visit (every
 * row locked, sourced from SCENARIO_V4) — V4 is the most-talked-about
 * alternative on 2026-04-26 and we want the page to be useful before the
 * reader does anything.
 *
 * "How we got here" hosts the V2 milestone note: V2 (full team, $115k/mo)
 * was retired from the live scenario set on 2026-04-26 once the founder
 * settled on the lean roster.
 */
export function ComparePage() {
  const { scenarioId, setScenarioId } = useScenario();
  const v3 = SCENARIOS.v3;
  const v4 = SCENARIOS.v4;

  const [state, setState] = useState<AltRealityState>(() => loadAltRealityState());
  const [historyOpen, setHistoryOpen] = useState(false);

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
      <header className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md bg-muted grid place-items-center flex-shrink-0">
          <GitCompareArrows className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Operating framework
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            V3 anchored. Alternative realities to the right.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            V3 — the lean-team, $90k/mo engagement — is the locked default operating framework. To
            the right, edit any row, lock what you've decided, and read the Δ-vs-V3 cell live as you
            talk a turn out. V4 (right-priced) is pre-loaded as the first alternative reality. Add,
            rename, or remove tabs as the conversation moves; everything you change is saved
            locally to your browser.
          </p>
        </div>
      </header>

      {/* Reading-context cards: which scenario is the rest of the guide currently reading on? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioCard
          scenario={v3}
          active={scenarioId === "v3"}
          onActivate={() => setScenarioId("v3")}
          locked
          subtitle="Locked default · the rest of the guide reads from this"
        />
        <ScenarioCard
          scenario={v4}
          active={scenarioId === "v4"}
          onActivate={() => setScenarioId("v4")}
          subtitle="Right-priced · also a fully-locked scenario"
        />
      </div>

      <SectionCard title="Workspace" subtitle="V3 (left, locked) vs alternative realities (right, editable)">
        {/* Tab strip */}
        <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2 border-b border-card-border pb-3">
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
                          <span style={{ color: v3.accent }}>V3 · Locked anchor</span>
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
      </SectionCard>

      {/* How we got here — V2 milestone note */}
      <SectionCard title="">
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-foreground"
          data-testid="history-toggle"
          aria-expanded={historyOpen}
        >
          {historyOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <History className="h-4 w-4 text-muted-foreground" />
          How we got here
        </button>
        {historyOpen ? (
          <div className="mt-3 ml-6 text-sm text-muted-foreground space-y-2">
            <p>
              <span className="font-medium text-foreground">V2 — Full team ($115k/mo)</span>{" "}
              <span className="text-xs">· retired 2026-04-26</span>
            </p>
            <p>
              The earliest published version of the operating framework carried an 8-role roster
              ($67k/mo payroll) and a $115k/mo engagement fee. Cost basis came in around $79.5k/mo
              ($67k payroll + ~$12.5k overheads), so the steady-state engagement threw off roughly
              <span className="font-medium text-foreground"> $35.5k/mo of Phase&nbsp;3 surplus</span>{" "}
              — split 50/25/25 into Reserve, Innovation, and Giving against the same shared
              buckets V3 uses today. (V3 has since moved Giving from a 25% Phase 3 slice to a
              tithe-first 10% off the top — see the Contracts page; the V2 50/25/25 framing here
              describes V2 as it shipped.)
            </p>
            <p>
              V2 was retired from the live scenario set on April 26, 2026 once the founder settled
              on the lean 6-role roster and V3 was promoted to the locked default. V2 is no longer
              available in the scenario toggle and no page reads from it. The V1 slide deck is
              unchanged.
            </p>
            <p>
              Salts (Parr's Jars), the 807 CDP grant, and Brightside are unchanged across the
              transition — they describe the world, not the engagement shape.
            </p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="What this workspace is for" accent={v4.accent}>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>
            <strong className="text-foreground">V3 is the anchor, not a draft.</strong> Every page
            in the guide reads V3's numbers as the founder's locked baseline. The left column on
            this page mirrors that anchor exactly so any alternative reality you sketch is
            measured against the same yardstick the rest of the document uses.
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
            <strong className="text-foreground">When you're ready to commit a turn,</strong> open
            the{" "}
            <Link
              href="/contracts"
              className="underline hover:text-foreground"
              data-testid="link-contracts-from-compare"
            >
              Contracts page <ArrowRight className="inline h-3 w-3" />
            </Link>{" "}
            and have the conversation against the locked V3 numbers, using your alt reality as the
            proposed counter-offer.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}

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
      className="rounded-xl border border-card-border bg-card p-5"
      style={{ borderTopColor: scenario.accent, borderTopWidth: "4px" }}
      data-testid={`compare-scenario-${scenario.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: scenario.accentInk }}>
            {scenario.name}
            {locked ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" /> default
              </span>
            ) : null}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle ?? scenario.tagline}</p>
        </div>
        <ConfirmedTag
          tag={
            scenario.status === "locked"
              ? { kind: "confirmed", date: "2026-04-26" }
              : { kind: "provisional", reason: scenario.statusNote }
          }
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>
      <button
        type="button"
        onClick={onActivate}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: scenario.accentInk }}
        data-testid={`compare-activate-${scenario.id}`}
      >
        {active ? "Currently reading" : "Switch the rest of the guide to this scenario"}{" "}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
