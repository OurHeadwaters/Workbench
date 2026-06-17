import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "wouter";
import { fetchKitAccess, setKitToken, getVisitedModules, markModuleVisited, type KitAccessResult } from "@/lib/kitTokens";
import { KIT_MODULES, KIT_HANDOUTS } from "@/data/pjSolutionsKit";

const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const INK = "#2c2c2c";
const MUTED = "#6b6b5e";
const GOLD = "#c89a2e";
const BLACK = "#141414";

type PageState =
  | { status: "loading" }
  | { status: "valid"; data: KitAccessResult }
  | { status: "expired"; expiredAt: string }
  | { status: "invalid" }
  | { status: "error"; message: string };

function LoadingState() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BLACK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "#666",
        fontSize: "0.9rem",
      }}
    >
      Checking your access link…
    </div>
  );
}

function ExpiredState({ expiredAt }: { expiredAt: string }) {
  const date = new Date(expiredAt).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BLACK,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: RUST,
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Parr's Jars · Headwaters
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            color: "white",
            marginBottom: "1rem",
          }}
        >
          This access link has expired.
        </h1>
        <p
          style={{
            color: "#aaa",
            lineHeight: 1.7,
            fontSize: "0.9rem",
            marginBottom: "0.5rem",
          }}
        >
          Your 30-day access window closed on {date}.
        </p>
        <p
          style={{
            color: "#aaa",
            lineHeight: 1.7,
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          To re-access your kit, you can purchase again or reach Bobbie directly.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <a
            href="/parrsjars/kit"
            style={{
              display: "inline-block",
              background: RUST,
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.04em",
              padding: "0.75rem 2rem",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Get the kit again →
          </a>
          <a
            href="mailto:bobbie@ourheadwaters.ca?subject=Kit%20access%20expired"
            style={{
              fontSize: "0.82rem",
              color: GOLD,
              textDecoration: "none",
            }}
          >
            Email Bobbie directly
          </a>
        </div>
      </div>
    </div>
  );
}

function InvalidState() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BLACK,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Parr's Jars · Headwaters
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            color: "white",
            marginBottom: "1rem",
          }}
        >
          Link not found.
        </h1>
        <p
          style={{
            color: "#aaa",
            lineHeight: 1.7,
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          This link doesn't match any kit purchase on record. It may have been
          copied incorrectly, or there could be a typo.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/kits/resend"
            style={{
              display: "inline-block",
              background: EVERGREEN,
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.04em",
              padding: "0.75rem 2rem",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Re-send my access link
          </Link>
          <a
            href="mailto:bobbie@ourheadwaters.ca?subject=Kit%20access%20link%20issue"
            style={{
              fontSize: "0.82rem",
              color: GOLD,
              textDecoration: "none",
            }}
          >
            Email Bobbie directly
          </a>
        </div>
      </div>
    </div>
  );
}

const PJ_SOLUTIONS_HUB_URL = "/parrsjars/hub";

function KitContentView({ data, token }: { data: KitAccessResult; token: string }) {
  const expiryDate = new Date(data.expires_at).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPjSolutionsKit = data.kit.id === "pj-solutions-kit";

  const [visitedTitles, setVisitedTitles] = useState<Set<string>>(() =>
    getVisitedModules(token)
  );

  const handleModuleClick = useCallback(
    (moduleTitle: string) => {
      markModuleVisited(token, moduleTitle);
      setVisitedTitles(getVisitedModules(token));
    },
    [token]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BLACK,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: EVERGREEN,
          padding: "2.5rem 1.5rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(244,237,224,0.5)",
            fontWeight: 700,
            marginBottom: "0.6rem",
          }}
        >
          Parr's Jars · Headwaters
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            fontWeight: 900,
            color: CREAM,
            lineHeight: 1.1,
            marginBottom: "0.6rem",
          }}
        >
          {data.kit.name}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(0.88rem, 2.4vw, 1rem)",
            color: "rgba(244,237,224,0.7)",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 1rem",
          }}
        >
          {data.kit.tagline}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "0.4rem 1rem",
            fontSize: "0.75rem",
            color: "rgba(244,237,224,0.75)",
          }}
        >
          <span style={{ color: GOLD }}>✓</span>
          Access active until {expiryDate}
        </div>
      </div>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Welcome + primary CTA */}
        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 8,
            borderLeft: `4px solid ${GOLD}`,
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Welcome, {data.buyer_name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "0.95rem",
              color: "#ddd",
              lineHeight: 1.7,
              marginBottom: "1.25rem",
            }}
          >
            {data.kit.contentNote}
          </p>

          {/* Primary action: open the kit content */}
          {isPjSolutionsKit ? (
            <a
              href={PJ_SOLUTIONS_HUB_URL}
              style={{
                display: "inline-block",
                background: RUST,
                color: "white",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.04em",
                padding: "0.8rem 1.75rem",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Open your kit — all 5 modules &amp; 20+ handouts →
            </a>
          ) : (
            <p
              style={{
                fontSize: "0.83rem",
                color: MUTED,
                fontStyle: "italic",
              }}
            >
              Your materials are included in the delivery email. Check your inbox for the Headwaters email.
            </p>
          )}
        </div>

        {/* Full kit contents — modules + handouts (PJ Solutions Kit only) */}
        {isPjSolutionsKit && (
          <>
            <div style={{ marginBottom: "2rem" }}>
              {/* Progress summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  5 Modules · 20+ Handouts
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 20,
                    padding: "0.3rem 0.85rem",
                  }}
                >
                  {/* Progress dots */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {KIT_MODULES.map((mod) => (
                      <div
                        key={mod.title}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: visitedTitles.has(mod.title) ? GOLD : "#333",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: visitedTitles.size === KIT_MODULES.length ? GOLD : "#888",
                      fontWeight: visitedTitles.size === KIT_MODULES.length ? 700 : 400,
                    }}
                  >
                    {visitedTitles.size} of {KIT_MODULES.length} modules visited
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {KIT_MODULES.map((mod, i) => {
                  const isVisited = visitedTitles.has(mod.title);
                  return (
                    <div
                      key={mod.title}
                      onClick={() => handleModuleClick(mod.title)}
                      style={{
                        background: "#1e1e1e",
                        borderRadius: 8,
                        border: isVisited ? `1px solid ${mod.color}40` : "1px solid #2a2a2a",
                        borderLeft: `4px solid ${mod.color}`,
                        overflow: "hidden",
                        display: "flex",
                        flexWrap: "wrap",
                        cursor: "pointer",
                        position: "relative",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {/* Visited badge */}
                      {isVisited && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            background: mod.color,
                            color: "white",
                            borderRadius: 12,
                            padding: "0.15rem 0.55rem",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            zIndex: 1,
                          }}
                        >
                          <span>✓</span> Visited
                        </div>
                      )}
                      <div style={{ flex: "1 1 240px", padding: "1.25rem 1.5rem" }}>
                        <p
                          style={{
                            fontSize: "0.58rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: mod.color,
                            fontWeight: 700,
                            marginBottom: "0.3rem",
                          }}
                        >
                          Module {i + 1}
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "1rem",
                            fontWeight: 800,
                            color: "white",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {mod.title}
                        </h3>
                        <p style={{ color: "#999", fontSize: "0.8rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                          {mod.desc}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          {mod.items.map((item) => (
                            <li key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.76rem", color: "#bbb" }}>
                              <span style={{ color: mod.color, flexShrink: 0 }}>→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        {!isVisited && (
                          <p style={{ fontSize: "0.65rem", color: "#555", marginTop: "0.75rem", margin: "0.75rem 0 0" }}>
                            Tap to mark as visited
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          flex: "0 0 110px",
                          minHeight: 110,
                          overflow: "hidden",
                          background: "#111",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={mod.img}
                          alt={mod.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isVisited ? 0.85 : 0.65, transition: "opacity 0.2s" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Handouts list */}
            <div
              style={{
                background: "#111",
                borderRadius: 8,
                border: "1px solid #222",
                padding: "1.25rem 1.5rem",
                marginBottom: "2rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: MUTED,
                  fontWeight: 700,
                  marginBottom: "0.85rem",
                }}
              >
                Also included
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "0.6rem",
                }}
              >
                {KIT_HANDOUTS.map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 6,
                      padding: "0.55rem 0.8rem",
                      fontSize: "0.76rem",
                      color: "#bbb",
                      display: "flex",
                      gap: "0.45rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: GOLD, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Arc note if present */}
        {data.kit.arcNote && (
          <div
            style={{
              background: "#1a2e22",
              borderRadius: 8,
              border: `1px solid ${EVERGREEN}`,
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#5a9e6e",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Community Money Machine — Steward Registration
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#b8d4bf",
                lineHeight: 1.7,
              }}
            >
              {data.kit.arcNote}
            </p>
          </div>
        )}

        {/* Access info */}
        <div
          style={{
            background: "#111",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Your access
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.83rem",
              color: "#999",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.25rem" }}>
              <span>Order</span>
              <span style={{ color: "#ccc", fontFamily: "monospace", fontSize: "0.78rem" }}>
                {data.purchase_id}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.25rem" }}>
              <span>Access expires</span>
              <span style={{ color: "#ccc" }}>{expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Re-send / bookmark note */}
        <div
          style={{
            fontSize: "0.8rem",
            color: MUTED,
            lineHeight: 1.65,
            textAlign: "center",
            borderTop: "1px solid #222",
            paddingTop: "1.5rem",
          }}
        >
          <p style={{ marginBottom: "0.4rem" }}>
            Bookmark this page or save the email to return to your kit.
          </p>
          <p>
            Lost the email?{" "}
            <Link
              href="/kits/resend"
              style={{ color: GOLD, textDecoration: "none" }}
            >
              Re-send it here →
            </Link>
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Questions?{" "}
            <a
              href="mailto:bobbie@ourheadwaters.ca"
              style={{ color: RUST, textDecoration: "none" }}
            >
              bobbie@ourheadwaters.ca
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export function KitAccessPage() {
  const params = useParams<{ token: string }>();
  const token = params.token ?? "";
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }

    let cancelled = false;

    fetchKitAccess(token)
      .then((result) => {
        if (cancelled) return;
        setKitToken(result.kit.id, {
          token,
          expiresAt: result.expires_at,
          buyerName: result.buyer_name,
        });
        setState({ status: "valid", data: result });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { status?: number }).status;
        if (status === 410) {
          const expiredAt = (err as { expiredAt?: string }).expiredAt ?? "";
          setState({ status: "expired", expiredAt });
        } else if (status === 404 || status === 400) {
          setState({ status: "invalid" });
        } else {
          const message =
            err instanceof Error ? err.message : "Something went wrong.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "expired") return <ExpiredState expiredAt={state.expiredAt} />;
  if (state.status === "invalid") return <InvalidState />;
  if (state.status === "error") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          color: "#aaa",
          fontSize: "0.9rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ marginBottom: "0.75rem" }}>{state.message}</p>
          <a href="mailto:bobbie@ourheadwaters.ca" style={{ color: GOLD }}>
            bobbie@ourheadwaters.ca
          </a>
        </div>
      </div>
    );
  }

  return <KitContentView data={state.data} token={token} />;
}
