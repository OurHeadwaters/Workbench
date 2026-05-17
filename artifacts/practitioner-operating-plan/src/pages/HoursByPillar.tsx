/**
 * HoursByPillar.tsx — retired
 *
 * Pillar hour tracking was relevant to the old six-person employed team model.
 * The current model is practitioner-led with subcontractors per phase.
 * Per-role pillar hour tracking is no longer applicable.
 */

import { Link } from "wouter";

const DARK  = "#1f3d2e";
const CREAM = "#f4ede0";
const MUTED = "#6b7665";
const RULE  = "#c8bfa7";
const MONO  = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF = "Fraunces, Georgia, serif";

export default function HoursByPillar() {
  return (
    <div style={{ minHeight: "100vh", background: "#d8d2c8", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ background: CREAM, borderRadius: 10, padding: "40px 48px", maxWidth: 580, width: "100%", border: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>
          Tool retired
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, marginBottom: 12, lineHeight: 1.2 }}>
          Hours-by-Pillar not applicable
        </h1>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
          The per-role, per-pillar hour tracking tool was built for the old six-person employed team model.
          The current engagement is practitioner-led — one practitioner covers all pillars, with subcontractors
          engaged per phase as scope requires.
        </p>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 32 }}>
          Hour tracking, if needed, is done at the phase level — not broken down by pillar role allocation.
          See the Contract Terms page for the current engagement team and amendment history.
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/" style={{ fontFamily: MONO, fontSize: 11, color: DARK, textDecoration: "none", letterSpacing: "0.12em", borderBottom: `1px solid ${DARK}`, paddingBottom: 1 }}>
            ← LOBBY
          </Link>
          <Link href="/contract-terms" style={{ fontFamily: MONO, fontSize: 11, color: MUTED, textDecoration: "none", letterSpacing: "0.12em", borderBottom: `1px solid ${RULE}`, paddingBottom: 1 }}>
            CONTRACT TERMS →
          </Link>
        </div>
      </div>
    </div>
  );
}
