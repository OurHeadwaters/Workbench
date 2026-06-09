import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM     = "#f4ede0";
const RUST      = "#b85a3e";
const GOLD      = "#c9930a";
const INK       = "#1a2820";
const MUTED     = "#5c6b5e";
const PALE      = "#f9f6f0";
const BARK      = "#2e1f0f";

function buildPlainText(): string {
  return [
    "CDP GRANT NARRATIVE",
    "Helping Hands: Community Labour, Credentialed Reputation, and the Path to Economic Sovereignty",
    "Headwaters Development Services — June 2026",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE PROBLEM",
    "",
    "Every day on northern reserves, real work gets done and real value moves between people.",
    "",
    "An elder teaches a youth how to smoke fish. A household helps a neighbour move firewood. A community member shows up for three seasons of maintenance work the band depends on. A woman trains the next canning crew so the knowledge doesn't leave when she does.",
    "",
    "None of it appears in any ledger that institutions recognize. None of it builds toward a credit history. None of it counts when a community member walks into a bank or applies for a microloan or tries to demonstrate the kind of reliability that formal institutions require before they offer anything.",
    "",
    "This is not an individual failure. It is a structural gap — the informal economy of northern reserve communities is fully functional and deeply sophisticated, and it is completely invisible to the institutions that control access to capital.",
    "",
    "The result is a double burden: communities do the work of sustaining themselves without the recognition that work deserves, and they are then told they lack the financial track record required for the support that would actually help.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE ENGINE: HELPING HANDS",
    "",
    "Helping Hands is the structured labour layer of the Headwaters community economy — a platform designed from the ground up for the way northern reserve communities already work.",
    "",
    "It is not a job board. It is not a gig platform. It is not a digital version of a timesheet.",
    "",
    "It is a community credentialing and labour coordination system built around one principle: the work community members do every day is real, it has value, and it should be recognized — by the community itself first, and eventually by institutions as well.",
    "",
    "HOW A TASK WORKS",
    "",
    "An administrator — a band manager, a coordinator, a community lead — posts a task. The task has a description, a required skill or badge level, a defined completion condition, and pay denominated in community tokens. A member claims it. They do the work. A confirmer signs off. The payment lands.",
    "",
    "The full lifecycle is tracked: posted → claimed → completed → confirmed → paid. A task that times out without confirmation triggers a no-show record. A task that completes on time adds a completion to the member's reliability score.",
    "",
    "This is not novel in concept — what is novel is that it is designed specifically for communities where the work is seasonal, the workforce is mixed across ages and skill levels, and the value of showing up consistently is as important as the value of the specific task completed.",
    "",
    "THE RELIABILITY LAYER",
    "",
    "Every completion builds a reliability record. Every no-show records against it. When a member hits milestones — ten completions, twenty completions — automatic bonuses land without anyone having to ask for them.",
    "",
    "What this produces over time is a machine-readable reputation — not a credit score (which is built on consumption and debt), but a record of contribution. Of showing up. Of doing the work.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE ON-RAMP: PROGRESSIVE WALLET REVEAL",
    "",
    "The single most important design decision in this system is how a new member first encounters their wallet.",
    "",
    "They don't.",
    "",
    "On day one, a new Helping Hands member sees no wallet. No crypto. No balance. No interface they need to understand before they can do anything. They sign up. They see tasks. They claim one.",
    "",
    "Then one of three things happens: they receive a tip from another member, they earn tokens completing a task, or a referral bonus lands.",
    "",
    "At that moment — and only at that moment — the wallet reveals itself. The member's first encounter with community currency is receiving value, not managing an empty account. The confusion of empty-wallet onboarding is eliminated. The first experience is abundance, not complexity.",
    "",
    "This is the on-ramp proof: the system works because it is designed for people who have never held a digital wallet, not for people who have.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "CREDENTIALING: THE BADGE MODEL",
    "",
    "Skills in the Helping Hands system move through four stages:",
    "",
    "  Watching — observing, not yet practising",
    "  Learning — active student, receiving instruction",
    "  Practising — doing the work with some oversight",
    "  Teaching — verified, can credential others",
    "",
    "Badge categories map to real community domains: food systems, land stewardship, governance, facility maintenance, and others.",
    "",
    "When someone holds a Teaching badge in food systems, they can validate a Learning member's progress. Credentialing is peer-to-peer, not institution-to-person. The knowledge that lives in the community — in elders, in experienced workers, in people who have been doing this work for decades without institutional recognition — becomes the source of formal credentialing.",
    "",
    "This matters for reconciliation in a specific, material way: it does not ask communities to replace their knowledge systems with institutional ones. It makes community knowledge legible to institutions on the community's own terms.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE PARTNERSHIP PORTAL: REPUTATION WITHOUT EXPOSURE",
    "",
    "The reliability record and badge credentials built inside Helping Hands have value beyond the community economy. They represent something institutions have never been able to see: a longitudinal record of economic participation by people whose economic activity has always been invisible to conventional tracking systems.",
    "",
    "The Partnership Portal is the interface between the Helping Hands reputation layer and external institutions — lenders, government programs, economic development bodies, and potential employers.",
    "",
    "It exposes anonymized reliability scores. Not individual data. Not identifiable records. Scores that allow a participating lender or program office to understand: this community has a demonstrated labour pool with a track record, and here is what that track record looks like.",
    "",
    "The individual member controls what is shared and when. Sharing is opt-in. The data stays in the community's custody. What crosses the Portal is a credential, not a file.",
    "",
    "This is material reconciliation. Not a land acknowledgment. Not a training workshop. A mechanism that connects the work community members already do to the institutional recognition that work has always deserved — without requiring individuals to expose themselves to systems that have not historically served them.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE SOVEREIGNTY ENDGAME: XRPL GRADUATION",
    "",
    "Helping Hands begins in a custodial model: the platform holds the tokens, manages the wallet, and keeps the complexity out of the member's immediate experience. This is deliberate. The on-ramp must be frictionless or it will not be used.",
    "",
    "But custodial is not the destination. The design intent is a graduation path.",
    "",
    "When a member is ready — when they understand the system, when they trust it, when they want to hold their own keys — they migrate from the custodial layer to a self-custody wallet on the XRP Ledger. Their reliability record and badge credentials follow them. Their envelopes (named spending buckets: Groceries, Savings, Supplies) translate into the Headwaters Bucket System with a real Xaman wallet and real RLUSD on-chain.",
    "",
    "The migration path is custodial → self-custody, not the reverse. Once someone graduates, they have genuine digital sovereignty over their economic assets. The band or community still participates as anchor and coordinator — but the member holds their own keys.",
    "",
    "This is what economic sovereignty looks like at the individual level: not the abstract right to self-determination, but the practical capacity to hold and direct your own economic output.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "WHY THIS. WHY NOW.",
    "",
    "Northern communities are not waiting for someone to invent economic development. They are doing it already. The informal economy on northern reserves is sophisticated, adaptive, and deeply rooted. What it lacks is legibility — to funders, to lenders, to the institutions that control the capital flows that formal development requires.",
    "",
    "Helping Hands does not introduce community labour. It recognizes community labour that already exists and makes it legible in ways that serve the community's own interests first.",
    "",
    "The CDP (or equivalent) funding stream asks: what economic development looks like when it is designed by and for the communities it serves. This is the answer. Not a pilot that extracts data. Not a program that requires communities to adopt institutional models before they can access support. A platform the community owns, runs, and can hand off to the next generation.",
    "",
    "The Headwaters approach is Codetry-grounded: everything built has a handover as the exit condition. The band runs it without Headwaters. That is what done means.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE ASK",
    "",
    "This grant application requests funding for the first phase of Helping Hands deployment in a northern Ontario First Nations community:",
    "",
    "  → Platform deployment and community configuration",
    "  → Coordinator training (band employee or community member)",
    "  → First-cohort task design and launch",
    "  → Partnership Portal pilot with one institutional lending partner",
    "  → Documentation for replication in a second community",
    "",
    "What funders receive in return: a transparent record of every task, every completion, every badge earned, every wallet reveal, and every reliability milestone — the kind of ground-level economic data that no other program is currently generating from northern reserve communities.",
    "",
    "What the community receives: infrastructure they own, a credentialing system that recognizes the work they already do, and a graduation path to economic sovereignty that does not depend on any outside organization staying involved.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Headwaters Development Services",
    "bobbie@ourheadwaters.ca · ourheadwaters.ca · 807 220 3654",
  ].join("\n");
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.52rem",
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: GOLD,
  marginBottom: "0.18in",
  display: "block",
};

