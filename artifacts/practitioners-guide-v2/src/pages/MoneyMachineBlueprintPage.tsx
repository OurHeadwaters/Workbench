import { useEffect, useState } from "react";
import { CheckSquare, RotateCcw, Square } from "lucide-react";

const STORAGE_KEY = "mmb-checklist-v1";

const BUCKETS = [
  {
    num: "1",
    name: "Cost Basis",
    purpose:
      "Pay the real cost of running the community's institutions — practitioners, infrastructure, operations.",
    rule: "Never borrow against this bucket. If it runs dry, the machine stops before it borrows.",
    accent: "#1F5B3F",
  },
  {
    num: "2",
    name: "Reserve",
    purpose:
      "Three to six months of operating costs, held in hard, community-controlled assets.",
    rule: "This bucket does not get touched until the machine has a confirmed income failure. It is not a slush fund.",
    accent: "#1A5FA8",
  },
  {
    num: "3",
    name: "Reinvestment",
    purpose:
      "New capacity, new infrastructure, new practitioners, and new institutions inside the watershed.",
    rule: "Every dollar in this bucket must produce a measurable ownership increase — not a program, not an event, not a report.",
    accent: "#B45309",
  },
  {
    num: "4",
    name: "Eave Flow",
    purpose:
      "The surplus that overflows the first three buckets and flows outward — to allied watersheds, replication, and the seventh generation.",
    rule: "This bucket does not activate until Buckets 1–3 are funded and the Reserve is full. Premature eave flow is a leak.",
    accent: "#6d28d9",
  },
];

const STATES = [
  {
    name: "Empty State",
    description: "Bucket 1 is funded. Buckets 2, 3, and 4 have nothing.",
    rules: [
      "All surplus above Cost Basis goes to Reserve (Bucket 2) until it reaches three months of operating costs.",
      "No Reinvestment spending.",
      "No Eave Flow.",
      "No exceptions. The machine is not strong enough to give anything away yet.",
    ],
    accent: "#ef4444",
  },
  {
    name: "Building State",
    description: "Bucket 2 (Reserve) is between one and six months of operating costs.",
    rules: [
      "Continue filling Reserve to the six-month target.",
      "Reinvestment (Bucket 3) may receive up to 10% of surplus while Reserve is building — but only for investments that demonstrably increase future Cost Basis income.",
      "No Eave Flow.",
    ],
    accent: "#B45309",
  },
  {
    name: "Stable State",
    description: "Bucket 2 is at six months. Bucket 1 is covered. Bucket 3 is active.",
    rules: [
      "Reserve is maintained. Any draw on Reserve triggers an immediate return-to-building protocol.",
      "Reinvestment runs at the agreed community percentage.",
      "Eave Flow (Bucket 4) activates only after Reinvestment is funded.",
    ],
    accent: "#1A5FA8",
  },
  {
    name: "Strong State",
    description:
      "All four buckets are funded. Reserve is at six months. Reinvestment is compounding. Eave Flow is active.",
    rules: [
      "The machine is now producing honey. The overflow is real.",
      "Eave Flow goes outward — to replication, to allied watersheds, to the seventh generation.",
      "The community begins the governance process to define the next generation of institutions.",
      "The machine is documented and prepared to be replicated.",
    ],
    accent: "#1F5B3F",
  },
];

