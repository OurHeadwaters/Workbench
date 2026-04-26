/**
 * Footnotes are shared verbatim across the live scenarios.
 * Where a footnote depends on the scenario (e.g. Brightside launch month),
 * the footnote text references the scenario's own field, not a hard-coded value.
 */

export interface Footnote {
  id: string;
  title: string;
  body: string;
  crossLink?: { label: string; href: string };
}

export const SALTS_FOOTNOTES: Footnote[] = [
  {
    id: "shadow-labour",
    title: "Shadow labour",
    body:
      "Founder + family produce 500 jars per 12-hr session. At actual production of 1,190 jars/yr, that's ~29 hrs of unpaid labour. Valued at the $30/hr bench rate, the shadow labour cost is ~$858/yr, which would reduce the economic margin to ~$440/yr. Salt is sustainable on family hands; any move to paid labour without volume growth tips the line underwater.",
  },
  {
    id: "maple-syrup",
    title: "Maple syrup at markets",
    body:
      "Separate line, NOT counted in salt revenue. 12 cases/yr × 12 bottles × $4 margin = ~$576/yr. Sells out early; volume pivot from 8 to 12 cases is doable with staff. Listed as Salts → Markets context only.",
  },
  {
    id: "wholesale-push",
    title: "Wholesale push state",
    body:
      "Founder is in active-push mode on wholesale. The 525 jars/yr baseline reflects the post-backlog steady state with the existing 5 accounts and is expected to grow.",
  },
  {
    id: "subscriptions-breakout",
    title: "Subscriptions breakout",
    body:
      "The 30% allocation reflects founder gut. When the founder is ready, the $500/mo line should be broken out item-by-item and re-allocated.",
  },
  {
    id: "dog-treat-cross",
    title: "Cross-bucket: dog-treat piecework (Salts ↔ 807 CDP)",
    body:
      "If the 807 structured option lands, dog-treat piecework production by Parr's Jars in salt-batch whitespace becomes a potential new sub-line in Salts. The cross-link is flagged here; the founder still needs to size dog-treat volumes with 807 before committing.",
    crossLink: { label: "See 807 CDP — Structured option", href: "/contracts#cdp807" },
  },
];

export const CDP807_FOOTNOTES: Footnote[] = [
  {
    id: "at-risk-10k",
    title: "$10k at-risk piece",
    body:
      "The $10,000 board-voted portion is genuinely at risk because the board is in deficit. The structured option exists precisely so 807 has a path to retire the invoice without needing the at-risk $10k to materialize as cash.",
  },
  {
    id: "dog-treat-capacity",
    title: "Dog-treat capacity assumption",
    body:
      "The dog-treat piece-work concept assumes Parr's Jars has spare batch-day capacity. Current salt cadence (every 6 weeks, ~12 hr sessions for 500 jars) suggests there is slack, but the guide should not commit to dog-treat volumes until the founder sizes them with 807.",
    crossLink: { label: "See Salts — channels & cadence", href: "/salts" },
  },
];

