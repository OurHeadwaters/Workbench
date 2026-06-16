import { useState } from "react";
import { resendKitAccess } from "@/lib/kitTokens";

const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const MUTED = "#6b6b5e";
const GOLD = "#c89a2e";
const BLACK = "#141414";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "sent" }
  | { status: "not_found" }
  | { status: "error"; message: string };

export function KitResendPage() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setFormState({ status: "submitting" });

    try {
      const result = await resendKitAccess(trimmed);
      if (result.sent) {
        setFormState({ status: "sent" });
      } else {
        setFormState({ status: "not_found" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setFormState({ status: "error", message });
    }
  }

  const isSubmitting = formState.status === "submitting";

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
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(244,237,224,0.4)",
            fontWeight: 700,
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          Parr's Jars · Headwaters
        </p>

        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "white",
            marginBottom: "0.75rem",
            textAlign: "center",
          }}
        >
          Re-send my access link
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.9rem",
            color: "#aaa",
            lineHeight: 1.65,
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          Enter the email address you used when you purchased your kit. If
          there's an active access link on file, we'll re-send it.
        </p>

        {formState.status === "sent" ? (
          <div
            style={{
              background: "#1a2e22",
              border: `1px solid ${EVERGREEN}`,
              borderRadius: 8,
              padding: "1.75rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#5a9e6e",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Check your inbox
            </p>
            <p style={{ color: "#b8d4bf", lineHeight: 1.7, fontSize: "0.9rem" }}>
              If that email address has an active kit on file, the access link is on
              its way. Check your inbox (and spam folder) for an email from
              Headwaters.
            </p>
          </div>
        ) : formState.status === "not_found" ? (
          <div
            style={{
              background: "#1e1a14",
              border: `1px solid #4a3a20`,
              borderRadius: 8,
              padding: "1.75rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              No active kit found
            </p>
            <p style={{ color: "#c8b88a", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: "1rem" }}>
              We couldn't find an active kit for that email address. It may
              have expired, or it might be under a different address.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "center" }}>
              <button
                onClick={() => {
                  setEmail("");
                  setFormState({ status: "idle" });
                }}
                style={{
                  background: "transparent",
                  border: `1px solid #4a3a20`,
                  color: GOLD,
                  fontSize: "0.83rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Try a different email
              </button>
              <a
                href="mailto:bobbie@ourheadwaters.ca?subject=Kit%20access%20help"
                style={{ fontSize: "0.82rem", color: MUTED, textDecoration: "none" }}
              >
                Email Bobbie directly
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => { void handleSubmit(e); }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="resend-email"
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#999",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.04em",
                }}
              >
                Email address
              </label>
              <input
                id="resend-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: 6,
                  padding: "0.75rem 1rem",
                  fontSize: "0.95rem",
                  color: "white",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              />
            </div>

            {formState.status === "error" && (
              <p style={{ fontSize: "0.8rem", color: RUST, margin: 0 }}>
                {formState.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              style={{
                background: EVERGREEN,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                padding: "0.8rem 1.5rem",
                borderRadius: 6,
                border: "none",
                cursor: isSubmitting || !email.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !email.trim() ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {isSubmitting ? "Sending…" : "Re-send my access link"}
            </button>

            <p
              style={{
                fontSize: "0.75rem",
                color: MUTED,
                lineHeight: 1.5,
                textAlign: "center",
                margin: 0,
              }}
            >
              We won't create an account or send marketing email. This only
              resends the access link you already purchased.
            </p>
          </form>
        )}

        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #222",
            textAlign: "center",
          }}
        >
          <a
            href="/headwaters/products"
            style={{ fontSize: "0.8rem", color: MUTED, textDecoration: "none" }}
          >
            ← Back to Parr's Jars
          </a>
        </div>
      </div>
    </div>
  );
}
