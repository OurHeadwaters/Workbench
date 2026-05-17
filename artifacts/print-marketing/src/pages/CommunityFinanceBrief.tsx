
// ── Palette (Headwaters water palette) ────────────────────────────────────
const EVERGREEN  = "#1f3d2e";
const LAKE       = "#2a6496";
const LAKE_LIGHT = "#3a8bc4";
const CREEK      = "#4a9e8e";
const FOAM       = "#f0f7f4";
const CREAM      = "#faf9f5";
const INK        = "#1a1a1a";
const MUTED      = "#6b7280";
const RUST       = "#b04a2a";

// ── Circuit diagram ────────────────────────────────────────────────────────
function CircuitDiagram() {
  const steps = [
    { label: "Complete a task", sub: "Helping Hands", color: EVERGREEN, icon: "✓" },
    { label: "Earn HWBAND", sub: "Community labour credit", color: CREEK, icon: "◈" },
    { label: "Allocate to envelope", sub: "xbuckets budgeting", color: LAKE, icon: "⊞" },
    { label: "Spend at reserve store", sub: "Token accepted at POS", color: RUST, icon: "🏪" },
    { label: "Savings build", sub: "Household budget fills", color: EVERGREEN, icon: "↑" },
  ];

  return (
    <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        minWidth: 600,
        padding: "1.5rem 0",
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                color: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <p style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: s.color,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.3,
                maxWidth: 90,
              }}>{s.label}</p>
              <p style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "0.65rem",
                color: MUTED,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.3,
                maxWidth: 90,
              }}>{s.sub}</p>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flexShrink: 0,
                width: 32,
                height: 2,
                background: `linear-gradient(to right, ${steps[i].color}, ${steps[i + 1].color})`,
                position: "relative",
                top: -18,
              }}>
                <div style={{
                  position: "absolute",
                  right: -4,
                  top: -5,
                  color: steps[i + 1].color,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}>▶</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ label, title, color = LAKE }: { label: string; title: string; color?: string }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <p style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        marginBottom: "0.4rem",
      }}>{label}</p>
      <h2 style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "1.75rem",
        fontWeight: 700,
        color: EVERGREEN,
        lineHeight: 1.2,
        margin: 0,
      }}>{title}</h2>
    </div>
  );
}

// ── Mechanic card ──────────────────────────────────────────────────────────
function MechanicCard({ name, desc, icon, accent }: {
  name: string;
  desc: string;
  icon: string;
  accent: string;
}) {
  return (
    <div style={{
      background: "white",
      border: `1px solid rgba(42,100,150,0.12)`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: 8,
      padding: "1.1rem 1.25rem",
      display: "flex",
      gap: "1rem",
      alignItems: "flex-start",
    }}>
      <span style={{
        fontSize: "1.6rem",
        lineHeight: 1,
        flexShrink: 0,
        marginTop: 2,
      }}>{icon}</span>
      <div>
        <p style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: accent,
          margin: "0 0 0.3rem",
        }}>{name}</p>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.875rem",
          color: "#374151",
          lineHeight: 1.6,
          margin: 0,
        }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Partner card ──────────────────────────────────────────────────────────
