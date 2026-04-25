type Email = {
  flowId: string;
  trigger: string;
  audience: string;
  send: string;
  cadence: string;
  subject: string;
  preheader: string;
  body: string[];
  cta: string;
};

const emails: Email[] = [
  {
    flowId: "salt-batch-slip",
    trigger:
      "Manual fire by OM in Klaviyo when a Deer Lake aggregation run takes the bay Wed and the DTC batch slips one week. OM event payload sets new ship date.",
    audience:
      "Customers with an open DTC order in the current batch window (Klaviyo segment: 'Salt — open batch order').",
    send: "Within 60 min of the OM firing the slip event.",
    cadence: "One per slip event. Suppressed for any customer who already received a slip notice in the same batch cycle.",
    subject: "Your Parr's Jars batch ships {{ event.new_ship_date|format_date }}",
    preheader:
      "We held the batch a week so the depot could clear an aggregation run. Same jars, new date.",
    body: [
      "Hi {{ first_name|default:'there' }},",
      "Quick note from the depot: this month's salt batch is shifting by exactly one week. Your order will now ship {{ event.new_ship_date|format_date:'EEEE, MMMM d' }}, with tracking on the way the same morning.",
      "Why: the Dryden depot is also moving an aggregation run for a Northern Ontario community partner this week, and we share the same bay. We hold the batch rather than split it — keeps the freight cost honest and the jars hand-checked.",
      "No action needed. Your card is not charged again. If a week's wait doesn't work, just reply and we'll refund — no questions.",
    ],
    cta: "View order — auto-link {{ event.order_url }}",
  },
  {
    flowId: "salt-batch-shipped",
    trigger:
      "Auto-fired Friday morning when Shippo creates the first label of the monthly batch (webhook → Klaviyo event 'Batch Shipped').",
    audience:
      "All customers in the current batch (segment: 'Salt — batch shipping today').",
    send: "Friday between 10:00 and 11:00 ET, after the depot pickup is booked.",
    cadence: "Once per batch. One email per customer regardless of order count in the cycle.",
    subject: "Your batch shipped — Parr's Jars on the truck today",
    preheader:
      "Tracking inside. Manitoulin freight or Canada Post depending on your postal code.",
    body: [
      "Hi {{ first_name|default:'there' }},",
      "Your jars left the Dryden depot today, {{ event.ship_date|format_date:'EEEE, MMMM d' }}. Tracking: {{ event.tracking_url }}.",
      "Carrier: {{ event.carrier }}. Estimated delivery {{ event.eta_window }}, depending on weather and your nearest hub.",
      "Next batch opens {{ event.next_batch_open_date|format_date:'MMMM d' }}; ships {{ event.next_batch_ship_date|format_date:'MMMM d' }}. We run one batch a month, on purpose.",
    ],
    cta: "Track shipment {{ event.tracking_url }}",
  },
];

export default function SaltKlaviyo() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VIII · 03 — Klaviyo flow
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Two emails the runbook promises.
              <span className="italic font-normal text-accent"> Both drafted, both live in Klaviyo.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The runbook only works if the customer hears from us before they
            wonder where the jars are.{" "}
            <span className="text-primary font-semibold">
              One email for a slipped batch (manual trigger, OM fires it).
              One for the monthly ship (auto, on the Shippo label webhook).
              No founder phone calls — ever.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          {emails.map((e) => (
            <div
              key={e.flowId}
              className="rounded-[0.4vw] p-[1.3vw] flex flex-col min-h-0"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="flex items-baseline justify-between mb-[0.6vh]">
                <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold">
                  Flow · {e.flowId}
                </div>
                <div className="font-mono text-[0.7vw] text-muted">
                  {e.send}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[0.6vw] mb-[0.8vh] font-body text-[0.78vw] leading-[1.35]">
                <div>
                  <div className="font-mono uppercase tracking-[0.16em] text-[0.65vw] text-muted mb-[0.2vh]">
                    Trigger
                  </div>
                  <div className="text-text">{e.trigger}</div>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-[0.16em] text-[0.65vw] text-muted mb-[0.2vh]">
                    Audience
                  </div>
                  <div className="text-text">{e.audience}</div>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-[0.16em] text-[0.65vw] text-muted mb-[0.2vh]">
                    Cadence rule
                  </div>
                  <div className="text-text">{e.cadence}</div>
                </div>
              </div>

              <div
                className="rounded-[0.3vw] p-[1vw] flex-1 flex flex-col min-h-0"
                style={{ background: "var(--slide-bg)" }}
              >
                <div className="font-mono uppercase tracking-[0.18em] text-[0.65vw] text-muted mb-[0.3vh]">
                  Subject
                </div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight mb-[0.6vh]">
                  {e.subject}
                </div>
                <div className="font-mono uppercase tracking-[0.18em] text-[0.65vw] text-muted mb-[0.2vh]">
                  Preheader
                </div>
                <div className="font-body text-[0.78vw] text-muted italic leading-[1.35] mb-[0.7vh]">
                  {e.preheader}
                </div>
                <div className="font-mono uppercase tracking-[0.18em] text-[0.65vw] text-muted mb-[0.3vh]">
                  Body
                </div>
                <div className="flex-1 min-h-0 overflow-hidden font-body text-[0.78vw] text-text leading-[1.45] space-y-[0.45vh]">
                  {e.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div
                  className="mt-[0.6vh] pt-[0.5vh] border-t font-mono text-[0.7vw] text-accent"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  CTA · {e.cta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-[1.5vh] pt-[1.2vh] border-t grid grid-cols-3 gap-[1.4vw]"
          style={{ borderColor: "var(--slide-rule)" }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
              Where the date comes from
            </div>
            <div className="font-body text-[0.85vw] text-text leading-[1.4]">
              Shopify metafield{" "}
              <span className="font-mono text-primary">salt.next_batch_ship</span>{" "}
              is the single source of truth. The OM updates it on Mon morning;
              Klaviyo reads it on every send via the catalog feed; the
              storefront reads the same metafield (next slide).
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1vw]"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
              style={{ color: "#e9c8a8" }}
            >
              What this replaces
            </div>
            <div className="font-body text-[0.85vw] leading-[1.4]">
              Founder DM-ing apologies on Instagram. A spreadsheet of "people
              I owe an update". A 6pm phone call from a confused customer
              that costs an hour the kids were owed.{" "}
              <span className="font-semibold">All gone — by design.</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
              Test before live
            </div>
            <div className="font-body text-[0.85vw] text-text leading-[1.4]">
              Both flows ship in Klaviyo as Draft + Smart Send Time off, with a
              seed list of three internal addresses. The OM fires a test slip
              event on the Mon before the first live batch. Promotion to
              Live happens only after the seed list confirms render + link.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
