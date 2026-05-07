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
];

export const AGENCY_FOOTNOTES: Footnote[] = [
  {
    id: "giving-ratio",
    title: "Giving is tithe-shaped — first claim, not residual",
    body:
      "Giving is 10% of practitioner draw — first claim on what Bobbie takes home, not on revenue and not on the business surplus. The tithe is personal: it is settled from Bobbie's draw before personal spending or any other allocation. The business P&L (revenue → COGS → overhead → draw → surplus) has no tithe line. Dave Ramsey discipline: the tithe is what you decided, not what was left. The earlier framing (10% of gross revenue, or 25% of Phase 3 surplus) made the giving line elastic — it grew with the fee, shrank if the fee shrank, and competed with the business waterfall. Tithe-on-draw fixes all three failure modes: the giving number is locked the moment Bobbie's draw is locked, and the business surplus waterfall (wages → capital recovery → Reserve / Innovation) runs cleanly on the side.",
  },
  {
    id: "buyer-dependency",
    title: "Buyer dependency",
    body:
      "If the buyer is the band council, the personal-compensation lines and the tithe-first deployment structure carry political weight that should be visible in any conversation with them. If the buyer is the founder's father, this is family capital cycling. The guide should not pretend the buyer is determined when it isn't.",
  },
  {
    id: "northern-band-travel",
    title: "Northern Band travel is a known unknown",
    body:
      "The guide ships with a TBD placeholder; locking it requires the founder to estimate flight + lodging + per diem cadence honestly.",
  },
  {
    id: "hiring-authority",
    title: "Hiring authority for Northern Band store staff",
    body:
      "Unresolved. The guide documents the open question rather than assume an answer. Regardless of authority: systems and training are Headwaters-only (not outsourced).",
  },
  {
    id: "life-supports",
    title: "Life supports timing",
    body:
      "Life supports start September 2026. The June–August window has lower overheads ($10,392 vs $12,492) and therefore slightly higher post-tithe surplus, which is why capital recovery clears faster in those early months.",
  },
  {
    id: "family-infusion-recovery",
    title: "Capital Recovery — family-infusion leg (V5 split)",
    body:
      "Under V5 the $112k Capital Recovery total is shown as two visible legs instead of one undivided line: the family-infusion leg ($40,000, month 1 + month-2 spillover at the post-tithe surplus rate) and the bank-loan leg ($72,000, Aug → early Oct). Both legs are tax-free debt repayment — money flows business → creditor (the founder's husband for the family leg, the bank for the loan leg), bypassing the founder's personal accounts entirely. NOT compensation to the lead, NOT income to the founder, NOT a deductible expense to the business. The split-leg framing is for visibility (so the front-loading of the family piece is legible); the substance is identical to V3/V4's undivided $112k Capital Recovery line. The Software/Sales archetype does NOT carry this line because it doesn't have a personal-guarantee stack to retire.",
    crossLink: { label: "See Archetypes", href: "/archetypes" },
  },
  {
    id: "brightside-coupling",
    title: "Cross-bucket: Brightside pre-launch funding (V4 carve-out vs V5 Innovation)",
    body:
      "Under the V4 baseline, Brightside's $28k pre-launch was funded from a dedicated Brightside Launch Month carve-out at the top of Phase 2 of the agency surplus waterfall. Under V5 (current), that dedicated phase is dropped — Brightside's pre-launch is funded from the Innovation bucket inside Phase 3 instead, after both Capital Recovery legs (family infusion + bank loan) have cleared. In either model, if pre-launch costs overrun the $28k cap, the overrun comes out of the following month's Reserve / Innovation splits — not from the tithe, not from the founder personally, and not from the agency cost basis. The tithe is structurally protected because it sits above the entire surplus waterfall.",
    crossLink: { label: "See Brightside — pre-launch cost basis", href: "/brightside" },
  },
  {
    id: "team-incentives",
    title: "Team incentives — visible-but-TBD",
    body:
      "Christmas bonus, perks of employment, and similar discretionary team-side spend appear as a named line on the roster table even though the dollar amount has not been pinned yet. The line exists to make sure the planning conversation never silently drops the team-incentives bucket — the cost will land somewhere (overheads or a new dedicated waterfall step) when it's locked.",
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
      "Brightside's pre-launch one-time spend ($28k) is funded from post-tithe agency surplus in the same month (Brightside Launch Month). If the agency engagement is delayed, Brightside launch is delayed in lockstep. If pre-launch costs overrun the $28k cap, the overrun comes out of the following month's Reserve / Innovation splits — the tithe sits above the surplus waterfall and is unaffected.",
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
    title: "Capital Recovery is NOT income (either leg)",
    body:
      "Capital Recovery returns existing obligations and is booked as \"Capital Recovery\" — distinct line, separate from compensation, separate from owner draw. Under V5 (current Codetry-archetype baseline) it is shown as two visible legs that retire the same $112k debt stack: a family-infusion leg ($40k, month 1, paid to the founder's husband) and a bank-loan leg ($72k, Aug → Oct, paid to the bank). Both legs are tax-free return of principal — money flows business → creditor, bypassing the founder personally; neither leg is income to the founder, and neither is a deductible expense to the business. Under V3/V4 (historical) the same $112k was carried as one undivided Capital Recovery line. Either way, time-bound: ends when the obligation is retired.",
  },
  {
    id: "family-infusion-tax-free",
    title: "Family-infusion leg is tax-free debt repayment, not a payment to Bobbie",
    body:
      "The $40k family-infusion leg of V5 Capital Recovery retires the founder's husband's family-capital infusion in full in month 1 (with month-2 spillover at the post-tithe surplus rate). The money flows business → husband; it never lands in Bobbie's personal accounts and never appears on her T1. There is no T4, no T4A, no withholding, and nothing to remit. It is intentionally NOT framed as a signing bonus or any other form of compensation — that framing would have triggered ~$18k of personal income tax (Ontario top marginal ~53.5%), CRA reasonableness scrutiny on related-party comp, and lost the balance-sheet treatment. The split-leg presentation gives visual cleanliness without the wallet hit.",
  },
  {
    id: "no-agency-owner-take",
    title: "No ongoing owner take from agency",
    body:
      "No profit-share, no dividend from the agency line. The founder's only profit-share line across all three buckets is Brightside owner take (50% of Brightside surplus).",
  },
];
