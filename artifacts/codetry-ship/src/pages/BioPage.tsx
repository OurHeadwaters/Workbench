import { Download } from "lucide-react";
import portrait from "@assets/IMG_7710_1777635285170.jpeg";

function handleDownloadPdf() {
  if (typeof window === "undefined") return;
  const previousTitle = document.title;
  document.title = "bobbie-parr-bio";
  try {
    window.print();
  } finally {
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 0);
  }
}

export function BioPage() {
  return (
    <main className="bio-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[64rem] px-6 sm:px-8 py-6 print:py-0 print:px-0 print:max-w-none">
        <div
          className="bio-download-row mb-3 flex justify-end print:hidden"
          data-testid="bio-download-row"
        >
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="bio-download-button inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors"
            style={{
              borderColor: "hsl(var(--accent))",
              color: "hsl(var(--accent))",
              background: "transparent",
            }}
            aria-label="Download Bobbie Parr's bio as a PDF"
            data-testid="bio-download-pdf"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </button>
        </div>
        <article
          className="bio-card rounded-md border bg-card p-6 sm:p-8 print:p-0 print:border-0 print:rounded-none print:bg-white"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="bio-card"
        >
          <header className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-5 sm:gap-6 items-start">
            <div
              className="overflow-hidden rounded-sm border print:border-0"
              style={{ borderColor: "hsl(var(--card-border))" }}
            >
              <img
                src={portrait}
                alt="Bobbie Parr, holding a Parr's Jars crate of preserves and produce"
                className="block w-full h-auto object-cover"
                style={{ aspectRatio: "3 / 4" }}
                data-testid="bio-portrait"
              />
            </div>

            <div className="space-y-2">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
                data-testid="bio-eyebrow"
              >
                practitioner · headwaters
              </p>
              <h1
                className="font-serif text-3xl sm:text-[34px] leading-[1.02] tracking-tight"
                data-testid="bio-name"
              >
                Bobbie Parr
              </h1>
              <p
                className="font-serif text-base leading-snug"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="bio-tagline"
              >
                Practitioner, Headwaters · Northwestern Ontario · Founder, Parr&rsquo;s Jars
              </p>
            </div>
          </header>

          <hr
            className="rule my-5 print:my-4"
            style={{ borderColor: "hsl(var(--card-border))" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-6 sm:gap-8 print:gap-6 items-start">
            <section
              className="space-y-3 font-serif text-[14.5px] leading-[1.5]"
              data-testid="bio-body"
            >
              <p>
                Bobbie is a Northwestern Ontario practitioner working in
                food systems. Community development degree, years on the ground in
                northern communities, and the founder and operator of
                Parr&rsquo;s Jars — a small preserves business out of the
                bush near Dryden that keeps her hands in the actual work
                the operating plans are about.
              </p>
              <p>
                She is the practitioner behind Headwaters and the codetry
                practice: the author of the Practitioner Operating Plan,
                the Codetry Handbook, and the community store operating
                plan. The work is shipped, not proposed — a constellation
                of running artifacts anyone can open and read for
                themselves.
              </p>
              <p>
                She works as a single practitioner, by design. The shape
                of the business is the constellation: one person, a
                handful of tightly-named artifacts, and the discipline of
                building the boat in the open. The voice is the same
                across all of it — plain, dollar-honest, no startup-pitch
                tone.
              </p>
            </section>

            <section
              className="rate-card rounded-md border-2 p-5 print:p-4"
              style={{ borderColor: "hsl(var(--accent))" }}
              data-testid="bio-rate-card"
            >
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2
                  className="font-serif text-xl tracking-tight"
                  data-testid="rate-card-title"
                >
                  Rate card
                </h2>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  engagement terms
                </p>
              </div>

              <ul
                className="divide-y"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <RateRow
                  label="Trial period"
                  amount="$150.00 / hour"
                  note="Project-based invoicing"
                  testId="rate-trial"
                />
                <RateRow
                  label="Full-time engagement"
                  amount="$80.00 / hour"
                  note="Ongoing engagement, hourly"
                  testId="rate-fulltime"
                />
                <RateRow
                  label="Travel premium"
                  amount="$150.00 / day"
                  note="On days worked on-site"
                  testId="rate-travel"
                />
                <RateRow
                  label="Expenses"
                  amount="Reimbursed at cost"
                  note="Reasonable travel to/from site, lodging, meals"
                  testId="rate-expenses"
                />
              </ul>

              <p
                className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="rate-footnote"
              >
                All hourly rates CAD · excludes HST
              </p>
            </section>
          </div>

          <hr
            className="rule my-5 print:my-4"
            style={{ borderColor: "hsl(var(--card-border))" }}
          />

          <section className="bio-skills" data-testid="bio-skills">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2
                className="font-serif text-xl tracking-tight"
                data-testid="skills-title"
              >
                Marketable skills
              </h2>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                areas of practice
              </p>
            </div>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 print:gap-y-1 font-serif text-[14.5px] leading-[1.45]"
              data-testid="skills-list"
            >
              <SkillPair
                first="Website design"
                second="Operational planning"
                testId="skill-web-ops"
              />
              <SkillPair
                first="App development"
                second="Privacy hardware and devices"
                testId="skill-app-privacy"
              />
              <SkillPair
                first="Economic development (grassroots)"
                second="grant writing"
                testId="skill-econ-grants"
              />
              <SkillItem
                label="Policy and procedure manuals"
                testId="skill-policy"
              />
              <SkillItem label="Team handbooks" testId="skill-handbooks" />
              <SkillItem label="Ghost writing" testId="skill-ghost" />
            </ul>
          </section>

          <hr
            className="rule my-5 print:my-4"
            style={{ borderColor: "hsl(var(--card-border))" }}
          />

          <section className="bio-work" data-testid="bio-work">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2
                className="font-serif text-xl tracking-tight"
                data-testid="work-title"
              >
                Selected work
              </h2>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                shipped artifacts
              </p>
            </div>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 print:gap-y-1 font-serif text-[14.5px] leading-[1.45]"
              data-testid="work-list"
            >
              <WorkLink
                href="/codetry-handbook/"
                label="Codetry Handbook"
                testId="work-codetry-handbook"
              />
              <WorkLink
                href="/deer-lake-walkthrough/"
                label="Community store walkthrough"
                testId="work-deer-lake-walkthrough"
              />
              <WorkLink
                href="/library/"
                label="Northern Food Systems Research Library"
                testId="work-library"
              />
              <WorkLink
                href="/headwaters-books/"
                label="Headwaters Books"
                testId="work-headwaters-books"
              />
              <WorkLink
                href={`${import.meta.env.BASE_URL}manifest`}
                label="Crew Manifest"
                testId="work-crew-manifest"
              />
              <WorkLink
                href="/codetry-ship/infographics/community-store-plan.html"
                label="Community store plan"
                testId="work-community-store-plan"
                target="_blank"
              />
              <WorkLink
                href="/codetry-ship/infographics/coop-membership-platform.html"
                label="Co-op membership platform"
                testId="work-coop-membership-platform"
                target="_blank"
              />
              <WorkLink
                href="/codetry-ship/infographics/custom-internal-tool.html"
                label="Custom internal tool"
                testId="work-custom-internal-tool"
                target="_blank"
              />
            </ul>
          </section>

          <hr
            className="rule my-5 print:my-4"
            style={{ borderColor: "hsl(var(--card-border))" }}
          />

          <section className="bio-contact" data-testid="bio-contact">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2
                className="font-serif text-xl tracking-tight"
                data-testid="contact-title"
              >
                How to engage
              </h2>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                contact
              </p>
            </div>

            <p
              className="font-serif text-[14.5px] leading-[1.5]"
              data-testid="contact-blurb"
            >
              Reach out by email to scope a trial period or a community
              engagement. Terms are on the rate card above.
            </p>

            <p
              className="mt-2 font-mono text-[13px] tracking-tight"
              data-testid="contact-email"
            >
              <span
                className="text-[10px] uppercase tracking-[0.22em] mr-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                email
              </span>
              <a
                href="mailto:bobbie@ourheadwaters.ca"
                className="underline underline-offset-2"
                style={{ color: "hsl(var(--primary))" }}
                data-testid="contact-email-link"
              >
                bobbie@ourheadwaters.ca
              </a>
            </p>
          </section>

          <footer className="mt-5 print:mt-4 flex items-center justify-between gap-4">
            <p className="signoff">— bobbie parr · headwaters</p>
            <div className="flex items-center gap-5">
              <a
                href={import.meta.env.BASE_URL}
                className="print:hidden font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-70 transition-opacity"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="bio-home-link"
              >
                ← headwaters home
              </a>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {new Date().toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

interface RateRowProps {
  label: string;
  amount: string;
  note: string;
  testId: string;
}

function RateRow({ label, amount, note, testId }: RateRowProps) {
  return (
    <li
      className="grid grid-cols-[1fr_auto] gap-3 py-2.5 first:pt-0 last:pb-0"
      data-testid={testId}
    >
      <div>
        <p className="font-serif text-[15px] leading-tight">
          {label}
        </p>
        <p
          className="font-sans text-[11px] mt-0.5 leading-tight"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {note}
        </p>
      </div>
      <p
        className="font-mono text-[14px] tracking-tight self-start text-right whitespace-nowrap"
        style={{ color: "hsl(var(--primary))" }}
      >
        {amount}
      </p>
    </li>
  );
}

interface SkillPairProps {
  first: string;
  second: string;
  testId: string;
}

function SkillPair({ first, second, testId }: SkillPairProps) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2" data-testid={testId}>
      <span>{first}</span>
      <span
        className="font-mono text-[13px]"
        style={{ color: "hsl(var(--accent))" }}
      >
        +
      </span>
      <span>{second}</span>
    </li>
  );
}

interface SkillItemProps {
  label: string;
  testId: string;
}

function SkillItem({ label, testId }: SkillItemProps) {
  return <li data-testid={testId}>{label}</li>;
}

interface WorkLinkProps {
  href: string;
  label: string;
  testId: string;
  target?: string;
}

function WorkLink({ href, label, testId, target }: WorkLinkProps) {
  const printUrl = buildPrintUrl(href);
  return (
    <li>
      <a
        href={href}
        className="bio-work-link underline-offset-4 hover:underline"
        data-testid={testId}
        data-print-url={printUrl}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    </li>
  );
}

function buildPrintUrl(href: string): string {
  if (typeof window === "undefined") {
    return href.replace(/^\/+/, "");
  }
  try {
    const absolute = new URL(href, window.location.origin);
    const hostAndPath = `${absolute.host}${absolute.pathname}`;
    return hostAndPath.replace(/^www\./, "");
  } catch {
    return href.replace(/^\/+/, "");
  }
}
