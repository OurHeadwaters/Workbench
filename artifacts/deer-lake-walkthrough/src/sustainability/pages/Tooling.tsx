import { Reveal } from "@/components/Reveal";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";
import { Card, PageFrame } from "../components/PageFrame";

/**
 * Tooling continuity. Square + QuickBooks stay; the operating system
 * around them is what survives turnover. Bridges to the existing
 * operator-couple cockpit at /cockpit so people see the surface and
 * the playbook are one thing.
 */

interface Capability {
  label: string;
  layer: "square" | "quickbooks" | "headwaters";
  scope: "store" | "hotel" | "both";
}

const OPEN: Capability[] = [
  { label: "Take sales at the till", layer: "square", scope: "store" },
  { label: "Book and check in a guest", layer: "square", scope: "hotel" },
  { label: "Receive a delivery", layer: "headwaters", scope: "both" },
  { label: "Log spoilage / log incident", layer: "headwaters", scope: "both" },
  { label: "Count cash to the float line", layer: "square", scope: "both" },
  { label: "Clock in / out", layer: "headwaters", scope: "both" },
  { label: "Log temps / housekeeping checks", layer: "headwaters", scope: "both" },
];

const LOCKED: Capability[] = [
  { label: "Change shelf or room prices", layer: "square", scope: "both" },
  { label: "Void a sale over $20", layer: "square", scope: "both" },
  { label: "Move money out of the bank", layer: "quickbooks", scope: "both" },
  { label: "Run payroll", layer: "quickbooks", scope: "both" },
  { label: "See the bank balance", layer: "quickbooks", scope: "both" },
  { label: "Edit the books", layer: "quickbooks", scope: "both" },
  { label: "Refund or comp a stay", layer: "square", scope: "hotel" },
];

const LAYER: Record<
  Capability["layer"],
  { label: string; bg: string; ink: string; border: string }
> = {
  square: {
    label: "Square",
    bg: "#dcdfe6",
    ink: "#1f3d2e",
    border: "rgba(31,61,46,0.16)",
  },
  quickbooks: {
    label: "QuickBooks",
    bg: "#cfe0d8",
    ink: "#1f3d2e",
    border: "rgba(31,61,46,0.16)",
  },
  headwaters: {
    label: "Headwaters layer",
    bg: "#f1d9c7",
    ink: "#7e3a25",
    border: "rgba(184,90,62,0.30)",
  },
};

const SCOPE: Record<
  Capability["scope"],
  { label: string; ink: string }
> = {
  store: { label: "store", ink: "#1f3d2e" },
  hotel: { label: "hotel", ink: "#7e3a25" },
  both: { label: "both", ink: "var(--color-muted)" },
};

export default function Tooling() {
  const { navigate } = useRoute();

  return (
    <PageFrame
      eyebrow="06 · Tools that survive"
      title="Square stays. QuickBooks stays."
      italic="What we built around them is what survives turnover."
      standfirst={
        <>
          The tools the next contractor already knows. The operator surface
          on top is what keeps the operation legible to a non-specialist —
          and is the thing a departing party can hand over without writing
          new software. The cockpit is that surface, live, today.
        </>
      }
    >
      <Card
        tag="The rule"
        head="Money is locked. Operations are open."
        body="Anything that touches money lives behind the manager sign-in. Anything operational — the till, the booking screen, the cooler log — is open to the operator couple on a tablet PIN. This rule survives every handover."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <CapList
          label="Open to the operator couple"
          tone="open"
          items={OPEN}
        />
        <CapList
          label="Locked behind the band & contractor"
          tone="locked"
          items={LOCKED}
        />
      </div>

      <div
        className="rounded-xl border p-4"
        style={{
          background: "var(--color-primary)",
          borderColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
      >
        <div
          className="mono text-[10.5px] uppercase tracking-[0.18em] mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          The bridge to the operator surface
        </div>
        <div className="serif text-[20px] leading-tight font-medium">
          The cockpit is the playbook, made tappable.
        </div>
        <p
          className="serif text-[14.5px] leading-[1.55] mt-2"
          style={{ color: "rgba(244,237,224,0.85)" }}
        >
          What this page describes in words is what the cockpit shows on a
          tablet: big tiles for the open jobs, a locked strip for the money
          jobs, layer tags so the contractor sees we're not replacing their
          stack — we're making it legible.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpit)}
          data-testid="tooling-go-cockpit"
          className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 mono text-[11px] uppercase tracking-[0.20em]"
          style={{
            background: "var(--color-accent-warm)",
            color: "var(--color-bg)",
          }}
        >
          Open the cockpit →
        </button>
      </div>

      <Reveal label="Why we don't replace Square or QuickBooks">
        <p>
          They're the tools the next contractor already uses. They're the
          tools the existing hotel already runs on. Replacing them means a
          migration nobody is asking for and a dependency on a piece of
          software only Headwaters knows.
        </p>
        <p>
          What we own is the layer on top — the operator surface, the
          household price lookup, the public price page, the role-based
          locks. Those are what we hand over, and those are the only thing
          a future contractor has to learn that's new.
        </p>
      </Reveal>

      <Reveal label="What survives turnover, exactly">
        <p>
          <span className="font-semibold">Square.</span> The tills, the
          bookings, the product catalogue, the historical sales. Belongs to
          the band's Square account, not Headwaters', from day one.
        </p>
        <p>
          <span className="font-semibold">QuickBooks.</span> The chart of
          accounts, the bank feeds, the payroll. Belongs to the band's
          QuickBooks account from day one.
        </p>
        <p>
          <span className="font-semibold">The Headwaters layer.</span> Open
          source on the band's behalf, hosted on the band's domain, exported
          on demand. The operating manual lives next to the code.
        </p>
      </Reveal>
    </PageFrame>
  );
}

function CapList({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "open" | "locked";
  items: Capability[];
}) {
  const isOpen = tone === "open";
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: isOpen
          ? "rgba(59,110,74,0.08)"
          : "rgba(31,61,46,0.06)",
        borderColor: "var(--color-rule)",
      }}
    >
      <div
        className="mono text-[10.5px] uppercase tracking-[0.18em] mb-2"
        style={{
          color: isOpen ? "#3b6e4a" : "var(--color-accent-warm)",
        }}
      >
        {isOpen ? "Open · operator PIN" : "Locked · manager sign-in"}
      </div>
      <div
        className="serif text-[15px] font-semibold mb-3"
        style={{ color: "var(--color-primary)" }}
      >
        {label}
      </div>
      <ul className="list-none pl-0 space-y-1.5">
        {items.map((c) => {
          const lay = LAYER[c.layer];
          const sc = SCOPE[c.scope];
          return (
            <li
              key={c.label}
              className="text-[13.5px] leading-[1.4] flex items-start gap-2 flex-wrap"
              style={{ color: "var(--color-text)" }}
            >
              <span className="flex-1 min-w-[12rem]">{c.label}</span>
              <span
                className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-[1px] rounded"
                style={{
                  background: lay.bg,
                  color: lay.ink,
                  border: `1px solid ${lay.border}`,
                }}
              >
                {lay.label}
              </span>
              <span
                className="mono text-[9.5px] uppercase tracking-[0.16em]"
                style={{ color: sc.ink }}
              >
                {sc.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
