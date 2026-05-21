import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useClerk } from "@clerk/react";
import { RavenCompanion } from "@/components/RavenCompanion";

export function UpgradeNudge({ tier }: { tier: string }) {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "var(--cream)" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "14px 20px", backgroundColor: "var(--parchment)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 19.5 C4 18.1 5.1 17 6.5 17 L20 17" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6.5 2 L20 2 L20 22 L6.5 22 C5.1 22 4 20.9 4 19.5 L4 4.5 C4 3.1 5.1 2 6.5 2Z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M8 7 L16 7 M8 11 L14 11" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--forest)" }}>
              Field Guide Finance
            </span>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" }).then(() => navigate("/"))}
            style={{ fontSize: "0.82rem", color: "var(--bark-light)", background: "none", border: "none", cursor: "pointer", padding: "6px 4px" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div
          style={{
            maxWidth: 440,
            width: "100%",
            borderRadius: 20,
            border: "1px solid var(--border)",
            backgroundColor: "var(--parchment)",
            padding: "40px 36px",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Northern accent top bar */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, var(--forest) 0%, var(--amber) 50%, var(--ice-dark) 100%)",
            }}
          />

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "var(--amber-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "2px solid var(--amber-mid)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="5" y="12" width="18" height="14" rx="3" stroke="var(--amber)" strokeWidth="1.6"/>
              <path d="M9 12 L9 8 C9 5.2 10.8 3 14 3 C17.2 3 19 5.2 19 8 L19 12" stroke="var(--amber)" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="14" cy="19" r="2" fill="var(--amber)"/>
            </svg>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <RavenCompanion delay={600} />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--forest)",
              marginBottom: 12,
              lineHeight: 1.25,
            }}
          >
            The trail requires a higher pass
          </h1>

          <p style={{ fontSize: "0.88rem", color: "var(--bark)", lineHeight: 1.7, marginBottom: 12, fontFamily: "var(--font-lora)" }}>
            Field Guide Finance is open to <strong>Harvest household</strong> and <strong>Pro producer</strong> members
            of 807 Benefits.
          </p>

          {tier && tier !== "none" && tier !== "unknown" && (
            <div
              style={{
                fontSize: "0.78rem",
                marginBottom: 20,
                padding: "8px 14px",
                borderRadius: 8,
                backgroundColor: "var(--cream-dark)",
                color: "var(--bark)",
                display: "inline-block",
              }}
            >
              Your current tier: <strong style={{ color: "var(--bark)" }}>{tier}</strong>
            </div>
          )}

          <p style={{ fontSize: "0.84rem", color: "var(--bark-light)", marginBottom: 24, fontFamily: "var(--font-lora)" }}>
            Upgrading is handled through the 807 Benefits co-op checkout.
          </p>

          <a
            href="https://807benefits.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="trail-sign-btn"
            style={{
              display: "inline-flex",
              width: "100%",
              justifyContent: "center",
              backgroundColor: "var(--forest)",
              color: "var(--cream)",
              padding: "13px 20px",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Upgrade at 807benefits.ca
            <ArrowRight size={15} />
          </a>

          {/* Northern landscape sketch */}
          <div aria-hidden="true" style={{ marginTop: 28, opacity: 0.18 }}>
            <svg width="100%" height="40" viewBox="0 0 360 40" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d="M0 35 Q30 20 60 30 Q90 38 120 25 Q150 12 180 28 Q210 40 240 22 Q270 8 300 26 Q330 38 360 30 L360 40 L0 40Z" fill="var(--forest)"/>
              <path d="M0 38 Q40 30 80 34 Q120 38 160 32 Q200 26 240 34 Q280 40 320 34 L360 36 L360 40 L0 40Z" fill="var(--moss)"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
