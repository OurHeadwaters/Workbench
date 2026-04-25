export type WindDownAction = {
  num: string;
  category: "Take the form down" | "Site copy" | "Active retainer" | "Inquiries routing";
  when: string;
  title: string;
  detail: string;
};

export const windDownActions: WindDownAction[] = [
  {
    num: "01",
    category: "Take the form down",
    when: "Today",
    title: "Replace bobbieparr.studio's contact form with the redirect block",
    detail:
      "Pull the form (and any 'work with us' / 'start a project' CTA above it) and paste in the redirect copy below. The page stays — the funnel doesn't. If the contact page is its own URL, keep that URL alive so existing links and email signatures don't 404; just swap the body.",
  },
  {
    num: "02",
    category: "Take the form down",
    when: "Today",
    title: "Disable any form-submission webhooks, Formspree / Netlify forms, or Zapier hooks",
    detail:
      "If the form posted to a service, turn off the integration so a stray submission from a cached page doesn't land in an inbox the founder has stopped watching. Confirm in the service dashboard, not just in the site code.",
  },
  {
    num: "03",
    category: "Inquiries routing",
    when: "Today",
    title: "Stand up a Headwaters inquiries address and forward it to the founder",
    detail:
      "Something like inquiries@headwaters... — short, on-brand, distinct from personal email. Forward it to the founder's main inbox with a label / filter so Carve-out A leads are visible without colonising the main inbox. Use that address in the redirect copy.",
  },
  {
    num: "04",
    category: "Site copy",
    when: "Today",
    title: "Walk every page and strip 'available for new work' energy",
    detail:
      "Home, about, services, footer, project case studies. Anything that reads like a pitch — 'currently taking on new clients', 'let's work together', 'start a project', 'open for Q-whatever' — gets removed or rewritten using the reframes below. The work itself stays; the sales voice goes.",
  },
  {
    num: "05",
    category: "Site copy",
    when: "Today",
    title: "Update the meta description and OG tags",
    detail:
      "If the site's meta description says 'design studio for hire' / 'taking on new clients', rewrite it as a portfolio descriptor (see reframes below). Otherwise the closure is invisible to anyone arriving from a Google result or a LinkedIn preview.",
  },
  {
    num: "06",
    category: "Site copy",
    when: "This week",
    title: "Remove the studio from any 'hire me' / 'available for work' directories",
    detail:
      "Dribbble availability toggle, Working Not Working, The Dots, Awwwards 'available for hire' badge, LinkedIn 'Open to Work' / Services. Each of these keeps the inbox warm whether the contact form is up or not.",
  },
  {
    num: "07",
    category: "Active retainer",
    when: "This week",
    title: "List every active studio retainer and pick one of three exits for each",
    detail:
      "Use the table on the second page. For every active client, write down: contract end date, MRR / project value, and which exit applies — runs to natural end (then no renewal), gets handed off to a named successor, or wound down early with notice. If you can't fill a row in five minutes, the relationship needs a phone call before it needs a plan.",
  },
  {
    num: "08",
    category: "Active retainer",
    when: "This week",
    title: "Send each existing client the wind-down note in person, then in writing",
    detail:
      "Phone or coffee first — these people gave you money and trust. The written note follows the same day so there's a paper trail. Use the template on the second page; fill in their name, their exit path, and the date their work with you ends. Don't batch-send.",
  },
  {
    num: "09",
    category: "Active retainer",
    when: "Within 30 days",
    title: "For every 'hand off' exit, name the successor in writing and make the intro",
    detail:
      "If you're sending a client to another studio or freelancer, write the intro email, cc the client, and don't disappear from the thread until the first invoice from the successor has been paid. A handoff that ends with 'reach out to so-and-so, here's their email' is a referral, not a wind-down.",
  },
  {
    num: "10",
    category: "Inquiries routing",
    when: "Within 30 days",
    title: "Update email signatures, invoicing footer, and Calendly links",
    detail:
      "Personal email signature drops 'Bobbie Parr Studio — taking on new work for ___'. Invoice footer drops the 'work with us' line. Calendly description drops 'discovery calls'. Anywhere your name shows up online still acting as a funnel, retire that copy.",
  },
];

export const redirectCopy = {
  heading: "The studio is closed to new outside work.",
  body: [
    "Bobbie Parr Studio isn't taking on new client engagements. The work shown here stays online as a portfolio — it's the record of what we made for the people we made it for.",
    "If you're a First Nation, co-op, or Northern community organization looking for help on a procurement dashboard, council pack, household-level pricing, or another piece of public-interest infrastructure — that work now happens through Headwaters, the agency this studio became part of.",
    "For Headwaters inquiries, write to inquiries@headwaters.example. Please include who you are, what you're trying to make public or legible, and roughly when you need to be standing somewhere different than where you are today. We read every note; we don't reply to every note.",
  ],
  closing: "For everything else — press, old-client questions, friends — the founder's email is unchanged.",
};