const h2Style: React.CSSProperties = {
  fontFamily: "Fraunces, Georgia, serif",
  fontSize: "1.28rem",
  fontWeight: 600,
  color: EVERGREEN,
  margin: "0 0 0.18in",
  lineHeight: 1.25,
  letterSpacing: "-0.01em",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "0.76rem",
  color: INK,
  lineHeight: 1.72,
  margin: "0 0 0.14in",
};

const pullStyle: React.CSSProperties = {
  fontFamily: "Fraunces, Georgia, serif",
  fontSize: "1.05rem",
  fontStyle: "italic",
  color: EVERGREEN,
  lineHeight: 1.4,
  borderLeft: `3px solid ${GOLD}`,
  paddingLeft: "0.22in",
  margin: "0.2in 0",
};

interface SectionProps {
  label: string;
  heading: string;
  children: React.ReactNode;
}

function Section({ label, heading, children }: SectionProps) {
  return (
    <section style={{ marginBottom: "0.42in" }}>
      <span style={sectionLabel}>{label}</span>
      <h2 style={h2Style}>{heading}</h2>
      {children}
    </section>
  );
}

export function CdpGrantNarrativePage() {
  return (
    <div
      style={{
        width: "8.5in",
        minHeight: "11in",
        background: PALE,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: EVERGREEN,
          padding: "0.38in 0.55in 0.32in",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "0.3in",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.72)",
              margin: "0 0 0.08in",
            }}
          >
            Headwaters Development Services · CDP Grant Narrative · June 2026
          </p>
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.85rem",
              fontWeight: 600,
              color: CREAM,
              margin: "0 0 0.08in",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Helping Hands
          </h1>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "rgba(244,237,224,0.60)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Community labour, credentialed reputation, and the path to economic sovereignty.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.44rem",
              color: "rgba(244,237,224,0.32)",
              margin: 0,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: 1.9,
            }}
          >
            ourheadwaters.ca<br />
            bobbie@ourheadwaters.ca<br />
            807 220 3654
          </p>
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ height: "3px", background: GOLD, flexShrink: 0 }} />

      {/* ── BODY — two-column ── */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
        }}
      >
        {/* LEFT COLUMN */}
        <div
          style={{
            padding: "0.36in 0.28in 0.36in 0.48in",
            borderRight: `1px solid rgba(31,61,46,0.12)`,
          }}
        >
          {/* Problem */}
          <Section label="The Problem" heading="Invisible to institutions. Visible to everyone who lives here.">
            <p style={bodyStyle}>
              Every day on northern reserves, real work gets done and real value moves between people. An elder teaches a youth to smoke fish. A household helps a neighbour move firewood. A community member shows up for three seasons of maintenance the band depends on.
            </p>
            <p style={bodyStyle}>
              None of it appears in any ledger institutions recognize. None of it builds toward a credit history. None of it counts when a community member applies for a microloan or tries to demonstrate the reliability formal institutions require before they offer anything.
            </p>
            <p style={pullStyle}>
              The informal economy of northern reserve communities is fully functional and deeply sophisticated — and completely invisible to the institutions that control access to capital.
            </p>
            <p style={bodyStyle}>
              The result is a double burden: communities do the work of sustaining themselves without the recognition it deserves, then are told they lack the financial track record required for the support that would actually help.
            </p>
          </Section>

          {/* The Engine */}
          <Section label="The Engine" heading="Helping Hands — structured community labour.">
            <p style={bodyStyle}>
              Helping Hands is the labour coordination layer of the Headwaters community economy. It is not a job board or a gig platform. It is a credentialing and coordination system built around one principle: the work community members do every day is real, it has value, and it should be recognized — by the community first.
            </p>

            {/* Task lifecycle */}
            <div
              style={{
                background: "white",
                border: `1px solid rgba(31,61,46,0.1)`,
                borderLeft: `4px solid ${EVERGREEN}`,
                borderRadius: "3px",
                padding: "0.15in 0.18in",
                marginBottom: "0.14in",
              }}
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.44rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: RUST,
                  margin: "0 0 0.09in",
                }}
              >
                Task lifecycle
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.05in", flexWrap: "wrap" }}>
                {["Posted", "Claimed", "Completed", "Confirmed", "Paid"].map((step, i, arr) => (
                  <span key={step} style={{ display: "flex", alignItems: "center", gap: "0.05in" }}>
                    <span
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: "0.62rem",
                        color: EVERGREEN,
                        fontWeight: 600,
                      }}
                    >
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ color: GOLD, fontSize: "0.6rem" }}>→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <p style={bodyStyle}>
              A task that times out without confirmation triggers a no-show record. A task completed on time adds to the member's reliability score. Over time, this produces a machine-readable reputation — not a credit score built on debt, but a record of contribution. Of showing up.
            </p>
          </Section>

          {/* Credentialing */}
          <Section label="Credentialing" heading="Peer-to-peer. Community knowledge as credential.">
            <p style={bodyStyle}>
              Skills in Helping Hands move through four stages:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.07in", marginBottom: "0.14in" }}>
              {[
                { stage: "Watching", desc: "Observing — not yet practising" },
                { stage: "Learning", desc: "Active student, receiving instruction" },
                { stage: "Practising", desc: "Doing with some oversight" },
                { stage: "Teaching", desc: "Verified — can credential others" },
              ].map(({ stage, desc }) => (
                <div
                  key={stage}
                  style={{
                    background: "white",
                    border: `1px solid rgba(31,61,46,0.1)`,
                    borderRadius: "3px",
                    padding: "0.1in 0.12in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.44rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: RUST,
                      margin: "0 0 0.04in",
                    }}
                  >
                    {stage}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "0.62rem",
                      color: MUTED,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <p style={bodyStyle}>
              Badge categories map to real domains: food, land, governance, maintenance, and others. A Teaching badge in food systems means you can validate a Learning member's progress — making credentialing peer-to-peer, not institution-to-person.
            </p>
            <p style={pullStyle}>
              The knowledge that lives in elders and experienced workers — without institutional recognition — becomes the source of formal credentialing. Community knowledge on its own terms.
            </p>
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ padding: "0.36in 0.48in 0.36in 0.28in" }}>

          {/* Progressive wallet reveal */}
          <Section label="The On-Ramp" heading="The wallet reveals itself. First encounter is abundance.">
            <p style={bodyStyle}>
              The single most important design decision in this system is how a new member first encounters their wallet.
            </p>
            <p style={pullStyle}>
              They don't. On day one, they see tasks — not crypto, not a balance, not complexity they need to understand before they can do anything.
            </p>
            <p style={bodyStyle}>
              Then one of three things happens: they receive a tip from another member, they earn tokens completing a task, or a referral bonus lands. At that moment — and only at that moment — the wallet reveals itself. The first experience is receiving value, not managing an empty account.
            </p>
            <p style={bodyStyle}>
              This is the on-ramp proof: the system works because it is designed for people who have never held a digital wallet, not for people who have.
            </p>
          </Section>

          {/* Partnership Portal */}
          <Section label="The Partnership Portal" heading="Reputation without exposure. Community data stays in community custody.">
            <p style={bodyStyle}>
              The reliability record and badge credentials built in Helping Hands represent something institutions have never been able to see: a longitudinal record of economic participation by people whose economic activity has always been invisible to conventional tracking.
            </p>
            <p style={bodyStyle}>
              The Partnership Portal is the interface between this reputation layer and external institutions — lenders, government programs, economic development bodies.
            </p>

            <div
              style={{
                background: "white",
                border: `1px solid rgba(31,61,46,0.1)`,
                borderLeft: `4px solid ${RUST}`,
                borderRadius: "3px",
                padding: "0.16in 0.18in",
                marginBottom: "0.14in",
              }}
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.44rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: RUST,
                  margin: "0 0 0.08in",
                }}
              >
                How it works
              </p>
              {[
                "Anonymized reliability scores — not individual data",
                "Sharing is opt-in, controlled by the member",
                "The data stays in community custody",
                "What crosses the Portal is a credential, not a file",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.08in", alignItems: "flex-start", marginBottom: "0.05in" }}>
                  <span style={{ color: GOLD, fontSize: "0.62rem", flexShrink: 0, lineHeight: 1.5 }}>→</span>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.64rem", color: INK, margin: 0, lineHeight: 1.55 }}>{item}</p>
                </div>
              ))}
            </div>

            <p style={pullStyle}>
              This is material reconciliation — a mechanism that connects the work community members already do to the institutional recognition that work has always deserved, without requiring individuals to expose themselves to systems that have not historically served them.
            </p>
          </Section>

          {/* XRPL Sovereignty */}
          <Section label="The Sovereignty Endgame" heading="Custodial is the on-ramp. Self-custody is the destination.">
            <p style={bodyStyle}>
              Helping Hands begins in a custodial model: the platform holds the tokens, manages the wallet, keeps complexity out of the member's immediate experience. This is deliberate. The on-ramp must be frictionless.
            </p>
            <p style={bodyStyle}>
              When a member is ready, they migrate to self-custody on the XRP Ledger. Their reliability record and badge credentials follow them. Their envelopes — Groceries, Savings, Supplies — translate into the Headwaters Bucket System with a real Xaman wallet and real RLUSD on-chain.
            </p>
            <p style={bodyStyle}>
              The migration path is custodial → self-custody, not the reverse. Once someone graduates, they hold their own keys.
            </p>

            {/* Stack diagram */}
            <div
              style={{
                background: EVERGREEN,
                borderRadius: "3px",
                padding: "0.15in 0.2in",
                marginBottom: "0.14in",
              }}
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.44rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(212,160,23,0.72)",
                  margin: "0 0 0.1in",
                }}
              >
                The graduation stack
              </p>
              {[
                ["Helping Hands", "Structured work, credentials, reliability"],
                ["Envelopes", "Named buckets, spending at local merchants"],
                ["Bucket System", "Self-custody, Xaman wallet, RLUSD on XRPL"],
                ["Drip Harvester", "Savings earning yield in AMM pools"],
              ].map(([name, desc]) => (
                <div key={name} style={{ display: "flex", gap: "0.1in", marginBottom: "0.06in", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.44rem", color: GOLD, flexShrink: 0, lineHeight: 1.7 }}>↓</span>
                  <div>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.48rem", color: CREAM, fontWeight: 600, letterSpacing: "0.06em" }}>{name}</span>
                    <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginLeft: "0.08in" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* The Ask */}
          <div
            style={{
              background: RUST,
              borderRadius: "3px",
              padding: "0.2in 0.22in",
            }}
          >
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.48rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.72)",
                margin: "0 0 0.1in",
              }}
            >
              The Ask
            </p>
            <p
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: CREAM,
                margin: "0 0 0.12in",
                lineHeight: 1.3,
              }}
            >
              First-community deployment of the Helping Hands platform and Partnership Portal pilot.
            </p>
            {[
              "Platform deployment and community configuration",
              "Coordinator training — band employee or community member",
              "First-cohort task design and launch",
              "Partnership Portal pilot with one institutional lender",
              "Documentation for replication in a second community",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.08in", alignItems: "flex-start", marginBottom: "0.05in" }}>
                <span style={{ color: "rgba(244,237,224,0.6)", fontSize: "0.62rem", flexShrink: 0, lineHeight: 1.55 }}>→</span>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.65rem", color: "rgba(244,237,224,0.88)", margin: 0, lineHeight: 1.55 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          background: BARK,
          padding: "0.16in 0.55in",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.44rem",
            color: "rgba(244,237,224,0.35)",
            margin: 0,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Headwaters Development Services
        </p>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.6rem",
            color: "rgba(244,237,224,0.28)",
            margin: 0,
          }}
        >
          Handover is the exit condition.
        </p>
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.44rem",
            color: "rgba(244,237,224,0.35)",
            margin: 0,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ourheadwaters.ca
        </p>
      </div>
    </div>
  );
}

export default function CdpGrantNarrative() {
  return (
    <>
      <PrintNav
        targetId="cdp-grant-narrative-standalone"
        filename="headwaters-cdp-grant-narrative.pdf"
        format="letter"
        orientation="portrait"
        onCopyPlainText={buildPlainText}
      />
      <div
        style={{
          background: "#cdc8be",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.4in 0 0.6in",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div id="cdp-grant-narrative-standalone">
          <CdpGrantNarrativePage />
        </div>
      </div>
    </>
  );
}
