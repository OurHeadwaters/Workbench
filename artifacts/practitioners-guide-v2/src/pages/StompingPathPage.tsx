import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

const ACCENT = "#1F5B3F";
const ACCENT_SOFT = "#DDF0E5";
const ACCENT_INK = "#0F2E20";
const ACCENT_WARM = "#7A4E2D";
const ACCENT_WARM_SOFT = "#F5EDE5";
const ACCENT_BLUE = "#3458A8";
const ACCENT_BLUE_SOFT = "#E8EEF8";

export function StompingPathPage() {
  return (
    <div className="space-y-5" data-testid="page-stomping-path">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-workspace"
      >
        <ArrowLeft className="h-3 w-3" />
        Workspace
      </Link>

      <header className="space-y-1">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: ACCENT_INK }}
        >
          Stage-Recognition Reference · Headwaters Universe · May 2026
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
        >
          The Stomping Path
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The transformation trail most Headwaters practitioners walked before they arrived at the
          kitchen table. Recognize which stage a person is in — and offer the right bridge.
        </p>
      </header>

      {/* ── Stage Recognition Quick Reference — FIRST, above the fold ── */}
      <section className="space-y-2">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: ACCENT_INK }}
        >
          Stage Recognition — Quick Reference
        </h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(var(--card-border))" }}>
          <table className="w-full text-sm" data-testid="stomping-path-recognition-table">
            <thead>
              <tr
                className="border-b text-xs uppercase tracking-wider"
                style={{ borderColor: "hsl(var(--card-border))", backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                <th className="py-2 px-4 text-left font-semibold w-1/2">What they say</th>
                <th className="py-2 px-4 text-left font-semibold">Stage they are likely in</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "hsl(var(--card-border))" }}>
              {[
                { say: '"The Fed is printing us into slavery"', stage: "Stage 1 or Stage 2" },
                { say: '"I\'m stacking gold / silver / Bitcoin"', stage: "Stage 2" },
                { say: '"End the Fed"', stage: "Stage 2" },
                { say: '"We\'re getting out of debt" / "Baby Steps"', stage: "Ramsey parallel trail" },
                { say: '"I want to hand something forward to my kids"', stage: "Stage 2 → 3 transition" },
                { say: '"How do we build the community economy?"', stage: "Stage 3" },
                { say: '"The community needs to own this"', stage: "Stage 3" },
                { say: "Asks about co-ops, community ownership, local currency", stage: "Stage 3" },
              ].map(({ say, stage }) => (
                <tr key={say} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-4 text-muted-foreground italic">{say}</td>
                  <td className="py-2 px-4 font-medium" style={{ color: ACCENT_INK }}>{stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bridge Language ── */}
      <section className="space-y-2">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: ACCENT_INK }}
        >
          Bridge Language for Each Transition
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            className="rounded-xl border p-3 space-y-1"
            style={{ borderColor: "hsl(var(--card-border))", borderLeftColor: "#B91C1C", borderLeftWidth: "4px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#B91C1C" }}>
              Stage 1 → Stage 2
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: ACCENT_INK }}>
              "The diagnosis was right. The prescription is wrong. The enemy is real, and the exit
              is not a bunker — it is a community that owns its own ground."
            </p>
          </div>

          <div
            className="rounded-xl border p-3 space-y-1"
            style={{ borderColor: "hsl(var(--card-border))", borderLeftColor: ACCENT_WARM, borderLeftWidth: "4px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_WARM }}>
              Stage 2 → Stage 3
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: ACCENT_INK }}>
              "You did the hard thing. You got out of the extraction machine at the household level.
              The next question is the one Paul didn't ask: where does the surplus actually go, and
              who owns the community it flows through?"
            </p>
          </div>

          <div
            className="rounded-xl border p-3 space-y-1"
            style={{ borderColor: "hsl(var(--card-border))", borderLeftColor: ACCENT_BLUE, borderLeftWidth: "4px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_BLUE }}>
              Ramsey → Stage 3
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: ACCENT_INK }}>
              "Ramsey taught you to stop the household leak. That was the right first move. The
              question he didn't ask is what happens after the household is whole — and whether
              'invest in mutual funds' is actually the same thing as owning your own ground."
            </p>
          </div>
        </div>
      </section>

      {/* ── The Three Stages ── */}
      <section className="space-y-2">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: ACCENT_INK }}
        >
          The Three Stages
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Stage 1 */}
          <div
            className="rounded-xl border bg-card overflow-hidden"
            style={{ borderTopColor: "#B91C1C", borderTopWidth: "4px", borderColor: "hsl(var(--card-border))" }}
          >
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#B91C1C" }}>
                Stage 1
              </p>
              <p className="font-semibold text-sm" style={{ color: ACCENT_INK, fontFamily: "var(--app-font-serif)" }}>
                The Doom Crowd
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Fear-based, conspiratorial, loud. The diagnosis is largely correct — extraction is
                real, the dependency systems are engineered, the central banking system does remove
                wealth from communities. What is broken is the prescription: more awareness, more
                alarm, stockpiling for collapse. No community building. No generative plan.
              </p>
              <p className="text-xs font-medium pt-1" style={{ color: "#B91C1C" }}>
                Ceiling: Awareness without agency.
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div
            className="rounded-xl border bg-card overflow-hidden"
            style={{ borderTopColor: ACCENT_WARM, borderTopWidth: "4px", borderColor: "hsl(var(--card-border))" }}
          >
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_WARM }}>
                Stage 2
              </p>
              <p className="font-semibold text-sm" style={{ color: ACCENT_INK, fontFamily: "var(--app-font-serif)" }}>
                The Ron Paul Pivot
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Austrian economics, sound money, personal sovereignty, non-interventionism. Same
                diagnosis as Stage 1; completely different prescription — opt out, own hard assets,
                build sovereignty at the household level. Produces real work: debt cleared, hard
                assets held, a desire to hand something forward.
              </p>
              <p className="text-xs font-medium pt-1" style={{ color: ACCENT_WARM }}>
                Ceiling: Paul stops at the household. No mechanism for community-scale ownership.
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div
            className="rounded-xl border bg-card overflow-hidden"
            style={{ borderTopColor: ACCENT, borderTopWidth: "4px", borderColor: "hsl(var(--card-border))" }}
          >
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                Stage 3
              </p>
              <p className="font-semibold text-sm" style={{ color: ACCENT_INK, fontFamily: "var(--app-font-serif)" }}>
                The Headwaters Kitchen Table
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Taking household sovereignty principles and scaling them outward — to community
                institutions, collective ownership, co-ops, local economies, and seven-generation
                stewardship. The traveller has a household that is not leaking and a community to
                build with.
              </p>
              <p className="text-xs font-medium pt-1" style={{ color: ACCENT }}>
                This is where the tools, models, and institutions enter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ramsey Parallel Trail ── */}
      <section
        className="rounded-xl border p-4 space-y-2"
        style={{ borderColor: "hsl(var(--card-border))", borderLeftColor: ACCENT_BLUE, borderLeftWidth: "4px", backgroundColor: ACCENT_BLUE_SOFT }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_BLUE }}>
          The Ramsey Parallel Trail
        </p>
        <p className="text-sm leading-relaxed" style={{ color: ACCENT_INK }}>
          Dave Ramsey runs a parallel on-ramp from consumer debt rather than political fear. Baby Steps 1–3
          are almost perfectly compatible with Headwaters cost-basis discipline. Both say:{" "}
          <strong>plug the household leak before you build anything.</strong> Where Ramsey diverges: Baby Step 4
          sends surplus into external capital markets — his ceiling is personal net worth and charitable
          giving. Ramsey disciples arrive carrying budget discipline, number literacy, a stewardship instinct,
          and readiness for the next question.
        </p>
      </section>

      {/* ── Seven-Generation Frame ── */}
      <section className="space-y-2">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: ACCENT_INK }}
        >
          The Seven-Generation Frame
        </h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(var(--card-border))" }}>
          <table className="w-full text-sm" data-testid="stomping-path-seven-gen-table">
            <thead>
              <tr
                className="border-b text-xs uppercase tracking-wider"
                style={{ borderColor: "hsl(var(--card-border))", backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                <th className="py-2 px-4 text-left font-semibold w-1/3">Generation</th>
                <th className="py-2 px-4 text-left font-semibold">The real question</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "hsl(var(--card-border))" }}>
              {[
                { gen: "0 — Now", q: "Is the ground I'm standing on stable enough to build from? Fix the leak first." },
                { gen: "1 — Your children", q: "What capacity, skill, and ownership am I handing them — not just money?" },
                { gen: "2–3 — Grandchildren", q: "What institutions, land, and relationships outlast me?" },
                { gen: "4–7 — The long arc", q: "What principles are embedded deeply enough to run without me?" },
              ].map(({ gen, q }) => (
                <tr key={gen} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-4 font-semibold" style={{ color: ACCENT_INK }}>{gen}</td>
                  <td className="py-2 px-4 text-muted-foreground">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Generation 0 has one job: stabilize the ground. The Haudenosaunee Great Law of Peace names the test:
          a decision is not finished until its consequence for the seventh generation has been named — roughly
          175 years.
        </p>
      </section>

      {/* ── Agent Notes ── */}
      <section
        className="rounded-xl border p-4 space-y-3"
        style={{ borderColor: "hsl(var(--card-border))", backgroundColor: ACCENT_WARM_SOFT }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_WARM }}>
          Agent Notes
        </p>
        <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5" style={{ color: ACCENT_INK }}>
          <li>
            <strong>Never condescend to Stage 1 or Stage 2.</strong> The diagnosis was right.
            Acknowledge the extraction plainly before naming the next rung.
          </li>
          <li>
            <strong>Name the gap explicitly.</strong> Paul stops at the household. Ramsey stops at
            the household. This is the honest name of the next rung their frameworks were never
            designed to reach.
          </li>
          <li>
            <strong>Hold the Generation 0 line.</strong> Fix the immediate before building forward.
            Stabilize the ground before planting the orchard.
          </li>
          <li>
            <strong>Use the bridge language.</strong> The bridge is not a sales pitch. It is the
            honest name of the gap.
          </li>
        </ul>
        <p className="text-xs italic pt-1" style={{ color: ACCENT_WARM }}>
          This trail is real. The people on it did real work to get here. Meet them where they are.
        </p>
      </section>

      <div className="pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-back-workspace"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Link>
      </div>
    </div>
  );
}
