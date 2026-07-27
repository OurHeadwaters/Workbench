import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AmbientBackground, GrainOverlay } from "@/components/AmbientBackground";

const ZONE3_BLUE = "#1A5FA8";

const CONSTELLATION_SWATCHES = [
  { label: "Zone 1 — Roots", value: "#2E6B45" },
  { label: "Zone 2 — Hearth", value: "#C97C2E" },
  { label: "Zone 3 — Gatehouse", value: "#1A5FA8" },
  { label: "Zone 4 — Ember", value: "#B85A3E" },
  { label: "Zone 5 — Canopy", value: "#1F3D2E" },
  { label: "Zone 6 — Current", value: "#4A7D8C" },
];

interface Module {
  id: string;
  name: string;
  tier: string;
  price: string;
  description: string;
}

const GATEHOUSE_MODULES: Module[] = [
  {
    id: "base",
    name: "Base Tracker + Impact",
    tier: "Base",
    price: "$1.25 / member / mo",
    description: "Member activity tracking, benefit ledger, and impact reporting. The foundation every deployment starts with.",
  },
  {
    id: "steward",
    name: "Steward Matchmaker",
    tier: "Steward",
    price: "$2.00 / member / mo",
    description: "Connects members who need support with stewards who can provide it. Relationship-aware, trust-gated.",
  },
  {
    id: "moments",
    name: "Moments",
    tier: "Full",
    price: "$2.50 / member / mo",
    description: "Captures and surfaces meaningful community moments — milestone recognitions, story anchors, shared memory.",
  },
  {
    id: "beacon",
    name: "Beacon",
    tier: "Full",
    price: "$2.50 / member / mo",
    description: "Visibility layer that lets members signal needs and offer capacity — a living mutual-aid board.",
  },
];

const LS_ORG_NAME = "hw:cockpit:orgName";
const LS_ZONE_COLOR = "hw:cockpit:zoneColor";
const LS_MODULES = "hw:cockpit:modules";
const LS_MEMBER_COUNT = "hw:cockpit:memberCount";

const TIER_PRICE: Record<string, number> = {
  Base: 1.25,
  Steward: 2.00,
  Full: 2.50,
};

function loadModuleState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_MODULES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { base: true, steward: false, moments: false, beacon: false };
}