const CHECKLIST_WEEKS: { label: string; items: string[] }[] = [
  {
    label: "Week 1–2: Cost Basis Audit",
    items: [
      "Every current operating cost is named and documented with a dollar amount",
      "Practitioner compensation is named explicitly — not deferred, not 'we'll figure it out'",
      "The monthly Cost Basis number is agreed to and signed by the governing circle",
      "All existing expenses that do not pass the three tests are identified for elimination",
    ],
  },
  {
    label: "Week 3–4: Account Structure",
    items: [
      "Separate accounts (or clearly segregated sub-accounts) exist for each of the four buckets",
      "Signing authority for each bucket is named and documented",
      "The Reserve account is community-controlled — not held by an outside institution that can restrict access",
      "Banking relationships are reviewed for alignment with the Hard Boundaries",
    ],
  },
  {
    label: "Week 5–6: Income Mapping",
    items: [
      "All current and projected income streams are documented",
      "Income is categorized by reliability (recurring vs. one-time)",
      "The gap between current income and Cost Basis is named plainly",
      "A realistic 90-day plan to close the gap (if one exists) is agreed to",
    ],
  },
  {
    label: "Week 7–8: Governance Setup",
    items: [
      "The governing circle is named — who has authority over each bucket decision",
      "The annual audit date is set",
      "The Reserve raid protocol is documented and agreed to (what triggers it, who authorizes it, how it's replenished)",
      "The first 90-day review meeting is scheduled",
    ],
  },
  {
    label: "Week 9–10: First Operational Run",
    items: [
      "First month of the machine runs with all income routed through the bucket structure",
      "Any variances from the plan are documented — not papered over",
      "Cost Basis is reconciled against actual spend",
      "Governing circle reviews the first run together",
    ],
  },
  {
    label: "Week 11–12: Stability Check",
    items: [
      "Second month runs without intervention",
      "Reserve trajectory is confirmed",
      "Any bucket that is off-track triggers a documented response plan",
      "The machine is declared operational or the gaps are named and addressed",
    ],
  },
];

const TOTAL_ITEMS = CHECKLIST_WEEKS.reduce((sum, w) => sum + w.items.length, 0);

function itemKey(weekIdx: number, itemIdx: number) {
  return `${weekIdx}-${itemIdx}`;
}

