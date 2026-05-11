/**
 * PromotionalPlanPage — Farmers market + organizational outreach promo plan.
 *
 * Three subsections:
 *   1. Farmers Market channel — stall math prompts, throughput questions, gross-per-day target
 *   2. Organizational Outreach — target org list, pitch narrative, outreach tracker
 *   3. Marketing Materials checklist — what needs to exist before showing up, production status
 *
 * Rates grounded in the Ship Manifest: $175/hr lead, $70/hr support, trial-first offer.
 */

import { Link } from "wouter";
import { useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Building2,
  FileCheck,
  HelpCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function PromotionalPlanPage() {
  return (
    <div className="space-y-8" data-testid="page-promo-plan">

      {/* ── Back to dashboard ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Promotional Plan
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Farmers market + organizational outreach
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-3xl leading-relaxed">
          A working plan for the two promotional channels available before a big agency contract
          lands: the local farmers market (Parr's Jars) and direct outreach to organizations
          that are natural buyers for Headwaters services. Rates from the Ship Manifest:
          $175/hr lead, $70/hr support, six-week bounded trial to start.
        </p>
      </header>

      {/* ════════════════════════════════════
          SECTION 1 — FARMERS MARKET
      ════════════════════════════════════ */}
      <section data-testid="section-farmers-market">
        <SectionHeader
          icon={ShoppingBag}
          accentColor="#B27319"
          label="Channel: Parr's Jars"
          title="Farmers Market"
          badge="Still building actuals"
          badgeVariant="modelling"
        />

        {/* Stall math prompts */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="font-semibold text-amber-900 text-sm">
                Stall math questions to answer before booking a slot
              </p>
              <div className="space-y-2">
                <FramingQuestion
                  q="What does a single Dryden Farmers' Market stall actually cost?"
                  context="The model assumes $30/stall/week. Confirm the 2026 rate with the market coordinator. Factor in any annual membership or insurance requirements."
                  accent="amber"
                />
                <FramingQuestion
                  q="What is the realistic jars-per-day throughput?"
                  context="The planning model carries 3 jars/week (45/season). Talk to vendors who've run the market for 2+ seasons. What does a good Saturday look like vs a slow one?"
                  accent="amber"
                />
                <FramingQuestion
                  q="What does a single market day need to gross to be worth the time?"
                  context="Break-even calculation: stall cost + setup time (est. 2 hrs) + market time (est. 4 hrs) + breakdown (1 hr) at shadow-labour rate ($30/hr). At $12/jar, how many jars cover that? What margin target makes it worth returning?"
                  accent="amber"
                />
                <FramingQuestion
                  q="What setup is required before the first stall?"
                  context="Confirmed items needed: price list, jar label with ingredients + allergens, cash or Square for payment. What's missing from that list right now?"
                  accent="amber"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Throughput estimate accordion */}
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem
            value="market-math"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: "#B27319", borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">Working throughput model</span>
                <span className="text-xs text-muted-foreground">
                  3 scenarios · low / mid / stretch
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground mb-3">
                All figures are planning estimates at $12/jar, 15-week season, $30/stall/week.
                Confirm stall rate and actual throughput before committing to a full-season booking.
              </p>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm min-w-[480px]">
                  <thead className="text-left text-muted-foreground">
                    <tr className="border-b border-card-border">
                      <th className="py-2 pr-4 font-medium">Scenario</th>
                      <th className="py-2 pr-4 font-medium text-right">Jars/week</th>
                      <th className="py-2 pr-4 font-medium text-right">Gross/day</th>
                      <th className="py-2 pr-4 font-medium text-right">Season gross</th>
                      <th className="py-2 pr-4 font-medium text-right">Net (after stall)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { scenario: "Low (founder's pick)", jars: 3, gross: 36, seasonGross: 540, net: 90 },
                      { scenario: "Mid", jars: 6, gross: 72, seasonGross: 1080, net: 630 },
                      { scenario: "Stretch", jars: 10, gross: 120, seasonGross: 1800, net: 1350 },
                    ].map((row) => (
                      <tr key={row.scenario} className="border-b border-card-border">
                        <td className="py-2 pr-4 font-medium">{row.scenario}</td>
                        <td className="py-2 pr-4 text-right num">{row.jars}</td>
                        <td className="py-2 pr-4 text-right num">${row.gross}</td>
                        <td className="py-2 pr-4 text-right num">${row.seasonGross}</td>
                        <td className="py-2 pr-4 text-right num">${row.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Net = season gross − stall cost (15 × $30 = $450). Does not include shadow labour.
                Add ~29 hrs production labour + market hours to see the true economic picture.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ════════════════════════════════════
          SECTION 2 — ORGANIZATIONAL OUTREACH
      ════════════════════════════════════ */}
      <section data-testid="section-org-outreach">
        <SectionHeader
          icon={Building2}
          accentColor="#1F5446"
          label="Channel: Headwaters services"
          title="Organizational Outreach"
          badge="Active — open actions"
          badgeVariant="active"
        />

        {/* Pitch narrative */}
        <div
          className="mt-4 rounded-xl border border-card-border bg-card p-5"
          data-testid="pitch-narrative"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
            One-paragraph pitch — grounded in real rates + trial-first offer
          </p>
          <p className="text-sm leading-relaxed">
            Headwaters builds operational tools that fit the team you have — not the team the
            software assumes you should be. The work is for northern and Indigenous community
            economic development: store plans, food hub design, membership platforms, and custom
            internal tools — written in plain language, dollar-honest, shipped complete, no retainer.
            The usual first step is a bounded six-week trial at an hourly rate ($175/hr lead,
            $70/hr support) — no retainer, no long commitment. If the fit is right, it continues.
            If not, you leave with something useful and no obligation to keep going. Full pricing
            is public. Nothing you can't see before signing.
          </p>
        </div>

        {/* Target org types */}
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem
            value="target-orgs"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: "#1F5446", borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">Target organization types</span>
                <span className="text-xs text-muted-foreground">warmest to coldest</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {[
                  {
                    type: "Co-operatives (807 area)",
                    why: "Shared governance, food distribution, and co-op platform needs — natural fit for the co-op membership platform service. Warm channel via existing 807 Co-op relationship.",
                    hook: "A working platform that follows your governance — not a template your bylaws have to fit into.",
                  },
                  {
                    type: "Band offices and tribal councils (IFNA cluster, Shibogama, Windigo)",
                    why: "Primary buyers for community store plans and food systems work. Warmest channel given Northern Band pursuit. Same freight corridor, same operating environment.",
                    hook: "Store-in-a-box for a northern community: procurement dashboard, local hire plan, open financial model — the council can read every number before signing.",
                  },
                  {
                    type: "Regional health authorities (SLFNHA, NOHA)",
                    why: "Food access as a health mandate. Brightside RT-LTC is a secondary pitch here — primary is food systems work where food insecurity intersects with health outcomes.",
                    hook: "What does a remote community need to have reliable access to food? That's the question this work answers.",
                  },
                  {
                    type: "Credit unions (Dryden area)",
                    why: "Small-business support mandate, board governance software needs, member platforms. Potential for custom internal tool engagements.",
                    hook: "A custom tool built around how your operation actually works — not off-the-shelf software with a monthly fee.",
                  },
                  {
                    type: "NAN economic development",
                    why: "Corridor-wide pitch venue, potential for multi-community introductions. Coldest start but highest multiplier if it lands.",
                    hook: "A model that travels — same operating structure, different community. Practitioner-built tools, corridor-wide reach.",
                  },
                ].map((org, i) => (
                  <div
                    key={org.type}
                    className="border border-card-border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="text-xs font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "#1F5446", color: "#E0EAE6" }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        <p className="font-semibold text-sm">{org.type}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{org.why}</p>
                        <p className="text-xs italic text-foreground leading-relaxed">
                          Hook: "{org.hook}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Outreach tracker */}
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem
            value="outreach-tracker"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: "#1F5446", borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">Outreach tracker</span>
                <span className="text-xs text-muted-foreground">fill in as you go</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground mb-3">
                A simple working log. Copy this into a notes file or spreadsheet and fill in as
                outreach happens. The table here is a prompt, not a live database.
                {" "}<span className="font-medium text-foreground">Reviewed May 2026</span> — statuses reflect the V7 scenario: rates confirmed ($175/hr lead · $70/hr support), contract not yet signed, trial window open.
              </p>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="text-left text-muted-foreground">
                    <tr className="border-b border-card-border">
                      <th className="py-2 pr-4 font-medium">Organization</th>
                      <th className="py-2 pr-4 font-medium">Contact</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium">Follow-up date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { org: "807 Co-op", contact: "Known", status: "Active — portal dev confirmed · $12k fee confirmed", followUp: "Ongoing" },
                      { org: "Northern Band", contact: "Band council", status: "Trial window open · rates confirmed · contract not yet signed", followUp: "2026-06-15 soft date" },
                      { org: "IFNA cluster communities", contact: "TBD", status: "Plan B — warm outreach if Northern Band stalls", followUp: "2026-07-31 hard deadline" },
                      { org: "Shibogama First Nations Council", contact: "TBD", status: "Plan B — queued", followUp: "After IFNA" },
                      { org: "SLFNHA", contact: "TBD", status: "Not started", followUp: "—" },
                      { org: "Dryden area credit union", contact: "TBD", status: "Not started", followUp: "—" },
                    ].map((row) => (
                      <tr key={row.org} className="border-b border-card-border align-top">
                        <td className="py-2 pr-4 font-medium">{row.org}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.contact}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.status}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.followUp}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-card-border border-dashed">
                      <td className="py-2 pr-4 text-muted-foreground italic" colSpan={4}>
                        + add organizations as outreach progresses
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — MARKETING MATERIALS
      ════════════════════════════════════ */}
      <section data-testid="section-marketing-materials">
        <SectionHeader
          icon={FileCheck}
          accentColor="#7A4E2D"
          label="Before you show up"
          title="Marketing Materials Checklist"
          badge="Open — check off as done"
          badgeVariant="open-action"
        />

        <div className="mt-4 space-y-3">
          <MaterialsChecklist
            accentColor="#7A4E2D"
            items={[
              {
                item: "Price list",
                desc: "Single page: jar sizes, blends, wholesale vs retail pricing. Plain numbers, no decorative copy.",
                status: "needed",
                channel: "Both channels",
              },
              {
                item: "Jar label with ingredients + allergens",
                desc: "Required for any retail sale. Must include: product name, ingredient list, allergen statement, net weight, producer contact.",
                status: "needed",
                channel: "Farmers market",
              },
              {
                item: "One-pager card",
                desc: "Business card or half-letter card: who Headwaters is, what the work is, the trial-first offer, QR code to the Ship site. Handed to contacts at market and org meetings.",
                status: "needed",
                channel: "Both channels",
              },
              {
                item: "QR code linking to the Ship site",
                desc: "Points to the Headwaters services page (ourheadwaters.ca/services or equivalent). Test it before printing anything.",
                status: "needed",
                channel: "Both channels",
              },
              {
                item: "Square for point-of-sale payment",
                desc: "Accept card payments at the market. Square reader + account setup. Test a transaction before market day.",
                status: "needed",
                channel: "Farmers market",
              },
              {
                item: "Intake form live on the Ship site",
                desc: "The \"Start a conversation\" form. Already exists — verify it's working and submits to an inbox you check.",
                status: "confirm",
                channel: "Org outreach",
              },
              {
                item: "Services page with rates visible",
                desc: "The Ship Manifest services page shows $175/hr lead, $70/hr support, trial-first offer. Verify rates match what you're quoting verbally.",
                status: "confirm",
                channel: "Org outreach",
              },
              {
                item: "Market display / table setup",
                desc: "Tablecloth, jar display stand or crate, signage with business name. Simple is fine — tidy and readable from 3 metres is the bar.",
                status: "needed",
                channel: "Farmers market",
              },
            ]}
          />
        </div>
      </section>

    </div>
  );
}

function SectionHeader({
  icon: Icon,
  accentColor,
  label,
  title,
  badge,
  badgeVariant,
}: {
  icon: typeof ShoppingBag;
  accentColor: string;
  label: string;
  title: string;
  badge: string;
  badgeVariant: "modelling" | "active" | "open-action" | "pre-revenue";
}) {
  const badgeStyles: Record<string, string> = {
    modelling: "bg-amber-50 text-amber-800 border border-amber-200",
    active: "bg-blue-50 text-blue-800 border border-blue-200",
    "open-action": "bg-orange-50 text-orange-800 border border-orange-200",
    "pre-revenue": "bg-slate-50 text-slate-700 border border-slate-200",
  };
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ borderTop: `4px solid ${accentColor}`, border: `1px solid hsl(var(--card-border))`, borderTopColor: accentColor, borderTopWidth: "4px" }}
    >
      <div className="bg-card p-5">
        <div className="flex items-start gap-3">
          <div
            className="h-9 w-9 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: accentColor + "22", color: accentColor }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--app-font-serif)", color: accentColor }}
              >
                {title}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[badgeVariant]}`}>
                {badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FramingQuestion({
  q,
  context,
  accent,
}: {
  q: string;
  context: string;
  accent: "amber" | "blue" | "green";
}) {
  const colors: Record<string, { q: string; ctx: string }> = {
    amber: { q: "text-amber-900", ctx: "text-amber-700" },
    blue: { q: "text-blue-900", ctx: "text-blue-700" },
    green: { q: "text-green-900", ctx: "text-green-700" },
  };
  const c = colors[accent];
  return (
    <div className="space-y-0.5">
      <p className={`font-medium text-sm ${c.q}`}>→ {q}</p>
      <p className={`text-xs leading-relaxed pl-3 ${c.ctx}`}>{context}</p>
    </div>
  );
}

function MaterialsChecklist({
  accentColor,
  items,
}: {
  accentColor: string;
  items: {
    item: string;
    desc: string;
    status: "done" | "confirm" | "needed";
    channel: string;
  }[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const statusLabel: Record<string, { label: string; style: string }> = {
    done: { label: "Done", style: "bg-emerald-50 text-emerald-800 border border-emerald-200" },
    confirm: { label: "Confirm", style: "bg-amber-50 text-amber-800 border border-amber-200" },
    needed: { label: "Needed", style: "bg-orange-50 text-orange-800 border border-orange-200" },
  };

  return (
    <div
      className="rounded-xl border border-card-border bg-card overflow-hidden"
      style={{ borderLeftColor: accentColor, borderLeftWidth: "3px" }}
    >
      <div className="px-4 py-3 border-b border-card-border">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Check off as you complete each item
        </p>
      </div>
      <div className="divide-y divide-card-border">
        {items.map((item) => {
          const isChecked = checked[item.item] ?? (item.status === "done");
          return (
            <div
              key={item.item}
              className={`px-4 py-4 flex items-start gap-3 cursor-pointer transition-colors ${isChecked ? "bg-muted/30" : ""}`}
              onClick={() => setChecked((prev) => ({ ...prev, [item.item]: !isChecked }))}
            >
              <div className="mt-0.5 flex-shrink-0 text-muted-foreground">
                {isChecked
                  ? <CheckSquare className="h-4 w-4" style={{ color: accentColor }} />
                  : <Square className="h-4 w-4" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className={`text-sm font-semibold ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                    {item.item}
                  </p>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${isChecked ? statusLabel.done.style : statusLabel[item.status].style}`}>
                    {isChecked ? statusLabel.done.label : statusLabel[item.status].label}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {item.channel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
