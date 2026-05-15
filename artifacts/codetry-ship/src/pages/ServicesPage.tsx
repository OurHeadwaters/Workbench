export function ServicesPage() {
  return (
    <main className="services-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
      >
        {/* decorative circle */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "hsl(38 36% 94%)" }}
        />
        <div className="relative mx-auto max-w-[52rem]">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4 opacity-70"
          >
            headwaters · what the work looks like
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-3">
            Seven simple tools.<br />
            Three ways to engage.
          </h1>
          <p className="font-serif text-lg italic mb-6 opacity-75">
            One community economy system — delivered as a store plan, a membership platform, or a custom tool.
          </p>
          <div
            className="rounded-md p-5 max-w-2xl font-serif text-[15px] leading-[1.6]"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            Headwaters is a set of seven connected tools — the Handbook, the Practitioner's Guide, the Books, and four supporting layers. Every engagement deploys some part of that stack. A community store plan, a co-op membership platform, and a custom internal tool are the three ways a community reaches into that system. Here is what each looks like, phase by phase, and what you leave with at the end.
          </div>
        </div>
      </section>

      {/* ── jump links ── */}
      <nav
        className="border-b sticky top-0 z-10 bg-background"
        style={{ borderColor: "hsl(var(--card-border))" }}
        aria-label="Page sections"
      >
        <div className="mx-auto max-w-[52rem] px-6 sm:px-8 flex gap-0 overflow-x-auto">
          {[
            { href: "#store", label: "Community store" },
            { href: "#platform", label: "Co-op platform" },
            { href: "#custom", label: "Custom tool" },
            { href: "#start", label: "How it starts" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-3.5 whitespace-nowrap border-b-2 border-transparent hover:border-accent transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8">

        {/* ── who this is for ── */}
        <section className="pt-10 pb-2">
          <div
            className="rounded-md border px-6 py-5"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-2" style={{ color: "hsl(var(--accent))" }}>
              who this is for
            </p>
            <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
              Headwaters works with band councils and community organizations in Northwestern Ontario that are planning or running a community-owned store, a food co-op, or a purpose-built internal tool. If your organization is in the early stages of asking "how would we even start?" — that is the right moment to reach out.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 1 — COMMUNITY STORE PLAN
        ══════════════════════════════════════ */}
        <section id="store" className="pt-14 pb-10">
          <SectionBand color="hsl(30 55% 38%)" label="Community economic development">
            Building the store — start to handoff
          </SectionBand>
          <p className="font-serif text-[15px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Six phases. Plain language. Open numbers.
          </p>

          <SubHeading>The phases</SubHeading>
          <Timeline items={[
            {
              num: "01",
              title: "Discovery",
              duration: "2–3 weeks",
              body: "Community interviews, existing assets audit, site assessment. What the band already has and what is missing.",
            },
            {
              num: "02",
              title: "Supply chain mapping",
              duration: "2–3 weeks",
              body: "807 supplier directory built from scratch. Freight routing, seasonal availability windows, minimum order realities. No assumptions about what comes from the south.",
            },
            {
              num: "03",
              title: "Staffing and training plan",
              duration: "2 weeks",
              body: "Local hire plan, role definitions written in plain language, 30-day training timeline. Built so operators can run it without a consultant in the room.",
            },
            {
              num: "04",
              title: "Financing structure",
              duration: "3–4 weeks",
              body: "Band council financing options, grant matching against the 807 grants index, co-op structure options with open financial model. Every number is visible and editable.",
            },
            {
              num: "05",
              title: "Operations manual",
              duration: "3–4 weeks",
              body: "Day-one procedures, daily close, weekly inventory cycle, monthly reconciliation. Written for the person doing the job, not for the person who hired the consultant.",
            },
            {
              num: "06",
              title: "Handoff",
              duration: "1–2 weeks",
              body: "Band council presentation. Operator walkthrough. Everything handed off in a format the community owns — no login required, no ongoing relationship required.",
            },
          ]} accentColor="hsl(30 55% 38%)" />

          <SubHeading className="mt-10">What you leave with</SubHeading>
          <DeliverableGrid items={[
            { icon: "📄", title: "Store plan document", desc: "Print-ready, plain language — no consultant jargon" },
            { icon: "📦", title: "807 supplier directory", desc: "Real contacts, freight details, seasonal notes" },
            { icon: "👷", title: "Job descriptions + 30-day training guide", desc: "Written for the operator, not HR" },
            { icon: "📊", title: "Financial model", desc: "Open spreadsheet — yours to edit, no software required" },
            { icon: "✅", title: "Day-one operations checklist", desc: "Everything to open the door on day one" },
            { icon: "🏛", title: "Band council presentation", desc: "Plain numbers, plain language — ready to present" },
          ]} />

          <WhatItIsNot items={[
            "A report that sits on a shelf",
            "A proposal that needs another proposal to proceed",
            "A template from a southern consulting firm",
            "Contingent on ongoing retainer to keep working",
          ]} />
        </section>

        <Divider />

        {/* ══════════════════════════════════════
            SECTION 2 — CO-OP MEMBERSHIP PLATFORM
        ══════════════════════════════════════ */}
        <section id="platform" className="pt-14 pb-10">
          <SectionBand color="hsl(145 36% 22%)" label="Governance + digital infrastructure">
            From paper bylaws to a working member platform
          </SectionBand>
          <p className="font-serif text-[15px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Built around your governance structure — not a template you shoehorn bylaws into.
          </p>

          <SubHeading>The phases</SubHeading>
          <Timeline items={[
            {
              num: "01",
              title: "Governance review",
              duration: "1–2 weeks",
              body: "Read your bylaws, map your member categories, identify what needs to be digital and what should stay paper. The platform follows governance — not the other way around.",
            },
            {
              num: "02",
              title: "Platform spec",
              duration: "1 week",
              body: "A plain-language document describing exactly what will be built, what will not, and what success looks like. Signed off before anything gets coded.",
            },
            {
              num: "03",
              title: "Build",
              duration: "4–6 weeks",
              body: "Member portal, producer onboarding flow, board admin panel, AGM tools. Built in the open — you can see it working at every stage.",
            },
            {
              num: "04",
              title: "Test with real members",
              duration: "2 weeks",
              body: "Real members, real scenarios, real problems caught before launch. Not a QA checklist — actual people doing actual tasks.",
            },
            {
              num: "05",
              title: "Launch and onboard",
              duration: "1–2 weeks",
              body: "Admin training. First member cohort. First AGM cycle run through the platform. Done when the team can run it without help.",
            },
          ]} accentColor="hsl(145 36% 22%)" />

          <SubHeading className="mt-10">What you leave with</SubHeading>
          <DeliverableGrid items={[
            { icon: "🌐", title: "Working platform", desc: "Yours — not licensed software with a monthly fee" },
            { icon: "🏠", title: "Member portal", desc: "Household and producer views, role-based access" },
            { icon: "🌱", title: "Producer onboarding", desc: "Application → listing, no email back-and-forth" },
            { icon: "🏛", title: "Board admin panel", desc: "AGM, meeting minutes, cashflow — roles for Chair, Secretary, Treasurer" },
            { icon: "📋", title: "Bylaws integrated", desc: "Governance rules wired into the platform flow" },
            { icon: "📝", title: "Admin documentation", desc: "Plain language — written for your staff, not developers" },
          ]} />

          <WhatItIsNot items={[
            "A SaaS product you subscribe to",
            "A template built for a southern co-op",
            "Dependent on the developer to make changes",
            "Governed by someone else's roadmap",
          ]} />
        </section>

        <Divider />

        {/* ══════════════════════════════════════
            SECTION 3 — CUSTOM INTERNAL TOOL
        ══════════════════════════════════════ */}
        <section id="custom" className="pt-14 pb-10">
          <SectionBand color="hsl(145 18% 32%)" label="Operations · Built for your team">
            A tool your team actually uses — not another thing to learn
          </SectionBand>
          <p className="font-serif text-[15px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Built around how your operation actually works. Changed when your operation changes.
          </p>

          <SubHeading>The phases</SubHeading>
          <Timeline items={[
            {
              num: "01",
              title: "Operations audit",
              duration: "1–2 weeks",
              body: "Map what is on paper, what is in your head, and what falls through the cracks. The goal is a clear picture of what a tool would actually fix — not a wishlist.",
            },
            {
              num: "02",
              title: "Spec in plain language",
              duration: "1 week",
              body: "A one-page document: what the tool does, what it does not, how success is measured. Signed off before a line of code is written.",
            },
            {
              num: "03",
              title: "Build and test",
              duration: "3–6 weeks",
              body: "Built in front of you. Your team tests it while it is being built — not after. Faster to fix things that are wrong before they get layered under more code.",
            },
            {
              num: "04",
              title: "Train",
              duration: "1 week",
              body: "Your team, at your pace. No jargon. No assumptions about tech comfort. If one person on the team cannot use it, it is not done.",
            },
            {
              num: "05",
              title: "Iterate",
              duration: "Ongoing",
              body: "Small changes, fast turnaround. No support ticket queue, no software-update waiting. The tool adapts as your operation adapts.",
            },
          ]} accentColor="hsl(145 18% 32%)" />

          <SubHeading className="mt-10">What you leave with</SubHeading>
          <DeliverableGrid items={[
            { icon: "🔧", title: "Custom-built tool", desc: "Fits your workflow — not the other way around" },
            { icon: "📖", title: "Documentation for your team", desc: "Written for the person doing the job, not a developer" },
            { icon: "💾", title: "Source code", desc: "Yours to keep — no lock-in, no vendor dependency" },
            { icon: "🔄", title: "No licensing fees", desc: "You own it outright after handoff" },
            { icon: "📞", title: "Ongoing iteration", desc: "Small changes fast — no contract needed" },
            { icon: "🎯", title: "Measurable outcome", desc: "Defined at the start: you know when it is working" },
          ]} />

          <WhatItIsNot items={[
            "Off-the-shelf software with a monthly fee",
            "A prototype that never ships",
            "Built for a generic use case, customized later",
            "Dependent on a retainer to stay functional",
          ]} />
        </section>

        <Divider />

        {/* ══════════════════════════════════════
            SECTION 4 — HOW A PROJECT STARTS
        ══════════════════════════════════════ */}
        <section id="start" className="pt-14 pb-16">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            the first step
          </p>
          <h2 className="font-serif text-3xl tracking-tight mb-1">
            A trial period, not a contract
          </h2>
          <p className="font-serif text-[15px] italic mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Every engagement starts with a defined phase — a fixed fee, a clear scope, and a real deliverable. No retainer, no open-ended commitment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10">
            {[
              { step: "1", label: "Send a message", body: "Tell us what your community is trying to build. A sentence or two is enough." },
              { step: "2", label: "Phase 1", body: "6–8 weeks, fixed fee, bounded scope. You get something real at the end whether or not it continues." },
              { step: "3", label: "Decision point", body: "If the fit is right, the next phase begins. If not, you leave with something useful and no obligation." },
              { step: "4", label: "Continue", body: "Each phase has its own scope, fee, and deliverables. Renewed only if the work calls for it." },
            ].map(({ step, label, body }) => (
              <div
                key={step}
                className="rounded-md border bg-card p-5"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <div
                  className="font-mono text-[11px] font-semibold mb-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  {step}
                </div>
                <p className="font-serif text-[15px] font-medium tracking-tight mb-1.5">{label}</p>
                <p className="font-serif text-[13.5px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-md border p-6 sm:p-8"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "hsl(var(--accent))" }}>
              phase fees
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Phase 1", value: "$28,000", note: "6–8 weeks. Fixed fee, defined scope, real deliverable. Shorter engagement = reduced invoice." },
                { label: "Phase 2+", value: "Scoped per phase", note: "Each subsequent phase is priced to its scope before work begins." },
                { label: "Travel & expenses", value: "At cost", note: "Travel to site and expenses reimbursed at cost with receipts." },
              ].map(({ label, value, note }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
                  <p className="font-serif text-2xl font-medium tracking-tight mb-1">{value}</p>
                  <p className="font-serif text-[13px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{note}</p>
                </div>
              ))}
            </div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.14em] mt-5"
              style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}
            >
              All fees CAD · excludes HST
            </p>
            <p className="font-serif text-[12px] italic leading-[1.6] mt-3" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.75 }}>
              Headwaters brings in specialist subcontractors by project need. The phase fee funds that full delivery system — you get the right person for each phase without carrying the overhead of assembling a team yourself.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}`}
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              Start a conversation →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Read the bio
            </a>
            <a
              href="/print-marketing/capability-statement"
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Capability statement →
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ── sub-components ── */

function SectionBand({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-md px-5 py-4 relative overflow-hidden"
      style={{ background: color, color: "hsl(38 36% 96%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
        style={{ background: "hsl(38 36% 94%)" }}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-1.5 opacity-70">{label}</p>
      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">{children}</h2>
    </div>
  );
}

function SubHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.26em] mb-4 ${className}`}
      style={{ color: "hsl(var(--accent))" }}
    >
      {children}
    </p>
  );
}

