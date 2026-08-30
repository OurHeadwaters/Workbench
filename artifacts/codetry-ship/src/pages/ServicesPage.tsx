export function ServicesPage() {
  return (
    <main className="services-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1f3d2e", color: "#f4ede0" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}odyssey/hempcrete-texture.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.10 }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,22,14,0.4) 100%)" }}
        />
        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-12 pb-14 text-center">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "rgba(212,160,23,0.8)" }}
          >
            headwaters · what the work looks like
          </p>
          <h1
            className="font-serif leading-[1.12] tracking-tight mb-6"
            style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)" }}
          >
            Seven simple tools.<br />
            <span style={{ color: "#b85a3e" }}>Three ways to engage.</span>
          </h1>
          <div
            className="rounded-md mx-auto px-5 py-5 text-left"
            style={{
              background: "rgba(244,237,224,0.07)",
              border: "1px solid rgba(184,90,62,0.55)",
              maxWidth: 480,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            <p
              className="font-serif leading-[1.55] mb-3"
              style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", color: "#f4ede0" }}
            >
              One community economy system — delivered as a store plan, a membership platform, or a custom tool.
            </p>
            <p
              className="font-serif leading-[1.5] text-[13px]"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Headwaters is seven connected tools deployed differently depending on what a community needs to build. Here is what each engagement looks like, phase by phase, and what you leave with at the end.
            </p>
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
            { href: "#the-clearing", label: "The Clearing" },
            { href: "#the-wishing-well", label: "The Wishing Well" },
            { href: "#start", label: "How it starts" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[13px] uppercase tracking-[0.2em] px-4 py-3.5 whitespace-nowrap border-b-2 border-transparent hover:border-accent transition-colors"
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
            <p className="font-mono text-[13px] uppercase tracking-[0.26em] mb-2" style={{ color: "hsl(var(--accent))" }}>
              who this is for
            </p>
            <p className="font-serif text-[16px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
              Headwaters works with community organizations — co-ops, band councils, local economies — that are building something they intend to own and run themselves. The work was built and proven in Northwestern Ontario with First Nations communities and regional food systems.{" "}
              <a
                href={`${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}/codetry`}
                className="underline underline-offset-2 hover:opacity-75 transition-opacity"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Codetry
              </a>
              , the discipline it runs on, replicates: a rural co-op, a fishing village, an Indigenous nation in another country, an off-grid settlement — any decentralized community asking "how would we even start?" is the right community for this conversation.
            </p>
            <a
              href={`${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}/codetry`}
              className="inline-flex items-center gap-1.5 mt-4 font-mono text-[10px] uppercase tracking-[0.2em] hover:opacity-75 transition-opacity"
              style={{ color: "hsl(var(--accent))" }}
            >
              What is Codetry? →
            </a>
          </div>
        </section>

        {/* ── find your path — community type → tool ── */}
        <section className="pt-10 pb-4">
          <p className="font-mono text-[13px] uppercase tracking-[0.26em] mb-2" style={{ color: "hsl(var(--accent))" }}>
            Find your path
          </p>
          <p className="font-serif text-[16px] leading-[1.6] mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Not every community needs the same tool first. Here is where each community type usually starts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            {[
              {
                type: "Homesteaders & rural households",
                icon: "🏡",
                tool: "Kitchen Table + XBuckets",
                why: "Start with identity and a non-custodial wallet. Names on record, passphrase in hand — the household runs its own keys without a bank in the middle.",
                href: "#custom",
                color: "hsl(30 55% 38%)",
              },
              {
                type: "Food co-ops & producer networks",
                icon: "🌾",
                tool: "Clearing + Co-op Platform",
                why: "Exchange and settlement between producers, households, and the board — every transaction visible to the community, no external ledger required.",
                href: "#platform",
                color: "hsl(145 36% 22%)",
              },
              {
                type: "Homeschool collectives",
                icon: "📖",
                tool: "The Handbook + The Wishing Well",
                why: "Start with the plain-language guide to running a community-owned system, then surface what the collective needs next from the households themselves.",
                href: `${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}/codetry-handbook/`,
                color: "hsl(220 20% 32%)",
              },
              {
                type: "Local producers & band councils",
                icon: "🌲",
                tool: "Community Store Plan",
                why: "Site selection, co-op structure, supplier directory, band financing, and day-one operations — handed off so the community runs it without a consultant in the room.",
                href: "#store",
                color: "hsl(145 18% 32%)",
              },
            ].map(({ type, icon, tool, why, href, color }) => (
              <a
                key={type}
                href={href}
                className="block rounded-md border bg-card p-4 transition-opacity hover:opacity-85"
                style={{ borderColor: "hsl(var(--card-border))", borderLeft: `4px solid ${color}`, textDecoration: "none" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px] leading-none shrink-0">{icon}</span>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--muted-foreground))" }}>{type}</p>
                </div>
                <p className="font-serif text-[15px] font-medium tracking-tight mb-1" style={{ color }}>{tool}</p>
                <p className="font-serif text-[14px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{why}</p>
              </a>
            ))}
          </div>
          <p className="font-serif text-[13px] italic" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}>
            Not sure where you land?{" "}
            <a
              href={`${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}/map`}
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Read the neighbourhood map first →
            </a>
          </p>
        </section>

        {/* ── the seven tools ── */}
        <section className="pt-10 pb-2">
          <p className="font-mono text-[13px] uppercase tracking-[0.26em] mb-4" style={{ color: "hsl(var(--accent))" }}>
            The seven tools
          </p>

          {/* Core flow */}
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            Core flow — learn · track · account
          </p>
          <div className="space-y-2 mb-5">
            {[
              {
                icon: "📖",
                name: "The Handbook",
                desc: "Where you start. Plain-language guide to the Headwaters way of working — scoping, handing over, and building community-owned systems.",
                color: "hsl(145 36% 22%)",
                href: "/codetry-handbook/",
              },
              {
                icon: "📋",
                name: "Practitioner's Guide",
                desc: "Where your work lives. Tracks each engagement — the scope, the phases, the decisions, and the handover.",
                color: "hsl(145 28% 32%)",
                href: "/practitioners-guide-v2/",
              },
              {
                icon: "📚",
                name: "The Accounts",
                desc: "Where the money is recorded. What came in, what went out, and what the work delivered — so the community always knows where it stands.",
                color: "hsl(145 22% 42%)",
                href: "/headwaters-books/",
              },
            ].map(({ icon, name, desc, color, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group block rounded-md border bg-card p-4 flex gap-3.5 items-start transition-opacity hover:opacity-80"
                style={{ borderColor: "hsl(var(--card-border))", borderLeft: `4px solid ${color}` }}
              >
                <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p className="font-serif text-[16px] font-medium tracking-tight mb-0.5">{name}</p>
                  <p className="font-serif text-[15px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Supporting layers */}
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            Supporting layers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                icon: "🔬",
                name: "Research Library",
                desc: "Curated research and reports on northern food systems — so every decision is grounded in real data.",
                color: "hsl(14 64% 36%)",
                href: "/library/",
              },
              {
                icon: "🖨️",
                name: "Print Marketing Suite",
                desc: "Print-ready flyers, posters, rack cards, and forms for every public-facing moment.",
                color: "hsl(14 50% 44%)",
                href: "/print-marketing/",
              },
              {
                icon: "🚢",
                name: "Crew Manifest",
                desc: "Shows who is on which project, what role they fill, and how the crew fits together.",
                color: "hsl(220 20% 32%)",
                href: "/",
              },
              {
                icon: "🗄️",
                name: "Media Library",
                desc: "Stores photos, documents, and assets so every other tool can pull from one reliable source.",
                color: "hsl(200 25% 35%)",
                href: "/media/",
              },
            ].map(({ icon, name, desc, color, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group block rounded-md border bg-card p-4 flex gap-3 items-start transition-opacity hover:opacity-80"
                style={{ borderColor: "hsl(var(--card-border))", borderLeft: `4px solid ${color}` }}
              >
                <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p className="font-serif text-[16px] font-medium tracking-tight mb-0.5">{name}</p>
                  <p className="font-serif text-[15px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 1 — COMMUNITY STORE PLAN
        ══════════════════════════════════════ */}
        <section id="store" className="pt-14 pb-10">
          <SectionBand color="hsl(30 55% 38%)" label="Community economic development">
            Building the store — start to handoff
          </SectionBand>
          <p className="font-serif text-[16px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
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
          <p className="font-serif text-[16px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
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
          <p className="font-serif text-[16px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
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
            SECTION 4 — THE CLEARING
        ══════════════════════════════════════ */}
        <section id="the-clearing" className="pt-14 pb-10">
          <SectionBand color="#b85a3e" label="Exchange & settlement">
            Clearing — community transactions, held by the community
          </SectionBand>
          <p className="font-serif text-[16px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Where producers, households, and the co-op record and settle exchanges — with no external ledger in the middle.
          </p>

          <div
            className="rounded-md border px-6 py-5 mb-8"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[13px] uppercase tracking-[0.26em] mb-2" style={{ color: "#b85a3e" }}>
              What it is
            </p>
            <p className="font-serif text-[16px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
              Clearing is the exchange and settlement layer of the community economy — a shared record of what moved between households, producers, and the co-op. Every transaction is visible to the community. No external accounting service holds the ledger. The community's own board governs what gets recorded and who can see what.
            </p>
          </div>

          <SubHeading>The phases</SubHeading>
          <Timeline items={[
            {
              num: "01",
              title: "Exchange audit",
              duration: "1–2 weeks",
              body: "Map what the community is already exchanging — food, labour, goods, services. Identify what needs to be recorded and what can stay informal. Clearing follows existing exchange patterns; it does not replace them.",
            },
            {
              num: "02",
              title: "Ledger spec",
              duration: "1 week",
              body: "A plain-language document: transaction categories, who can record what, how disputes are resolved, what the board sees. Signed off before anything is built.",
            },
            {
              num: "03",
              title: "Build",
              duration: "3–5 weeks",
              body: "Producer and household transaction views, board settlement panel, periodic reconciliation report. Built in front of your team — nothing goes live that the board hasn't walked through.",
            },
            {
              num: "04",
              title: "Pilot with real exchanges",
              duration: "2 weeks",
              body: "Run real transactions through Clearing before full launch. Catch edge cases with the people doing the work, not in a QA session.",
            },
            {
              num: "05",
              title: "Handoff",
              duration: "1 week",
              body: "Board admin training. Written procedures for every role. Done when your treasurer can run a monthly reconciliation without help.",
            },
          ]} accentColor="#b85a3e" />

          <SubHeading className="mt-10">What you leave with</SubHeading>
          <DeliverableGrid items={[
            { icon: "📒", title: "Community ledger", desc: "Every exchange recorded — owned by the community, not a vendor" },
            { icon: "🌾", title: "Producer view", desc: "What each producer has contributed and received" },
            { icon: "🏠", title: "Household view", desc: "Each household's transaction history in plain language" },
            { icon: "🏛", title: "Board settlement panel", desc: "Periodic reconciliation, dispute log, board-level summary" },
            { icon: "📋", title: "Governance rules wired in", desc: "Your board's rules for what gets recorded and by whom" },
            { icon: "📖", title: "Plain-language admin guide", desc: "Written for your treasurer, not a developer" },
          ]} />

          <WhatItIsNot items={[
            "A payment processor or bank replacement",
            "Software the vendor controls",
            "Built for a generic co-op template",
            "Locked to an ongoing subscription",
          ]} />

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[13px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "#b85a3e", color: "#f4ede0" }}
            >
              Commission Clearing →
            </a>
            <a
              href="/aquifer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
              style={{ color: "rgba(56,189,248,0.70)", borderBottom: "1px solid rgba(56,189,248,0.22)", paddingBottom: 1 }}
            >
              How the ledger works — The Aquifer →
            </a>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════
            SECTION 5 — THE WISHING WELL
        ══════════════════════════════════════ */}
        <section id="the-wishing-well" className="pt-14 pb-10">
          <SectionBand color="#0F766E" label="Community procurement & requests">
            The Wishing Well — let the community name what it needs next
          </SectionBand>
          <p className="font-serif text-[16px] italic mt-2 mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Requests surface from the household level up — so what gets built next is decided by the community, not the consultant.
          </p>

          <div
            className="rounded-md border px-6 py-5 mb-8"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[13px] uppercase tracking-[0.26em] mb-2" style={{ color: "#0F766E" }}>
              What it is
            </p>
            <p className="font-serif text-[16px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
              The Wishing Well is a structured request layer — a place for households and producers to name what the community needs before it exists. It surfaces demand from the ground up: what products, services, or tools are missing? What would households actually use? The board sees aggregated requests and can act on real need instead of guessing. No procurement committee required.
            </p>
          </div>

          <SubHeading>The phases</SubHeading>
          <Timeline items={[
            {
              num: "01",
              title: "Needs audit",
              duration: "1 week",
              body: "What are households currently doing without? Where do they leave the community to spend money? Identify the top gaps before building anything to collect more of them.",
            },
            {
              num: "02",
              title: "Request flow spec",
              duration: "1 week",
              body: "Define request categories, visibility rules (what is public, what goes only to the board), and how the board acts on aggregated demand. One document, signed off before a line of code.",
            },
            {
              num: "03",
              title: "Build",
              duration: "2–4 weeks",
              body: "Household request form, category tagging, board demand dashboard. Simple enough that a household with slow internet can submit a request without friction.",
            },
            {
              num: "04",
              title: "First demand cycle",
              duration: "2 weeks",
              body: "Run the first real request cycle with the community. The board reviews aggregate demand and identifies one or two actionable items. The tool is only useful if it changes what gets built — this phase proves it does.",
            },
            {
              num: "05",
              title: "Handoff",
              duration: "1 week",
              body: "Board admin training. Documented procedure for running a quarterly demand review. Done when your board can run the cycle without help.",
            },
          ]} accentColor="#0F766E" />

          <SubHeading className="mt-10">What you leave with</SubHeading>
          <DeliverableGrid items={[
            { icon: "📬", title: "Household request portal", desc: "Simple form — works on slow connections, no account required" },
            { icon: "📊", title: "Board demand dashboard", desc: "Aggregated view of what the community is asking for" },
            { icon: "🏷️", title: "Category tagging", desc: "Requests sorted by type so patterns are visible at a glance" },
            { icon: "🔒", title: "Visibility controls", desc: "What is public, what only the board sees — your rules" },
            { icon: "🔄", title: "Quarterly demand review process", desc: "Documented procedure for running the cycle each quarter" },
            { icon: "📖", title: "Plain-language admin guide", desc: "Written for the person running the review, not a developer" },
          ]} />

          <WhatItIsNot items={[
            "A suggestion box no one reads",
            "A procurement software subscription",
            "A tool that routes requests outside the community",
            "Dependent on ongoing support to run the review cycle",
          ]} />

          <div className="mt-10">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[13px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "#0F766E", color: "#f4ede0" }}
            >
              Commission The Wishing Well →
            </a>
          </div>
        </section>

        <Divider />

        {/* ══════════════════════════════════════
            SECTION 6 — HOW A PROJECT STARTS
        ══════════════════════════════════════ */}
        <section id="start" className="pt-14 pb-16">
          <p
            className="font-mono text-[13px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            the first step
          </p>
          <h2 className="font-serif text-3xl tracking-tight mb-1">
            A trial period, not a contract
          </h2>
          <p className="font-serif text-[16px] italic mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
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
                  className="font-mono text-[13px] font-semibold mb-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  {step}
                </div>
                <p className="font-serif text-[16px] font-medium tracking-tight mb-1.5">{label}</p>
                <p className="font-serif text-[15px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-md border p-6 sm:p-8"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[13px] uppercase tracking-[0.22em] mb-3" style={{ color: "hsl(var(--accent))" }}>
              current quote paths
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Initial implementation", value: "$20,000 / $28,000", note: "Starting price for community/nonprofit work / commercial or institutional work. Defined scope, real deliverable." },
                { label: "Additional standard tool", value: "$8,000 / $12,000", note: "Starting price for community/nonprofit work / commercial or institutional work. Confirmed against the tool and scope." },
                { label: "Custom review", value: "By review", note: "Expanded, unusual, or still-forming work is scoped with the organization before a fee is proposed." },
                { label: "Travel & expenses", value: "At cost", note: "Travel to site and expenses reimbursed at cost with receipts." },
              ].map(({ label, value, note }) => (
                <div key={label}>
                  <p className="font-mono text-[13px] uppercase tracking-[0.18em] mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
                  <p className="font-serif text-2xl font-medium tracking-tight mb-1">{value}</p>
                  <p className="font-serif text-[15px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{note}</p>
                </div>
              ))}
            </div>
            <p
              className="font-mono text-[13px] uppercase tracking-[0.14em] mt-5"
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
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[13px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              Start a conversation (short form) →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="font-mono text-[13px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Read the bio
            </a>
            <a
              href="/print-marketing/capability-statement"
              className="font-mono text-[13px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
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
      className="rounded-md px-4 py-3.5 relative overflow-hidden"
      style={{ background: color, color: "hsl(38 36% 96%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
        style={{ background: "hsl(38 36% 94%)" }}
      />
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] mb-1.5 opacity-70">{label}</p>
      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight break-words">{children}</h2>
    </div>
  );
}

function SubHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-mono text-[13px] uppercase tracking-[0.26em] mb-4 ${className}`}
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
            <span className="font-mono text-[11px] font-bold" style={{ color: "hsl(38 36% 96%)" }}>
              {i + 1}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-1.5">
            <p className="font-serif text-[16px] font-medium tracking-tight">{title}</p>
            <span
              className="font-mono text-[12px] uppercase tracking-[0.14em]"
              style={{ color: accentColor }}
            >
              {duration}
            </span>
          </div>
          <p
            className="font-serif text-[16px] leading-[1.55]"
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
            <p className="font-serif text-[16px] font-medium tracking-tight mb-0.5 break-words">{title}</p>
            <p className="font-serif text-[15px] leading-[1.5] break-words" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
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
            <span className="font-mono text-[13px] mt-[2px] shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>✕</span>
            <span className="font-serif text-[15px] leading-[1.5] break-words" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
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
