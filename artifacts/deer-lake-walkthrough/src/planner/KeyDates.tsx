import { type Derived, type ScenarioMode, fmtShort } from "./dates";

/**
 * Read-only panel of the dates that *fall out of* the anchor choices.
 * The contractor can screenshot this before the meeting; everything
 * here is downstream math, not user input.
 *
 * Mode-aware: grants mode lists the federal decision dates; self-fund
 * mode swaps those for the truck-LFIF cycle and arrival dates.
 */
export function KeyDates({ d, mode }: { d: Derived; mode: ScenarioMode }) {
  const rows: Array<{ label: string; value: string; tone?: "warm" }> = [
    { label: "90 days of pilot data", value: fmtShort(d.pilotData90) },
  ];

  if (mode === "self-fund") {
    if (d.truckLfifIntake) {
      rows.push({
        label: "Truck LFIF intake (807 partnership)",
        value: fmtShort(d.truckLfifIntake),
      });
    }
    if (d.truckLfifDecision) {
      rows.push({
        label: "Truck LFIF decision",
        value: fmtShort(d.truckLfifDecision),
      });
    }
  } else {
    if (d.applicationsFiled) {
      rows.push({
        label: "Applications filed",
        value: fmtShort(d.applicationsFiled),
      });
    }
    if (d.lfifDecision) {
      rows.push({ label: "LFIF decision", value: fmtShort(d.lfifDecision) });
    }
    if (d.fedNorDecision) {
      rows.push({
        label: "FedNor decision",
        value: fmtShort(d.fedNorDecision),
      });
    }
  }

  rows.push(
    {
      label: "Funding-secured trigger",
      value: fmtShort(d.fundingSecured),
      tone: "warm",
    },
    {
      label: "Contract two activates",
      value: fmtShort(d.contractTwoActivates),
    },
    { label: "Build M1", value: fmtShort(d.buildM1) },
    { label: "Soft opening", value: fmtShort(d.buildSoftOpen) },
    { label: "Doors open", value: fmtShort(d.doorsOpen), tone: "warm" },
    {
      label: "Handover to community manager",
      value: fmtShort(d.buildHandover),
    },
  );

  if (mode === "self-fund" && d.truckArrives) {
    rows.push({
      label: "Truck arrives (807 partnership)",
      value: fmtShort(d.truckArrives),
    });
  }

  rows.push(
    { label: "NNC enrolment filed", value: fmtShort(d.nncFiled) },
    {
      label: "First NNC claim paid",
      value: fmtShort(d.nncFirstClaim),
      tone: "warm",
    },
  );

  return (
    <section className="w-full" style={{ background: "var(--color-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 py-6">
        <div
          className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          What falls out
        </div>
        <p
          className="serif text-[14px] leading-[1.45] mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Downstream dates the math gives back from your anchors.
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: "var(--color-rule)",
            background: "var(--color-paper)",
          }}
          data-testid="key-dates"
        >
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="grid grid-cols-[1fr_auto] gap-3 items-baseline px-4 py-3"
              style={{
                borderTop:
                  i === 0 ? "none" : "1px solid var(--color-rule)",
                background: r.tone === "warm" ? "rgba(184,90,62,0.06)" : "transparent",
              }}
            >
              <p
                className="serif text-[14px] leading-tight"
                style={{
                  color:
                    r.tone === "warm"
                      ? "var(--color-accent-warm)"
                      : "var(--color-text)",
                  fontWeight: r.tone === "warm" ? 600 : 400,
                }}
              >
                {r.label}
              </p>
              <p
                className="mono text-[13px]"
                style={{
                  color:
                    r.tone === "warm"
                      ? "var(--color-accent-warm)"
                      : "var(--color-primary)",
                  fontWeight: r.tone === "warm" ? 600 : 500,
                }}
              >
                {r.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
