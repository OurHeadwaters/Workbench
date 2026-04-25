type Step = {
  num: string;
  title: string;
  detail: string;
};

const fireSteps: Step[] = [
  {
    num: "01",
    title: "Confirm slip is real before 11:00 ET Wed",
    detail:
      "Slip only fires if the Deer Lake aggregation truck actually takes the bay Wed AND the casual labour bench can't backfill before 14:00. If either's false, no email — the batch holds.",
  },
  {
    num: "02",
    title: "Set the new ship date in Shopify first",
    detail:
      "Edit the metafield salt.next_batch_ship to the next Friday (always exactly 7 days out — never 'maybe Monday'). This is the source of truth the email reads.",
  },
  {
    num: "03",
    title: "Fire the slip event in Klaviyo",
    detail:
      "Profiles → Bulk action → Trigger event 'Salt Batch Slipped' on segment 'Salt — open batch order'. Klaviyo picks up the new metafield value via the catalog sync.",
  },
  {
    num: "04",
    title: "Spot-check three sends before the cohort sends",
    detail:
      "Klaviyo holds the flow at 'Review' for 15 min. Open the three seed-list previews, confirm the new date renders, then approve. Cohort send completes within 60 min of approval.",
  },
];

const setDateSteps: Step[] = [
  {
    num: "01",
    title: "First Mon of every batch cycle, 9:00–9:15 ET",
    detail:
      "Recurring calendar block. If the Mon is a stat holiday, it moves to the Tue at 9:00. The Slack reminder bot pings the OM channel until the metafield is updated.",
  },
  {
    num: "02",
    title: "Open Shopify → Settings → Custom data → Products",
    detail:
      "Find the SALT product set. Edit metafield salt.next_batch_ship. Format: ISO date (2026-04-24). Save. The storefront banner and cart copy update on the next page render.",
  },
  {
    num: "03",
    title: "Verify the catalog sync ran in Klaviyo (≤ 30 min)",
    detail:
      "Klaviyo → Catalog → Salt feed → Last synced. Should be within the last 30 minutes. If it's older, force a manual sync; do not fire any flow until the value matches Shopify.",
  },
  {
    num: "04",
    title: "Post the date in #salt-ops Slack",
    detail:
      "One-line message: 'Next batch ships [date]'. This is the casual labour bench's heads-up and the bookkeeper's date-of-record for the cost-centre close.",
  },
];

const donts = [
  "Do not promise a date earlier than 7 days from today, ever — the batch cadence depends on it.",
  "Do not edit the date inside Klaviyo directly. Always Shopify first, sync second, fire third.",
  "Do not fire the slip flow without a ship-date update — customers will get a 'your batch ships {{ event.new_ship_date }}' email with a blank date.",
  "Do not call or DM customers individually. The flow handles it. Founder's hands stay off.",
  "Do not skip the seed-list spot check, even on a clean run. One typo > one batch's worth of refunds.",
];

export default function SaltOpsNote() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 05 — OM operator note
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              When to fire the slip flow.
              <span className="italic font-normal text-accent"> How to set the next batch date. What never to do.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            One page the OM keeps pinned in Notion. Lives next to the salt
            runbook on the depot wall, too.{" "}
            <span className="text-primary font-semibold">
              Two procedures, one don't-list. Whole thing fits inside the
              Wed batch-pack hour.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.3vw] flex flex-col min-h-0"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[0.6vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
                When to fire the slip flow
              </div>
              <div className="font-mono text-[0.7vw] text-muted">
                Trigger window · Wed 11:00 → 14:00 ET
              </div>
            </div>
            <div className="flex-1 min-h-0 space-y-[0.7vh]">
              {fireSteps.map((s) => (
                <div key={s.num} className="grid grid-cols-[auto_1fr] gap-[0.7vw]">
                  <div
                    className="font-mono text-[0.78vw] font-semibold pt-[0.1vh]"
                    style={{ color: "var(--slide-accent)" }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.2vh]">
                      {s.title}
                    </div>
                    <div className="font-body text-[0.82vw] text-text leading-[1.4]">
                      {s.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.3vw] flex flex-col min-h-0"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[0.6vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
                How to set the next batch date
              </div>
              <div className="font-mono text-[0.7vw] text-muted">
                Recurring · first Mon, 9:00 ET
              </div>
            </div>
            <div className="flex-1 min-h-0 space-y-[0.7vh]">
              {setDateSteps.map((s) => (
                <div key={s.num} className="grid grid-cols-[auto_1fr] gap-[0.7vw]">
                  <div
                    className="font-mono text-[0.78vw] font-semibold pt-[0.1vh]"
                    style={{ color: "var(--slide-accent)" }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.2vh]">
                      {s.title}
                    </div>
                    <div className="font-body text-[0.82vw] text-text leading-[1.4]">
                      {s.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-[1.5vh] rounded-[0.4vw] p-[1.2vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.6vh]">
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold"
              style={{ color: "#e9c8a8" }}
            >
              Five don'ts
            </div>
            <div
              className="font-mono text-[0.72vw]"
              style={{ color: "#e9c8a8", opacity: 0.85 }}
            >
              The list the OM signs at onboarding
            </div>
          </div>
          <ul className="grid grid-cols-5 gap-[0.9vw] font-body text-[0.82vw] leading-[1.4]">
            {donts.map((d, i) => (
              <li key={i} className="flex gap-[0.4vw]">
                <span className="font-mono text-[0.78vw]" style={{ color: "#e9c8a8" }}>
                  ×
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
