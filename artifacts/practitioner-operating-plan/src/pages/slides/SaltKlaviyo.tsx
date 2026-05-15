/**
 * SaltKlaviyo.tsx — VI · 05 Slip-Flow Rehearsal: Klaviyo seed-list setup
 *
 * Lists the three internal seed addresses the OM must add in Klaviyo,
 * the exact JSON event payload to fire for a test slip event, and
 * the seed-list name / segment to target before going live.
 */

import { useState } from "react";

const SEED_ADDRESSES = [
  {
    label: "Practitioner inbox",
    email: "ops+salttest@headwaters.coop",
    role: "Catches render on a desktop Gmail client — the most common OM view.",
  },
  {
    label: "Mobile spot-check",
    email: "mobile+salttest@headwaters.coop",
    role: "Routed to a shared phone. Confirms responsive layout on a real 390 px screen.",
  },
  {
    label: "Dark-mode audit",
    email: "dark+salttest@headwaters.coop",
    role: "Opened in Apple Mail (dark mode). Catches inverted-image and unreadable-text failures.",
  },
];

const EVENT_PAYLOAD = `{
  "event": "Slip Issued",
  "customer_properties": {
    "$email": "ops+salttest@headwaters.coop",
    "$first_name": "Test",
    "$last_name": "Recipient"
  },
  "properties": {
    "slip_id": "TEST-001",
    "batch_label": "Batch 9 — Dry Run",
    "batch_date": "2026-05-15",
    "product_name": "Deer Lake Wild Boreal Salt",
    "quantity_kg": 2.5,
    "pickup_location": "Dryden Hub",
    "pickup_window": "May 19 – May 23, 2026",
    "cohort_name": "Spring 2026 Cohort",
    "is_test": true
  }
}`;

export default function SaltKlaviyo() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(EVENT_PAYLOAD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              VI · 05 — Slip-Flow Rehearsal · Klaviyo Setup
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Do this once · before the cohort send
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1] tracking-tight text-paper mb-[0.6vh]">
          Seed the list. Fire the event.
        </h1>
        <div className="font-display italic text-[1.3vw] text-muted mb-[3vh] max-w-[70vw]">
          Add all three addresses to the <span className="not-italic text-paper font-semibold">Headwaters Salt — Internal Seed</span> list
          in Klaviyo before firing any test. Each address checks a different failure mode.
        </div>

        <div className="flex-1 grid grid-cols-[1fr_1.15fr] gap-[3vw] min-h-0">

          {/* Left — seed addresses */}
          <div className="flex flex-col gap-[1.5vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.5vh]">
              Step 1 — Add to Klaviyo seed list
            </div>
            {SEED_ADDRESSES.map((addr, i) => (
              <div
                key={addr.email}
                className="border border-rule rounded-[5px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[0.4vh]"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted">
                    {String(i + 1).padStart(2, "0")} · {addr.label}
                  </div>
                </div>
                <div className="font-mono text-[1.05vw] text-accent font-semibold tracking-wide">
                  {addr.email}
                </div>
                <div className="font-body text-[0.82vw] text-muted leading-[1.4]">
                  {addr.role}
                </div>
              </div>
            ))}

            <div className="mt-[0.5vh] pt-[1.5vh] border-t border-rule">
              <div className="font-mono uppercase tracking-[0.14em] text-[0.7vw] text-muted mb-[0.5vh]">
                Klaviyo path
              </div>
              <div className="font-body text-[0.85vw] text-paper leading-[1.5]">
                Lists → <span className="font-semibold">Headwaters Salt — Internal Seed</span> → Add members manually.
                Confirm all three appear before proceeding to Step 2.
              </div>
            </div>
          </div>

          {/* Right — event payload */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-[1vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted">
                Step 2 — Fire this payload via Klaviyo → Metrics → Create Event
              </div>
              <button
                onClick={handleCopy}
                className="font-mono uppercase tracking-[0.15em] text-[0.7vw] px-[0.8vw] py-[0.4vh] rounded border border-rule text-muted hover:text-paper hover:border-accent/60 transition-all duration-150"
              >
                {copied ? "Copied ✓" : "Copy JSON"}
              </button>
            </div>
            <div
              className="flex-1 rounded-[6px] overflow-auto p-[1.2vw]"
              style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(244,237,224,0.10)" }}
            >
              <pre className="font-mono text-[0.82vw] leading-[1.6] text-paper/85 whitespace-pre">
                {EVENT_PAYLOAD}
              </pre>
            </div>
            <div className="mt-[1vh] font-body text-[0.78vw] text-muted leading-[1.5]">
              The <span className="font-mono text-paper/70">"is_test": true</span> flag prevents this
              event from counting toward any analytics. Remove it only when firing the real cohort send.
              Change <span className="font-mono text-paper/70">$email</span> to each seed address in turn
              — or use Klaviyo's "Send to list" toggle to hit all three at once.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule flex items-center justify-between">
          <div className="font-body text-[0.82vw] text-muted">
            Next slide walks through the 10-minute dry-run and shows what each email should look like when it renders correctly.
          </div>
          <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent">
            → SaltOpsNote for the dry-run script
          </div>
        </div>

      </div>
    </div>
  );
}
