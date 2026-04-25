import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "headwaters-hours-by-pillar-v1";

type Pillar = "deerLake" | "salt" | "internalDesign" | "agencyBackOffice";

const PILLARS: { key: Pillar; label: string; short: string }[] = [
  { key: "deerLake", label: "Deer Lake (contract)", short: "Deer Lake" },
  { key: "salt", label: "Salt", short: "Salt" },
  { key: "internalDesign", label: "Internal design", short: "Int. design" },
  { key: "agencyBackOffice", label: "Agency back-office", short: "Back-office" },
];

type Hours = Record<Pillar, number>;

type RoleRow = {
  id: string;
  name: string;
  baselinePercent: number;
  hours: Hours;
  prevQuarterUnder: boolean;
  notes: string;
};

type State = {
  quarter: string;
  preparedBy: string;
  preparedOn: string;
  rows: RoleRow[];
};

const DEFAULT_STATE: State = {
  quarter: "",
  preparedBy: "",
  preparedOn: "",
  rows: [
    {
      id: "ops-manager",
      name: "Operations Manager",
      baselinePercent: 65,
      hours: { deerLake: 235, salt: 45, internalDesign: 35, agencyBackOffice: 45 },
      prevQuarterUnder: false,
      notes:
        "~28 hrs/week. Deer Lake: store-manager 1:1s, weekly staffing + supplier coordination, monthly P&L walk-through with the band council, freight + cold-chain escalations. Salt: production scheduling and co-pack check-ins. Internal design: sprint kickoffs and resourcing calls. Back-office: contracts, vendor onboarding, HR admin, agency-wide weekly ops huddle.",
    },
    {
      id: "bookkeeper",
      name: "Bookkeeper / Admin",
      baselinePercent: 40,
      hours: { deerLake: 60, salt: 30, internalDesign: 20, agencyBackOffice: 40 },
      prevQuarterUnder: false,
      notes:
        "~12 hrs/week. Deer Lake: store payroll, vendor pay-runs, monthly statement to the band council, this Hours-by-Pillar report. Salt: COGS reconciliation, HST on retail orders, royalty tracking. Internal design: project-time allocation and client invoicing. Back-office: agency payroll, monthly close, GST/HST filings, year-end T4s/T4As.",
    },
    {
      id: "it-tech",
      name: "IT/Tech",
      baselinePercent: 60,
      hours: { deerLake: 130, salt: 30, internalDesign: 25, agencyBackOffice: 30 },
      prevQuarterUnder: false,
      notes:
        "~15 hrs/week plus on-call. Deer Lake: POS upkeep, inventory sync, in-store networking, payment-terminal uptime, satellite-link babysitting. Salt: webshop + order-automation tweaks. Internal design: build tools and asset pipeline. Back-office: agency device/account admin, backups, MFA cleanup.",
    },
    {
      id: "food-handler",
      name: "Food Handler",
      baselinePercent: 90,
      hours: { deerLake: 360, salt: 0, internalDesign: 10, agencyBackOffice: 20 },
      prevQuarterUnder: false,
      notes:
        "~30 hrs/week at the Deer Lake store: receiving, prep, cold-chain checks, daily food-safety log. Back-office time is cert renewals (FoodSafe), training refresh, and SOP write-ups paid out of practitioner overhead. Small internal-design slice covers shelf labels and recipe cards. Salt batches are processed by separate certified staff — do not bill salt hours here.",
    },
  ],
};

