/**
 * DebtAttackPage — Bobbie's private debt attack plan.
 *
 * Three phases: buffer → Debt A ($40k) → Debt B ($72k).
 * Personal take-home: $2,000 bi-weekly ($4,000/mo) from Bobbie draw until debt-free.
 * Tithe rule (permanent): first claim on practitioner DRAWINGS only — not on revenue.
 *   During debt attack: tithe on $4,000/mo take-home = $400/mo.
 * All engagement income above personal spending + tithe goes to the active phase target.
 * Debt-free is the trigger to increase personal spending.
 *
 * Math (V7 rates — Bobbie $175/hr billed, $105/hr net):
 *   Monthly billed:            $39,200
 *   Tyler sub:                ($11,200)
 *   Overheads:                 ($1,292)
 *   Bobbie draw:              ($16,800)  ($105/hr × 160 hr/mo)
 *   Business surplus:          $9,908/mo  (no business tithe — tithe is personal)
 *
 *   From draw — personal take-home: ($4,000)  ($2,000 bi-weekly)
 *   From draw — tithe (10% of $4k):   ($400)  first claim on drawings
 *   From draw — to debt:            $12,400  ($16,800 − $4,000 − $400)
 *   Total stacked:                  $22,308/mo  ($12,400 from draw + $9,908 surplus)
 *
 *   Phase 1 — buffer:    $20,000 ÷ $22,308 ≈ 0.9 months → 1 month
 *   Phase 2 — $40k debt: $40,000 ÷ $22,308 ≈ 1.8 months → 2 months
 *   Phase 3 — $72k debt: $72,000 ÷ $22,308 ≈ 3.2 months → 4 months
 *   Total to debt-free: ~7 months from engagement start (Jun 2026 → Jan 2027)
 */

import { CheckCircle2, Shield, Zap, Trophy, TrendingDown, Calendar, DollarSign } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const BOBBIE_DRAW_MONTHLY = 16_800;  // $105/hr × 160 hr/mo (V7 rate)
const PERSONAL_MONTHLY    = 4_000;   // $2,000 bi-weekly take-home during debt attack
const TITHE_MONTHLY       = 400;     // 10% of $4,000 take-home — first claim on drawings, NOT on revenue
const SURPLUS_MONTHLY     = 9_908;   // business surplus: revenue − draw − Tyler − OH (no business tithe)
const STACK_MONTHLY       = (BOBBIE_DRAW_MONTHLY - PERSONAL_MONTHLY - TITHE_MONTHLY) + SURPLUS_MONTHLY; // 22,308

const BUFFER_TARGET      = 20_000;
const DEBT_A             = 40_000;
const DEBT_B             = 72_000;

const BUFFER_MONTHS      = Math.ceil(BUFFER_TARGET / STACK_MONTHLY); // 2
const DEBT_A_MONTHS      = Math.ceil(DEBT_A / STACK_MONTHLY);        // 3
const DEBT_B_MONTHS      = Math.ceil(DEBT_B / STACK_MONTHLY);        // 5
const TOTAL_MONTHS       = BUFFER_MONTHS + DEBT_A_MONTHS + DEBT_B_MONTHS;

// Start: June 2026 (Phase 2 engagement start)
const START_YEAR  = 2026;
const START_MONTH = 5; // 0-indexed: 5 = June

