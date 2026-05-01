import portrait from "@assets/IMG_7710_1777635285170.jpeg";

export function BioPage() {
  return (
    <main className="bio-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[64rem] px-6 sm:px-8 py-6 print:py-0 print:px-0 print:max-w-none">
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
                food systems. Recreation degree, years on the ground in
                northern communities, and the founder and operator of
                Parr&rsquo;s Jars — a small preserves business out of the
                bush near Dryden that keeps her hands in the actual work
                the operating plans are about.
              </p>
              <p>
                She is the practitioner behind Headwaters and the codetry
                practice: the author of the Practitioner Operating Plan,
                the Codetry Handbook, and the Deer Lake Store operating
                plan the contractor is reading right now. The work is
                shipped, not proposed — a constellation of running
                artifacts the chief, the contractor, and the council can
                open and read for themselves.
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
                  label="Full-time Deer Lake project"
                  amount="$80.00 / hour"
                  note="Ongoing engagement, hourly"
                  testId="rate-fulltime"
                />
                <RateRow
                  label="Travel premium"
                  amount="$150.00 / day"
                  note="On days worked at Deer Lake"
                  testId="rate-travel"
                />
                <RateRow
                  label="Expenses"
                  amount="Reimbursed at cost"
                  note="Reasonable travel to/from Deer Lake, lodging, meals"
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

          <footer className="mt-5 print:mt-4 flex items-center justify-between gap-4">
            <p className="signoff">— bobbie parr · headwaters</p>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {new Date().toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
              })}
            </p>
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
