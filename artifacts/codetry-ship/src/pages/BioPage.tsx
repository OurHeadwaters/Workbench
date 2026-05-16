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
                className="block w-full object-cover"
                style={{ aspectRatio: "3 / 4", objectPosition: "center 82%" }}
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

          <div className="space-y-3 font-serif text-[14.5px] leading-[1.5]" data-testid="bio-body">
              <p>
                Bobbie Parr holds a community development degree and has spent years on the ground in
                northern Ontario communities — not as an outside advisor, but as someone who lives and
                works in the territory the plans are about. She is the founder and operator of
                Parr&rsquo;s Jars, a small preserves business out of the bush near Dryden, which
                keeps her hands in the actual work: supply chains, seasonal realities, the economics
                of a small food operation in the north.
              </p>
              <p>
                That combination — community development training, years of practical engagement, and
                a running business of her own — is what shaped the Headwaters practice. When she
                couldn&rsquo;t find the right tools for building food systems in northern
                communities, she built them. When the existing language didn&rsquo;t fit, she wrote
                the vocabulary from scratch.
              </p>
              <p>
                <strong>Headwaters is the practice</strong> — food systems planning and community
                economic development for northern organisations. <strong>Codetry is the
                discipline it runs on</strong> — the method of building, naming, and handing over
                systems that a community owns outright, without a consultant in the room to keep them
                running.
              </p>
              <p>
                The work is shipped, not proposed — a constellation of running tools anyone can open
                and read for themselves. The voice across all of it is plain, dollar-honest, no
                startup-pitch tone.
              </p>
            </div>

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
                href={`${import.meta.env.BASE_URL}work`}
                label="Case studies — Parr's Jars + 807 Food Co-op"
                testId="work-case-studies-bio"
              />
              <WorkLink
                href="/print-marketing/capability-statement"
                label="Capability statement"
                testId="work-capability-statement"
              />
              <WorkLink
                href="/codetry-handbook/"
                label="Codetry Handbook"
                testId="work-codetry-handbook"
              />
              <WorkLink
                href="/practitioners-guide-v2/community-store/walkthrough"
                label="Community store walkthrough"
                testId="work-community-store-walkthrough"
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
                href={`${import.meta.env.BASE_URL}infographics/community-store-plan.html`}
                label="Community store plan"
                testId="work-community-store-plan"
                target="_blank"
                swatchColor="#2E7D55"
              />
              <WorkLink
                href={`${import.meta.env.BASE_URL}infographics/coop-membership-platform.html`}
                label="Co-op membership platform"
                testId="work-coop-membership-platform"
                target="_blank"
                swatchColor="#1A7A7A"
              />
              <WorkLink
                href={`${import.meta.env.BASE_URL}infographics/custom-internal-tool.html`}
                label="Custom internal tool"
                testId="work-custom-internal-tool"
                target="_blank"
                swatchColor="#B5711A"
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
              If the work here looks like the problem your organisation is facing, the right
              first move is a short message — what your community is trying to build, and where
              you are in the process. Bobbie will write back directly. No proposal deck,
              no sales call. Fee information is on the services page.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href={`${import.meta.env.BASE_URL}#conversation`}
                className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                data-testid="bio-cta-conversation"
              >
                Reach out — short form →
              </a>
              <a
                href={`${import.meta.env.BASE_URL}services#start`}
                className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="bio-cta-services"
              >
                See fees and how it starts →
              </a>
            </div>

            <p
              className="mt-4 font-mono text-[13px] tracking-tight"
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

interface WorkLinkProps {
  href: string;
  label: string;
  testId: string;
  target?: string;
  swatchColor?: string;
}

function WorkLink({ href, label, testId, target, swatchColor }: WorkLinkProps) {
  const printUrl = buildPrintUrl(href);
  return (
    <li className="flex items-center gap-2">
      {swatchColor && (
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-sm print:hidden"
          style={{ width: 10, height: 10, backgroundColor: swatchColor }}
        />
      )}
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
