export type GateKey =
  | "sender"
  | "ask"
  | "mission"
  | "horizon"
  | "concrete";

export type TriageGate = {
  key: GateKey;
  num: string;
  short: string;
  question: string;
  yesMeans: string;
  noMeans: string;
  source: string;
};

export const triageGates: TriageGate[] = [
  {
    key: "sender",
    num: "01",
    short: "Who's asking",
    question:
      "Is the sender a First Nation, co-op, or Northern community organization — or someone visibly working on behalf of one?",
    yesMeans:
      "Named band council, tribal council, co-operative, regional Indigenous health / housing / food authority, or a contractor / advisor with that org cc'd.",
    noMeans:
      "A brand, a startup, an out-of-region nonprofit, a freelancer aggregator, an agency looking for white-label work, or a sender who doesn't name an organization at all.",
    source: "Carve-out A · Slide VI · 02",
  },
  {
    key: "ask",
    num: "02",
    short: "What they want",
    question:
      "Is the ask a piece of the Transparency Stack — procurement dashboard, council pack, household-level pricing, public price dashboard, band data room, POS configuration, or other public-facing infrastructure?",
    yesMeans:
      "Anything that ends up legible to community members, council, or the public. Procurement, pricing, supply, accountability, plain-language reporting.",
    noMeans:
      "Logo refresh, marketing site, brand identity, pitch deck for investors, internal HR portal, app idea with no public surface.",
    source: "Carve-out A · Slide VI · 02",
  },
  {
    key: "mission",
    num: "03",
    short: "Mission alignment",
    question:
      "Is the work in service of making something public or legible for the community — not selling something to it?",
    yesMeans:
      "Outcome is people in the community can see / check / verify a thing they couldn't before. Dollars, supply chains, decisions, prices.",
    noMeans:
      "Outcome is the org becomes more marketable, raises more money, ships a product to its members, or improves an internal-only workflow.",
    source: "Transparency Stack · Slide VI · 02",
  },
  {
    key: "horizon",
    num: "04",
    short: "Time horizon",
    question:
      "Could this plausibly grow into a 6–12 month engagement — i.e. scoping work that points toward Pilot #2, not a one-off two-week deliverable?",
    yesMeans:
      "Multi-phase work, real budget conversation possible, the ask is a starting wedge into something bigger the org actually needs.",
    noMeans:
      "One concrete deliverable with a fixed date and no follow-on. Fine work — just not the agency's shape.",
    source: "Pilot #2 framing · Slide VI · 02",
  },
  {
    key: "concrete",
    num: "05",
    short: "Concrete enough",
    question:
      "Does the note name the organization, a decision-maker, and what they want made public — enough that a real reply is possible?",
    yesMeans:
      "Org named, sender's role clear, the ask is at least one sentence of substance. A scoping call would have something to chew on.",
    noMeans:
      "Generic 'we'd love to chat about design', no org, no name, no specifics — or it's a cold RFP cut-and-paste that went to twenty studios.",
    source: "Triage discipline",
  },
];

export type TriageRoute = "reply" | "park" | "decline" | "unknown";

export type RouteDescriptor = {
  route: TriageRoute;
  label: string;
  oneLine: string;
  detail: string;
  accent: string;
};

export const routeDescriptors: Record<TriageRoute, RouteDescriptor> = {
  reply: {
    route: "reply",
    label: "Reply — this is a real Carve-out A lead",
    oneLine:
      "Route through Headwaters. Book a 30-minute scoping call within the week.",
    detail:
      "Reply from the Headwaters address (not the studio). Acknowledge what they're trying to make public, name the closest piece of the Transparency Stack, and propose a scoping call. Book it as scoping toward Pilot #2 — not as studio work and not as free strategy.",
    accent: "#1f3d2e",
  },
  park: {
    route: "park",
    label: "Park for Pilot #2 candidate-reserve",
    oneLine:
      "Mission-aligned but not actionable yet. Save the sender, reply when capacity opens.",
    detail:
      "The sender belongs in the candidate-reserve, not the inbox. Send a short holding note: thank them, confirm Headwaters is the right address, name when the founder is realistically open to a scoping conversation. Add the org, contact, and the ask in one sentence to the Pilot #2 candidate-reserve scoring sheet.",
    accent: "#7a5c1f",
  },
  decline: {
    route: "decline",
    label: "Polite no — outside Carve-out A",
    oneLine:
      "Send the polite-decline note. Don't ghost; don't open a door that isn't there.",
    detail:
      "Use the polite-decline template. It points the sender at the studio site as a portfolio and explains the agency only takes on community-development work. No 'maybe later'. No referral unless there's a specific person you'd actually trust with this — vague referrals are how junk RFPs become someone else's junk RFPs.",
    accent: "#b85a3e",
  },
  unknown: {
    route: "unknown",
    label: "Answer the five questions to see the route",
    oneLine:
      "Each yes/no narrows it down. The route appears here once the picture is clear.",
    detail:
      "If you find yourself wanting to answer 'kind of', force a yes or no and write the qualifier in the notes. The point of the rubric is to spend five minutes on triage instead of an hour on a draft reply.",
    accent: "#6b7665",
  },
};