function addMonths(year: number, month: number, add: number) {
  const d = new Date(year, month + add);
  return d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

const BUFFER_DONE_DATE = addMonths(START_YEAR, START_MONTH, BUFFER_MONTHS);
const DEBT_A_DONE_DATE = addMonths(START_YEAR, START_MONTH, BUFFER_MONTHS + DEBT_A_MONTHS);
const DEBT_FREE_DATE   = addMonths(START_YEAR, START_MONTH, TOTAL_MONTHS);

// ── Helpers ───────────────────────────────────────────────────────────────────

function money(n: number) {
  return "$" + n.toLocaleString("en-CA");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PhaseCard({
  phase,
  icon: Icon,
  label,
  color,
  colorSoft,
  colorInk,
  target,
  monthly,
  months,
  doneDate,
  description,
  done,
  active,
}: {
  phase: string;
  icon: typeof Shield;
  label: string;
  color: string;
  colorSoft: string;
  colorInk: string;
  target: number;
  monthly: number;
  months: number;
  doneDate: string;
  description: string;
  done?: boolean;
  active?: boolean;
}) {
  const pct = 100; // static — user tracks manually
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: active ? color : "hsl(var(--card-border))",
        background: "hsl(var(--card))",
        boxShadow: active ? `0 0 0 2px ${color}33` : undefined,
      }}
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="h-11 w-11 rounded-xl grid place-items-center flex-shrink-0 text-2xl font-bold"
            style={{ backgroundColor: colorSoft, color: colorInk }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold"
                style={{ color }}
              >
                {phase}
              </span>
              {active && (
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: colorSoft, color: colorInk }}
                >
                  Active
                </span>
              )}
              {done && (
                <span className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  Done
                </span>
              )}
            </div>
            <h3
              className="text-xl font-semibold leading-tight"
              style={{ fontFamily: "var(--app-font-serif)", color: colorInk }}
            >
              {label}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div
              className="text-2xl font-bold tabular-nums"
              style={{ fontFamily: "var(--app-font-serif)", color }}
            >
              {money(target)}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
              target
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>

        <div
          className="mt-4 grid grid-cols-3 gap-3 rounded-lg p-3"
          style={{ backgroundColor: colorSoft + "80" }}
        >
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-0.5">
              Monthly stack
            </div>
            <div className="text-base font-bold tabular-nums" style={{ color: colorInk }}>
              {money(monthly)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-0.5">
              Months
            </div>
            <div className="text-base font-bold tabular-nums" style={{ color: colorInk }}>
              ~{months}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-0.5">
              Done by
            </div>
            <div
              className="text-[12px] font-bold leading-tight"
              style={{ color: colorInk }}
            >
              {doneDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthRow({
  month,
  label,
  phase,
  color,
  cumulative,
  note,
}: {
  month: number;
  label: string;
  phase: string;
  color: string;
  cumulative: number;
  note?: string;
}) {
  return (
    <div
      className="grid grid-cols-[2.5rem_1fr_auto] gap-3 items-center py-2 border-b last:border-0"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <span
        className="text-[11px] font-mono tabular-nums text-center font-bold"
        style={{ color }}
      >
        {String(month).padStart(2, "0")}
      </span>
      <div>
        <span className="text-sm font-medium">{label}</span>
        {note && (
          <span className="ml-2 text-[11px] font-mono text-muted-foreground">{note}</span>
        )}
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
          {phase}
        </div>
      </div>
      <span className="text-sm font-mono tabular-nums font-semibold" style={{ color }}>
        {money(cumulative)}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function DebtAttackPage() {
  // Build the month-by-month table
  type Row = {
    month: number;
    label: string;
    phase: string;
    color: string;
    cumulative: number;
    note?: string;
  };

  const rows: Row[] = [];
  let cumulative = 0;

  // Phase 1 — buffer
  for (let m = 1; m <= BUFFER_MONTHS; m++) {
    cumulative = Math.min(cumulative + STACK_MONTHLY, BUFFER_TARGET);
    const date = addMonths(START_YEAR, START_MONTH, m - 1);
    const isLast = cumulative >= BUFFER_TARGET;
    rows.push({
      month: m,
      label: date,
      phase: "Buffer",
      color: "#065f46",
      cumulative,
      note: isLast ? "Buffer reached ✓" : undefined,
    });
  }

  // Phase 2 — $40k debt
  cumulative = 0;
  let monthOffset = BUFFER_MONTHS;
  for (let m = 1; m <= DEBT_A_MONTHS; m++) {
    cumulative = Math.min(cumulative + STACK_MONTHLY, DEBT_A);
    const date = addMonths(START_YEAR, START_MONTH, monthOffset + m - 1);
    const remaining = DEBT_A - cumulative;
    const isLast = remaining === 0;
    rows.push({
      month: monthOffset + m,
      label: date,
      phase: "Debt A — $40k",
      color: "#c2410c",
      cumulative,
      note: isLast ? "$40k cleared ✓" : `${money(remaining)} remaining`,
    });
  }

  // Phase 3 — $72k debt
  cumulative = 0;
  monthOffset = BUFFER_MONTHS + DEBT_A_MONTHS;
  for (let m = 1; m <= DEBT_B_MONTHS; m++) {
    cumulative = Math.min(cumulative + STACK_MONTHLY, DEBT_B);
    const date = addMonths(START_YEAR, START_MONTH, monthOffset + m - 1);
    const remaining = DEBT_B - cumulative;
    const isLast = remaining === 0;
    rows.push({
      month: monthOffset + m,
      label: date,
      phase: "Debt B — $72k",
      color: "#6d28d9",
      cumulative,
      note: isLast ? "DEBT FREE ✓" : `${money(remaining)} remaining`,
    });
  }

  return (
    <div className="space-y-6" data-testid="page-debt-attack">
      {/* Header */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          <TrendingDown className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Private · Bobbie only
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Debt attack plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Buffer → $40k → $72k → debt free · $2,000 bi-weekly take-home during debt attack
          </p>
        </div>
      </header>

      {/* At-a-glance strip */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted)/0.4)" }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          The whole plan at a glance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Personal/mo", value: money(PERSONAL_MONTHLY), sub: "$2,000 bi-weekly", color: "#065f46" },
            { label: "Stacked/mo", value: money(STACK_MONTHLY), sub: "after personal spending", color: "#c2410c" },
            { label: "Total debt", value: money(DEBT_A + DEBT_B), sub: "$40k + $72k", color: "#6d28d9" },
            { label: "Debt-free", value: DEBT_FREE_DATE.split(" ").slice(-1)[0], sub: DEBT_FREE_DATE, color: "#92400e" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1">
                {item.label}
              </div>
              <div
                className="text-xl font-bold tabular-nums"
                style={{ fontFamily: "var(--app-font-serif)", color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash flow breakdown */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Monthly cash flow · how the stack is built
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Total billed to client", value: 39_200, sign: "+", color: "#065f46" },
            { label: "Tyler subcontract", value: -11_200, sign: "−", color: "#c2410c" },
            { label: "Overheads (lean)", value: -1_292, sign: "−", color: "#c2410c" },
            { label: "Bobbie draw ($105/hr × 160 hr)", value: -16_800, sign: "−", color: "#6d28d9" },
            { label: "Business surplus (no business tithe)", value: 9_908, sign: "=", color: "#065f46", note: "goes entirely to debt" },
            { label: "— Bobbie take-home ($2k bi-weekly)", value: -4_000, sign: "−", color: "#6d28d9", note: "from draw · personal spending" },
            { label: "— Tithe (10% of take-home · first claim)", value: -400, sign: "−", color: "#6d28d9", note: "personal · on drawings only" },
            { label: "— From draw to debt", value: 12_400, sign: "=", color: "#065f46", note: "draw $16,800 − $4,000 − $400" },
            { label: "Total stacked toward debt", value: STACK_MONTHLY, sign: "→", color: "#92400e", bold: true },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 py-1.5"
              style={{
                borderTop: row.bold ? "1px solid hsl(var(--card-border))" : undefined,
                marginTop: row.bold ? "4px" : undefined,
                paddingTop: row.bold ? "10px" : undefined,
              }}
            >
              <span
                className="text-sm font-mono font-bold text-center"
                style={{ color: row.color }}
              >
                {row.sign}
              </span>
              <div>
                <span className={`text-sm ${row.bold ? "font-semibold" : ""}`}>{row.label}</span>
                {row.note && (
                  <span className="ml-2 text-[11px] font-mono text-muted-foreground">{row.note}</span>
                )}
              </div>
              <span
                className={`text-sm font-mono tabular-nums ${row.bold ? "font-bold" : ""}`}
                style={{ color: row.color }}
              >
                {row.value < 0 ? `(${money(Math.abs(row.value))})` : money(row.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Three phase cards */}
      <div className="space-y-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Three phases · in order
        </p>

        <PhaseCard
          phase="Phase 1"
          icon={Shield}
          label="Build the $20,000 buffer"
          color="#065f46"
          colorSoft="#d1fae5"
          colorInk="#064e3b"
          target={BUFFER_TARGET}
          monthly={STACK_MONTHLY}
          months={BUFFER_MONTHS}
          doneDate={BUFFER_DONE_DATE}
          active
          description={`Stack ${money(STACK_MONTHLY)}/mo into a protected business buffer. This fund does not get touched — it is the firewall that lets you keep attacking debt without a bad month wiping the progress. Nothing moves to Phase 2 until this hits ${money(BUFFER_TARGET)}.`}
        />

        <div className="flex justify-center">
          <div className="text-muted-foreground opacity-40 text-xl">↓</div>
        </div>

        <PhaseCard
          phase="Phase 2"
          icon={Zap}
          label="Kill the $40,000 debt"
          color="#c2410c"
          colorSoft="#ffedd5"
          colorInk="#9a3412"
          target={DEBT_A}
          monthly={STACK_MONTHLY}
          months={DEBT_A_MONTHS}
          doneDate={DEBT_A_DONE_DATE}
          description={`Every dollar above personal spending goes straight at the $40k. Nothing else. ${money(STACK_MONTHLY)}/mo × ~${DEBT_A_MONTHS} months. When it clears, you have buying power and breathing room — the same ${money(STACK_MONTHLY)}/mo now pivots entirely to the $72k.`}
        />

        <div className="flex justify-center">
          <div className="text-muted-foreground opacity-40 text-xl">↓</div>
        </div>

        <PhaseCard
          phase="Phase 3"
          icon={Trophy}
          label="Kill the $72,000 debt"
          color="#6d28d9"
          colorSoft="#ede9fe"
          colorInk="#5b21b6"
          target={DEBT_B}
          monthly={STACK_MONTHLY}
          months={DEBT_B_MONTHS}
          doneDate={DEBT_FREE_DATE}
          description={`The biggest block — but you arrive with momentum, no payment going to the $40k, and a proven system. ${money(STACK_MONTHLY)}/mo × ~${DEBT_B_MONTHS} months. The finish line is ${DEBT_FREE_DATE}. Personal spending steps up the day the last payment clears.`}
        />
      </div>

      {/* Debt-free milestone */}
      <div
        className="rounded-xl border-2 p-6 text-center"
        style={{ borderColor: "#92400e", background: "#fef3c7" }}
      >
        <Trophy className="h-8 w-8 mx-auto mb-3" style={{ color: "#92400e" }} />
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#92400e" }}>
          Target finish line
        </p>
        <p
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--app-font-serif)", color: "#78350f" }}
        >
          {DEBT_FREE_DATE}
        </p>
        <p className="mt-2 text-sm text-amber-800">
          Debt free · {TOTAL_MONTHS} months from engagement start · drawings increase from here
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Buffer done", value: BUFFER_DONE_DATE, months: `Month ${BUFFER_MONTHS}` },
            { label: "$40k cleared", value: DEBT_A_DONE_DATE, months: `Month ${BUFFER_MONTHS + DEBT_A_MONTHS}` },
            { label: "Debt free", value: DEBT_FREE_DATE, months: `Month ${TOTAL_MONTHS}` },
          ].map((m) => (
            <div key={m.label} className="rounded-lg p-3" style={{ background: "#fde68a" }}>
              <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-amber-700 mb-1">{m.label}</div>
              <div className="text-xs font-bold text-amber-900">{m.value}</div>
              <div className="text-[10px] font-mono text-amber-700 mt-0.5">{m.months}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Month-by-month tracker */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "hsl(var(--card-border))" }}>
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Month-by-month · cumulative progress per phase
          </p>
        </div>
        <div className="px-4 py-1 divide-y" style={{ borderColor: "hsl(var(--card-border))" }}>
          {rows.map((row) => (
            <MonthRow key={row.month} {...row} />
          ))}
        </div>
      </div>

      {/* Rules of the plan */}
      <div
        className="rounded-xl border p-5 space-y-3"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Rules of the plan · non-negotiable
        </p>
        {[
          { icon: DollarSign, color: "#065f46", rule: "Personal take-home stays at $2,000 bi-weekly ($4,000/mo) until the last debt clears. No lifestyle creep before the finish line." },
          { icon: CheckCircle2, color: "#065f46", rule: "Tithe is the first claim on practitioner drawings — not on revenue. During debt attack: 10% of $4,000/mo take-home = $400/mo. One tithe, on the draw. Permanent rule." },
          { icon: Shield, color: "#c2410c", rule: "The $20,000 buffer is untouchable once built. It absorbs a bad month without breaking the debt plan." },
          { icon: Zap, color: "#6d28d9", rule: "$40k dies before $72k. Clearing the smaller one first gives a real psychological win and frees the full stack for the bigger one." },
          { icon: Trophy, color: "#92400e", rule: "Debt-free is the trigger for a drawings increase — not a contract renewal, not a good month, not a feeling. The date on the plan." },
        ].map(({ icon: Icon, color, rule }) => (
          <div key={rule.slice(0, 20)} className="flex items-start gap-3">
            <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color }} />
            <p className="text-sm leading-relaxed text-muted-foreground">{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
