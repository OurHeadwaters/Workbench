import { Reveal } from "../../../communityStore/plannerReveal";
import { Card, PageFrame } from "../components/PageFrame";

interface Capability { label: string; layer: "square" | "quickbooks" | "headwaters"; scope: "store" | "hotel" | "both"; }

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

const LAYER: Record<Capability["layer"], { label: string; bg: string; ink: string; border: string }> = {
  square: { label: "Square", bg: "#dcdfe6", ink: "#1f3d2e", border: "rgba(31,61,46,0.16)" },
  quickbooks: { label: "QuickBooks", bg: "#cfe0d8", ink: "#1f3d2e", border: "rgba(31,61,46,0.16)" },
  headwaters: { label: "practice layer", bg: "#f1d9c7", ink: "#7e3a25", border: "rgba(184,90,62,0.30)" },
};

const SCOPE: Record<Capability["scope"], { label: string; ink: string }> = {
  store: { label: "store", ink: "#1f3d2e" },
  hotel: { label: "hotel", ink: "#7e3a25" },
  both: { label: "both", ink: "var(--cs-muted)" },
};

export default function Tooling({ onNavigateCockpit }: { onNavigateCockpit: () => void }) {
  return (
    <PageFrame
      eyebrow="06 · Tools that survive"
      title="Square stays. QuickBooks stays."
      italic="What we built around them is what survives turnover."
      standfirst={<>The tools the next contractor already knows. The operator surface on top is what keeps the operation legible to a non-specialist.</>}
    >
      <Card tag="The rule" head="Money is locked. Operations are open." body="Anything that touches money lives behind the manager sign-in. Anything operational — the till, the booking screen, the cooler log — is open to the operator couple on a tablet PIN. This rule survives every handover." />

      <div className="grid gap-3 sm:grid-cols-2">
        <CapList label="Open to the operator couple" tone="open" items={OPEN} />
        <CapList label="Locked behind the band & contractor" tone="locked" items={LOCKED} />
      </div>

      <div className="rounded-xl border p-4" style={{ background: "var(--cs-primary)", borderColor: "var(--cs-primary)", color: "var(--cs-bg)" }}>
        <div className="text-[10.5px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--cs-accent)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The bridge to the operator surface</div>
        <div className="text-[20px] leading-tight font-medium" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>The cockpit is the playbook, made tappable.</div>
        <p className="text-[14.5px] leading-[1.55] mt-2" style={{ color: "rgba(244,237,224,0.85)", fontFamily: "'Fraunces', Georgia, serif" }}>What this page describes in words is what the cockpit shows on a tablet: big tiles for the open jobs, a locked strip for the money jobs.</p>
        <button type="button" onClick={onNavigateCockpit} data-testid="tooling-go-cockpit" className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] uppercase tracking-[0.20em]" style={{ background: "var(--cs-accent-warm)", color: "var(--cs-bg)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Open the cockpit →</button>
      </div>

      <Reveal label="Why we don't replace Square or QuickBooks">
        <p>They're the tools the next contractor already uses. They're the tools the existing hotel already runs on. Replacing them means a migration nobody is asking for.</p>
        <p>What we own is the layer on top — the operator surface, the household price lookup, the public price page, the role-based locks.</p>
      </Reveal>

      <Reveal label="What survives turnover, exactly">
        <p><span className="font-semibold">Square.</span> The tills, the bookings, the product catalogue, the historical sales. Belongs to the band's Square account from day one.</p>
        <p><span className="font-semibold">QuickBooks.</span> The chart of accounts, the bank feeds, the payroll. Belongs to the band's QuickBooks account from day one.</p>
        <p><span className="font-semibold">The practice layer.</span> Open source on the band's behalf, hosted on the band's domain, exported on demand.</p>
      </Reveal>
    </PageFrame>
  );
}

function CapList({ label, tone, items }: { label: string; tone: "open" | "locked"; items: Capability[] }) {
  const isOpen = tone === "open";
  return (
    <div className="rounded-xl border p-4" style={{ background: isOpen ? "rgba(59,110,74,0.08)" : "rgba(31,61,46,0.06)", borderColor: "var(--cs-rule)" }}>
      <div className="text-[10.5px] uppercase tracking-[0.18em] mb-2" style={{ color: isOpen ? "#3b6e4a" : "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{isOpen ? "Open · operator PIN" : "Locked · manager sign-in"}</div>
      <div className="text-[15px] font-semibold mb-3" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{label}</div>
      <ul className="list-none pl-0 space-y-1.5">
        {items.map((c) => {
          const lay = LAYER[c.layer]; const sc = SCOPE[c.scope];
          return (
            <li key={c.label} className="text-[13.5px] leading-[1.4] flex items-start gap-2 flex-wrap" style={{ color: "var(--cs-text)" }}>
              <span className="flex-1 min-w-[12rem]">{c.label}</span>
              <span className="text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-[1px] rounded" style={{ background: lay.bg, color: lay.ink, border: `1px solid ${lay.border}`, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{lay.label}</span>
              <span className="text-[9.5px] uppercase tracking-[0.16em]" style={{ color: sc.ink, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{sc.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