export function OperatorPage() {
  const [, navigate] = useLocation();

  const [orgName, setOrgName] = useState(() => localStorage.getItem(LS_ORG_NAME) ?? "Gatehouse Communities Inc.");
  const [zoneColor, setZoneColor] = useState(() => localStorage.getItem(LS_ZONE_COLOR) ?? ZONE3_BLUE);
  const [modules, setModules] = useState<Record<string, boolean>>(loadModuleState);
  const [memberCount, setMemberCount] = useState<number>(() => {
    const raw = localStorage.getItem(LS_MEMBER_COUNT);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return isNaN(parsed) ? 1500 : parsed;
  });

  useEffect(() => {
    localStorage.setItem(LS_ORG_NAME, orgName);
  }, [orgName]);

  useEffect(() => {
    localStorage.setItem(LS_ZONE_COLOR, zoneColor);
  }, [zoneColor]);

  useEffect(() => {
    localStorage.setItem(LS_MODULES, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(LS_MEMBER_COUNT, String(memberCount));
  }, [memberCount]);

  function toggleModule(id: string) {
    setModules((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const activeCount = Object.values(modules).filter(Boolean).length;

  // MRR: member count × price of highest active tier
  const highestTierPrice = GATEHOUSE_MODULES.reduce((max, mod) => {
    if (modules[mod.id]) {
      const p = TIER_PRICE[mod.tier] ?? 0;
      return p > max ? p : max;
    }
    return max;
  }, 0);
  const estimatedMRR = memberCount > 0 ? memberCount * highestTierPrice : 0;
  const formattedMRR = estimatedMRR.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: "#0B1520" }}
      data-testid="operator-cockpit"
    >
      <AmbientBackground variant="mist" />
      <GrainOverlay opacity={0.028} />

      <div className="relative z-10 mx-auto max-w-[52rem] px-6 sm:px-8 py-12 sm:py-16">

        {/* Read-only banner */}
        <div
          className="mb-10 flex items-center gap-3 rounded-sm px-4 py-3"
          style={{
            background: "rgba(26,95,168,0.12)",
            border: `1px solid rgba(26,95,168,0.35)`,
          }}
          data-testid="cockpit-banner"
        >
          <span
            className="shrink-0 w-2 h-2 rounded-full"
            style={{ background: ZONE3_BLUE, boxShadow: `0 0 6px ${ZONE3_BLUE}` }}
            aria-hidden
          />
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(130,175,230,0.85)" }}
          >
            Read-only preview — this is a spec / demo configuration surface, not a live admin panel
          </p>
        </div>

        {/* Page header */}
        <header className="mb-12">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "rgba(130,175,230,0.65)" }}
          >
            headwaters · operator cockpit
          </p>
          <h1
            className="font-serif leading-[1.05] tracking-tight mb-3"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
              color: "#f4ede0",
              fontStyle: "italic",
            }}
          >
            Operator Configuration
          </h1>
          <p
            className="font-serif text-base sm:text-lg"
            style={{ color: "rgba(244,237,224,0.50)", fontStyle: "italic" }}
          >
            Configure your branded Headwaters deployment. Changes persist across this demo session.
          </p>
        </header>

        {/* ── Section 1: Identity ── */}
        <section
          className="mb-10 rounded-md overflow-hidden"
          style={{
            background: "rgba(15,25,40,0.80)",
            border: "1px solid rgba(26,95,168,0.22)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
          data-testid="cockpit-identity"
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: "rgba(26,95,168,0.18)",
              borderBottom: "1px solid rgba(26,95,168,0.22)",
            }}
          >
            <span className="text-lg" aria-hidden>🏛️</span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-0.5" style={{ color: "rgba(130,175,230,0.65)" }}>
                section 01
              </p>
              <p className="font-serif text-[17px]" style={{ color: "#f4ede0", fontStyle: "italic" }}>
                Identity
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Org name */}
            <div>
              <label
                htmlFor="cockpit-org-name"
                className="block font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: "rgba(130,175,230,0.70)" }}
              >
                Organisation name
              </label>
              <input
                id="cockpit-org-name"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your organisation name"
                className="block w-full max-w-md rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2"
                style={{
                  background: "rgba(244,237,224,0.06)",
                  border: "1px solid rgba(26,95,168,0.35)",
                  color: "#f4ede0",
                }}
                data-testid="cockpit-org-name"
              />
              <p className="mt-1.5 font-mono text-[9px]" style={{ color: "rgba(244,237,224,0.28)" }}>
                Appears on member-facing screens and reports
              </p>
            </div>

            {/* Zone colour */}
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                style={{ color: "rgba(130,175,230,0.70)" }}
              >
                Zone colour
              </p>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Zone colour">
                {CONSTELLATION_SWATCHES.map((swatch) => {
                  const active = zoneColor === swatch.value;
                  return (
                    <button
                      key={swatch.value}
                      role="radio"
                      aria-checked={active}
                      aria-label={swatch.label}
                      title={swatch.label}
                      onClick={() => setZoneColor(swatch.value)}
                      className="relative w-9 h-9 rounded-sm transition-transform hover:scale-110"
                      style={{
                        background: swatch.value,
                        outline: active ? `3px solid rgba(244,237,224,0.80)` : "3px solid transparent",
                        outlineOffset: "2px",
                        boxShadow: active ? `0 0 14px ${swatch.value}88` : "none",
                      }}
                      data-testid={`cockpit-swatch-${swatch.value.replace("#", "")}`}
                    >
                      {active && (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
                          aria-hidden
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 font-mono text-[9px]" style={{ color: "rgba(244,237,224,0.28)" }}>
                Selected: {CONSTELLATION_SWATCHES.find((s) => s.value === zoneColor)?.label ?? zoneColor}
              </p>
            </div>

            {/* Logo placeholder */}
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                style={{ color: "rgba(130,175,230,0.70)" }}
              >
                Logo
              </p>
              <div
                className="flex items-center justify-center w-40 h-20 rounded-sm"
                style={{
                  background: "rgba(244,237,224,0.04)",
                  border: "1px dashed rgba(26,95,168,0.35)",
                }}
                data-testid="cockpit-logo-placeholder"
              >
                <div className="text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.28)" }}>
                    Logo upload
                  </p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(244,237,224,0.18)" }}>
                    available in live deploy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Active Modules ── */}
        <section
          className="mb-10 rounded-md overflow-hidden"
          style={{
            background: "rgba(15,25,40,0.80)",
            border: "1px solid rgba(26,95,168,0.22)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
          data-testid="cockpit-modules"
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{
              background: "rgba(26,95,168,0.18)",
              borderBottom: "1px solid rgba(26,95,168,0.22)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg" aria-hidden>⚙️</span>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-0.5" style={{ color: "rgba(130,175,230,0.65)" }}>
                  section 02
                </p>
                <p className="font-serif text-[17px]" style={{ color: "#f4ede0", fontStyle: "italic" }}>
                  Active Modules
                </p>
              </div>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
              style={{
                background: "rgba(26,95,168,0.25)",
                color: "rgba(130,175,230,0.80)",
                border: "1px solid rgba(26,95,168,0.35)",
              }}
            >
              {activeCount} / {GATEHOUSE_MODULES.length} active
            </span>
          </div>

          <div className="px-6 py-4 space-y-3">
            {GATEHOUSE_MODULES.map((mod) => {
              const on = modules[mod.id] ?? false;
              return (
                <div
                  key={mod.id}
                  className="flex items-start gap-4 rounded-sm px-4 py-4 transition-all"
                  style={{
                    background: on ? "rgba(26,95,168,0.10)" : "rgba(244,237,224,0.03)",
                    border: on ? "1px solid rgba(26,95,168,0.28)" : "1px solid rgba(244,237,224,0.07)",
                  }}
                  data-testid={`cockpit-module-${mod.id}`}
                >
                  {/* Toggle */}
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={`Toggle ${mod.name}`}
                    onClick={() => toggleModule(mod.id)}
                    className="relative shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors"
                    style={{
                      background: on ? ZONE3_BLUE : "rgba(244,237,224,0.15)",
                      boxShadow: on ? `0 0 10px ${ZONE3_BLUE}66` : "none",
                    }}
                    data-testid={`cockpit-toggle-${mod.id}`}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{
                        background: "#f4ede0",
                        left: on ? "calc(100% - 18px)" : "2px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                      }}
                    />
                  </button>

                  {/* Module info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-1">
                      <p
                        className="font-serif text-[15px]"
                        style={{ color: on ? "#f4ede0" : "rgba(244,237,224,0.55)", fontStyle: "italic" }}
                      >
                        {mod.name}
                      </p>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: on ? "rgba(26,95,168,0.25)" : "rgba(244,237,224,0.06)",
                          color: on ? "rgba(130,175,230,0.80)" : "rgba(244,237,224,0.30)",
                          border: on ? "1px solid rgba(26,95,168,0.35)" : "1px solid rgba(244,237,224,0.10)",
                        }}
                      >
                        {mod.tier}
                      </span>
                    </div>
                    <p
                      className="font-sans text-[13px] leading-[1.6] mb-2"
                      style={{ color: on ? "rgba(244,237,224,0.65)" : "rgba(244,237,224,0.35)" }}
                    >
                      {mod.description}
                    </p>
                    <p
                      className="font-mono text-[11px] tracking-[0.04em]"
                      style={{ color: on ? "rgba(130,175,230,0.75)" : "rgba(244,237,224,0.25)" }}
                    >
                      {mod.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member count + MRR callout */}
          <div
            className="px-6 py-5 space-y-4"
            style={{ borderTop: "1px solid rgba(26,95,168,0.15)" }}
          >
            {/* Member count input */}
            <div>
              <label
                htmlFor="cockpit-member-count"
                className="block font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: "rgba(130,175,230,0.70)" }}
              >
                Member count
              </label>
              <input
                id="cockpit-member-count"
                type="number"
                min={0}
                value={memberCount}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setMemberCount(isNaN(v) ? 0 : v);
                }}
                className="block w-40 rounded-sm px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2"
                style={{
                  background: "rgba(244,237,224,0.06)",
                  border: "1px solid rgba(26,95,168,0.35)",
                  color: "#f4ede0",
                }}
                data-testid="cockpit-member-count"
              />
              <p className="mt-1.5 font-mono text-[9px]" style={{ color: "rgba(244,237,224,0.28)" }}>
                Defaults to 1,500 — adjust to your deployment size
              </p>
            </div>

            {/* Estimated MRR callout */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm px-5 py-4"
              style={{
                background: highestTierPrice > 0
                  ? "rgba(26,95,168,0.16)"
                  : "rgba(244,237,224,0.04)",
                border: highestTierPrice > 0
                  ? "1px solid rgba(26,95,168,0.40)"
                  : "1px solid rgba(244,237,224,0.10)",
              }}
              data-testid="cockpit-mrr-callout"
            >
              <div>
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1"
                  style={{ color: "rgba(130,175,230,0.65)" }}
                >
                  Estimated MRR
                </p>
                <p
                  className="font-serif text-[22px] leading-none"
                  style={{
                    color: highestTierPrice > 0 ? "#f4ede0" : "rgba(244,237,224,0.30)",
                    fontStyle: "italic",
                  }}
                  data-testid="cockpit-mrr-value"
                >
                  {highestTierPrice > 0 ? `${formattedMRR} / mo` : "—"}
                </p>
              </div>
              {highestTierPrice > 0 && (
                <p
                  className="font-mono text-[10px] leading-snug text-right"
                  style={{ color: "rgba(130,175,230,0.55)" }}
                >
                  {memberCount.toLocaleString()} members<br />
                  × ${highestTierPrice.toFixed(2)} / mo
                </p>
              )}
              {highestTierPrice === 0 && (
                <p
                  className="font-mono text-[10px]"
                  style={{ color: "rgba(244,237,224,0.28)" }}
                >
                  Enable at least one module
                </p>
              )}
            </div>
          </div>

          <div
            className="px-6 py-3"
            style={{ borderTop: "1px solid rgba(26,95,168,0.15)" }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.22)" }}>
              Pricing locked · Gatehouse build · July 2026
            </p>
          </div>
        </section>

        {/* ── Section 3: Benefit Rules ── */}
        <section
          className="mb-12 rounded-md overflow-hidden"
          style={{
            background: "rgba(15,25,40,0.80)",
            border: "1px solid rgba(26,95,168,0.22)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
          data-testid="cockpit-benefit-rules"
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: "rgba(26,95,168,0.18)",
              borderBottom: "1px solid rgba(26,95,168,0.22)",
            }}
          >
            <span className="text-lg" aria-hidden>⚖️</span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-0.5" style={{ color: "rgba(130,175,230,0.65)" }}>
                section 03
              </p>
              <p className="font-serif text-[17px]" style={{ color: "#f4ede0", fontStyle: "italic" }}>
                Benefit Rules
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="space-y-4">
              {[
                {
                  icon: "🔑",
                  rule: "Benefits are distributed when a member holds a T2 or T3 trust credential.",
                  note: "Trust tiers are earned through verified participation — not assigned by administrators.",
                },
                {
                  icon: "📋",
                  rule: "Distribution rounds are audited by default.",
                  note: "Every benefit event is written to the open ledger. Operators can export, members can inspect.",
                },
                {
                  icon: "🪞",
                  rule: "The Ethos Gate is a mirror, not a wall.",
                  note: "It reflects community values back to members — it does not bar access. Operators set the mirror, not the verdict.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-sm px-4 py-4"
                  style={{
                    background: "rgba(26,95,168,0.07)",
                    border: "1px solid rgba(26,95,168,0.18)",
                  }}
                >
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden>{item.icon}</span>
                  <div>
                    <p className="font-serif text-[15px] leading-snug mb-1.5" style={{ color: "#f4ede0" }}>
                      {item.rule}
                    </p>
                    <p className="font-sans text-[13px] leading-[1.6]" style={{ color: "rgba(244,237,224,0.50)" }}>
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-2 rounded-sm px-5 py-4 flex flex-wrap items-center justify-between gap-4"
              style={{
                background: "rgba(26,95,168,0.12)",
                border: "1px solid rgba(26,95,168,0.30)",
              }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "rgba(130,175,230,0.65)" }}>
                  Lock in your rules
                </p>
                <p className="font-sans text-sm" style={{ color: "rgba(244,237,224,0.55)" }}>
                  Work with Headwaters to finalise your organisation's benefit configuration before go-live.
                </p>
              </div>
              <a
                href="/bio"
                className="shrink-0 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 rounded-sm transition-opacity hover:opacity-80"
                style={{
                  background: ZONE3_BLUE,
                  color: "#f4ede0",
                }}
                data-testid="cockpit-cta"
              >
                Discuss with Headwaters →
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="flex flex-wrap items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(244,237,224,0.07)" }}
        >
          <button
            onClick={() => navigate("/workbench")}
            className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
            style={{ color: "rgba(244,237,224,0.35)" }}
          >
            ← Back to Workbench
          </button>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(244,237,224,0.18)" }}
          >
            headwaters · operator cockpit · demo
          </p>
        </footer>

      </div>
    </main>
  );
}
