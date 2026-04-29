import { Link } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { useScenario } from "@/lib/scenario";
import { money } from "@/lib/format";

const ACCENT = "#1F5B3F";
const ACCENT_SOFT = "#DDF0E5";
const ACCENT_INK = "#0F2E20";

export function ArchetypesPage() {
  const { scenario } = useScenario();
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;

  return (
    <div className="space-y-6" data-testid="page-archetypes">
      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: ACCENT_INK }}
        >
          Project archetypes · how the model splits
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
        >
          Codetry vs Software / Sales — two archetypes, one operating discipline.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          The earlier model (V3, V4) carried the implicit assumption that every Codetry engagement
          looked the same shape: one $90k–$105k/mo agency-style fee, a ~7-role team, an 18-month
          cost-basis window. That assumption broke as soon as the first non-Deer Lake engagements
          got mapped out — the leveraged, software-flavoured products don't carry the same
          boots-on-the-ground payroll, and Deer Lake's economics don't translate cleanly to a SaaS
          P&L. As of 2026-04-29 the model carries <strong>two project archetypes</strong>, with the
          tithe-first surplus discipline and the no-owner-take-from-agency stance held identical
          across both.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Codetry archetype" tag={a.feeTag} accent={ACCENT}>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Shape.</strong> Community engagement with a lead practitioner on the ground,
              a small team, a fixed engagement window (typically 12 months), and a signing-bonus
              line up front. The lead carries the discontinuity-of-income risk of stepping into the
              engagement; the bonus retires that risk in full at month 1.
            </p>
            <p>
              <strong>Canonical example.</strong> Deer Lake (V5). {money(a.fee)}/mo agency fee × {a.termMonths} months
              against a {a.roster.length}-role Day-1 team ({money(a.payrollTotal)}/mo loaded payroll). Signing bonus{" "}
              {money(a.signingBonus)} in month 1; capital recovery {money(a.capitalRecoveryAmount)} (loan only — the
              family infusion was paid via the signing bonus); Phase 3 {money(a.totals18mo.reserve + a.totals18mo.innovation)} split{" "}
              {a.reservePct}/{a.innovationPct} Reserve / Innovation.
            </p>
            <p>
              <strong>Surplus waterfall.</strong> Tithe (10% off the top, first claim) → Wages →{" "}
              <strong>Signing bonus</strong> → Capital Recovery → Reserve / Innovation. The Brightside
              Launch Month phase is dropped from the agency waterfall — Brightside's pre-launch is
              funded out of the Innovation bucket once Phase 3 is deployed.
            </p>
            <p>
              <strong>Why a signing bonus.</strong> The lead is leaving (or holding back from) other
              income to start a place-bound community engagement. The bonus is sized to retire the
              founder-side family-capital obligations in full up front, so the engagement starts
              clean — the only cap-recovery line that survives is the actual third-party loan.
            </p>
            <p>
              <strong>Deferred roles (gated, not deleted).</strong> The V4 7-role roster carried{" "}
              <em>IT/Tech</em>, <em>Community Development Associate</em>, and{" "}
              <em>Junior Analyst / Field</em> seats that V5 leaves off the Day-1 cost basis. They're
              not removed from the planning surface — they're deferred and gated against the
              month-12 renegotiation triggers. When a trigger fires (Brightside live + Software /
              Sales-archetype products in daily use, then a year-1 value-delivered audit), the
              engagement steps back up toward the V4 right-priced fee and these seats reappear (or
              get reassigned to the Software / Sales archetype).
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Software / Sales archetype" tag={bs.tag} accent="#3458A8">
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Shape.</strong> Leveraged software / services revenue. No fixed engagement
              window, no on-the-ground roster, no signing bonus — profit-share carries the
              equivalent value the signing bonus plays in the Codetry archetype.
            </p>
            <p>
              <strong>Canonical example.</strong> Brightside (Recreation Therapy SaaS for LTC).
              Founder builds, founder sells. {money(bs.revenue)} cumulative revenue target; tithe-first
              ({bs.tithePct}% off the top, {money(bs.tithe)}); cost basis {money(bs.cost)}; post-tithe
              surplus {money(bs.surplus)}, split {bs.ownerTakePct}/{bs.retainedPct} owner take / retained
              ({money(bs.ownerTake)} owner take). Karen's tool is the next instance of this archetype.
            </p>
            <p>
              <strong>Surplus waterfall.</strong> Tithe (10% off the top, first claim) → Cost basis →
              50/50 owner take / reinvestment. There is no signing bonus, no capital recovery line,
              and no community-engagement payroll book-kept against this archetype. Owner take here
              is the founder's only profit-share line across all three buckets — it's not in
              tension with the no-owner-take-from-agency stance because Brightside is built on the
              founder's personal time outside the agency salary.
            </p>
            <p>
              <strong>Where it lives in this guide.</strong> The Software/Sales archetype does not
              carry a numbered V-scenario in the workspace because its economics are book-kept
              inside the existing Brightside scenario. The numbered scenarios (V3, V4, V5) all
              describe Codetry-archetype variations applied to Deer Lake.
            </p>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="What's held identical across both archetypes"
        tag={a.feeTag}
        accent={ACCENT}
      >
        <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong>Tithe-first surplus discipline.</strong> 10% off the top of revenue, first
            claim, before cost basis or any capital allocation. The tithe is what was decided, not
            what was left.
          </li>
          <li>
            <strong>No ongoing owner take from agency surplus.</strong> The Codetry archetype's
            agency line never funds a profit share for the founder. Owner take exists only on the
            Software/Sales archetype, where it's structurally legitimate (founder's personal time
            outside the agency salary).
          </li>
          <li>
            <strong>Capital recovery is NOT income.</strong> Whether the line is $72k (V5,
            loan-only) or $112k (V4, loan + family), it's a debt-repayment line and is shown
            separately on the personal-cash page so it never reads as compensation.
          </li>
          <li>
            <strong>Tags and dates.</strong> Every figure ships with a "confirmed" or "TBD" tag
            with the date the founder locked it. Both archetypes obey this rule.
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="V3 → V4 → V5 — the lineage" tag={a.feeTag} accent={ACCENT}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="archetypes-lineage-table">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-card-border">
                <th className="py-2 pr-4 text-left font-medium">Scenario</th>
                <th className="py-2 pr-4 text-left font-medium">Status</th>
                <th className="py-2 pr-4 text-left font-medium">Fee × term</th>
                <th className="py-2 pr-4 text-left font-medium">Roster</th>
                <th className="py-2 pr-4 text-left font-medium">Lead draw</th>
                <th className="py-2 pr-4 text-left font-medium">Signing bonus</th>
                <th className="py-2 pr-4 text-left font-medium">Cap recovery</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-card-border">
                <td className="py-2 pr-4 font-medium">V3 — Lean team</td>
                <td className="py-2 pr-4 text-muted-foreground">Workspace anchor (migration only)</td>
                <td className="py-2 pr-4 num">$90k × 18 mo</td>
                <td className="py-2 pr-4 num">7 roles</td>
                <td className="py-2 pr-4 num">$14k/mo</td>
                <td className="py-2 pr-4 num">—</td>
                <td className="py-2 pr-4 num">$112k</td>
              </tr>
              <tr className="border-b border-card-border">
                <td className="py-2 pr-4 font-medium">V4 — Right-priced</td>
                <td className="py-2 pr-4 text-muted-foreground">Historical baseline</td>
                <td className="py-2 pr-4 num">$105k × 18 mo</td>
                <td className="py-2 pr-4 num">7 roles</td>
                <td className="py-2 pr-4 num">$14k/mo</td>
                <td className="py-2 pr-4 num">—</td>
                <td className="py-2 pr-4 num">$112k</td>
              </tr>
              <tr className="font-semibold" style={{ background: ACCENT_SOFT, color: ACCENT_INK }}>
                <td className="py-2 pr-4">V5 — Codetry archetype (current)</td>
                <td className="py-2 pr-4">Locked default</td>
                <td className="py-2 pr-4 num">$90k × 12 mo</td>
                <td className="py-2 pr-4 num">4 roles</td>
                <td className="py-2 pr-4 num">$18k/mo</td>
                <td className="py-2 pr-4 num">$40k m1</td>
                <td className="py-2 pr-4 num">$72k (loan only)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          V3 is preserved as the workspace anchor so persisted scratch realities stay valid; the
          rest of the guide reads from V5. The Operating Framework page lets you toggle V5
          (Current) ↔ V4 (Prior) to compare the published default to the right-priced baseline.
        </p>
      </SectionCard>

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-back-index"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Index
        </Link>
        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-to-contracts"
        >
          <Home className="h-4 w-4" />
          See V5 on the Contracts page
        </Link>
      </div>
    </div>
  );
}
