import { useState } from "react";
import { AmbientBackground, GrainOverlay, ScrollReveal } from "@/components/AmbientBackground";
import { ZoneTag } from "@/components/ZoneTag";

const ZONE2_BLUE = "#1A5FA8";
const ZONE2_BLUE_DIM = "rgba(26,95,168,0.18)";
const CREAM = "#f4ede0";
const CREAM_DIM = "rgba(244,237,224,0.62)";
const CREAM_FAINT = "rgba(244,237,224,0.38)";
const RUST = "#b85a3e";

function FilledBar({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: ZONE2_BLUE,
        color: CREAM,
        borderRadius: 3,
        paddingTop: "0.2em",
        paddingBottom: "0.2em",
        paddingLeft: "0.55em",
        paddingRight: "0.55em",
        fontSize: "0.68rem",
        fontWeight: 800,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono, monospace)",
      }}
    >
      {children}
    </span>
  );
}

const FILTER_QUESTIONS = [
  {
    q: "Is there a real problem, not a hypothesis?",
    note: "The community has tried something, hit a wall, and knows what the wall is.",
  },
  {
    q: "Is the scope bounded enough to finish?",
    note: "A deliverable exists that can be named, handed over, and closed.",
  },
  {
    q: "Is payment committed, not contingent?",
    note: "Work happens in exchange for money, not in exchange for a chance at money.",
  },
  {
    q: "Is there a relationship, not a cold pitch?",
    note: "Someone in the room already trusts the work. A warm introduction counts.",
  },
  {
    q: "Can it be handed over when done?",
    note: "The community owns what comes out. No ongoing dependency on the practitioner to keep it running.",
  },
];