function loadState(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_STATE;
    // Light-touch hydration: any missing field falls back to default.
    const rows = Array.isArray(parsed.rows) && parsed.rows.length > 0
      ? parsed.rows.map((r: Partial<RoleRow>, i: number) => ({
          id: String(r.id ?? `row-${i}`),
          name: String(r.name ?? ""),
          baselinePercent: Number.isFinite(Number(r.baselinePercent))
            ? Number(r.baselinePercent)
            : 0,
          hours: {
            deerLake: Number(r.hours?.deerLake ?? 0) || 0,
            salt: Number(r.hours?.salt ?? 0) || 0,
            internalDesign: Number(r.hours?.internalDesign ?? 0) || 0,
            agencyBackOffice: Number(r.hours?.agencyBackOffice ?? 0) || 0,
          },
          prevQuarterUnder: Boolean(r.prevQuarterUnder),
          notes: String(r.notes ?? ""),
        }))
      : DEFAULT_STATE.rows;
    return {
      quarter: String(parsed.quarter ?? ""),
      preparedBy: String(parsed.preparedBy ?? ""),
      preparedOn: String(parsed.preparedOn ?? ""),
      rows,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function rowTotal(h: Hours): number {
  return h.deerLake + h.salt + h.internalDesign + h.agencyBackOffice;
}

function deerLakeShare(h: Hours): number {
  const t = rowTotal(h);
  return t > 0 ? (h.deerLake / t) * 100 : 0;
}

function fmtPct(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

function fmtHours(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function newId(): string {
  return `row-${Math.random().toString(36).slice(2, 9)}`;
}

export default function HoursByPillar() {
  const [state, setState] = useState<State>(() => loadState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }, [state]);

  const updateRow = (id: string, patch: Partial<RoleRow>) => {
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const updateHours = (id: string, pillar: Pillar, value: number) => {
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === id
          ? { ...r, hours: { ...r.hours, [pillar]: value } }
          : r,
      ),
    }));
  };

  const addRow = () => {
    setState((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: newId(),
          name: "",
          baselinePercent: 0,
          hours: { deerLake: 0, salt: 0, internalDesign: 0, agencyBackOffice: 0 },
          prevQuarterUnder: false,
          notes: "",
        },
      ],
    }));
  };

  const removeRow = (id: string) => {
    setState((prev) => ({
      ...prev,
      rows: prev.rows.filter((r) => r.id !== id),
    }));
  };

  const reset = () => {
    setState(DEFAULT_STATE);
  };

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const pdfHref = `${import.meta.env.BASE_URL}headwaters-hours-by-pillar.pdf`;

  const enriched = useMemo(() => {
    return state.rows.map((r) => {
      const total = rowTotal(r.hours);
      const actual = deerLakeShare(r.hours);
      const variance = actual - r.baselinePercent;
      const belowThisQuarter = total > 0 && actual < r.baselinePercent;
      const triggersPause = belowThisQuarter && r.prevQuarterUnder;
      return {
        row: r,
        total,
        actual,
        variance,
        belowThisQuarter,
        triggersPause,
      };
    });
  }, [state.rows]);

  const anyPause = enriched.some((e) => e.triggersPause);
  const anyBelowThisQuarter = enriched.some((e) => e.belowThisQuarter);

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Quarterly Hours-by-Pillar Report
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[15pt]">
              Did Deer Lake get first call this quarter — for every shared role?
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Bookkeeper&rsquo;s quarterly check</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Hard Rule 02 · slide VI · 03
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665]">
            Fill the four hours columns for every shared role. Variance,
            flags and the pause trigger calculate live. Saves on this device.
          </div>
          <div className="flex gap-[6pt]">
            <button
              type="button"
              onClick={reset}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Reset
            </button>
            <a
              href={pdfHref}
              download="headwaters-hours-by-pillar.pdf"
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Quarter" hint="e.g. Q1 2026">
            <input
              type="text"
              value={state.quarter}
              onChange={(e) => setState((s) => ({ ...s, quarter: e.target.value }))}
              placeholder="Q_ 20__"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Prepared by" hint="Bookkeeper">
            <input
              type="text"
              value={state.preparedBy}
              onChange={(e) => setState((s) => ({ ...s, preparedBy: e.target.value }))}
              placeholder="Name"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Prepared on" hint="Date filed">
            <input
              type="text"
              value={state.preparedOn}
              onChange={(e) => setState((s) => ({ ...s, preparedOn: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
        </div>

        <table
          className="w-full text-[9pt] border-collapse mb-[8pt] print:text-[8.5pt]"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
              <th className="py-[4pt] pr-[3pt] w-[16%]">Shared role</th>
              <th className="py-[4pt] px-[2pt] w-[8%] text-right">
                Baseline
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  Deer Lake %
                </div>
              </th>
              {PILLARS.map((p) => (
                <th key={p.key} className="py-[4pt] px-[2pt] w-[8%] text-right">
                  {p.short}
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    hours
                  </div>
                </th>
              ))}
              <th className="py-[4pt] px-[2pt] w-[7%] text-right">
                Total
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  hrs
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[8%] text-right">
                Actual
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  Deer Lake %
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[8%] text-right">
                Variance
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  pp vs baseline
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[7%] text-center">
                Prev Q
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  under?
                </div>
              </th>
              <th className="py-[4pt] pl-[2pt] w-[14%] text-left">
                Flag
              </th>
            </tr>
          </thead>
          <tbody className="text-[#2a2520] align-top">
            {enriched.map(({ row, total, actual, variance, belowThisQuarter, triggersPause }) => (
              <tr
                key={row.id}
                className="border-b border-[#e3dac4]"
                style={{
                  background: triggersPause
                    ? "#f7d7c9"
                    : belowThisQuarter
                    ? "#fbeed1"
                    : "transparent",
                }}
              >
                <td className="py-[4pt] pr-[3pt]">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, { name: e.target.value })}
                    placeholder="Role"
                    className="w-full bg-transparent font-semibold text-[#1f3d2e] focus:outline-none print:border-0"
                  />
                  <div className="print-hide mt-[2pt] flex items-center gap-[4pt]">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="font-mono uppercase tracking-[0.14em] text-[7pt] text-[#b85a3e] hover:underline"
                    >
                      remove
                    </button>
                  </div>
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={row.baselinePercent}
                    onChange={(v) => updateRow(row.id, { baselinePercent: v })}
                    suffix="%"
                  />
                </td>
                {PILLARS.map((p) => (
                  <td key={p.key} className="py-[4pt] px-[2pt] text-right">
                    <NumberInput
                      value={row.hours[p.key]}
                      onChange={(v) => updateHours(row.id, p.key, v)}
                    />
                  </td>
                ))}
                <td className="py-[4pt] px-[2pt] text-right font-semibold text-[#1f3d2e]">
                  {fmtHours(total)}
                </td>
                <td className="py-[4pt] px-[2pt] text-right font-semibold">
                  {total > 0 ? fmtPct(actual) : "—"}
                </td>
                <td
                  className="py-[4pt] px-[2pt] text-right font-semibold"
                  style={{
                    color: total === 0
                      ? "#6b7665"
                      : variance < 0
                      ? "#b85a3e"
                      : "#1f3d2e",
                  }}
                >
                  {total > 0
                    ? `${variance >= 0 ? "+" : ""}${variance.toFixed(0)}pp`
                    : "—"}
                </td>
                <td className="py-[4pt] px-[2pt] text-center">
                  <label className="inline-flex items-center justify-center cursor-pointer print:cursor-auto">
                    <input
                      type="checkbox"
                      checked={row.prevQuarterUnder}
                      onChange={(e) =>
                        updateRow(row.id, { prevQuarterUnder: e.target.checked })
                      }
                      className="print-hide w-[12pt] h-[12pt] accent-[#1f3d2e]"
                    />
                    <span
                      aria-hidden
                      className="hidden print:inline-flex w-[10pt] h-[10pt] border border-[#1f3d2e] items-center justify-center"
                    >
                      {row.prevQuarterUnder && (
                        <span className="font-mono text-[8pt] leading-none">
                          ✓
                        </span>
                      )}
                    </span>
                  </label>
                </td>
                <td className="py-[4pt] pl-[2pt] text-left text-[8.5pt] font-semibold print:text-[8pt]">
                  {triggersPause ? (
                    <span className="text-[#b85a3e]">
                      Pause salt + design
                    </span>
                  ) : belowThisQuarter ? (
                    <span className="text-[#a07a18]">Under baseline</span>
                  ) : total > 0 ? (
                    <span className="text-[#1f3d2e]">OK</span>
                  ) : (
                    <span className="text-[#6b7665] font-normal">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-hide mb-[10pt]">
          <button
            type="button"
            onClick={addRow}
            className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
          >
            + Add shared role
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10pt] mb-[8pt] print:gap-[6pt] print:mb-[5pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[6.5pt] print:mb-[1pt]">
              Status this quarter
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight print:text-[12pt]">
              {anyPause
                ? "Salt + internal design pause"
                : anyBelowThisQuarter
                ? "Watch — under for one quarter"
                : "Hard Rule 02 holds"}
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[2pt] leading-[1.35] print:text-[7.5pt] print:leading-[1.25] print:mt-[1pt]">
              {anyPause
                ? "At least one shared role is below the contracted Deer Lake baseline two quarters in a row. Salt batches and internal design sprints stop until next quarter's report shows the ratio restored."
                : anyBelowThisQuarter
                ? "One or more roles are under baseline this quarter. If they're under again next quarter, salt and internal design pause."
                : "Every shared role's Deer Lake share met or beat the contracted baseline this quarter. Salt and internal design continue."}
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[6.5pt] print:mb-[1pt]">
              How the trigger works
            </div>
            <div className="text-[9pt] text-[#2a2520] leading-[1.4] print:text-[8.5pt] print:leading-[1.3]">
              For each shared role: actual Deer Lake share = Deer Lake hours
              ÷ total hours across all four pillars. If actual is below the
              contracted baseline, the row is flagged{" "}
              <span className="font-semibold">Under baseline</span>. The
              <span className="font-mono"> Prev&nbsp;Q&nbsp;under? </span>
              box must be set from the{" "}
              <span className="font-semibold">prior quarter&rsquo;s filed
              report</span> — not from memory — so the two-in-a-row check
              can&rsquo;t be quietly skipped. When both are true the row
              turns red and salt + internal design pause.
            </div>
          </div>
        </div>

        <div className="mb-[8pt] print:mb-[5pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt]">
            Bookkeeper&rsquo;s notes (per role)
          </div>
          <div className="space-y-[4pt]">
            {state.rows.map((r) => (
              <div
                key={`note-${r.id}`}
                className="grid grid-cols-[1fr_3fr] gap-[6pt] items-baseline border-b border-[#e3dac4] pb-[4pt]"
              >
                <div className="font-semibold text-[9pt] text-[#1f3d2e] print:text-[8.5pt]">
                  {r.name || <span className="text-[#6b7665] font-normal italic">unnamed role</span>}
                </div>
                <input
                  type="text"
                  value={r.notes}
                  onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                  placeholder="What ate the hours? Anything the contractor needs to know?"
                  className="w-full bg-transparent text-[9pt] text-[#2a2520] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:text-[8.5pt] print:border-0"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-[6pt] p-[8pt] rounded-[3pt] flex items-baseline justify-between gap-[10pt] print:mt-[3pt] print:py-[5pt] print:px-[8pt] print:gap-[8pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold shrink-0 print:text-[7pt]"
            style={{ color: "#e9c8a8" }}
          >
            Hard Rule 02
          </div>
          <div className="font-display italic text-[10pt] leading-[1.35] text-right print:text-[9pt] print:leading-[1.25]">
            Deer Lake gets first call on the shared team. Salt and internal
            design fill white space — never compete for it.
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[5pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>Source: Practitioner Operating Plan, slide VI · 03 (Two hard rules)</div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · Hours-by-Pillar Report
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
        {label}
      </div>
      {children}
      {hint && (
        <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
          {hint}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="inline-flex items-baseline justify-end gap-[1pt] w-full">
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={suffix === "%" ? 1 : 0.5}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const next = Number(e.target.value);
          onChange(Number.isFinite(next) && next >= 0 ? next : 0);
        }}
        className="w-full bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
      />
      {suffix && (
        <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">
          {suffix}
        </span>
      )}
    </div>
  );
}
