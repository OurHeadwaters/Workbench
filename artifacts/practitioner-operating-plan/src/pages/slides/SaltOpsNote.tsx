/**
 * SaltOpsNote.tsx — VI · 06 Slip-Flow Rehearsal: Dry-Run Script + Email Mockups
 *
 * Two inline email render mockups (slip + shipped, desktop + mobile widths)
 * sit beside the 10-minute dry-run checklist the OM follows before the first
 * live cohort send. Includes a rollback procedure if anything renders wrong.
 */

import { useState } from "react";

type EmailType = "slip" | "shipped";
type ViewWidth = "desktop" | "mobile";

const STEPS = [
  {
    time: "0:00",
    action: "Open Klaviyo → Flows → Salt Slip-Flow → select the \u201cSlip Issued\u201d trigger branch.",
    check: "Flow status shows Active. If it shows Draft, do NOT proceed — alert the practitioner.",
  },
  {
    time: "1:00",
    action: "Confirm the seed list \u201cHeadwaters Salt \u2014 Internal Seed\u201d has all three addresses (previous slide).",
    check: "Member count = 3. If fewer, add missing addresses before continuing.",
  },
  {
    time: "2:30",
    action: "Fire the test payload (copy from previous slide) via Klaviyo → Metrics → Create Event. Set $email to ops+salttest@headwaters.coop.",
    check: "Metrics page shows \u201cSlip Issued \u00b7 1 event\u201d within 60 seconds.",
  },
  {
    time: "4:00",
    action: "Check all three seed inboxes. Allow up to 5 minutes for delivery. Compare rendered email against the mockups on this slide.",
    check: "Subject line, batch label, pickup window, and product name all match. No broken images or raw {{variables}}.",
  },
  {
    time: "6:00",
    action: "Open the mobile seed inbox on the shared phone. Rotate to portrait. Confirm text is legible at 390 px.",
    check: "CTA button is full-width, not cut off. Product image scales correctly. No horizontal scroll.",
  },
  {
    time: "7:30",
    action: "Open the dark-mode seed inbox in Apple Mail. Switch to dark mode if needed.",
    check: "Text is readable. Logo does not invert to black-on-black. Background is not pure white.",
  },
  {
    time: "9:00",
    action: "If all checks pass: in Klaviyo, set the flow trigger to target the live cohort list. Note the send time in the ops log.",
    check: "Flow is live. You're done.",
  },
];

const ROLLBACK = [
  "Pause the flow immediately in Klaviyo → Flows → Salt Slip-Flow → Pause.",
  "Screenshot the broken render and send to the practitioner + IT.",
  "Do NOT re-enable until the practitioner confirms the template fix.",
  "No emails will re-send to customers who did not receive them — Klaviyo does not retry after a pause. The OM must manually re-trigger after the fix is confirmed.",
];

