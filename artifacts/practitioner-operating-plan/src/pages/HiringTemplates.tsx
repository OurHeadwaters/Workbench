/**
 * HiringTemplates.tsx — ready-to-paste job postings and screening emails
 *
 * One job-posting template per role (long Chamber/Job-Bank version +
 * short Facebook/bulletin-board version) and one first-reply screening
 * email per role. The handyman role gets a referral DM only — no open posting.
 *
 * Tone: plain, direct, northern-Ontario voice.
 */

import { useState } from "react";

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const BG     = "#d8d2c8";
const MONO   = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF  = "Fraunces, Georgia, serif";
const SANS   = "Inter, system-ui, sans-serif";

// ── Template content ────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "ops-manager",
    title: "Operations Manager",
    context: "Dryden, ON · In-person · ~40 hrs/wk · $40/hr · Contract",
    templates: [
      {
        id: "long",
        label: "Long (Chamber / Job Bank)",
        kind: "posting" as const,
        body: `Operations Manager — Dryden, ON
Full-time · In-person · ~$40/hr · Contract

Headwaters is a small Indigenous-owned consulting and food-systems company working with First Nations communities across Northwestern Ontario. We're building a store-and-logistics operation out of Dryden and we need someone who can own the day-to-day.

WHAT THE JOB IS

You're the person the store calls when something breaks. You manage schedules, handle supplier relationships, keep Square and Local Line running smoothly, and report weekly to the lead. This is a phone-holder role — you field the call, you don't pass it along.

Specific responsibilities:
- Open and close store operations; set the daily schedule
- Manage two to three direct staff and coordinate with community partners
- Keep Square POS, Local Line, and QuickBooks in sync — we'll train the specifics
- Handle supplier orders and delivery coordination
- Flag problems early; solve what you can without escalating

WHAT WE'RE LOOKING FOR

- Experience managing a small retail, food service, logistics, or community operation
- Comfortable with basic software — willing to learn our stack
- Clean driving record; local travel is part of the job
- Steady under pressure; you don't need permission to make a common-sense call
- Respectful and straightforward with staff and community members

DETAILS

Hours: ~40 hrs/wk; some flexibility needed around deliveries and store openings
Location: Dryden, ON — must be local or willing to relocate; this is an in-person role
Compensation: $40/hr, contract; reviewed at 6 months
Start: As soon as the right person is ready

TO APPLY

Email [YOUR-EMAIL] with:
1. Your name and the best number to reach you
2. A brief description of an operation you've run day-to-day (what it was, how big, what "running it" actually meant for you)
3. One situation where something went sideways and you fixed it without being asked

No résumé required, though you're welcome to include one. We'll be in touch within a week.`,
      },
      {
        id: "short",
        label: "Short (Facebook / Bulletin Board)",
        kind: "posting" as const,
        body: `📋 OPERATIONS MANAGER — Dryden, ON
Full-time · In-person · ~$40/hr · Contract

We're hiring an Ops Manager for a food-systems operation based in Dryden. You'll manage daily store and logistics, keep things moving, and be the go-to person when something needs sorting.

Good fit if you've run a store, a crew, or a small operation before and know how to keep it moving without hand-holding. Clean driving record required. Must be local or able to relocate.

$40/hr · Contract · Starts ASAP

Email [YOUR-EMAIL] with a brief note on your background and one example of a problem you solved on your own.`,
      },
      {
        id: "screening",
        label: "Screening Email",
        kind: "email" as const,
        body: `Subject: Re: Operations Manager — quick intro call

[Name],

Thanks for reaching out. Your background looks like it could be a good fit — I'd like to do a short phone call to learn more before we go further.

A few questions to think about before we talk:

1. Walk me through the last operation you ran day-to-day. What did "running it" actually mean for you — scheduling, suppliers, staff, all of it?
2. Tell me about a time a supplier or a staff member dropped the ball at the worst moment. What did you do?
3. This role is based in Dryden with a First Nations food-systems company. What draws you to it specifically?

Would [DAY, TIME] work for a 20-minute call? Reply with a time that works for you and the best number to reach you.

[YOUR NAME]`,
      },
    ],
  },
  {
    id: "it-tech",
    title: "IT / Tech",
    context: "Remote-friendly · Occasional travel to NW Ontario · Contract",
    templates: [
      {
        id: "long",
        label: "Long (Chamber / Job Bank)",
        kind: "posting" as const,
        body: `IT Technician — Northwestern Ontario (Remote-Friendly, Some On-Site)
Part-time to full-time · Contract · Rate negotiable

Headwaters runs a 9-server infrastructure supporting store operations, privacy phones, and a community data platform across First Nations communities in Northwestern Ontario. We need someone who can keep it running and step in when something breaks — often remotely, sometimes in the field.

WHAT THE JOB COVERS

- Server monitoring and maintenance (Linux-based stack)
- Privacy phone setup and troubleshooting (GrapheneOS and similar hardened Android)
- Network and connectivity support at remote community sites
- Integration support for store operations: Square, Local Line, QuickBooks connections
- Helping onboard community staff to the tech stack; patient documentation and training

WHAT WE NEED

- Comfortable with Linux systems administration — you've owned a small fleet before
- Experience with remote troubleshooting; you can diagnose a problem without being there in person
- Privacy and security-minded; experience with hardened devices or air-gapped networks a plus
- Patient with non-technical users — explaining clearly is part of the job
- Able to travel to Northwestern Ontario communities occasionally (travel covered)

DETAILS

Location: Remote-friendly; travel to community sites in NW Ontario required periodically
Scope: Part-time to full-time depending on fit and workload
Compensation: Negotiable based on experience and scope
Start: Flexible

TO APPLY

Email [YOUR-EMAIL] with:
1. A brief description of the infrastructure you've managed — OS, scale, on-site or remote
2. One example of a remote fix that saved the day when you couldn't just drive to the problem
3. Any experience with privacy-focused devices or security-hardened systems`,
      },
      {
        id: "short",
        label: "Short (Facebook / Bulletin Board)",
        kind: "posting" as const,
        body: `💻 IT TECHNICIAN — Remote / Northwestern ON
Contract · Part- or full-time · Rate negotiable

Small Indigenous-owned company needs a solid IT person. You'll maintain a 9-server Linux stack, set up and support privacy phones, and troubleshoot remotely for community sites in NW Ontario. Some travel required.

Good fit: Linux sysadmin background, remote work experience, calm when something breaks at 6 AM.

Email [YOUR-EMAIL] with a brief note on what you've managed before and one example of a remote fix you're proud of.`,
      },
      {
        id: "screening",
        label: "Screening Email",
        kind: "email" as const,
        body: `Subject: Re: IT Technician inquiry — a few quick questions

[Name],

Thanks for reaching out. Before we set up a call, a few short questions by email would help me understand your background:

1. Describe the server environment you've managed most recently — OS, scale, remote or on-site, and what "owning it" looked like for you day-to-day.
2. We run GrapheneOS and similar hardened Android devices for staff phones. Have you worked with privacy-focused or hardened devices before? If not, how comfortable are you learning on the job?
3. We support communities with limited and unreliable connectivity in Northern Ontario. Tell me about a time you diagnosed and fixed a problem remotely when you couldn't physically touch the hardware.

Reply whenever you're ready and we'll book a call from there.

[YOUR NAME]`,
      },
    ],
  },
  {
    id: "bookkeeper",
    title: "Bookkeeper / Admin",
    context: "Remote · ~10 hrs/wk · $40/hr · Contract",
    templates: [
      {
        id: "long",
        label: "Long (Chamber / Job Bank)",
        kind: "posting" as const,
        body: `Bookkeeper / Administrative Support — Remote
Part-time · ~10 hrs/wk · $40/hr · Contract

Headwaters is looking for a reliable bookkeeper and admin support person to keep the back office running. This is a remote, part-time contract — roughly 10 hours a week, more during monthly close.

WHAT THE JOB COVERS

- Monthly bookkeeping in QuickBooks (or equivalent)
- CRA remittances — payroll source deductions, HST, corporate filings on schedule
- Supplier and contractor invoicing; following up on outstanding amounts
- Monthly close reporting delivered to the lead without being asked
- Light admin: contracts, templates, document organization

WHAT WE NEED

- Bookkeeping or accounting background — you've closed months before and know what "done" looks like
- Familiar with CRA requirements for small businesses or contractors; no surprises at year-end
- Organized and self-directed; we will not remind you of deadlines
- Comfortable working asynchronously with a small, distributed team
- Discretion; this is a confidential role

DETAILS

Location: Fully remote
Hours: ~10 hrs/wk, flexible schedule; more hours during month-end (typically 2–3 days heavier)
Compensation: $40/hr, contract
Start: Within the next few weeks, flexible

TO APPLY

Email [YOUR-EMAIL] with:
1. A brief description of the businesses or clients you've bookkept — industry, size, complexity
2. Your familiarity with CRA remittances — what have you filed, and how often?
3. Your typical availability around month-end`,
      },
      {
        id: "short",
        label: "Short (Facebook / Bulletin Board)",
        kind: "posting" as const,
        body: `📒 BOOKKEEPER / ADMIN — Remote · Part-time
~10 hrs/wk · $40/hr · Contract

Need a reliable bookkeeper for a small Indigenous-owned company in Northern Ontario. Remote, flexible hours, roughly 10 hrs/wk plus month-end. QuickBooks, CRA remittances, invoicing, monthly close.

Self-directed only — if you need to be chased for deadlines, this is not a good fit.

Email [YOUR-EMAIL] with your bookkeeping background and your availability around month-end.`,
      },
      {
        id: "screening",
        label: "Screening Email",
        kind: "email" as const,
        body: `Subject: Re: Bookkeeper application — a few quick questions

[Name],

Thanks for getting in touch. Before we set up a call, a few short questions:

1. What accounting software do you know well, and how long have you been using it day-to-day?
2. Describe your experience with CRA remittances — payroll source deductions, HST, corporate filings. What have you filed, and how regularly?
3. This is a remote, self-managed role with no internal deadlines being pushed to you. How do you handle month-end when you're managing multiple clients at the same time?

Reply whenever you're ready and we'll book a call.

[YOUR NAME]`,
      },
    ],
  },
  {
    id: "food-handler",
    title: "Food Handler",
    context: "Deer Lake First Nation · On-site · Full-time · Contract",
    templates: [
      {
        id: "long",
        label: "Long (Chamber / Job Bank / Band Office)",
        kind: "posting" as const,
        body: `Food Handler — Deer Lake First Nation (On-Site, Embedded)
Full-time · Contract · Competitive rate

Headwaters is placing a full-time Food Handler directly at the Deer Lake First Nation store on Day 1. This is an in-community, on-the-floor role — not remote, not occasional.

WHAT THE JOB COVERS

- Salt processing and packaging: batch prep, weighing, labeling, quality checks
- 807 piecework production alongside community members
- Daily store and kitchen tidying — floor, surfaces, equipment kept clean and ready
- Following food safety procedures and helping document them clearly
- Working closely with the store manager and Headwaters staff; flagging problems early

WHAT WE NEED

- Experience in food handling, food production, or a commercial kitchen — you know what safe and clean looks like
- Food Handler certification (or genuine willingness to complete it before the start date; we can help arrange it)
- Physically able and comfortable in a standing, active role throughout the day
- Respectful and low-ego; you are a guest in someone else's community and you treat it that way
- Reliable above all else — showing up matters more than anything else on this list

DETAILS

Location: Deer Lake First Nation, ON — must be willing to relocate or travel on a set rotation (housing/travel support discussed at offer)
Hours: Full-time
Compensation: Competitive, based on experience; contract role
Start: Day 1 — as soon as possible

TO APPLY

Email [YOUR-EMAIL] with:
1. Your food handling or kitchen background — what kind of production or volume have you worked in?
2. Your honest situation with travel or relocation to Deer Lake, ON
3. Your current certification status (Food Safe / Food Handler) and any other relevant certifications`,
      },
      {
        id: "short",
        label: "Short (Facebook / Bulletin Board / Band Notice)",
        kind: "posting" as const,
        body: `🥄 FOOD HANDLER — Deer Lake First Nation
Full-time · On-site · Contract

Hiring a Food Handler for the Deer Lake store. Day-one start. Salt processing, piecework production, and keeping the kitchen and shop floor clean and running.

You need to be reliable, respectful, and ready to show up. Food handling background preferred. Food Safe certificate required or we'll help you get it before start.

Relocation or rotation support available.

Email [YOUR-EMAIL] with a brief note on your background and your availability.`,
      },
      {
        id: "screening",
        label: "Screening Email",
        kind: "email" as const,
        body: `Subject: Re: Food Handler role — quick phone screen

[Name],

Thanks for reaching out. A few questions before we talk:

1. Describe your food handling or kitchen experience. What kind of production or environment have you worked in — volume, team size, what you were responsible for day-to-day?
2. This role is on-site at Deer Lake First Nation — a remote community in Northern Ontario. Are you familiar with the area? What's your realistic situation with travel or relocation, and would housing or travel support make it workable?
3. Day-one reliability is the single most important thing for this role. What does your current situation look like for availability, and is there anything that might affect an early start date?

Reply with your answers and the best number to reach you, and I'll get a call in the calendar.

[YOUR NAME]`,
      },
    ],
  },
  {
    id: "cleaner-tutor",
    title: "Cleaner / Tutor",
    context: "Dryden, ON · Part-time · Household & office support · Contract",
    templates: [
      {
        id: "long",
        label: "Long (Chamber / Community Board)",
        kind: "posting" as const,
        body: `Part-Time Cleaner and Part-Time Tutor — Dryden, ON
Part-time · Contract · Two separate roles; may be filled by one person or two

Headwaters is hiring part-time household and family support staff in Dryden. These are two distinct roles that can be filled separately or by one reliable person who has the range for both.

CLEANER (~$500/mo, ~10–12 hrs/wk)

- Regular cleaning of the home office and household common areas
- Kitchen surfaces, bathrooms, floors, and tidying
- Consistent schedule; work completed without supervision
- Must be discreet — you'll be working in a family home and office

TUTOR (~$900/mo, ~15–18 hrs/wk)

- Academic support for school-age children, elementary to secondary level
- Flexible scheduling around the family's routine
- Homework help, reading, math, science — generalist preferred; subject specialists also welcome
- Patient, encouraging approach; you keep things calm under pressure

WHAT WE NEED (BOTH ROLES)

- Reliable — you show up when you say you will, consistently
- Discreet — what happens in the household stays there
- Straightforward and low-drama; this is a professional relationship

DETAILS

Location: Dryden, ON — in-person only
Start: Flexible; within the next few weeks
Compensation: Cleaner ~$500/mo · Tutor ~$900/mo · Both ~$1,400/mo · Contract

TO APPLY

Email [YOUR-EMAIL] with:
- Which role(s) you're applying for
- Relevant background (cleaning experience, tutoring experience, subjects you're strong in)
- Your availability and how quickly you could start`,
      },
      {
        id: "short",
        label: "Short (Facebook / Community Board)",
        kind: "posting" as const,
        body: `🏠 CLEANER + TUTOR — Dryden, ON · Part-time · Contract

Two part-time roles — can be filled by one person or two.

Cleaner: ~10–12 hrs/wk, home office and household. Regular schedule, work done independently, full discretion.

Tutor: ~15–18 hrs/wk, school-age kids, elementary to secondary. Generalist preferred. Patient and steady.

Both roles require reliability above anything else.

Email [YOUR-EMAIL] and tell us which role(s) you're interested in and your background.`,
      },
      {
        id: "screening",
        label: "Screening Email",
        kind: "email" as const,
        body: `Subject: Re: Cleaner / Tutor inquiry — quick questions

[Name],

Thanks for reaching out. A few short questions before we talk:

1. Which role are you applying for — cleaning, tutoring, or both?
2. Describe your relevant background briefly. For cleaning: what kind of spaces have you cleaned and how regularly? For tutoring: what age groups and subjects are you strongest with?
3. Both roles require full discretion — this is a working family home. Is there anything about that setup that would be a concern for you?
4. What does your availability look like, and how quickly could you start?

Reply whenever you're ready.

[YOUR NAME]`,
      },
    ],
  },
  {
    id: "handyman",
    title: "Handyman",
    context: "Referral only — no open posting",
    isReferralOnly: true,
    templates: [
      {
        id: "referral-dm",
        label: "Referral Ask DM",
        kind: "dm" as const,
        body: `Hey [NAME] —

Quick question for you.

I'm looking for a reliable handyman I can call on a regular basis — small repairs, odd jobs around the operation here in Dryden, nothing too complicated but it needs to be done right the first time and without me having to follow up three times.

I'm not posting this publicly. I'd rather find someone through people I trust.

Would you know anyone you'd personally vouch for? Someone who shows up when they say they will, does clean work, and doesn't need to be managed?

I'm happy to pay fairly — this would be ongoing work, not a one-off.

If someone comes to mind, feel free to pass along their number and I'll reach out directly, or send them my way.

Thanks — [YOUR NAME]`,
        note: "Send this DM to trusted contacts: contractors, trades instructors, the parish priest, community leaders, long-standing local tradespeople. Do not post publicly.",
      },
    ],
  },
];

// ── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        fontFamily: MONO,
        fontSize: "7.5pt",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        background: copied ? DARK : "transparent",
        color: copied ? CREAM : AMBER,
        border: `1px solid ${copied ? DARK : AMBER}`,
        borderRadius: "3pt",
        padding: "3pt 8pt",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

// ── Template block ───────────────────────────────────────────────────────────

function TemplateBlock({ tpl }: { tpl: (typeof ROLES)[0]["templates"][0] }) {
  const kindLabel =
    tpl.kind === "posting" ? "Job Posting" :
    tpl.kind === "email"   ? "Screening Email" :
                             "Referral DM";

  const kindColor =
    tpl.kind === "posting" ? AMBER :
    tpl.kind === "email"   ? DARK  :
                             "#5a7a5a";

  return (
    <div style={{ marginBottom: "24pt" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6pt", gap: "8pt" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8pt" }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: "6.5pt",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: CREAM,
              background: kindColor,
              borderRadius: "2pt",
              padding: "2pt 6pt",
            }}
          >
            {kindLabel}
          </span>
          <span style={{ fontFamily: SANS, fontSize: "8.5pt", color: MUTED }}>
            {tpl.label}
          </span>
        </div>
        <CopyButton text={tpl.body} />
      </div>

      {/* Note (referral DM only) */}
      {"note" in tpl && tpl.note && (
        <div
          style={{
            fontFamily: SANS,
            fontSize: "8pt",
            color: DARK,
            background: "rgba(31,61,46,0.08)",
            border: `1px solid rgba(31,61,46,0.2)`,
            borderRadius: "3pt",
            padding: "6pt 10pt",
            marginBottom: "6pt",
            lineHeight: 1.5,
          }}
        >
          <strong>Note:</strong> {tpl.note}
        </div>
      )}

      {/* Body */}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "8pt",
          lineHeight: 1.7,
          color: TEXT,
          background: "rgba(31,61,46,0.04)",
          border: `1px solid ${RULE}`,
          borderRadius: "3pt",
          padding: "12pt 14pt",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
          overflowX: "auto",
        }}
      >
        {tpl.body}
      </pre>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function HiringTemplates() {
  const [activeRole, setActiveRole] = useState(ROLES[0].id);

  const role = ROLES.find((r) => r.id === activeRole) ?? ROLES[0];

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: SANS }}>
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          background: CREAM,
          minHeight: "100vh",
        }}
      >
        {/* Amber rule */}
        <div style={{ height: "3pt", background: AMBER }} />

        {/* Header */}
        <div style={{ padding: "28pt 40pt 0" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: "7pt",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: AMBER,
              marginBottom: "4pt",
            }}
          >
            Practitioner Operating Plan · Hiring Pack
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: "22pt",
              fontWeight: 700,
              color: DARK,
              lineHeight: 1.1,
              marginBottom: "6pt",
            }}
          >
            Job Postings & Screening Templates
          </div>
          <p
            style={{
              fontSize: "9.5pt",
              color: MUTED,
              lineHeight: 1.55,
              maxWidth: "560px",
              margin: "0 0 20pt",
            }}
          >
            Ready-to-paste templates for each role. Select a role, pick the version
            that fits the channel, and copy. The handyman role uses a referral DM
            only — no open posting.
          </p>

          {/* Role tabs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6pt",
              borderBottom: `1.5pt solid ${RULE}`,
              paddingBottom: "0",
              marginBottom: "0",
            }}
          >
            {ROLES.map((r) => {
              const active = r.id === activeRole;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  style={{
                    fontFamily: MONO,
                    fontSize: "7.5pt",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: active ? AMBER : MUTED,
                    border: "none",
                    borderBottom: active ? `2pt solid ${AMBER}` : "2pt solid transparent",
                    borderRadius: 0,
                    padding: "8pt 10pt 7pt",
                    cursor: "pointer",
                    transition: "color 0.15s",
                    marginBottom: "-1.5pt",
                  }}
                >
                  {r.title}
                  {"isReferralOnly" in r && r.isReferralOnly && (
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: "6pt",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: active ? "rgba(184,90,62,0.6)" : "rgba(107,118,101,0.5)",
                        marginLeft: "5pt",
                      }}
                    >
                      Referral only
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role content */}
        <div style={{ padding: "24pt 40pt 40pt" }}>
          {/* Role context */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: "7.5pt",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "20pt",
            }}
          >
            {role.context}
          </div>

          {/* Templates */}
          {role.templates.map((tpl) => (
            <TemplateBlock key={tpl.id} tpl={tpl} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1pt solid ${RULE}`,
            padding: "10pt 40pt 14pt",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: "7pt",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Headwaters Development Services · Confidential
          </div>
          <div style={{ fontFamily: MONO, fontSize: "7pt", color: MUTED }}>
            Hiring Templates · Practitioner Operating Plan
          </div>
        </div>
      </div>
    </div>
  );
}
