import { ZoneTag } from "@/components/ZoneTag";

function FeatureRow({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="py-4 border-b last:border-b-0"
      style={{ borderColor: "hsl(var(--card-border))" }}>
      <p className="font-serif font-semibold text-[16px] text-foreground mb-1">{label}</p>
      <p className="font-serif text-[15px] leading-relaxed text-foreground/75">{description}</p>
    </div>
  );
}

export function BrightSidePage() {
  return (
    <main className="bright-side-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[60rem] px-6 sm:px-10 py-12 sm:py-16">

        <header className="mb-12 sm:mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] m-0"
              style={{ color: "hsl(var(--accent))" }}>
              Bright Side · Residential Care
            </p>
            <ZoneTag zone={0} label="Saltbox" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-foreground mb-5">
            Your staff already knows what a good shift looks like.<br />
            The clipboard doesn't.
          </h1>
          <p className="font-serif text-xl leading-relaxed text-foreground/70">
            Bright Side replaces the clipboard, the shared Excel file, and the sticky notes on the nursing station. It's a mobile-first staff tool for residential care — built so an untrained person can pick it up mid-shift and not break anything.
          </p>
        </header>

        <section className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-sm overflow-hidden border"
            style={{ borderColor: "hsl(var(--card-border))" }}>
            {[
              { label: "No charting, no PHI", description: "Staff share shift notes and resident moments — not health records. No compliance risk, no IT sign-off required to start." },
              { label: "Untrained staff, first shift", description: "High turnover is the reality. The app is designed so a new RT or PSW can use it on day one without a tutorial." },
              { label: "Works on any phone", description: "No hardware purchase. Staff use their own devices. No app store download required — it runs in the browser." },
            ].map(({ label, description }) => (
              <div key={label} className="bg-card p-5 sm:p-6">
                <p className="font-serif font-semibold text-[16px] text-foreground mb-2">{label}</p>
                <p className="font-serif text-[14px] leading-relaxed text-foreground/70">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "hsl(var(--accent))" }}>
              What it replaces
            </p>
            <div>
              <FeatureRow
                label="The unit roster on paper"
                description="Each unit is a swipeable digital roster — bed by bed, with room for attendance, notes, and transitions. Looks like a clipboard. Works like a database."
              />
              <FeatureRow
                label="The whiteboard at the nursing station"
                description="Staff post shift notes directly from their phone. Notes belong to the floor, not a manager's inbox. No approval step, no bottleneck."
              />
              <FeatureRow
                label="The Excel activity calendar"
                description="Events, transitions, and activity schedules live in one place. Templates carry the standard checklist so nothing gets forgotten when the regular coordinator is off."
              />
              <FeatureRow
                label="The lobby TV slideshow"
                description="A live resident highlights wall on the lobby display — powered by the same data the floor staff enter during their shift. No one has to update it separately."
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "hsl(var(--accent))" }}>
              What it protects
            </p>
            <div>
              <FeatureRow
                label="Resident dignity"
                description="Full names and photos only appear in lit rooms — the resident's own profile and the lobby display. Everywhere else, staff work with room numbers and coded IDs."
              />
              <FeatureRow
                label="The paper trail"
                description="Transitions — walks, redirects, outings — are logged with timestamps. A redirect that happened three times in one walk shows three counts, not one. The record is the reality."
              />
              <FeatureRow
                label="Director control"
                description="One settings surface for the person running the floor: which residents are visible to whom, what the default checklists say, who has access to what. Not buried in an IT ticket."
              />
              <FeatureRow
                label="Existing workflow"
                description="Bright Side doesn't ask staff to change how they work. It asks them to record what they're already doing — in the language they already use."
              />
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-sm border p-6 sm:p-8"
          style={{ borderColor: "hsl(var(--card-border))" }}>
          <div className="max-w-xl">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "hsl(var(--accent))" }}>
              For your home
            </p>
            <p className="font-serif text-xl font-semibold text-foreground mb-3">
              Designed to grow to your size.
            </p>
            <p className="font-serif text-[16px] leading-relaxed text-foreground/75 mb-4">
              The unit roster handles any number of beds — organized by unit, ward, or wing. A 96-bed home runs as a set of units side by side, each with its own swipeable roster. Staff only see their unit; the director sees the floor.
            </p>
            <p className="font-serif text-[16px] leading-relaxed text-foreground/75">
              It starts as a single-facility tool. No head office, no corporate subscription, no vendor lock-in. Your home controls the data. If you stop using it, you leave with a clean export.
            </p>
          </div>
        </section>

        <section className="border-t pt-10"
          style={{ borderColor: "hsl(var(--card-border))" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight mb-3">
                Let's walk through it.
              </h2>
              <p className="font-serif text-[16px] leading-relaxed text-foreground/70 mb-4">
                I built this because I've watched care home staff work around tools that weren't made for them. A 30-minute call is enough to show you what it does and whether it fits your floor.
              </p>
              <p className="font-serif text-[16px] leading-relaxed text-foreground/70">
                No demo environment, no slide deck — I'll walk you through the actual tool on an actual device.
              </p>
            </div>
            <div className="sm:pt-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-2">
                Contact
              </p>
              <p className="font-serif font-bold text-lg mb-0.5">Bobbie Parr</p>
              <p className="font-serif text-foreground/70 text-[14px] mb-2">Headwaters · Dryden, Ontario</p>
              <a
                href="mailto:bobbie@ourheadwaters.ca?subject=Bright Side — interested in a walkthrough"
                className="font-mono text-[13px] underline underline-offset-4 decoration-dotted"
                style={{ color: "hsl(var(--primary))" }}
              >
                bobbie@ourheadwaters.ca
              </a>
              <p className="font-serif text-[13px] text-foreground/50 mt-3 italic">
                No obligation. If it's not the right fit, I'll say so.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t flex items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}>
          <p className="signoff">— bobbie parr · headwaters</p>
          <a
            href={import.meta.env.BASE_URL}
            className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-70 transition-opacity"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="bright-side-home-link"
          >
            ← headwaters home
          </a>
        </footer>

      </div>
    </main>
  );
}
