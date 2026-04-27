import {
  anchorHint,
  anchorLabel,
  anchorOrder,
  type AnchorKey,
  type Anchors,
  type ScenarioMode,
} from "./dates";

/**
 * Adjustable anchor list. Native <input type="date"> opens the OS picker
 * on a phone — best touch UX for date-picking, no custom drag widget
 * needed. Each row is its own card so it's tappable on a small screen.
 *
 * Mode-aware: grant mode shows five pegs, self-fund mode shows four
 * (drops LFIF-intake and ISC-decision, adds the truck-LFIF window). The
 * council-decision peg's label and hint also change between modes since
 * the same date carries different meaning.
 */
export function DatePegs({
  mode,
  anchors,
  onChange,
}: {
  mode: ScenarioMode;
  anchors: Anchors;
  onChange: (key: AnchorKey, value: string) => void;
}) {
  const order = anchorOrder(mode);
  return (
    <section className="w-full" style={{ background: "var(--color-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 py-6">
        <div
          className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Adjust the load-bearing dates
        </div>
        <p
          className="serif text-[14px] leading-[1.45] mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Tap a date to change it. Everything downstream updates.
        </p>
        <div className="flex flex-col gap-2.5" data-testid="date-pegs">
          {order.map((key) => (
            <PegRow
              key={key}
              anchorKey={key}
              mode={mode}
              value={anchors[key]}
              onChange={(v) => onChange(key, v)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PegRow({
  anchorKey,
  mode,
  value,
  onChange,
}: {
  anchorKey: AnchorKey;
  mode: ScenarioMode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label
      className="rounded-xl p-3.5 border flex items-center gap-3"
      style={{
        background: "var(--color-paper)",
        borderColor: "var(--color-rule)",
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="serif text-[14px] font-semibold leading-tight"
          style={{ color: "var(--color-primary)" }}
        >
          {anchorLabel(anchorKey, mode)}
        </p>
        <p
          className="serif text-[12px] italic mt-0.5"
          style={{ color: "var(--color-muted)" }}
        >
          {anchorHint(anchorKey, mode)}
        </p>
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`peg-${anchorKey}`}
        className="mono text-[13px] px-2.5 py-2 rounded-md border bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-warm)]"
        style={{
          color: "var(--color-primary)",
          borderColor: "var(--color-rule)",
        }}
      />
    </label>
  );
}