function SlipEmailMockup({ width }: { width: ViewWidth }) {
  const isDesktop = width === "desktop";
  const w = isDesktop ? "w-full" : "w-[52%]";
  return (
    <div
      className={`${w} rounded-[5px] overflow-hidden flex flex-col`}
      style={{ border: "1px solid rgba(244,237,224,0.15)", background: "#f9f6f1" }}
    >
      {/* Email chrome */}
      <div style={{ background: "#e8e3db", padding: isDesktop ? "6px 10px" : "5px 8px" }}>
        <div className="font-mono" style={{ fontSize: isDesktop ? "0.62vw" : "0.58vw", color: "#6b6560" }}>
          From: salt@headwaters.coop &nbsp;·&nbsp; Subject: Your Salt Slip — Batch 9, Spring 2026
        </div>
      </div>
      {/* Email body */}
      <div style={{ padding: isDesktop ? "12px 14px" : "10px 10px", flex: 1 }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: isDesktop ? 10 : 8 }}>
          <div style={{ width: isDesktop ? 22 : 18, height: isDesktop ? 22 : 18, borderRadius: "50%", background: "#1f3d2e" }} />
          <span className="font-mono" style={{ fontSize: isDesktop ? "0.65vw" : "0.6vw", color: "#1f3d2e", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Headwaters
          </span>
        </div>
        {/* Hero band */}
        <div style={{ background: "#1f3d2e", borderRadius: 4, padding: isDesktop ? "10px 12px" : "8px 10px", marginBottom: isDesktop ? 10 : 8 }}>
          <div className="font-display" style={{ fontSize: isDesktop ? "1.05vw" : "0.9vw", color: "#f4ede0", fontWeight: 600, lineHeight: 1.2 }}>
            Your slip is ready.
          </div>
          <div className="font-body" style={{ fontSize: isDesktop ? "0.72vw" : "0.66vw", color: "#c8bfb0", marginTop: 3 }}>
            Batch 9 · Deer Lake Wild Boreal Salt · 2.5 kg
          </div>
        </div>
        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isDesktop ? "6px 10px" : "5px 8px", marginBottom: isDesktop ? 10 : 8 }}>
          {[
            ["Pickup location", "Dryden Hub"],
            ["Pickup window", "May 19 – 23, 2026"],
            ["Cohort", "Spring 2026"],
            ["Slip ID", "TEST-001"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="font-mono" style={{ fontSize: isDesktop ? "0.58vw" : "0.54vw", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</div>
              <div className="font-body" style={{ fontSize: isDesktop ? "0.68vw" : "0.62vw", color: "#2a2a2a", fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div style={{ background: "#b85a3e", borderRadius: 3, textAlign: "center", padding: isDesktop ? "6px 0" : "5px 0" }}>
          <span className="font-mono" style={{ fontSize: isDesktop ? "0.65vw" : "0.6vw", color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            View Full Slip →
          </span>
        </div>
      </div>
    </div>
  );
}

function ShippedEmailMockup({ width }: { width: ViewWidth }) {
  const isDesktop = width === "desktop";
  const w = isDesktop ? "w-full" : "w-[52%]";
  return (
    <div
      className={`${w} rounded-[5px] overflow-hidden flex flex-col`}
      style={{ border: "1px solid rgba(244,237,224,0.15)", background: "#f9f6f1" }}
    >
      {/* Email chrome */}
      <div style={{ background: "#e8e3db", padding: isDesktop ? "6px 10px" : "5px 8px" }}>
        <div className="font-mono" style={{ fontSize: isDesktop ? "0.62vw" : "0.58vw", color: "#6b6560" }}>
          From: salt@headwaters.coop &nbsp;·&nbsp; Subject: Batch 9 Shipped — Arrives May 19–23
        </div>
      </div>
      {/* Email body */}
      <div style={{ padding: isDesktop ? "12px 14px" : "10px 10px", flex: 1 }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: isDesktop ? 10 : 8 }}>
          <div style={{ width: isDesktop ? 22 : 18, height: isDesktop ? 22 : 18, borderRadius: "50%", background: "#1f3d2e" }} />
          <span className="font-mono" style={{ fontSize: isDesktop ? "0.65vw" : "0.6vw", color: "#1f3d2e", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Headwaters
          </span>
        </div>
        {/* Hero band */}
        <div style={{ background: "#2d5240", borderRadius: 4, padding: isDesktop ? "10px 12px" : "8px 10px", marginBottom: isDesktop ? 10 : 8 }}>
          <div className="font-display" style={{ fontSize: isDesktop ? "1.05vw" : "0.9vw", color: "#f4ede0", fontWeight: 600, lineHeight: 1.2 }}>
            It's on the way.
          </div>
          <div className="font-body" style={{ fontSize: isDesktop ? "0.72vw" : "0.66vw", color: "#a8c4b4", marginTop: 3 }}>
            Batch 9 · Departed Deer Lake · May 16, 2026
          </div>
        </div>
        {/* Tracking row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isDesktop ? 10 : 8, padding: isDesktop ? "6px 8px" : "5px 6px", borderRadius: 3, background: "#f0ece4", border: "1px solid #ddd7cc" }}>
          <div>
            <div className="font-mono" style={{ fontSize: isDesktop ? "0.58vw" : "0.54vw", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em" }}>Est. arrival</div>
            <div className="font-body" style={{ fontSize: isDesktop ? "0.72vw" : "0.64vw", color: "#1f3d2e", fontWeight: 700 }}>May 19 – 23, 2026</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: isDesktop ? "0.58vw" : "0.54vw", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em" }}>Hub</div>
            <div className="font-body" style={{ fontSize: isDesktop ? "0.72vw" : "0.64vw", color: "#1f3d2e", fontWeight: 700 }}>Dryden Hub</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: isDesktop ? "0.58vw" : "0.54vw", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em" }}>Qty</div>
            <div className="font-body" style={{ fontSize: isDesktop ? "0.72vw" : "0.64vw", color: "#1f3d2e", fontWeight: 700 }}>2.5 kg</div>
          </div>
        </div>
        {/* CTA */}
        <div style={{ background: "#1f3d2e", borderRadius: 3, textAlign: "center", padding: isDesktop ? "6px 0" : "5px 0" }}>
          <span className="font-mono" style={{ fontSize: isDesktop ? "0.65vw" : "0.6vw", color: "#e9c8a8", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            View Shipment Details →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SaltOpsNote() {
  const [emailType, setEmailType] = useState<EmailType>("slip");
  const [viewWidth, setViewWidth] = useState<ViewWidth>("desktop");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[1.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              VI · 06 — Slip-Flow Rehearsal · Dry-Run + Email Renders
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            10 min · OM runs this once before the cohort send
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.4vw] leading-[1] tracking-tight text-paper mb-[0.5vh]">
          What correct looks like.
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[2vh] max-w-[70vw]">
          Follow the checklist left to right. If the seed preview doesn't match these renders, stop and roll back.
        </div>

        <div className="flex-1 grid grid-cols-[1.1fr_0.9fr] gap-[2.5vw] min-h-0">

          {/* Left — dry-run checklist */}
          <div className="flex flex-col min-h-0">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted mb-[0.8vh]">
              10-minute dry-run checklist — click a step to expand
            </div>
            <div className="flex-1 overflow-auto flex flex-col gap-[0.5vh] pr-[0.5vw]">
              {STEPS.map((step, i) => {
                const open = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStep(open ? null : i)}
                    className="text-left rounded-[4px] px-[1vw] py-[0.7vh] transition-all duration-150 focus:outline-none"
                    style={{
                      border: open ? "1px solid rgba(184,90,62,0.55)" : "1px solid rgba(244,237,224,0.12)",
                      background: open ? "rgba(184,90,62,0.08)" : "rgba(244,237,224,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-[0.8vw]">
                      <div className="font-mono text-[0.65vw] text-muted/70 tabular-nums w-[2.5vw] shrink-0">
                        {step.time}
                      </div>
                      <div className="font-body text-[0.82vw] text-paper leading-[1.35] flex-1">
                        {step.action}
                      </div>
                      <div
                        className="shrink-0 font-mono text-[0.7vw] transition-transform duration-150"
                        style={{ color: "rgba(244,237,224,0.35)", transform: open ? "rotate(90deg)" : "none" }}
                      >
                        ›
                      </div>
                    </div>
                    {open && (
                      <div className="mt-[0.6vh] ml-[3.3vw] flex items-start gap-[0.5vw]">
                        <div className="shrink-0 w-[0.8vw] h-[0.8vw] rounded-full mt-[0.1vh]" style={{ background: "#4caf7d", opacity: 0.85 }} />
                        <div className="font-body text-[0.78vw] leading-[1.4]" style={{ color: "#a8d8b8" }}>
                          {step.check}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Rollback */}
            <div className="mt-[1.5vh] pt-[1.5vh] border-t border-rule">
              <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] mb-[0.6vh]" style={{ color: "#d97050" }}>
                Rollback — if any seed preview renders wrong
              </div>
              <ol className="flex flex-col gap-[0.3vh]">
                {ROLLBACK.map((line, i) => (
                  <li key={i} className="flex items-start gap-[0.5vw]">
                    <span className="font-mono text-[0.65vw] tabular-nums shrink-0" style={{ color: "#d97050", opacity: 0.7 }}>
                      {i + 1}.
                    </span>
                    <span className="font-body text-[0.75vw] text-muted leading-[1.4]">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right — email render mockups */}
          <div className="flex flex-col min-h-0">
            {/* Toggle controls */}
            <div className="flex items-center gap-[1vw] mb-[1vh]">
              <div className="flex rounded-[4px] overflow-hidden" style={{ border: "1px solid rgba(244,237,224,0.15)" }}>
                {(["slip", "shipped"] as EmailType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEmailType(t)}
                    className="font-mono uppercase tracking-[0.14em] text-[0.65vw] px-[0.8vw] py-[0.4vh] transition-all duration-150"
                    style={{
                      background: emailType === t ? "rgba(184,90,62,0.25)" : "transparent",
                      color: emailType === t ? "#e9c8a8" : "rgba(244,237,224,0.45)",
                      borderRight: t === "slip" ? "1px solid rgba(244,237,224,0.15)" : "none",
                    }}
                  >
                    {t === "slip" ? "Slip Issued" : "Shipped"}
                  </button>
                ))}
              </div>
              <div className="flex rounded-[4px] overflow-hidden" style={{ border: "1px solid rgba(244,237,224,0.15)" }}>
                {(["desktop", "mobile"] as ViewWidth[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setViewWidth(w)}
                    className="font-mono uppercase tracking-[0.14em] text-[0.65vw] px-[0.8vw] py-[0.4vh] transition-all duration-150"
                    style={{
                      background: viewWidth === w ? "rgba(244,237,224,0.12)" : "transparent",
                      color: viewWidth === w ? "#f4ede0" : "rgba(244,237,224,0.45)",
                      borderRight: w === "desktop" ? "1px solid rgba(244,237,224,0.15)" : "none",
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="font-mono text-[0.65vw] text-muted/60">
                {viewWidth === "desktop" ? "~640 px rendered width" : "~390 px portrait"}
              </div>
            </div>

            {/* Mockup display */}
            <div
              className="flex-1 rounded-[6px] flex items-center justify-center overflow-hidden"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(244,237,224,0.08)" }}
            >
              <div className={viewWidth === "desktop" ? "w-[90%]" : "w-[52%]"}>
                {emailType === "slip"
                  ? <SlipEmailMockup width={viewWidth} />
                  : <ShippedEmailMockup width={viewWidth} />
                }
              </div>
            </div>

            {/* Render checklist */}
            <div className="mt-[1vh] grid grid-cols-2 gap-[0.4vh]">
              {[
                "Subject line matches batch label",
                "Pickup window shows correct dates",
                "No raw {{variables}} visible",
                "CTA button is clickable / not clipped",
                "Logo renders (not broken image)",
                "Mobile: no horizontal scroll",
              ].map((item) => (
                <div key={item} className="flex items-center gap-[0.4vw]">
                  <div className="w-[0.7vw] h-[0.7vw] rounded-sm shrink-0" style={{ border: "1px solid rgba(244,237,224,0.3)", background: "transparent" }} />
                  <span className="font-body text-[0.72vw] text-muted leading-[1.3]">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