export function MoneyMachineBlueprintPage() {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)));
  }, [checked]);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
  }

  const completedCount = checked.size;
  const progressPct = Math.round((completedCount / TOTAL_ITEMS) * 100);

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
          Economic Architecture
        </p>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Community Money Machine Blueprint
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Version 4 · Anchored May 2026. This is the operating spec, not the
          pitch deck. Every Headwaters institution runs on these four buckets and
          these transition rules.
        </p>
        <blockquote className="mt-4 border-l-4 pl-4 italic text-sm text-muted-foreground" style={{ borderColor: "#1F5B3F" }}>
          "Building the money machine was like dropping wishes in a house of mirrors with all
          the best filters and an echo of the best version of yourself." — Bobbie Parr
        </blockquote>
      </div>

      <section>
        <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>
          Core Ethic
        </h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          The machine is not a charity. It is not a grant program. It is not a fund. It is an{" "}
          <strong>ownership architecture</strong>. Every dollar that moves through it either
          strengthens the community's ownership position or it doesn't belong in the machine.
        </p>
        <div className="rounded-lg border p-4 space-y-2 bg-card" style={{ borderColor: "hsl(var(--card-border))" }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Three tests every dollar must pass
          </p>
          {[
            "Does it increase ownership or create dependency?",
            "Does it strengthen the watershed or create a new leak?",
            "Would it pass seven-generation scrutiny?",
          ].map((test, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span
                className="mt-0.5 h-4 w-4 rounded-full flex-shrink-0 grid place-items-center text-white text-[10px] font-bold"
                style={{ backgroundColor: "#1F5B3F" }}
              >
                {i + 1}
              </span>
              <span>{test}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            If the answer to any of these is no, the dollar does not move that direction. This
            is not aspirational. It is the operating rule.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
          The Four Buckets
        </h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Every dollar that flows through the machine is sorted into one of four buckets. The
          buckets are not metaphors — they are literal accounts, literal purposes, and literal
          rules.
        </p>
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "hsl(var(--card-border))" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40" style={{ borderColor: "hsl(var(--card-border))" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground w-6">#</th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Purpose</th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Rule</th>
              </tr>
            </thead>
            <tbody>
              {BUCKETS.map((b, i) => (
                <tr
                  key={b.num}
                  className={i < BUCKETS.length - 1 ? "border-b" : ""}
                  style={{ borderColor: "hsl(var(--card-border))" }}
                >
                  <td className="px-4 py-3 align-top">
                    <span
                      className="h-5 w-5 rounded-full grid place-items-center text-white text-xs font-bold"
                      style={{ backgroundColor: b.accent }}
                    >
                      {b.num}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top font-semibold whitespace-nowrap" style={{ color: b.accent }}>
                    {b.name}
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground leading-relaxed">{b.purpose}</td>
                  <td className="px-4 py-3 align-top text-muted-foreground leading-relaxed">{b.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>
          The Honey Principle (Eave Flow)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          A hive produces honey continuously. Most of it feeds the hive. The excess overflows
          the cells and drips down the comb. That overflow — the eave flow — is the only honey
          the keeper harvests. <strong>Taking from inside the comb before it overflows kills the
          hive.</strong>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border p-4 bg-card" style={{ borderColor: "hsl(var(--card-border))" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#1F5B3F" }}>
              Eave flow is
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                "Surplus to allied communities replicating the model",
                "Contributions to shared infrastructure across watersheds",
                "Endowment deposits against the seventh generation",
                "Knowledge, tools, and documentation flowing to Zone 6",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1F5B3F" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-card" style={{ borderColor: "hsl(var(--card-border))" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-red-600">
              Eave flow is not
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                "Early distribution when the Reserve is underfunded",
                "Grants to outside organizations that don't build ownership",
                "Charitable giving that creates dependency",
                "Fees to outside platforms or institutions",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
          Empty → Strong: State Transition Rules
        </h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          The machine passes through predictable states. These rules govern the transitions.
        </p>
        <div className="space-y-3">
          {STATES.map((state, i) => (
            <div
              key={state.name}
              className="rounded-lg border p-4 bg-card"
              style={{ borderColor: "hsl(var(--card-border))", borderLeftWidth: "4px", borderLeftColor: state.accent }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                  style={{ backgroundColor: state.accent + "18", color: state.accent }}
                >
                  {state.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic mb-2">{state.description}</p>
              <ul className="space-y-1">
                {state.rules.map((rule, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: state.accent }}
                    />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ fontFamily: "var(--app-font-serif)" }}>
            90-Day Launch Checklist
          </h2>
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Reset checklist"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="rounded-lg border p-4 bg-card mb-4" style={{ borderColor: "hsl(var(--card-border))" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-semibold" style={{ color: completedCount === TOTAL_ITEMS ? "#1F5B3F" : undefined }}>
              {completedCount} / {TOTAL_ITEMS} complete
              {completedCount === TOTAL_ITEMS && " · Machine operational ✓"}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPct}%`,
                backgroundColor: completedCount === TOTAL_ITEMS ? "#1F5B3F" : "#1A5FA8",
              }}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Before the machine is considered operational, the following must be complete. These
          are not suggestions — they are the minimum conditions for the machine to run without
          breaking.
        </p>
        <div className="space-y-4">
          {CHECKLIST_WEEKS.map((week, weekIdx) => (
            <div
              key={week.label}
              className="rounded-lg border p-4 bg-card"
              style={{ borderColor: "hsl(var(--card-border))" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {week.label}
              </p>
              <ul className="space-y-2">
                {week.items.map((item, itemIdx) => {
                  const key = itemKey(weekIdx, itemIdx);
                  const isChecked = checked.has(key);
                  return (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2 text-sm cursor-pointer select-none group"
                      onClick={() => toggle(key)}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 transition-colors" style={{ color: "#1F5B3F" }} />
                      ) : (
                        <Square className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                      )}
                      <span className={isChecked ? "line-through text-muted-foreground" : undefined}>
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border p-5 bg-card" style={{ borderColor: "hsl(var(--card-border))" }}>
        <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>
          The Closing Rule
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong>The machine does not run on hope. It runs on structure.</strong> Hope is what
          you have before the buckets exist. The machine is what you build so that hope becomes a
          system that outlasts any individual practitioner, any single income stream, and any
          external economic disruption.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          When the machine is strong, the community does not depend on the next grant, the next
          funder's priorities, or the next government program. It depends on itself. Stop the
          leak. Fill the buckets. Let the overflow reach the next watershed.
        </p>
        <p className="mt-3 text-xs italic text-muted-foreground">
          The machine was built to run without you watching it. Build it that way.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Source:{" "}
        <code className="font-mono bg-muted px-1 rounded">
          shared/community-money-machine-blueprint.md
        </code>{" "}
        · v4 · May 2026
      </p>
    </div>
  );
}