export function decideRoute(
  answers: Partial<Record<GateKey, "yes" | "no">>,
): TriageRoute {
  const sender = answers.sender;
  const ask = answers.ask;
  const mission = answers.mission;
  const horizon = answers.horizon;
  const concrete = answers.concrete;

  // Need at least the three core gates answered to make any call.
  if (!sender || !ask || !mission) return "unknown";

  // Any of the three core gates fails → not Carve-out A. Polite no.
  if (sender === "no" || ask === "no" || mission === "no") return "decline";

  // Three core gates clear. If the other two are still unanswered, hold.
  if (!horizon || !concrete) return "unknown";

  // Three cores clear, both supporting gates clear → reply.
  if (horizon === "yes" && concrete === "yes") return "reply";

  // Three cores clear, but timing or concreteness is missing → park.
  return "park";
}

export const replyTemplate = `Subject: Re: {THEIR_SUBJECT} — Headwaters

Hi {NAME},

Thanks for writing. To make sure I'm reading this right: you're with
{ORG}, and you're trying to make {WHAT_THEY_WANT_PUBLIC} legible to
{WHO_NEEDS_TO_SEE_IT}. That sits squarely inside the work Headwaters
takes on.

A few things up front, so you have the full picture:

  · This work runs through Headwaters, not Bobbie Parr Studio. The
    studio site is a portfolio — the agency is where engagements
    happen.

  · The right next step is a 30-minute scoping call. I want to
    understand what's already been tried, who needs to be in the
    room, and what 'done' would mean for council / membership / the
    community.

  · After the call I'll send a short scoping note — what we'd build,
    over how long, at what cost, with what shape of agreement. No
    surprises.

I'm holding the following times this week — does any of them work?
{TIMES}. If none, send three that do and I'll match one.

— Bobbie
Headwaters`;

export const declineTemplate = `Subject: Re: {THEIR_SUBJECT}

Hi {NAME},

Thanks for the note, and for thinking of the studio.

Bobbie Parr Studio is closed to new outside work. The site stays up
as a portfolio — it's the record of what we made for the people we
made it for — but there's no intake behind it.

The agency that grew out of the studio, Headwaters, only takes on
community-development work for First Nations, co-ops, and Northern
community organizations — specifically the public-facing pieces of
the Transparency Stack (procurement dashboards, council packs,
household-level pricing, that shape of thing). Based on your note,
that isn't quite the fit, so I don't want to leave a 'maybe later'
hanging.

Wishing you well with it.

— Bobbie`;

export const parkTemplate = `Subject: Re: {THEIR_SUBJECT} — Headwaters

Hi {NAME},

Thanks for writing — and thank you for naming what you're trying to
make legible. Reading your note, this is exactly the shape of work
Headwaters exists for.

I'm being honest about timing: {ORG} is on a short list of
organizations Headwaters wants to scope a real engagement with, and
the founder is heads-down on the first community pilot through
{PILOT_DATE}. Rather than schedule a call I can't follow through on
in the next month, I'd like to put {ORG} on the candidate-reserve
list for the second pilot and come back to you in {COMEBACK_WINDOW}
with a real scoping window.

If that timing doesn't work for you, please say so and I'll either
make space or be straightforward that I can't.

— Bobbie
Headwaters`;

export type JunkSignal = {
  num: string;
  text: string;
};

export const junkSignals: JunkSignal[] = [
  {
    num: "J1",
    text: "Came in via a freelancer aggregator, RFP marketplace, or 'we matched you with a vendor' platform.",
  },
  {
    num: "J2",
    text: "No organization named — sender is 'Operations' / 'Marketing' / a generic gmail with no signature.",
  },
  {
    num: "J3",
    text: "Asks for an hourly rate, day rate, or ballpark quote before any conversation about the actual problem.",
  },
  {
    num: "J4",
    text: "Looks copy-pasted: same paragraph clearly went to multiple studios, your name doesn't appear, the ask is generic 'design services'.",
  },
  {
    num: "J5",
    text: "Wants a logo, brand refresh, marketing site, app MVP, or 'a deck for investors' — none of which is the Transparency Stack.",
  },
];
