const DARK      = "#1a1008";
const AMBER     = "#C97228";
const CREAM     = "#f4ede0";
const EVERGREEN = "#1f3d2e";
const WARM_MID  = "#2c1e10";
const MUTED     = "rgba(244,237,224,0.55)";
const WHITE     = "#ffffff";

const card = (bg: string, border?: string): React.CSSProperties => ({
  background: bg,
  borderRadius: "18px",
  padding: "28px 24px",
  marginBottom: "14px",
  border: border ? `1.5px solid ${border}` : undefined,
});

const sectionLabel: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: AMBER,
  margin: "0 0 10px",
  fontFamily: "Inter, system-ui, sans-serif",
};

const headline: React.CSSProperties = {
  fontFamily: "Fraunces, Georgia, serif",
  fontSize: "26px",
  fontWeight: 700,
  lineHeight: 1.15,
  margin: "0 0 10px",
  color: CREAM,
};

const body: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "15px",
  lineHeight: 1.65,
  color: MUTED,
  margin: "0 0 6px",
};

const bullet = (emoji: string, text: string, sub?: string) => (
  <div key={text} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "flex-start" }}>
    <span style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>{emoji}</span>
    <div>
      <p style={{ ...body, color: CREAM, fontWeight: 600, margin: 0 }}>{text}</p>
      {sub && <p style={{ ...body, fontSize: "13px", marginTop: "3px", margin: "3px 0 0" }}>{sub}</p>}
    </div>
  </div>
);

import React from "react";