function Timeline({ items, accentColor }: {
  items: { num: string; title: string; duration: string; body: string }[];
  accentColor: string;
}) {
  return (
    <div className="relative pl-8 space-y-0">
      {/* vertical line */}
      <div
        className="absolute left-[11px] top-3 bottom-3 w-px"
        style={{ background: accentColor, opacity: 0.25 }}
      />
      {items.map(({ num, title, duration, body }, i) => (
        <div key={num} className="relative pb-8 last:pb-0">
          {/* dot */}
          <div
            className="absolute -left-8 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <span className="font-mono text-[8px] font-bold" style={{ color: "hsl(38 36% 96%)" }}>
              {i + 1}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-1.5">
            <p className="font-serif text-[16px] font-medium tracking-tight">{title}</p>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.18em] shrink-0"
              style={{ color: accentColor }}
            >
              {duration}
            </span>
          </div>
          <p
            className="font-serif text-[14px] leading-[1.55]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {body}
          </p>
        </div>
      ))}
    </div>
  );
}

function DeliverableGrid({ items }: {
  items: { icon: string; title: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="rounded-md border bg-card p-4 flex gap-3.5 items-start"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <span className="text-[20px] leading-none mt-0.5 shrink-0">{icon}</span>
          <div>
            <p className="font-serif text-[14.5px] font-medium tracking-tight mb-0.5">{title}</p>
            <p className="font-serif text-[13px] leading-[1.45]" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WhatItIsNot({ items }: { items: string[] }) {
  return (
    <div
      className="mt-6 rounded-md border px-5 py-4"
      style={{ borderColor: "hsl(var(--card-border))", borderStyle: "dashed" }}
    >
      <p
        className="font-mono text-[9.5px] uppercase tracking-[0.22em] mb-3"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        What this is not
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="font-mono text-[11px] mt-[2px] shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>✕</span>
            <span className="font-serif text-[13.5px]" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Divider() {
  return (
    <hr
      className="my-2"
      style={{ borderColor: "hsl(var(--card-border))" }}
    />
  );
}
