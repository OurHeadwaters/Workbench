import { Download } from "lucide-react";

function handleDownloadPdf() {
  if (typeof window === "undefined") return;
  const previousTitle = document.title;
  document.title = "headwaters-statement-of-work";
  try {
    window.print();
  } finally {
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 0);
  }
}

function SowRow({
  item,
  description,
}: {
  item: string;
  description: string;
}) {
  return (
    <div className="sow-row grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 py-3 border-b last:border-b-0"
      style={{ borderColor: "hsl(var(--card-border))" }}>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] pt-0.5"
        style={{ color: "hsl(var(--accent))" }}>
        {item}
      </span>
      <span className="font-serif text-[15px] leading-relaxed text-foreground/90">
        {description}
      </span>
    </div>
  );
}

export function SowPage() {
  return (
    <main className="sow-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[64rem] px-6 sm:px-8 py-6 print:py-0 print:px-0 print:max-w-none">

        <div className="sow-download-row mb-3 flex justify-end print:hidden">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors"
            style={{
              borderColor: "hsl(var(--accent))",
              color: "hsl(var(--accent))",
              background: "transparent",
            }}
            aria-label="Download statement of work as PDF"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </button>
        </div>

        <article
          className="sow-card rounded-md border bg-card p-6 sm:p-8 print:p-0 print:border-0 print:rounded-none print:bg-white"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <header className="mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2"
              style={{ color: "hsl(var(--accent))" }}>
              Statement of Work
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Bobbie Parr — Hourly Engagement
            </h1>
            <p className="font-serif text-lg text-foreground/70 mt-1 italic">
              Community Development &amp; Digital Planning
            </p>

            <hr className="rule mt-5 mb-5 border-0 h-px"
              style={{ backgroundColor: "hsl(var(--card-border))" }} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-0.5">Effective</p>
                <p className="font-serif text-foreground">May 2026</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-0.5">Rate</p>
                <p className="font-serif text-foreground">$80.00 / hr</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-0.5">Billing</p>
                <p className="font-serif text-foreground">Every two weeks</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-0.5">Currency</p>
                <p className="font-serif text-foreground">CAD · excl. HST</p>
              </div>
            </div>
          </header>

          <section className="mb-6">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="font-serif text-xl tracking-tight font-semibold">
                Scope of services
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--accent))" }}>
                as needed · no minimum hours
              </p>
            </div>
            <div>
              <SowRow
                item="Operational planning"
                description="Ongoing community development planning — updating, maintaining, and extending the store plan and related documents as conditions change."
              />
              <SowRow
                item="App maintenance"
                description="Updates and improvements to the community store digital walkthrough, planner, and cockpit tools built during the CDP project."
              />
              <SowRow
                item="Grant writing"
                description="Research, drafting, and submission support for funding applications related to the store, food hub, or community economic development."
              />
              <SowRow
                item="Website design"
                description="Design and development of web pages, community-facing tools, or information resources as priorities emerge."
              />
              <SowRow
                item="Policy &amp; procedure"
                description="Writing operational policies, staff procedures, or governance documents for the store or co-op structure."
              />
              <SowRow
                item="Research"
                description="Northern food systems research, supplier sourcing, market analysis, or peer-community case studies as needed to inform decisions."
              />
            </div>
          </section>

          <hr className="rule mb-5 border-0 h-px"
            style={{ backgroundColor: "hsl(var(--card-border))" }} />

          <section className="mb-6">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="font-serif text-xl tracking-tight font-semibold">
                Engagement terms
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--accent))" }}>
                simple · no retainer required
              </p>
            </div>
            <div className="space-y-3 font-serif text-[15px] leading-relaxed text-foreground/85">
              <p>
                Work begins on a task-by-task basis at the hourly rate above. No minimum hour commitment is required to start. Hours are logged and billed every two weeks with a plain-language summary of work completed.
              </p>
              <p>
                Travel to site is billed at an additional <strong>$150.00 per travel day</strong>. Expenses (fuel, accommodation, meals) are reimbursed at cost with receipts.
              </p>
              <p>
                Either party may pause or end the engagement with two weeks' written notice. All work product and digital assets produced remain the property of the community.
              </p>
            </div>
          </section>

          <hr className="rule mb-5 border-0 h-px"
            style={{ backgroundColor: "hsl(var(--card-border))" }} />

          <section className="mb-6">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h2 className="font-serif text-xl tracking-tight font-semibold">
                How to start
              </h2>
            </div>
            <div className="space-y-3 font-serif text-[15px] leading-relaxed text-foreground/85">
              <p>
                Reply to this document with the first task or question you'd like work started on. That's the start date. No contract ceremony required — a written reply counts as authorization to begin.
              </p>
              <p>
                If you'd prefer a trial period first: the first 10 hours are billed at the standard rate of $150.00/hr (matching the trial rate on my public rate card). If you want to continue after that, the rate drops to $80.00/hr for the full engagement.
              </p>
            </div>

            <div className="mt-5 p-4 rounded-sm border font-serif text-[14px] italic text-foreground/70"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted) / 0.4)" }}>
              The work that's already built — the store walkthrough, the planner, the cockpit, the food systems research library — stays live and accessible at no additional cost during this engagement.
            </div>
          </section>

          <hr className="rule mb-5 border-0 h-px"
            style={{ backgroundColor: "hsl(var(--card-border))" }} />

          <footer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-2">
                Prepared by
              </p>
              <p className="font-serif font-bold text-lg">Bobbie Parr</p>
              <p className="font-serif text-foreground/70 text-[14px]">Headwaters</p>
              <a
                href="mailto:bobbie@ourheadwaters.ca"
                className="font-mono text-[12px] mt-1 block"
                style={{ color: "hsl(var(--primary))" }}
              >
                bobbie@ourheadwaters.ca
              </a>
              <a
                href={import.meta.env.BASE_URL}
                className="print:hidden font-mono text-[10px] uppercase tracking-[0.18em] mt-3 block hover:opacity-70 transition-opacity"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="sow-home-link"
              >
                ← headwaters home
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-2">
                Authorized by
              </p>
              <div className="border-b mt-8 mb-1"
                style={{ borderColor: "hsl(var(--card-border))" }} />
              <p className="font-serif text-[13px] text-foreground/50">
                Name, Title · Community · Date
              </p>
            </div>
          </footer>

        </article>
      </div>
    </main>
  );
}