function PartnerCard({ category, value, icon, color }: {
  category: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div style={{
      background: "white",
      border: "1px solid rgba(31,61,46,0.1)",
      borderRadius: 10,
      overflow: "hidden",
    }}>
      <div style={{
        background: color,
        padding: "0.65rem 1.1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
      }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "white",
          margin: 0,
        }}>{category}</p>
      </div>
      <div style={{ padding: "1rem 1.1rem" }}>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.875rem",
          color: "#374151",
          lineHeight: 1.65,
          margin: 0,
        }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function CommunityFinanceBrief() {
  return (
    <div style={{
      minHeight: "100vh",
      background: CREAM,
      fontFamily: "Inter, system-ui, sans-serif",
      color: INK,
    }}>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${EVERGREEN} 0%, #2d5a3d 60%, ${LAKE} 100%)`,
        color: "white",
        padding: "3.5rem 2rem 3rem",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.65,
            marginBottom: "0.6rem",
          }}>
            Headwaters Development Services · Partner Brief
          </p>
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.12,
            marginBottom: "1rem",
          }}>
            Gamified Community Finance
          </h1>
          <p style={{
            fontSize: "1.05rem",
            lineHeight: 1.65,
            opacity: 0.88,
            maxWidth: 580,
            marginBottom: "1.75rem",
          }}>
            A two-instrument earning and budgeting system that connects reserve labour with household financial health — built for communities that conventional financial tools have never reached.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {[
              { label: "2027 Launch Target" },
              { label: "XRPL · On-chain" },
              { label: "Reserve-First Design" },
            ].map((tag) => (
              <span key={tag.label} style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 20,
                padding: "0.3rem 0.85rem",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}>{tag.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem 4rem" }}>

        {/* ── 1. The Problem ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <SectionHeader label="Section 1" title="The Problem" color={RUST} />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.25rem",
          }}>
            {[
              {
                heading: "Work and spending are disconnected",
                body: "Reserve community members earn through Helping Hands, but there is no system that ties what they earn to how they spend. Income is invisible inside the household budget.",
              },
              {
                heading: "Participation goes unrewarded",
                body: "Consistent work, savings behaviour, and community participation produce nothing a household can see, track, or use to demonstrate reliability to outside institutions.",
              },
              {
                heading: "Financial tools built elsewhere don't fit",
                body: "Mainstream budgeting apps assume bank accounts, credit cards, and predictable paycheques. None of those assumptions hold in communities operating on a mixed cash and barter economy.",
              },
            ].map((card) => (
              <div key={card.heading} style={{
                background: "white",
                border: "1px solid rgba(31,61,46,0.1)",
                borderRadius: 8,
                padding: "1.25rem",
              }}>
                <p style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: RUST,
                  margin: "0 0 0.5rem",
                  lineHeight: 1.35,
                }}>{card.heading}</p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  lineHeight: 1.65,
                  margin: 0,
                }}>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why This Time ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <div style={{
            background: EVERGREEN,
            borderRadius: 12,
            padding: "2rem 2.25rem",
            color: "white",
            marginBottom: "1.75rem",
          }}>
            <p style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: "0.5rem",
            }}>The honest question</p>
            <p style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "0.75rem",
              opacity: 0.97,
            }}>
              Community currencies have been tried before. They usually fail. What's different here?
            </p>
            <p style={{
              fontSize: "0.9rem",
              lineHeight: 1.7,
              opacity: 0.82,
              maxWidth: 620,
            }}>
              Most past attempts — from hippie co-ops to local currency experiments — collapsed for the same reason: they couldn't sustain the labour side. Once participation dropped, tokens lost utility. Once tokens lost utility, participation dropped further. The death spiral was structural, not accidental.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.1rem",
          }}>
            {[
              {
                heading: "Fix the labour problem first",
                body: "Every past community currency assumed participation would be intrinsically motivated. This system doesn't. Helping Hands + gamified incentives solve the labour problem structurally before anything else is built on top. The token only launches once the earn side is proven.",
                color: CREEK,
                icon: "⚙️",
              },
              {
                heading: "Skills compound like permaculture",
                body: "Helping Hands tasks build practical capacity — food preservation, land stewardship, facility maintenance, logistics. Each skill makes the next task easier and the community less dependent on outside services. Small consistent inputs compound quickly. The economic base grows with the workforce, not ahead of it.",
                color: LAKE,
                icon: "🌱",
              },
              {
                heading: "Everyone gets a cut",
                body: "Broad, equitable participation is the only thing that keeps token velocity healthy. The design distributes earning opportunity across the whole community — not just a founding cohort. When everyone has a reason to earn and spend locally, the circulation loop stays alive.",
                color: RUST,
                icon: "⇄",
              },
              {
                heading: "On-chain, not on trust",
                body: "Past experiments relied on social trust to enforce fairness. Here, escrow, credentials, and the Watershed Score are on the XRPL — auditable by anyone, controlled by no one. The rules don't change because a committee decides they should.",
                color: EVERGREEN,
                icon: "🔒",
              },
            ].map((card) => (
              <div key={card.heading} style={{
                background: "white",
                border: "1px solid rgba(31,61,46,0.1)",
                borderTop: `4px solid ${card.color}`,
                borderRadius: 8,
                padding: "1.25rem",
              }}>
                <p style={{
                  fontSize: "1.3rem",
                  margin: "0 0 0.5rem",
                  lineHeight: 1,
                }}>{card.icon}</p>
                <p style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: card.color,
                  margin: "0 0 0.5rem",
                  lineHeight: 1.3,
                }}>{card.heading}</p>
                <p style={{
                  fontSize: "0.84rem",
                  color: "#374151",
                  lineHeight: 1.65,
                  margin: 0,
                }}>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. The System ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <SectionHeader label="Section 2" title="The System" color={CREEK} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}>
            {/* HWBAND */}
            <div style={{
              background: "white",
              border: "1px solid rgba(31,61,46,0.1)",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{
                background: EVERGREEN,
                padding: "0.8rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>◈</span>
                <p style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                }}>HWBAND</p>
              </div>
              <div style={{ padding: "1.1rem 1.25rem" }}>
                <p style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: EVERGREEN,
                  marginBottom: "0.5rem",
                }}>Community labour credit</p>
                <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.65, margin: 0 }}>
                  Earned through verified task completion on the Helping Hands platform. Redeemable at reserve stores. Community-scoped — no fiat peg, no interprovincial reach.
                </p>
              </div>
            </div>

            {/* RLUSD */}
            <div style={{
              background: "white",
              border: "1px solid rgba(31,61,46,0.1)",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{
                background: LAKE,
                padding: "0.8rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⊞</span>
                <p style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                }}>RLUSD + xbuckets</p>
              </div>
              <div style={{ padding: "1.1rem 1.25rem" }}>
                <p style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: LAKE,
                  marginBottom: "0.5rem",
                }}>Household envelope budgeting</p>
                <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.65, margin: 0 }}>
                  XRPL stablecoin used for named household budget envelopes in the xbuckets app. Members allocate earnings into envelopes — groceries, fuel, school supplies — and spend directly from them.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: FOAM,
            border: `1px solid rgba(74,158,142,0.25)`,
            borderRadius: 10,
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: CREEK,
              marginBottom: "1rem",
            }}>How they connect — the earning circuit</p>
            <CircuitDiagram />
            <p style={{
              fontSize: "0.78rem",
              color: MUTED,
              margin: "0.75rem 0 0",
              textAlign: "center",
              fontStyle: "italic",
            }}>
              HWBAND and RLUSD connect behaviourally, not legally. Two instruments, one circuit.
            </p>
          </div>
        </section>

        {/* ── 3. Gamification Mechanics ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <SectionHeader label="Section 3" title="Gamification Mechanics" color={LAKE} />
          <p style={{
            fontSize: "0.9rem",
            color: MUTED,
            lineHeight: 1.65,
            marginBottom: "1.75rem",
            maxWidth: 600,
          }}>
            Five named mechanics, each anchored to a verifiable on-chain event. No dark patterns, no artificial urgency — the water metaphor runs throughout the member-facing app.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <MechanicCard
              name="The Stream"
              icon="🌊"
              accent={LAKE}
              desc="Confirmed tasks flow directly into named household budget envelopes in real time — earnings arrive as a steady stream, not a delayed payroll batch."
            />
            <MechanicCard
              name="Streak Rewards"
              icon="🔥"
              accent={CREEK}
              desc="Consecutive task completions trigger bonus token drops — visible as a rising water level in the household app, giving members a daily reason to show up."
            />
            <MechanicCard
              name="Community Challenge Pools"
              icon="🏞️"
              accent={EVERGREEN}
              desc="The band posts a collective target; XRPL escrow holds a shared bonus and releases it proportionally when the goal is met on-chain — transparent, automatic, no administrator needed."
            />
            <MechanicCard
              name="Savings Milestones"
              icon="🏆"
              accent={RUST}
              desc="Hitting a household bucket target issues a non-transferable on-chain credential — verifiable by partners without self-reporting, a first financial track record for members who have none."
            />
            <MechanicCard
              name="The Watershed Score"
              icon="📊"
              accent={LAKE_LIGHT}
              desc="A portable reputation combining task history and savings behaviour, stored in an XRPL DID — replaces self-reported work history for members without conventional credit records."
            />
          </div>
        </section>

        {/* ── 4. Regulatory Position ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <SectionHeader label="Section 4" title="Regulatory Position" color={EVERGREEN} />
          <p style={{
            fontSize: "0.9rem",
            color: MUTED,
            lineHeight: 1.65,
            marginBottom: "1.75rem",
            maxWidth: 600,
          }}>
            Plain language. This is a product brief, not a compliance filing. The 2027 launch timeline is deliberate — it aligns with full regulatory clarity under Canada's Stablecoin Act.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}>
            {/* What it is */}
            <div style={{
              background: "white",
              border: `1px solid rgba(31,61,46,0.12)`,
              borderTop: `4px solid ${EVERGREEN}`,
              borderRadius: 8,
              padding: "1.4rem",
            }}>
              <p style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: EVERGREEN,
                marginBottom: "1rem",
              }}>What it is</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  {
                    label: "A community utility token",
                    detail: "HWBAND is a labour credit — earned by completing tasks, redeemable at participating reserve stores. No fiat peg. Community-scoped.",
                  },
                  {
                    label: "Provably fair reward triggers",
                    detail: "All bonus releases are tied to verified on-chain events via XRPL escrow — publicly auditable, no administrator discretion.",
                  },
                  {
                    label: "Aligned with the 2027 timeline",
                    detail: "Canada's Stablecoin Act received Royal Assent in March 2026 and comes into force in 2027. The launch timeline was designed around this window.",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: EVERGREEN,
                      margin: "0 0 0.2rem",
                    }}>✓ {item.label}</p>
                    <p style={{
                      fontSize: "0.82rem",
                      color: "#4b5563",
                      lineHeight: 1.6,
                      margin: 0,
                    }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What it is not */}
            <div style={{
              background: "white",
              border: `1px solid rgba(31,61,46,0.12)`,
              borderTop: `4px solid ${RUST}`,
              borderRadius: 8,
              padding: "1.4rem",
            }}>
              <p style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: RUST,
                marginBottom: "1rem",
              }}>What it is not</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  {
                    label: "Not gambling",
                    detail: "Every reward trigger is tied to a verified labour or savings event. There is no element of chance — outcomes are deterministic and on-chain.",
                  },
                  {
                    label: "Not a regulated stablecoin",
                    detail: "The Stablecoin Act targets instruments with interprovincial reach that claim fiat equivalence. HWBAND has neither. It is community-scoped and labour-denominated.",
                  },
                  {
                    label: "Not speculation",
                    detail: "HWBAND has no secondary market, no exchange listing, and no mechanism for price appreciation. Its value is fixed at the task rate set by the band.",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: RUST,
                      margin: "0 0 0.2rem",
                    }}>✗ {item.label}</p>
                    <p style={{
                      fontSize: "0.82rem",
                      color: "#4b5563",
                      lineHeight: 1.6,
                      margin: 0,
                    }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Partner Angles ── */}
        <section style={{ padding: "3rem 0 2rem", borderBottom: `1px solid rgba(31,61,46,0.1)` }}>
          <SectionHeader label="Section 5" title="Partner Angles" color={LAKE} />
          <p style={{
            fontSize: "0.9rem",
            color: MUTED,
            lineHeight: 1.65,
            marginBottom: "1.75rem",
            maxWidth: 600,
          }}>
            Four categories of partner, each with a distinct reason to be at the table.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "1.1rem",
          }}>
            <PartnerCard
              category="Economic Development Orgs"
              icon="📈"
              color={EVERGREEN}
              value="On-chain outcome metrics that write themselves — no self-reporting, no surveys, no program officer manually collecting data at the end of a funding cycle."
            />
            <PartnerCard
              category="Financial Inclusion Orgs"
              icon="💳"
              color={LAKE}
              value="Measurable behaviour change — savings milestones, streak data, and envelope fill rates — with a public audit trail that satisfies funders without burdening participants."
            />
            <PartnerCard
              category="Credit Unions"
              icon="🏦"
              color={CREEK}
              value="White-label the household budgeting layer (CU tenant mode already exists) and offer members a community wallet that earns through participation, not interest."
            />
            <PartnerCard
              category="Indigenous Development Corps"
              icon="🌿"
              color={RUST}
              value="A community currency model that keeps economic activity on-reserve and builds portable financial identity for members who have none — a foundation for future credit access."
            />
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section style={{ padding: "3rem 0 0" }}>
          <div style={{
            background: `linear-gradient(135deg, ${EVERGREEN}, #2d5a3d)`,
            borderRadius: 12,
            padding: "2.5rem",
            color: "white",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.65,
              marginBottom: "0.65rem",
            }}>2027 Launch · Conversations open now</p>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "0.9rem",
            }}>Get in touch</h2>
            <p style={{
              fontSize: "0.95rem",
              lineHeight: 1.65,
              opacity: 0.85,
              maxWidth: 480,
              margin: "0 auto 1.5rem",
            }}>
              We're opening conversations with economic development orgs, financial inclusion partners, Indigenous development corps, and credit unions ahead of the 2027 launch. If this fits your mandate, let's talk.
            </p>
            <a
              href="mailto:bobbie@headwaters.dev"
              style={{
                display: "inline-block",
                background: "white",
                color: EVERGREEN,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "0.75rem 2rem",
                borderRadius: 7,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              bobbie@headwaters.dev
            </a>
            <p style={{
              fontSize: "0.72rem",
              opacity: 0.55,
              marginTop: "1.25rem",
            }}>
              Headwaters Development Services · Northwestern Ontario · headwaters.dev
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