export const AGENCY_FOOTNOTES: Footnote[] = [
  {
    id: "giving-ratio",
    title: "Giving ratio honesty",
    body:
      "The ~6.1% giving / contract ratio is honest math. The \"no owner take from agency\" structure did not increase community giving vs. the original 30/30/20/20 split — it redirected what would have been ongoing owner profit into the Reserve war chest. The founder chose this knowingly: salary protected, everyone made whole, build the future.",
  },
  {
    id: "buyer-dependency",
    title: "Buyer dependency",
    body:
      "If the buyer is 807, the personal-compensation lines and giving ratio carry political weight that should be visible in any conversation with 807. If the buyer is the founder's father, this is family capital cycling. The guide should not pretend the buyer is determined when it isn't.",
  },
  {
    id: "deer-lake-travel",
    title: "Deer Lake travel is a known unknown",
    body:
      "The guide ships with a TBD placeholder; locking it requires the founder to estimate flight + lodging + per diem cadence honestly.",
  },
  {
    id: "hiring-authority",
    title: "Hiring authority for Deer Lake store staff",
    body:
      "Unresolved. The guide documents the open question rather than assume an answer. Regardless of authority: systems and training are Headwaters-only (not outsourced).",
  },
  {
    id: "life-supports",
    title: "Life supports timing",
    body:
      "Life supports start September 2026. The June–August window has lower overheads ($10,392 vs $12,492) and therefore slightly higher surplus, which is why capital recovery clears purely in 3 months under Phase 1.",
  },
  {
    id: "brightside-coupling",
    title: "Cross-bucket: September agency surplus is fully claimed by Brightside",
    body:
      "If Brightside's pre-launch costs (engineer / audit / legal) overrun the locked $28k cap, the overrun comes out of October's Reserve / Innovation / Giving splits — not from the founder personally and not from the agency cost basis.",
    crossLink: { label: "See Brightside — pre-launch cost basis", href: "/brightside" },
  },
];

export const BRIGHTSIDE_FOOTNOTES: Footnote[] = [
  {
    id: "target-vs-forecast",
    title: "$120k is a target, not a forecast",
    body:
      "The $120k cumulative revenue target assumes the customer ramp, mix, and training attach above. Under stricter assumptions (more Tier 1, lower training attach, slower ramp) realistic ramp may land closer to $90,000–$100,000. Treat the target as a target, not a forecast.",
  },
  {
    id: "chain-deals-upside",
    title: "Chain deals are upside, not baseline",
    body:
      "A regional operator win (5–50 facilities) could 2–3x the surplus. The guide captures the concept as a footnote, not as plan.",
  },
  {
    id: "homecare-shelved",
    title: "Home-care services market is shelved",
    body:
      "Reactivation criterion: \"if RT/LTC succeeds on its own.\"",
  },
  {
    id: "owner-take-consistency",
    title: "Owner-take consistency",
    body:
      "Brightside owner take (50% of surplus) is internally consistent with the \"no owner take\" stance on agency surplus. Brightside is built on founder's personal time outside the agency salary, so it generates owner-take legitimately. The two stances are compatible, not contradictory — this is stated directly so a reader doesn't read it as inconsistent.",
  },
  {
    id: "agency-funding-coupling",
    title: "Cross-bucket: funded from agency surplus",
    body:
      "Brightside's pre-launch one-time spend ($28k) is funded from agency surplus in the same month (Brightside Launch Month). If the agency engagement is delayed, Brightside launch is delayed in lockstep. If pre-launch costs overrun the $28k cap, the overrun comes out of the following month's Reserve / Innovation / Giving splits.",
    crossLink: { label: "See Agency — Brightside Launch Month", href: "/contracts#agency" },
  },
  {
    id: "hardware-framing",
    title: "Hardware framing",
    body:
      "The earlier \"compliance hardware\" and \"lobby kiosk\" ideas are folded into the SaaS product as BYOD on customer-owned tablets. No separate hardware SKU, no hardware supply chain, no hardware revenue line. The \"Hardware\" word in the bucket title is preserved for category continuity only.",
  },
];

export const PERSONAL_CASH_FOOTNOTES: Footnote[] = [
  {
    id: "capital-recovery-not-income",
    title: "Capital Recovery is NOT income",
    body:
      "Phase 1 Capital Recovery returns existing obligations to lender ($72k business loan) and family ($40k personal infusion from founder's husband). Booked as \"Capital Recovery\" — distinct line, separate from compensation, separate from owner draw. Time-bound: ends when the $112k is retired.",
  },
  {
    id: "no-agency-owner-take",
    title: "No ongoing owner take from agency",
    body:
      "No profit-share, no dividend from the agency line. The founder's only profit-share line across all three buckets is Brightside owner take (50% of Brightside surplus).",
  },
];