export const redirectHtml = `<!-- Drop-in replacement for the contact form on bobbieparr.studio -->
<section class="studio-closed">
  <h1>The studio is closed to new outside work.</h1>

  <p>
    Bobbie Parr Studio isn't taking on new client engagements. The work
    shown here stays online as a portfolio &mdash; it's the record of
    what we made for the people we made it for.
  </p>

  <p>
    If you're a First Nation, co-op, or Northern community organization
    looking for help on a procurement dashboard, council pack,
    household-level pricing, or another piece of public-interest
    infrastructure &mdash; that work now happens through
    <strong>Headwaters</strong>, the agency this studio became part of.
  </p>

  <p>
    For Headwaters inquiries, write to
    <a href="mailto:inquiries@headwaters.example">inquiries@headwaters.example</a>.
    Please include who you are, what you're trying to make public or
    legible, and roughly when you need to be standing somewhere
    different than where you are today. We read every note; we don't
    reply to every note.
  </p>

  <p class="muted">
    For everything else &mdash; press, old-client questions, friends
    &mdash; the founder's email is unchanged.
  </p>
</section>`;

export type SiteCopyReframe = {
  where: string;
  remove: string;
  replaceWith: string;
};

export const siteCopyReframes: SiteCopyReframe[] = [
  {
    where: "Home / hero subhead",
    remove: "A design studio for ambitious teams. Currently taking on new clients.",
    replaceWith:
      "A design studio for ambitious teams. The studio is now closed to new outside work; the work below is the portfolio.",
  },
  {
    where: "Home / footer CTA",
    remove: "Have a project? Let's talk → [Start a project] button",
    replaceWith:
      "Remove the button. If a CTA must exist, swap it for a single line: 'Public-interest work is now done through Headwaters →' linked to the Headwaters address.",
  },
  {
    where: "About page closing line",
    remove: "Bobbie is currently open to new engagements for Q-whatever.",
    replaceWith:
      "Bobbie now does design work inside Headwaters, the agency this studio became part of. The studio site stays up as a record of the work.",
  },
  {
    where: "Services page",
    remove:
      "List of service packages with 'Book a discovery call' / 'Get a quote' buttons.",
    replaceWith:
      "Either delete the page entirely, or rewrite it in past tense — 'What the studio used to ship' — with no buttons. The page becomes evidence, not a menu.",
  },
  {
    where: "Project case study footers",
    remove:
      "'Want something like this for your team? Let's talk →' tail on every case study.",
    replaceWith:
      "Remove the tail. If you want to keep one line of forward motion, use the same single line as the home footer. The case study itself doesn't change.",
  },
  {
    where: "Site meta description / OG tags",
    remove: "Bobbie Parr Studio — design studio for ambitious teams. Available for new work.",
    replaceWith:
      "Bobbie Parr Studio — portfolio of work shipped 20XX–20XX. Now closed to new outside engagements; public-interest work continues through Headwaters.",
  },
];

export type RetainerExit = {
  key: "natural-end" | "hand-off" | "wound-down";
  label: string;
  description: string;
};

export const retainerExits: RetainerExit[] = [
  {
    key: "natural-end",
    label: "Runs to natural end",
    description:
      "Contract finishes on its existing end date. No renewal, no scope expansion. The client knows this is the last engagement.",
  },
  {
    key: "hand-off",
    label: "Hand off to a named successor",
    description:
      "Work transfers to another studio / freelancer the founder has actually spoken to. Successor named in writing; warm intro made; founder stays on the thread until the successor's first invoice clears.",
  },
  {
    key: "wound-down",
    label: "Wound down early",
    description:
      "Engagement ends before its contractual end date — usually by mutual agreement, with a defined handover window and any prepaid fees reconciled. Use sparingly and only with notice.",
  },
];

export const clientNoteTemplate = `Subject: A change in how I'm working — Bobbie Parr Studio

Hi {NAME},

A quick note, written so it's on paper as well as in conversation.

I'm closing Bobbie Parr Studio to new outside work. Going forward,
my design practice runs inside Headwaters, an agency focused on
public-interest infrastructure for First Nations, co-ops, and
Northern community organizations. The studio site stays online as
a portfolio.

For our work together, here's what that means:

  {EXIT_PATH_SENTENCE}

  {DATE_OR_NEXT_STEP_SENTENCE}

Nothing about this is a comment on you or the work — it's about
where I'm pointing my own time. I'm grateful you trusted the
studio with this; I want the wind-down to feel like the same
relationship, not a different one.

If anything in here doesn't sit right, the right next step is a
phone call, not an email reply. My number hasn't changed.

— Bobbie`;