export default function GillesPitch() {
  return (
    <div style={{
      background: DARK,
      minHeight: "100vh",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex",
      justifyContent: "center",
      padding: "0 0 60px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 16px" }}>

        {/* ── HERO ───────────────────────────────────────────── */}
        <div style={{ padding: "48px 8px 24px" }}>
          <p style={{ ...sectionLabel, color: "rgba(201,114,40,0.7)", margin: "0 0 12px" }}>
            G.M. Pepin Holdings · Private
          </p>
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "48px",
            fontWeight: 700,
            color: WHITE,
            margin: "0 0 14px",
            lineHeight: 1.05,
          }}>
            Gilles.
          </h1>
          <p style={{ ...body, fontSize: "17px", color: "rgba(244,237,224,0.75)", margin: 0 }}>
            40 years of knowing exactly what to do.<br />
            None of it written down.
          </p>
        </div>

        {/* ── THE PROBLEM ────────────────────────────────────── */}
        <div style={{ ...card(WARM_MID, "rgba(201,114,40,0.2)") }}>
          <p style={sectionLabel}>The problem you already know</p>
          <h2 style={{ ...headline, fontSize: "22px" }}>
            Everything runs through your two ears.
          </h2>
          {bullet("⚡", "When you're not there — it slows down.")}
          {bullet("📉", "When you step back — it could collapse.")}
          {bullet("🔒", "You can't sell a business that only works because of you.")}
          <p style={{ ...body, color: AMBER, fontWeight: 600, margin: "10px 0 0" }}>
            You said it yourself. Twice.
          </p>
        </div>

        {/* ── WHATSAPP ───────────────────────────────────────── */}
        <div style={{ ...card("#1e2d1e", "rgba(31,61,46,0.8)") }}>
          <p style={{ ...sectionLabel, color: "#6aad7a" }}>What you're already doing right</p>
          <h2 style={{ ...headline, fontSize: "22px" }}>
            WhatsApp works fine.
          </h2>
          <p style={{ ...body, color: "rgba(244,237,224,0.7)", marginBottom: "16px" }}>
            Every message you send is knowledge. Experience. 40 years of knowing exactly what to do.
          </p>
          <div style={{
            background: "rgba(31,61,46,0.6)",
            borderRadius: "12px",
            padding: "16px 18px",
            borderLeft: `3px solid #6aad7a`,
          }}>
            <p style={{ ...body, color: CREAM, fontStyle: "italic", margin: 0, fontSize: "16px" }}>
              The problem isn't the message.<br />
              <strong style={{ color: WHITE }}>The problem is — it disappears.</strong>
            </p>
          </div>
        </div>

        {/* ── FIRE ESCAPE ────────────────────────────────────── */}
        <div style={{ ...card(WARM_MID, `rgba(201,114,40,0.3)`) }}>
          <p style={sectionLabel}>You built Fire & Security Centre</p>
          <h2 style={{ ...headline, fontSize: "22px" }}>
            Right now your messages put out today's fire.
          </h2>
          <p style={{ ...body, marginBottom: "20px" }}>
            What if those same messages also —
          </p>
          {bullet("📋", "Wrote the fire escape plan", "So the next crew knows what to do")}
          {bullet("🧯", "Showed everyone where the extinguisher is", "Without calling you")}
          {bullet("🔁", "Made it repeatable", "Same work. Same words. Just captured.")}
        </div>

        {/* ── THE PROPOSAL ───────────────────────────────────── */}
        <div style={{
          background: AMBER,
          borderRadius: "18px",
          padding: "28px 24px",
          marginBottom: "14px",
        }}>
          <p style={{ ...sectionLabel, color: "rgba(26,16,8,0.65)" }}>What I'm proposing</p>
          <h2 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "26px",
            fontWeight: 700,
            color: DARK,
            lineHeight: 1.15,
            margin: "0 0 16px",
          }}>
            I trail your operation.<br />Not to change it.<br />To learn it.
          </h2>
          {[
            ["You do what you do", "I document the knowledge nuggets"],
            ["No new systems to learn", "No planning room required"],
            ["French or English", "Voice note on your time"],
          ].map(([a, b]) => (
            <div key={a} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: DARK, flexShrink: 0, marginTop: "7px" }} />
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{a}</p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "rgba(26,16,8,0.65)", lineHeight: 1.4 }}>{b}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ADJACENT NOT PRESENT ───────────────────────────── */}
        <div style={{ ...card(WARM_MID, "rgba(201,114,40,0.2)") }}>
          <p style={sectionLabel}>How it works in practice</p>
          <h2 style={{ ...headline, fontSize: "22px" }}>
            I work like your wife works.
          </h2>
          <p style={{ ...body, marginBottom: "16px" }}>
            She's not on-site every day. She doesn't pour concrete.
            But the operation would collapse without what she does behind it.
          </p>
          <div style={{
            background: "rgba(201,114,40,0.12)",
            borderRadius: "12px",
            padding: "16px 18px",
            borderLeft: `3px solid ${AMBER}`,
            marginBottom: "16px",
          }}>
            <p style={{ ...body, color: CREAM, fontWeight: 600, fontSize: "15px", margin: 0 }}>
              Behind the operation, not in it.<br />
              Adjacent — not absent.
            </p>
          </div>
          <p style={{ ...body, margin: 0 }}>
            I capture what comes out of your ears so it doesn't get lost.
            A few days a month is enough — because the work happens between the days.
          </p>
        </div>

        {/* ── LABOUR ─────────────────────────────────────────── */}
        <div style={{ ...card(WARM_MID, "rgba(201,114,40,0.15)") }}>
          <p style={sectionLabel}>The labour problem</p>
          <h2 style={{ ...headline, fontSize: "20px" }}>
            You can't hire reliable people right now.
          </h2>
          <p style={{ ...body, marginBottom: "16px" }}>That's real. But here's the question:</p>
          <div style={{
            background: "rgba(201,114,40,0.15)",
            borderRadius: "12px",
            padding: "16px 18px",
            borderLeft: `3px solid ${AMBER}`,
            marginBottom: "16px",
          }}>
            <p style={{ ...body, color: CREAM, fontWeight: 600, fontSize: "16px", margin: 0 }}>
              Would reliable people stay longer if the job was clearer?
            </p>
          </div>
          <p style={{ ...body, margin: 0 }}>
            Day 1 with a real orientation — not a hope and a handshake. That's what this builds toward.
          </p>
        </div>

        {/* ── 2 YEARS ────────────────────────────────────────── */}
        <div style={{
          background: EVERGREEN,
          borderRadius: "18px",
          padding: "28px 24px",
          marginBottom: "14px",
        }}>
          <p style={{ ...sectionLabel, color: "rgba(244,237,224,0.55)" }}>In 2 years</p>
          <h2 style={{ ...headline, fontSize: "22px" }}>
            Same work.<br />But now it scales.
          </h2>
          {[
            ["✅", "You're not the only one who knows how it works"],
            ["✅", "New crews get up to speed faster"],
            ["✅", "The chief sees a model that runs without hand-holding"],
            ["✅", "You have something worth passing on — or selling"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
              <p style={{ ...body, color: CREAM, margin: 0, fontSize: "14px" }}>{text}</p>
            </div>
          ))}
        </div>

        {/* ── LEGACY ─────────────────────────────────────────── */}
        <div style={{
          background: "#0f0a05",
          borderRadius: "18px",
          padding: "28px 24px",
          marginBottom: "14px",
          border: "1.5px solid rgba(201,114,40,0.25)",
        }}>
          <p style={sectionLabel}>The bigger picture</p>
          <h2 style={{ ...headline, fontSize: "24px", color: WHITE }}>
            You get to be the guy<br />who figured it out first.
          </h2>
          <p style={{ ...body, color: "rgba(244,237,224,0.7)", marginBottom: "20px" }}>
            40 years of field knowledge — building in the north, understanding reserves, knowing what actually works.
            That doesn't exist anywhere else.
          </p>
          <div style={{
            background: "rgba(201,114,40,0.1)",
            borderRadius: "12px",
            padding: "16px 18px",
            borderLeft: `3px solid ${AMBER}`,
          }}>
            <p style={{ ...body, color: CREAM, fontWeight: 600, fontSize: "15px", margin: "0 0 8px" }}>
              What we're building together:
            </p>
            {[
              "A model the next developer can follow",
              "A system that runs when you're not in the room",
              "Something with a shelf life beyond one client",
            ].map((t) => (
              <div key={t} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: "8px" }} />
                <p style={{ ...body, color: "rgba(244,237,224,0.75)", margin: 0, fontSize: "13px" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── COST / ASK ─────────────────────────────────────── */}
        <div style={{ ...card("#0f0a05", `rgba(201,114,40,0.4)`) }}>
          <p style={sectionLabel}>What it costs you right now</p>
          <h2 style={{ ...headline, fontSize: "28px", color: WHITE }}>
            Nothing changes.
          </h2>
          <p style={{ ...body, fontSize: "16px", color: "rgba(244,237,224,0.8)", marginBottom: "20px" }}>
            You keep running your operation.<br />You keep using WhatsApp.
          </p>
          <div style={{
            borderTop: `1px solid rgba(201,114,40,0.3)`,
            paddingTop: "18px",
          }}>
            <p style={{ ...sectionLabel, marginBottom: "8px" }}>All I'm asking</p>
            <p style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "20px",
              fontWeight: 700,
              color: AMBER,
              margin: 0,
              lineHeight: 1.3,
            }}>
              Let me walk alongside<br />for one season.
            </p>
          </div>
        </div>

        {/* ── SIGN OFF ───────────────────────────────────────── */}
        <div style={{ padding: "24px 8px 0", textAlign: "center" }}>
          <p style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "22px",
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1.4,
            marginBottom: "16px",
          }}>
            "You can't sell a business<br />with just one client."
          </p>
          <p style={{ ...body, textAlign: "center", marginBottom: "4px" }}>
            You don't have to build forever.
          </p>
          <p style={{ ...body, textAlign: "center", color: CREAM, marginBottom: "28px" }}>
            But right now, everything you've learned<br />is still just in your head.
          </p>
          <p style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "18px",
            fontWeight: 700,
            color: AMBER,
            margin: "0 0 4px",
          }}>
            Let's get it out — and put it to work.
          </p>
          <p style={{ ...body, fontSize: "13px", marginTop: "24px", color: "rgba(244,237,224,0.35)" }}>
            — Bobbie Parr · Headwaters Development Services<br />
            ourheadwaters.ca
          </p>
        </div>

      </div>
    </div>
  );
}