export function MillPage() {
  const [checked, setChecked] = useState<boolean[]>(FILTER_QUESTIONS.map(() => false));
  const allClear = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: "#0F1C18" }}
      data-testid="mill-page"
    >
      <AmbientBackground variant="aurora" />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-[52rem] px-6 sm:px-8 py-12 sm:py-16">

        {/* ── Hero ── */}
        <header className="mb-14">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <ZoneTag zone={2} label="The Workbench" />
              <div className="h-px flex-1" style={{ background: ZONE2_BLUE_DIM }} />
              <span
                className="font-mono text-[9px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(244,237,224,0.28)" }}
              >
                production framing
              </span>
            </div>

            <h1
              className="font-serif leading-[1.05] tracking-tight mb-5"
              style={{
                fontSize: "clamp(2.6rem, 7.5vw, 4.2rem)",
                color: CREAM,
                fontStyle: "italic",
              }}
              data-testid="mill-title"
            >
              The Mill
            </h1>

            <p
              className="font-serif text-[17px] leading-[1.7]"
              style={{ color: CREAM_DIM, maxWidth: "42rem" }}
              data-testid="mill-intro"
            >
              Zone 2 is where raw community intention gets turned into structured, billable work.
              Not speculation. Not capacity-building for its own sake. Work in exchange for money —
              bounded in scope, started with a trial, and built on a relationship that already
              exists. The Mill is the production frame: the questions asked before a scope is
              opened, and the format used to close it.
            </p>
          </ScrollReveal>
        </header>

        {/* ── Divider ── */}
        <div
          className="mb-12 h-px"
          style={{ background: `linear-gradient(to right, ${ZONE2_BLUE_DIM}, transparent)` }}
        />

        {/* ── Section 1: What happens here ── */}
        <section className="mb-14" data-testid="mill-section-what">
          <ScrollReveal>
            <div className="mb-6">
              <FilledBar>What happens here</FilledBar>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div
              className="rounded-md p-6 sm:p-7 space-y-4 font-serif text-[15.5px] leading-[1.7]"
              style={{
                background: "rgba(15,28,24,0.7)",
                border: `1px solid ${ZONE2_BLUE_DIM}`,
                color: CREAM_DIM,
              }}
            >
              <p>
                A practitioner at the Mill reads an engagement — a conversation, a referral, an
                inbound question — and decides whether it fits the Codetry production frame before
                a single scope line is written. The frame is simple: bounded scope, trial-period
                first, relationship-driven.
              </p>
              <p>
                Bounded scope means the work has an edge. There is a deliverable that can be named
                and handed over. Trial-period first means the engagement opens small — enough work
                to establish trust and calibrate the relationship before a longer commitment.
                Relationship-driven means someone in the room already knows the work. The Mill
                does not run cold pitches.
              </p>
              <p>
                Work that clears the five filter questions moves to a scope of work. Work that
                does not goes back to Zone 1 (the Headwaters practice) or out of the constellation
                entirely. The Mill is not a catch-all — it is a threshold.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Section 2: The five filter questions ── */}
        <section className="mb-14" data-testid="mill-section-filters">
          <ScrollReveal>
            <div className="mb-6">
              <FilledBar>The five filter questions</FilledBar>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FILTER_QUESTIONS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 55}>
                <div
                  className="rounded-md overflow-hidden"
                  style={{
                    background: checked[i]
                      ? "rgba(26,95,168,0.12)"
                      : "rgba(15,28,24,0.75)",
                    border: checked[i]
                      ? `1px solid ${ZONE2_BLUE_DIM}`
                      : "1px solid rgba(244,237,224,0.07)",
                    transition: "background 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  <button
                    type="button"
                    className="w-full text-left px-5 py-3 flex items-start gap-3"
                    style={{
                      borderBottom: "1px solid rgba(26,95,168,0.18)",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                    onClick={() => toggle(i)}
                    aria-pressed={checked[i]}
                  >
                    {/* Checkbox */}
                    <span
                      className="shrink-0 mt-0.5"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 18,
                        height: 18,
                        borderRadius: 3,
                        border: `1.5px solid ${checked[i] ? ZONE2_BLUE : "rgba(26,95,168,0.45)"}`,
                        background: checked[i] ? ZONE2_BLUE : "transparent",
                        transition: "background 0.2s ease, border-color 0.2s ease",
                        flexShrink: 0,
                      }}
                    >
                      {checked[i] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 3.5L3.8 6.5L9 1"
                            stroke={CREAM}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>

                    {/* Question number */}
                    <span
                      className="font-mono text-[11px] shrink-0 mt-0.5"
                      style={{ color: checked[i] ? ZONE2_BLUE : "rgba(26,95,168,0.55)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Question text */}
                    <p
                      className="font-serif text-[15px] leading-snug"
                      style={{
                        color: checked[i] ? CREAM : CREAM_DIM,
                        fontStyle: "italic",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.q}
                    </p>
                  </button>

                  <div className="px-5 py-3" style={{ paddingLeft: "3.25rem" }}>
                    <p
                      className="font-serif text-[13.5px] leading-[1.6]"
                      style={{ color: CREAM_FAINT }}
                    >
                      {item.note}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* ── Go / No-go indicator ── */}
          <div
            className="mt-6 rounded-md overflow-hidden"
            style={{
              border: allClear
                ? `1px solid ${ZONE2_BLUE}`
                : "1px solid rgba(244,237,224,0.07)",
              background: allClear
                ? "rgba(26,95,168,0.18)"
                : "rgba(15,28,24,0.5)",
              transition: "background 0.35s ease, border-color 0.35s ease",
            }}
            data-testid="mill-gonogo"
          >
            <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: allClear ? "#4ade80" : "rgba(244,237,224,0.18)",
                    boxShadow: allClear ? "0 0 8px rgba(74,222,128,0.6)" : "none",
                    transition: "background 0.35s ease, box-shadow 0.35s ease",
                    flexShrink: 0,
                  }}
                />
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.18em]"
                  style={{
                    color: allClear ? CREAM : "rgba(244,237,224,0.32)",
                    transition: "color 0.35s ease",
                  }}
                >
                  {allClear
                    ? "Clear to open a scope"
                    : `${checked.filter(Boolean).length} / ${FILTER_QUESTIONS.length} cleared`}
                </p>
              </div>

              {allClear && (
                <a
                  href={(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") + "/sow"}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-70"
                  style={{ color: CREAM }}
                  data-testid="mill-gonogo-sow-link"
                >
                  Open SOW →
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 3: What comes out ── */}
        <section className="mb-14" data-testid="mill-section-output">
          <ScrollReveal>
            <div className="mb-6">
              <FilledBar>What comes out</FilledBar>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div
              className="rounded-md p-6 sm:p-7 space-y-4 font-serif text-[15.5px] leading-[1.7]"
              style={{
                background: "rgba(15,28,24,0.7)",
                border: `1px solid rgba(244,237,224,0.07)`,
                color: CREAM_DIM,
              }}
            >
              <p>
                A scope of work. Not a proposal — a plain document that names the deliverable,
                the rate, the billing cadence, and how to start. The SOW format used across
                Codetry engagements is built for organizations that have seen too many proposal
                decks and not enough clear agreements.
              </p>
              <p>
                After the scope is agreed, the engagement runs. Work is logged, billed on a
                regular cycle, and closed when the deliverable is done and handed over. The
                community owns what comes out. No retainer. No ongoing access fee. No consultant
                in the room to keep the thing running.
              </p>
              <p>
                The output of the Mill is work that ships — a running tool, a finished document,
                a plan the community can execute without Codetry in the room. That is the Zone 2
                standard.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Divider ── */}
        <div
          className="mb-10 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.10), transparent)" }}
        />

        {/* ── Links row ── */}
        <section data-testid="mill-links">
          <ScrollReveal>
            <p
              className="font-mono text-[9px] uppercase tracking-[0.28em] mb-5"
              style={{ color: "rgba(244,237,224,0.32)" }}
            >
              related tools
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                eyebrow: "Who's at the Mill",
                title: "Practitioner Bio",
                href: "/bio",
                accent: "#1f3d2e",
                testId: "mill-link-bio",
              },
              {
                eyebrow: "The work contract format",
                title: "Statement of Work",
                href: "/sow",
                accent: RUST,
                testId: "mill-link-sow",
              },
              {
                eyebrow: "The tool hub",
                title: "Workbench",
                href: "/workbench",
                accent: ZONE2_BLUE,
                testId: "mill-link-workbench",
              },
            ].map((link, i) => (
              <ScrollReveal key={link.testId} delay={i * 60}>
                <a
                  href={link.href}
                  className="group block rounded-md overflow-hidden"
                  style={{
                    background: "rgba(15,28,24,0.75)",
                    border: "1px solid rgba(244,237,224,0.08)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-2px)";
                    el.style.borderColor = "rgba(244,237,224,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "";
                    el.style.borderColor = "rgba(244,237,224,0.08)";
                  }}
                  data-testid={link.testId}
                >
                  <div
                    className="px-4 py-2.5"
                    style={{
                      background: link.accent,
                      borderBottom: "1px solid rgba(0,0,0,0.18)",
                    }}
                  >
                    <p
                      className="font-mono text-[8.5px] uppercase tracking-[0.24em] mb-0.5"
                      style={{ color: "rgba(244,237,224,0.65)" }}
                    >
                      {link.eyebrow}
                    </p>
                    <p
                      className="font-serif text-[15px]"
                      style={{ color: CREAM, fontStyle: "italic" }}
                    >
                      {link.title}
                    </p>
                  </div>
                  <div className="px-4 py-2 flex justify-end">
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.18em] transition-opacity group-hover:opacity-80"
                      style={{ color: CREAM_FAINT }}
                    >
                      Open →
                    </span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="mt-16 pt-8 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(244,237,224,0.07)" }}
        >
          <a
            href={(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") + "/workbench"}
            className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: "rgba(244,237,224,0.35)" }}
          >
            ← workbench
          </a>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(244,237,224,0.18)" }}
          >
            zone 2 · codetry production frame
          </p>
        </footer>

      </div>
    </main>
  );
}
