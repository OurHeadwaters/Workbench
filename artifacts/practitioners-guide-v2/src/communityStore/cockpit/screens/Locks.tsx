import { Lock, LockOpen } from "lucide-react";

type Layer = "square" | "quickbooks" | "localline" | "headwaters";
interface Capability { id: string; label: string; layer: Layer; }

const OPEN: Capability[] = [
  { id: "sales", label: "Take sales at the till", layer: "square" },
  { id: "receive", label: "Receive the truck", layer: "localline" },
  { id: "spoilage", label: "Log spoilage & shrinkage", layer: "headwaters" },
  { id: "float", label: "Count cash to the float line", layer: "square" },
  { id: "reorder", label: "Request a reorder from the cycle", layer: "localline" },
  { id: "clock", label: "Clock in / out", layer: "headwaters" },
  { id: "temps", label: "Log cooler & freezer temps", layer: "headwaters" },
  { id: "incident", label: "File an incident note", layer: "headwaters" },
];

const LOCKED: Capability[] = [
  { id: "prices", label: "Change shelf prices", layer: "square" },
  { id: "suppliers", label: "Add or change a producer", layer: "localline" },
  { id: "cycle", label: "Set the weekly producer cycle", layer: "localline" },
  { id: "void-big", label: "Void a sale over $20", layer: "square" },
  { id: "move-money", label: "Move money out of the bank", layer: "quickbooks" },
  { id: "payroll", label: "Run payroll", layer: "quickbooks" },
  { id: "margins", label: "See margins & markups", layer: "headwaters" },
  { id: "bank", label: "See the bank balance", layer: "quickbooks" },
  { id: "books", label: "Edit the books", layer: "quickbooks" },
];

const LAYER: Record<Layer, { label: string; bg: string; ink: string; border: string }> = {
  square: { label: "Square", bg: "#dcdfe6", ink: "#1f3d2e", border: "rgba(31,61,46,0.16)" },
  quickbooks: { label: "QuickBooks", bg: "#cfe0d8", ink: "#1f3d2e", border: "rgba(31,61,46,0.16)" },
  localline: { label: "Local Line", bg: "#e9c8a8", ink: "#7e3a25", border: "rgba(184,90,62,0.30)" },
  headwaters: { label: "Practice layer", bg: "#f1d9c7", ink: "#7e3a25", border: "rgba(184,90,62,0.30)" },
};

function LayerTag({ layer }: { layer: Layer }) {
  const t = LAYER[layer];
  return (
    <span className="text-[10px] uppercase tracking-[0.18em] px-1.5 py-[2px] rounded inline-block"
      style={{ background: t.bg, color: t.ink, border: `1px solid ${t.border}`, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
    >
      {t.label}
    </span>
  );
}

function CapRow({ cap, locked }: { cap: Capability; locked: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2.5 px-3 rounded-md"
      style={{ background: locked ? "rgba(31,61,46,0.05)" : "rgba(244,237,224,0.6)", border: locked ? "1px dashed rgba(31,61,46,0.18)" : "1px solid rgba(31,61,46,0.12)" }}
    >
      {locked ? <Lock size={16} strokeWidth={2} color="#9c2a1c" /> : <LockOpen size={16} strokeWidth={2} color="#3b6e4a" />}
      <span className="flex-1 text-[14px]" style={{ color: "#18201b", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500 }}>{cap.label}</span>
      <LayerTag layer={cap.layer} />
    </li>
  );
}

export default function Locks() {
  return (
    <section className="px-5 sm:px-7 py-6 max-w-[1280px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-[0.24em] mb-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Screen 4 · the permission boundary</div>
        <h1 className="text-[34px] leading-[1.05] tracking-tight font-medium" style={{ color: "#1f3d2e", fontFamily: "'Fraunces', Georgia, serif" }}>
          Open to the operators.
          <span style={{ color: "#b85a3e", fontStyle: "italic" }}> Locked to the band.</span>
        </h1>
        <p className="mt-2 text-[14px] leading-[1.45] max-w-[44rem]" style={{ color: "#1f3d2e" }}>
          Every operational job is open. Every money job is locked. The tag on each row shows which base layer it really lives in &mdash; we&rsquo;re not replacing your stack, we&rsquo;re making it legible.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[12px] p-5" style={{ background: "#ebe2d0", border: "1px solid rgba(31,61,46,0.16)" }}>
          <div className="flex items-center gap-2 mb-1"><LockOpen size={20} color="#3b6e4a" />
            <h2 className="text-[20px] font-semibold" style={{ color: "#1f3d2e", fontFamily: "'Fraunces', Georgia, serif" }}>Open to the operator couple</h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.20em] mb-4" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>No sign-in beyond the iPad PIN</p>
          <ul className="space-y-2" data-testid="locks-open-list">{OPEN.map((c) => <CapRow key={c.id} cap={c} locked={false} />)}</ul>
        </div>

        <div className="rounded-[12px] p-5" style={{ background: "#1f3d2e", color: "#f4ede0", border: "1px solid rgba(31,61,46,0.4)" }}>
          <div className="flex items-center gap-2 mb-1"><Lock size={20} color="#fbe7e2" />
            <h2 className="text-[20px] font-semibold" style={{ color: "#f4ede0", fontFamily: "'Fraunces', Georgia, serif" }}>Locked to the band & contractor</h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.20em] mb-4" style={{ color: "#e9c8a8", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Manager sign-in required</p>
          <ul className="space-y-2" data-testid="locks-locked-list">
            {LOCKED.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5 px-3 rounded-md" style={{ background: "rgba(244,237,224,0.06)", border: "1px dashed rgba(244,237,224,0.20)" }}>
                <Lock size={16} strokeWidth={2} color="#fbe7e2" />
                <span className="flex-1 text-[14px]" style={{ color: "#f4ede0", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>{c.label}</span>
                <LayerTag layer={c.layer} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-[12px] p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ background: "#ebe2d0", border: "1px solid rgba(31,61,46,0.14)" }}>
        {([
          { layer: "square" as Layer, desc: "Sales, payments, the till. Already in the contractor's plan." },
          { layer: "quickbooks" as Layer, desc: "Bank, books, payroll. Already in the contractor's plan." },
          { layer: "localline" as Layer, desc: "Producer cycle & weekly orders. The regional producers already use it." },
          { layer: "headwaters" as Layer, desc: "The operator surface layer on top. The right thing is the easy thing." },
        ]).map((item) => (
          <div key={item.layer}>
            <div className="mb-1"><LayerTag layer={item.layer} /></div>
            <div className="text-[13px] leading-[1.45]" style={{ color: "#1f3d2e" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
