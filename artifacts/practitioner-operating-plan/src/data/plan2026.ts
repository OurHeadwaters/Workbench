// ─── Types ───────────────────────────────────────────────────────────────────

export type Phase = "Pursuit" | "Pivot" | "Operating Season";

export type ActionType = "copy-ai-prompt" | "copy-replit-task-brief";

export type StepCategory = "proposals" | "print" | "relationship" | "admin" | "build";

export interface StepAction {
  type: ActionType;
  label: string;
  content: string;
}

export interface Step {
  title: string;
  detail?: string;
  actions?: StepAction[];
  link?: { label: string; path: string };
  category?: StepCategory;
}

export interface Day {
  isoDate: string;
  steps: Step[];
}

export interface Week {
  isoWeek: number;
  phase: Phase;
  theme: string;
  days: Day[]; // Mon–Fri
}

// ─── Key milestone dates ──────────────────────────────────────────────────────

/** AGM — Annual General Meeting. Near-term board milestone; aim for W22. */
export const AGM_TARGET_WEEK = 22;

/** Deer Lake proposal soft decision window. */
export const DEER_LAKE_SOFT_DEADLINE = "2026-06-15";

/** Hard deadline for confirming an active operating contract. */
export const OPERATING_CONTRACT_DEADLINE = "2026-07-31";

/** 807 computing runway available. */
export const COMPUTING_RUNWAY_807 = 12_000;

/** Total startup budget. */
export const STARTUP_BUDGET = 28_000;

// ─── Backward-compat constants (used by v7.ts) ────────────────────────────────
// These are kept for import compatibility with other data files.

/** @deprecated - kept for v7.ts compat. Use DEER_LAKE_SOFT_DEADLINE instead. */
export const BRIDGE_CAPITAL_DEADLINE = "2026-05-30";

/** @deprecated - kept for v7.ts compat. Use OPERATING_CONTRACT_DEADLINE instead. */
export const PLAN_B_HARD_DEADLINE = "2026-07-31";

/** @deprecated - kept for v7.ts compat. */
export const SUPPLY_CHAIN_TARGET_YEAR = "2027";

/** @deprecated - kept for v7.ts compat. */
export const SCENARIO_A_COST_BASIS_MONTHLY = 48_000;

// ─── Phase order ─────────────────────────────────────────────────────────────

export const PHASE_ORDER: Phase[] = ["Pursuit", "Pivot", "Operating Season"];

// ─── Phase colours ────────────────────────────────────────────────────────────

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; dot: string }> = {
  "Pursuit":          { bg: "rgba(184,90,62,0.12)",  text: "#f4ede0", dot: "#b85a3e" },
  "Pivot":            { bg: "rgba(26,95,168,0.14)",  text: "#f4ede0", dot: "#1A5FA8" },
  "Operating Season": { bg: "rgba(31,61,46,0.80)",   text: "#f4ede0", dot: "#a3c4a8" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateRange(week: Week): string {
  const mon = new Date(week.days[0].isoDate + "T12:00:00");
  const fri = new Date(week.days[week.days.length - 1].isoDate + "T12:00:00");
  const fmt = (d: Date) => d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  return `${fmt(mon)} – ${fmt(fri)}`;
}

export function getTodayWeek(): Week | null {
  const today = toLocalISODate(new Date());
  return PLAN_2026.find((w) => w.days.some((d) => d.isoDate === today)) ?? null;
}

export function getTodayDay(): { week: Week; day: Day; weekendMode?: "saturday" | "sunday" } | null {
  const today = toLocalISODate(new Date());
  for (const week of PLAN_2026) {
    for (const day of week.days) {
      if (day.isoDate === today) return { week, day };
    }
  }
  // Weekend handling: Saturday → show Friday's plan, Sunday → show Monday's plan
  const now = new Date();
  const dow = now.getDay(); // 0=Sun, 6=Sat
  if (dow === 6) {
    // Saturday → find Friday
    const fri = new Date(now);
    fri.setDate(fri.getDate() - 1);
    const friStr = toLocalISODate(fri);
    for (const week of PLAN_2026) {
      for (const day of week.days) {
        if (day.isoDate === friStr) return { week, day, weekendMode: "saturday" };
      }
    }
  } else if (dow === 0) {
    // Sunday → find Monday
    const mon = new Date(now);
    mon.setDate(mon.getDate() + 1);
    const monStr = toLocalISODate(mon);
    for (const week of PLAN_2026) {
      for (const day of week.days) {
        if (day.isoDate === monStr) return { week, day, weekendMode: "sunday" };
      }
    }
  }
  return null;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Plan anchored to W20, May 18, 2026.
// Three phases:
//   Pursuit         W20–W26  (May 18 – Jul 3)   Proposals out, AGM, print work
//   Pivot           W27–W35  (Jul 6 – Aug 28)   Post-AGM follow-up, Tyler cold storage, pipeline
//   Operating Season W36–W52 (Aug 31 – Dec 25)  Active contracts, seasonal rhythm

export const PLAN_2026: Week[] = [

  // ══════════════════════════════════════════════════════════
  //  PURSUIT  W20–W26  (May 18 – Jul 3, 2026)
  //  Deer Lake is the anchor. 807 is the floor. AGM is the gate.
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 20,
    phase: "Pursuit",
    theme: "Set the table — Deer Lake brief, 807 check-in, evening dump habit",
    days: [
      {
        isoDate: "2026-05-18",
        steps: [
          {
            title: "Write down this week's single most important outcome",
            detail: "On paper. Not a list — one sentence. If only one thing moves this week, what must it be? Everything else is secondary.",
            category: "admin",
          },
          {
            title: "807 check-in — confirm computing runway and current scope",
            detail: "$12k computing runway from 807 is the floor that keeps the lights on. Confirm the current active scope, invoice status, and any upcoming work that needs scoping. 807 is the active revenue relationship — treat it with the care it deserves.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-05-19",
        steps: [
          {
            title: "Deer Lake brief — review and sharpen the one-page proposal",
            detail: "Deer Lake is the anchor deal. The brief needs to be one page, plain language, emotionally direct. Review the current Chief Brief and confirm the 8-week trial framing is clear: what it costs, what the community controls, what the council can stop at any time.",
            link: { label: "Open Chief Brief", path: "/deer-lake-chief-brief" },
            category: "proposals",
          },
          {
            title: "Start the evening dump habit tonight",
            detail: "The evening brain dump is a new rhythm. Tonight: open the evening dump page before you close your computer. Write for 5 minutes — anything on your mind about the day's work. No structure needed.",
            link: { label: "Evening dump →", path: "/debrief/evening" },
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-05-20",
        steps: [
          {
            title: "Connect codetry.ca in GoDaddy — 10 minutes, coffee in hand",
            detail: "Step 1: Open this Replit project → click Publish (top right) → Custom domains → Add domain → type codetry.ca → also add www.codetry.ca. Replit will show you a CNAME value to copy (looks like a long replit.app address). Step 2: In a new tab, go to godaddy.com → sign in → My Products → Domains → codetry.ca → DNS. Step 3: Add a CNAME record — Name: www, Value: paste what Replit gave you, TTL: 1 hour. Step 4: For the root (codetry.ca with no www), GoDaddy calls it an 'A' record — use the IP address Replit shows, or if GoDaddy offers 'Forwarding', forward codetry.ca → www.codetry.ca. Step 5: Save. Done. DNS can take anywhere from 2 minutes to 2 hours to kick in — check by typing codetry.ca in your browser.",
            category: "admin",
          },
          {
            title: "Print materials — confirm what's in the queue",
            detail: "Farmers market materials and any other print/physical deliverables that are in progress or needed soon. Make a short list: what's done, what's in progress, what has a deadline. Don't let print work pile up into a sprint.",
            category: "print",
          },
          {
            title: "Gather Round — prepare first-contact message",
            detail: "Gather Round is the top of the outreach pipeline. The first message goes to Rebecca Spooner (@homeschoolon on Instagram). Two sentences: name the Legacy Pass download problem, ask if a 20-minute call makes sense. No pitch, no credentials — just the problem.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the DM",
                content: "Write a 2-sentence Instagram DM from a homeschool mom who is also a developer. She is reaching out to Rebecca Spooner, founder of Gather Round Homeschool (@homeschoolon). Open with the Legacy Pass download management problem (families spending real time managing PDFs across devices, losing access without internet). Ask if it would make sense to show Rebecca a local-first tool she has built for exactly this. Tone: warm, peer-to-peer, not a cold pitch. No jargon. No mention of blockchain, NFTs, or XRPL. Two sentences only.",
              },
            ],
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-05-21",
        steps: [
          {
            title: "AGM agenda — draft the key items for the board meeting",
            detail: "AGM is the near-term board milestone. The agenda should include: financial position ($28k startup budget, $12k 807 runway), Deer Lake partnership path for board approval, and any other items requiring a board resolution. Get this into a draft form now so there's time to refine it.",
            category: "admin",
          },
          {
            title: "Tyler — confirm cold storage conversation is on the calendar",
            detail: "Tyler's cold storage development plan is a live thread. Make sure there's a scheduled time to sit down and map out the actual plan — timeline, costs, what Tyler needs to move forward. This shouldn't stay as a background conversation much longer.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-05-22",
        steps: [
          {
            title: "Week 20 close-out — three-column review",
            detail: "Write a short note: Deer Lake (where does the brief stand?), 807 (runway confirmed?), AGM (agenda drafted?). What carried over to next week? File it somewhere you'll actually look at it.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 21,
    phase: "Pursuit",
    theme: "AGM prep, print deliverables, Gather Round first contact",
    days: [
      {
        isoDate: "2026-05-25",
        steps: [
          {
            title: "AGM prep — confirm board members are notified and have the agenda",
            detail: "Send the draft agenda to board members with the meeting date confirmed. Make sure the Deer Lake partnership path item is clearly framed: this is a board approval item, not just an update.",
            category: "admin",
          },
          {
            title: "Deer Lake — send the brief to the right person",
            detail: "The Chief Brief is ready. Get it into the right hands this week — not next week. One page, hand it over, ask for a 30-minute conversation.",
            link: { label: "Chief Brief", path: "/deer-lake-chief-brief" },
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-05-26",
        steps: [
          {
            title: "Farmers market print materials — confirm what's needed by when",
            detail: "What materials need to be ready for the farmers market? Signage, flyers, price lists, QR codes? Nail down the list and the deadline. If anything needs to be printed professionally, get the files ready this week.",
            category: "print",
          },
          {
            title: "807 — confirm next work scope and timeline",
            detail: "The computing runway from 807 needs to stay active. Confirm with 807 what's next: is there a new scope to propose, or is existing work continuing? Don't let the relationship go quiet.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-05-27",
        steps: [
          {
            title: "Gather Round — send the Instagram DM if not done",
            detail: "This is the last chance before it becomes a delayed thing. Two sentences to Rebecca Spooner. If already sent, note the status.",
            category: "relationship",
          },
          {
            title: "PACE — background research in preparation for first outreach",
            detail: "PACE is in the outreach pipeline. What do you know about them? Who is the right contact? What's the entry framing for a first conversation? Write a short note: 3 bullet points about why this conversation makes sense right now.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-05-28",
        steps: [
          {
            title: "Tyler cold storage — planning session",
            detail: "Sit down with Tyler and map the cold storage plan: what infrastructure is needed, what the timeline looks like, what it costs, and what Tyler needs to move forward. This is a development thread that needs a real plan, not just good intentions.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-05-29",
        steps: [
          {
            title: "Print files — finalize and send to printer if needed",
            detail: "If farmers market materials need professional printing, today's the day to send the files. Don't wait for next week.",
            category: "print",
          },
          {
            title: "Week 21 close-out — non-negotiables check",
            detail: "Kids, sleep, partner time — all three intact? Write an honest one-liner. One missed week is information. Two in a row is a signal.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 22,
    phase: "Pursuit",
    theme: "AGM — board approval on Deer Lake path",
    days: [
      {
        isoDate: "2026-06-01",
        steps: [
          {
            title: "AGM final prep — review the agenda one more time",
            detail: "Read the agenda out loud. Every item should have: (1) a clear framing, (2) what the board needs to decide or know, (3) how long it will take. Trim anything that isn't a decision or essential update.",
            category: "admin",
          },
          {
            title: "Deer Lake — confirm status before the AGM",
            detail: "Before the board meeting, know exactly where the Deer Lake proposal stands. Have they responded to the brief? Is there a conversation scheduled? The board will ask, and 'I'm working on it' isn't an answer.",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-06-02",
        steps: [
          {
            title: "Run the AGM",
            detail: "Key items: financial position update, Deer Lake partnership path (board approval), any other resolutions. Document decisions in writing immediately after — don't let the notes get stale.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-06-03",
        steps: [
          {
            title: "Post-AGM — distribute meeting minutes and confirmed decisions",
            detail: "Write the minutes, circulate to board members, and file them. The Deer Lake decision needs to be documented clearly: what was approved, what the conditions are, what happens next.",
            category: "admin",
          },
          {
            title: "NAN — first outreach note if not already sent",
            detail: "NAN (Nishnawbe Aski Nation) is in the outreach pipeline alongside PACE. One paragraph: who Headwaters is, what the store-in-a-box does, why NAN communities are the right conversation, and the ask (a 30-minute call).",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-06-04",
        steps: [
          {
            title: "Saltbox / computing work — 807 scope review",
            detail: "With AGM done and the Deer Lake path approved, confirm the 807 computing scope for the next 4-6 weeks. The $12k runway is the floor — make sure the work is scoped to keep it active.",
            link: { label: "Saltbox × Gather Round brief", path: "/saltbox-gather-round" },
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-06-05",
        steps: [
          {
            title: "Week 22 close-out — AGM outcome documented",
            detail: "Three questions: (1) What did the board approve on Deer Lake? (2) Is the 807 scope confirmed? (3) What's the next concrete action on each proposal in the pipeline (Deer Lake, Gather Round, PACE, NAN)?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 23,
    phase: "Pursuit",
    theme: "Post-AGM follow-up — Deer Lake conversation, pipeline warming",
    days: [
      {
        isoDate: "2026-06-08",
        steps: [
          {
            title: "Deer Lake — follow up on the brief",
            detail: "The brief has been out for ~3 weeks. One clear follow-up: 'I'd like to understand what questions the council has before our next conversation. Is there a 30-minute call that works this week?' If there's no response by Friday, schedule an in-person visit.",
            category: "proposals",
          },
          {
            title: "Print materials — farmers market preparation",
            detail: "Farmers market is physical execution work. Confirm all print materials are ready. Walk through the setup: table, signage, samples, payment system. Nothing should be scrambled the morning of.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-06-09",
        steps: [
          {
            title: "Gather Round — follow up or prepare demo",
            detail: "If no DM response after two messages, move to the next pipeline item and revisit Gather Round in 4 weeks. If she responded, prepare the 20-minute demo: (1) Legacy Pass download problem from the family's view, (2) live QR device handoff demo, (3) the credential flow in plain language, (4) the ask: 90-day pilot, 5 families, flat fee.",
            category: "relationship",
          },
          {
            title: "Tyler cold storage — review plan and identify first action",
            detail: "After the planning session last week: what's the single first action that moves the cold storage plan forward? Assign it, calendar it, or make a decision to delay it deliberately (not passively).",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-06-10",
        steps: [
          {
            title: "PACE outreach — send the first note",
            detail: "One paragraph to the right PACE contact. Lead with the corridor framing: same freight routes, same procurement logic as 807. Ask for a 30-minute call.",
            category: "relationship",
          },
          {
            title: "Financial position review — startup budget and runway",
            detail: "Quick review: how much of the $28k startup budget has been deployed? What's the current monthly burn? How many weeks of runway at the current rate? This should take 20 minutes — just keep the numbers honest.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-06-11",
        steps: [
          {
            title: "807 work — progress check and any blockers",
            detail: "Confirm computing work is progressing. Any blockers? Any scope changes? Keep 807 well-served — this is the active revenue relationship.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-06-12",
        steps: [
          {
            title: "Week 23 close-out — proposal pipeline status",
            detail: "Where does each proposal stand? Deer Lake (response received? meeting scheduled?), Gather Round (demo call booked?), PACE (outreach sent?), NAN (outreach sent?). One line each. File it.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 24,
    phase: "Pursuit",
    theme: "Deer Lake soft deadline — decision window",
    days: [
      {
        isoDate: "2026-06-15",
        steps: [
          {
            title: "Deer Lake soft deadline — formal assessment",
            detail: "Is there a signed agreement, a scheduled decision date, or a concrete next step on the calendar? If yes: continue Pursuit, calendar the decision date, stay warm. If no: don't panic, but open parallel outreach to the next community on the list — don't let Deer Lake stall create a single point of failure.",
            category: "proposals",
          },
          {
            title: "Talking points review — prepare for the exclusivity conversation if needed",
            detail: "If Deer Lake asks about exclusivity (as they might), review the talking points doc before any call or meeting.",
            link: { label: "Exclusivity talking points", path: "/deer-lake-talking-points" },
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-06-16",
        steps: [
          {
            title: "NAN — follow up on first outreach note",
            detail: "One short follow-up to NAN. Warm close: 'Happy to work around your schedule — even a 20-minute call would be useful.' If no response after two attempts, move to a band-direct approach.",
            category: "relationship",
          },
          {
            title: "Print materials — farmers market post-mortem",
            detail: "How did the farmers market materials land? What worked, what needs to change for next time? Write a one-paragraph note. This is how print work improves.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-06-17",
        steps: [
          {
            title: "807 deepening — is there a next scope to propose?",
            detail: "807 is the active revenue relationship. Don't wait for them to bring the next scope to you. Think about what Headwaters can offer in the next 6 weeks that would be genuinely valuable to 807. Bring it to them.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-06-18",
        steps: [
          {
            title: "Tyler cold storage — timeline check",
            detail: "Is the cold storage plan on track? What's the critical path item right now? Is Tyler blocked on anything?",
            category: "build",
          },
          {
            title: "Runway model update",
            detail: "Update the three-scenario runway: Deer Lake only, Deer Lake + 807, 807 only. Which scenario is the current operating assumption?",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-06-19",
        steps: [
          {
            title: "Week 24 close-out — June 15 checkpoint documented",
            detail: "What was the Deer Lake status as of June 15? What's the current operating assumption? What's the July 31 hard deadline plan? File it.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 25,
    phase: "Pursuit",
    theme: "Parallel outreach opens — proposals, build, and physical track all moving",
    days: [
      {
        isoDate: "2026-06-22",
        steps: [
          {
            title: "PACE — follow up or book a call",
            detail: "If PACE responded, book a 30-minute call this week. If no response, send one more note and then park it for 3 weeks. Don't over-rotate on non-responsive pipeline.",
            category: "relationship",
          },
          {
            title: "Deer Lake — stay warm, no pressure",
            detail: "One short note through the existing channel: 'Is there anything useful I can send ahead of the next conversation?' Keep the relationship warm. Don't force a timeline.",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-06-23",
        steps: [
          {
            title: "Build — 807 computing work progress",
            detail: "Confirm current 807 computing work is on track. Any scope changes or new requests? Keep the relationship well-served.",
            category: "build",
          },
          {
            title: "Print — inventory physical deliverables",
            detail: "What physical deliverables are in progress or upcoming? Signage, printed materials, any cold storage documentation Tyler needs? Make a clean list.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-06-24",
        steps: [
          {
            title: "Gather Round — status check and decision",
            detail: "If still no response from Gather Round after two DMs, formally park it. Move Gather Round to 'revisit in September' and take it off the active weekly list. Don't let non-responsive pipeline drain attention.",
            category: "relationship",
          },
          {
            title: "Cold storage plan — Tyler update",
            detail: "What has moved since last week? What's the next milestone? Is Tyler getting what he needs?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-06-25",
        steps: [
          {
            title: "Replication roadmap — review for the Deer Lake conversation",
            detail: "When the Deer Lake conversation moves to a closer, review the replication roadmap so you can speak confidently to Phase 1 → Phase 2 → Constellation. This framing is important for community buy-in.",
            link: { label: "How the model spreads", path: "/deer-lake-roadmap" },
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-06-26",
        steps: [
          {
            title: "Week 25 close-out — mid-phase review",
            detail: "We're 6 weeks into Pursuit. Quick review: Deer Lake (where are we?), 807 (strong?), Gather Round (parked or active?), PACE (call scheduled?), NAN (response?), Tyler (plan in place?). What's the realistic operating assumption for July?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 26,
    phase: "Pursuit",
    theme: "End of Pursuit — Jul 3 check: contract or Pivot",
    days: [
      {
        isoDate: "2026-06-29",
        steps: [
          {
            title: "July 1 week — reflect before the half-year mark",
            detail: "Before the holiday: write a one-page note. What happened in the first 6 weeks of this phase? What was harder than expected? What worked? What does the second half of the year need to look different?",
            category: "admin",
          },
          {
            title: "Deer Lake — final Pursuit push",
            detail: "If there is any action that would move the Deer Lake decision before July 31, do it this week. Not a pressure play — a genuine offer of whatever they need to be ready to decide.",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-06-30",
        steps: [
          {
            title: "807 — confirm H2 scope",
            detail: "What does 807 need from Headwaters in the second half of the year? Scope it, price it, and put it in writing. The computing runway needs to be renewed, not assumed.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-07-01",
        steps: [
          {
            title: "Canada Day — rest if you can",
            detail: "Protect the non-negotiables. If the kids are home, be home. The work will still be there Wednesday.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-07-02",
        steps: [
          {
            title: "Phase gate: do we have a contract, a committed deal, or a hard no?",
            detail: "Honest assessment: Deer Lake — contract signed, committed but not signed, or stalled? 807 — scope confirmed for H2? PACE / NAN — any responses? Based on this, is the July 31 hard deadline still viable for an operating contract? If not, Pivot starts now, not July 31.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-07-03",
        steps: [
          {
            title: "Week 26 close-out — Pursuit phase complete",
            detail: "Document the outcome of Pursuit phase: what proposals are active, what is closed, what moves into Pivot. This is the record that future you will be glad you wrote.",
            category: "admin",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  PIVOT  W27–W35  (Jul 6 – Aug 28, 2026)
  //  Post-AGM follow-up. 807 deepening. Tyler cold storage. Pipeline.
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 27,
    phase: "Pivot",
    theme: "Pivot opens — 807 deepening and cold storage plan finalization",
    days: [
      {
        isoDate: "2026-07-06",
        steps: [
          {
            title: "Pivot orientation — write the single goal for this phase",
            detail: "Pivot is 9 weeks. What is the one outcome that would make Pivot a success? Write it down. Everything else is in service of that.",
            category: "admin",
          },
          {
            title: "807 — deepening conversation",
            detail: "Schedule a relationship conversation with 807, not a task call. What is 807 working toward in the next 6 months? Where does Headwaters fit in that picture? Listen more than you pitch.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-07-07",
        steps: [
          {
            title: "Tyler cold storage — finalize the development plan",
            detail: "The cold storage plan should be in near-final form by now. Review the timeline, the cost estimate, and what Tyler needs to start. If the plan isn't finalized, set a hard deadline: finalized by end of W27, no exceptions.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-08",
        steps: [
          {
            title: "Deer Lake — active follow-up (not passive waiting)",
            detail: "If Deer Lake hasn't moved since June 15, this is the week to make a direct ask. One clear question: 'Is there a decision coming before July 31, or should we plan for a later timeline?' Get a real answer.",
            category: "proposals",
          },
          {
            title: "PACE — call or park",
            detail: "If PACE has responded, run the call this week. If not, park it to September. Make the decision explicitly — don't let it drift.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-07-09",
        steps: [
          {
            title: "Print — review physical deliverables for summer season",
            detail: "What physical deliverables are needed for the summer farmers market season? Get ahead of the print queue.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-07-10",
        steps: [
          {
            title: "Week 27 close-out",
            detail: "One line each: 807 (deepening conversation status), Tyler cold storage (plan finalized?), Deer Lake (real answer received?), pipeline (PACE, NAN status).",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 28,
    phase: "Pivot",
    theme: "July 31 hard deadline approaching — contracts or redirect",
    days: [
      {
        isoDate: "2026-07-13",
        steps: [
          {
            title: "July 31 countdown — 18 days out",
            detail: "July 31 is the hard deadline for confirming an active operating contract. What needs to happen in the next 18 days? Write it down. If Deer Lake isn't going to make it, what does the redirect look like?",
            category: "proposals",
          },
          {
            title: "807 computing work — confirm H2 scope in writing",
            detail: "Get the H2 807 scope documented. This is the floor. It needs to be confirmed, not assumed.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-14",
        steps: [
          {
            title: "Cold storage plan — what does Tyler need right now?",
            detail: "Check in with Tyler. Is the plan funded? Does he have what he needs to start? What's the single thing that would unblock progress?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-15",
        steps: [
          {
            title: "NAN — follow up or plan a direct approach",
            detail: "NAN hasn't moved if there's been no response to two outreach notes. Consider a band-direct approach to a specific NAN member community rather than going through the national body.",
            category: "relationship",
          },
          {
            title: "Financial model — update for current scenario",
            detail: "Where are we against the $28k startup budget? What's the runway at current burn? What does the July 31 outcome do to the numbers in each scenario?",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-07-16",
        steps: [
          {
            title: "Print — farmers market mid-season check",
            detail: "Are the farmers market materials holding up? Anything needing reprinting or replacement?",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-07-17",
        steps: [
          {
            title: "Week 28 close-out",
            detail: "July 31 is two weeks away. Honest assessment: what is the most likely outcome? Contract signed, in-progress but close, or redirect?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 29,
    phase: "Pivot",
    theme: "Hard decisions — commit or redirect with clarity",
    days: [
      {
        isoDate: "2026-07-20",
        steps: [
          {
            title: "Deer Lake — make the direct ask for a decision",
            detail: "One clear, respectful ask: 'We're planning our August operations. Is there a decision on the Deer Lake engagement before July 31, or should we plan for a later timeline?' This is not pressure — it's honest planning.",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-07-21",
        steps: [
          {
            title: "807 — relationship check-in beyond the scope",
            detail: "How is the 807 relationship going at a human level? Beyond the computing work, are you a trusted partner to them? What would deepen that trust in the next quarter?",
            category: "relationship",
          },
          {
            title: "Cold storage — Tyler progress update",
            detail: "Where is Tyler on the cold storage plan? What's the next milestone?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-22",
        steps: [
          {
            title: "Gather Round — revisit if parked (it's been 4 weeks)",
            detail: "If Gather Round was parked in June, it's been 4 weeks. One more light note to Rebecca: 'Following up in case the timing is better now.' One message. Then park until September if no response.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-07-23",
        steps: [
          {
            title: "Build — review Saltbox/computing work pipeline",
            detail: "What's in the pipeline after the current 807 scope? Is there a next project visible, or does new work need to be actively created?",
            link: { label: "Saltbox × Gather Round brief", path: "/saltbox-gather-round" },
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-24",
        steps: [
          {
            title: "Week 29 close-out — July 31 one week out",
            detail: "One week to the hard deadline. What's the honest outlook on each active deal? Where does the runway model land in each scenario?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 30,
    phase: "Pivot",
    theme: "July 31 hard deadline — commit to the operating path",
    days: [
      {
        isoDate: "2026-07-27",
        steps: [
          {
            title: "Final week before July 31 hard deadline",
            detail: "Whatever actions are still open on Deer Lake, PACE, NAN — do them this week. After July 31, stop chasing and start building on what's confirmed.",
            category: "proposals",
          },
          {
            title: "Cold storage — confirm Tyler's timeline and any funding needs",
            detail: "Is cold storage going to move this summer or fall? Confirm the timeline and what resources are needed.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-28",
        steps: [
          {
            title: "807 computing — check on H2 scope progress",
            detail: "Confirm the H2 807 work is progressing as expected. No surprises.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-07-29",
        steps: [
          {
            title: "Print — summer season wrap-up",
            detail: "What print/physical work needs to wrap up before the operating season starts? Make a short list and move through it.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-07-30",
        steps: [
          {
            title: "Prepare July 31 decision document",
            detail: "One page: what is committed (signed or verbal commitment with a signed date), what is in-progress (likely to close in August), what is parked. This document is the starting point for Operating Season planning.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-07-31",
        steps: [
          {
            title: "July 31 hard deadline — document and decide",
            detail: "The hard deadline is here. Document the status of every active proposal. Make a clear decision: what is the operating model going into August and the fall? Write it down. Share it with anyone who needs to know.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 31,
    phase: "Pivot",
    theme: "Transition — building toward Operating Season",
    days: [
      {
        isoDate: "2026-08-03",
        steps: [
          {
            title: "Operating Season prep — what needs to be in place by W36?",
            detail: "Operating Season starts W36 (Aug 31). That's 5 weeks away. What infrastructure, agreements, or systems need to be in place? Make the list now.",
            category: "admin",
          },
          {
            title: "807 — confirm relationship health and H2 plan",
            detail: "Is the 807 relationship strong? Is H2 scope confirmed? Any concerns?",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-08-04",
        steps: [
          {
            title: "Tyler cold storage — August progress check",
            detail: "Cold storage development should be progressing. Where is Tyler? What's the next milestone?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-05",
        steps: [
          {
            title: "Deer Lake / active proposals — follow-up on any post-July-31 commitments",
            detail: "If any proposals moved to 'committed but not signed' at July 31, follow up this week to get them signed.",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-08-06",
        steps: [
          {
            title: "Print — fall materials planning",
            detail: "What print/physical materials will be needed for the fall season? Get ahead of the queue.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-08-07",
        steps: [
          {
            title: "Week 31 close-out",
            detail: "Progress toward Operating Season: what's in place, what still needs to happen.",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 32,
    phase: "Pivot",
    theme: "Build momentum — systems and relationships for the operating season",
    days: [
      {
        isoDate: "2026-08-10",
        steps: [
          {
            title: "808 relationship — proactive check-in",
            detail: "Don't wait for 807 to come to you. Reach out proactively: is there anything Headwaters can do in the next 4 weeks that would make a meaningful difference for 807?",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-08-11",
        steps: [
          {
            title: "Cold storage — is Tyler on track?",
            detail: "Review Tyler's cold storage progress. Are there any blockers? Any decisions needed from you?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-12",
        steps: [
          {
            title: "PACE / NAN — September outreach plan",
            detail: "If PACE and NAN haven't responded by now, plan a September outreach relaunch. What would make the next outreach more likely to land?",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-08-13",
        steps: [
          {
            title: "Operating plan documentation",
            detail: "Document the operating plan for the fall: active contracts, monthly revenue, key milestones, and team structure. This is the document you'll refer to every week in Operating Season.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-08-14",
        steps: [
          {
            title: "Week 32 close-out",
            detail: "Where does each active thread stand? 807, Tyler, proposals, print. What needs to move in the next 3 weeks to be ready for Operating Season?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 33,
    phase: "Pivot",
    theme: "Pre-season systems check",
    days: [
      {
        isoDate: "2026-08-17",
        steps: [
          {
            title: "POS and procurement systems — confirm readiness",
            detail: "Square POS and Local Line procurement need to be confirmed ready for operating season. Are both set up and tested? Any outstanding configurations?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-18",
        steps: [
          {
            title: "807 computing work — any pre-season requests?",
            detail: "Does 807 need anything done before the operating season starts? Confirm and scope it.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-19",
        steps: [
          {
            title: "Print — final pre-season materials",
            detail: "Any print materials needed before Operating Season starts? Get them done this week.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-08-20",
        steps: [
          {
            title: "Tyler cold storage — pre-season review",
            detail: "Where does the cold storage plan land relative to Operating Season? Is it on track to be operational before winter?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-21",
        steps: [
          {
            title: "Week 33 close-out",
            detail: "Two weeks to Operating Season. What's still outstanding?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 34,
    phase: "Pivot",
    theme: "Final Pivot week — confirm everything for Operating Season",
    days: [
      {
        isoDate: "2026-08-24",
        steps: [
          {
            title: "Confirm all active contracts are signed",
            detail: "No verbal commitments into Operating Season. Every active engagement needs a signed agreement or a signed commitment with a defined signing date.",
            category: "proposals",
          },
          {
            title: "807 H2 scope — final confirmation",
            detail: "Confirm the full H2 807 scope is agreed and documented. No ambiguity going into the fall.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-08-25",
        steps: [
          {
            title: "Tyler cold storage — August milestone review",
            detail: "What did Tyler accomplish in August? What's the September plan?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-08-26",
        steps: [
          {
            title: "Gather Round — September re-engagement",
            detail: "It's been a full summer. One message to Rebecca: 'Circling back as we head into fall — still would love to show you what this looks like if the timing is right.' This is the last attempt before parking permanently.",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-08-27",
        steps: [
          {
            title: "Operating plan — final version",
            detail: "Finalize the operating plan document. Active contracts, monthly revenue, team, key milestones for fall. Share with anyone who needs it.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-08-28",
        steps: [
          {
            title: "Pivot phase complete — final close-out note",
            detail: "Write the Pivot phase close-out note. What changed between W27 and W34? What did you learn? What does Operating Season need to get right?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 35,
    phase: "Pivot",
    theme: "Bridge week — rest, prep, then Operating Season opens",
    days: [
      {
        isoDate: "2026-08-31",
        steps: [
          {
            title: "Rest day — no deliverables",
            detail: "This is a one-day buffer before Operating Season. No proposals, no outreach. Rest.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-09-01",
        steps: [
          {
            title: "Set-the-season note — what does a good fall look like?",
            detail: "Not a plan — a paragraph. What would make October feel like it worked? Write it before the season starts.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-09-02",
        steps: [
          {
            title: "Operating Season client list — final review",
            detail: "Who are the active clients entering fall? What's each engagement? Any loose threads to close before W36?",
            category: "proposals",
          },
        ],
      },
      {
        isoDate: "2026-09-03",
        steps: [
          {
            title: "Weekly rhythm doc — write it before you need it",
            detail: "Monday: set the week. Wednesday: client check-ins. Friday: close-out note. Write this rhythm down somewhere you'll actually see it every Monday morning.",
            category: "admin",
          },
        ],
      },
      {
        isoDate: "2026-09-04",
        steps: [
          {
            title: "Pivot → Operating Season transition complete",
            detail: "Four months of pursuit and repositioning. Write the one-sentence version: what changed, and what are you walking into fall with?",
            category: "admin",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  OPERATING SEASON  W36–W52  (Sep 7 – Dec 25, 2026)
  //  Active contracts. Seasonal rhythm. Weekly close-outs.
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 36,
    phase: "Operating Season",
    theme: "Operating Season opens — contracts live, rhythm established",
    days: [
      {
        isoDate: "2026-09-07",
        steps: [
          {
            title: "Operating Season orientation — write the weekly rhythm",
            detail: "Every week in Operating Season follows the same rhythm: Monday set-the-week, Friday close-out, Wednesday check-in with active clients. Write this down and commit to it.",
            category: "admin",
          },
          {
            title: "807 — week one of H2 operating scope",
            detail: "Confirm the H2 807 scope is active. What's this week's deliverable?",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-09-08",
        steps: [
          {
            title: "Active contract check-in — Deer Lake (if signed)",
            detail: "First full week of Operating Season. If Deer Lake is signed, check in with the council: what do they need this week? What does the first week look like on the ground?",
            category: "relationship",
          },
        ],
      },
      {
        isoDate: "2026-09-09",
        steps: [
          {
            title: "Tyler cold storage — September plan",
            detail: "What is Tyler doing in September? What needs to be done before winter? Confirm the September plan is documented and resourced.",
            category: "build",
          },
        ],
      },
      {
        isoDate: "2026-09-10",
        steps: [
          {
            title: "Print — fall season materials check",
            detail: "Any print materials needed for September? Get them into the queue.",
            category: "print",
          },
        ],
      },
      {
        isoDate: "2026-09-11",
        steps: [
          {
            title: "Week 36 close-out — Operating Season week one",
            detail: "How did week one feel? Is the rhythm working? What needs to change?",
            category: "admin",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 37,
    phase: "Operating Season",
    theme: "Operating rhythm — relationships, build, physical work",
    days: [
      {
        isoDate: "2026-09-14",
        steps: [
          { title: "807 — weekly scope check", category: "build", detail: "Confirm this week's 807 deliverable is on track." },
          { title: "Active contracts — weekly check-in", category: "relationship", detail: "One check-in with each active contract client. What do they need? Any issues?" },
        ],
      },
      {
        isoDate: "2026-09-15",
        steps: [
          { title: "Cold storage progress", category: "build", detail: "Tyler update: where are we on the cold storage timeline?" },
        ],
      },
      {
        isoDate: "2026-09-16",
        steps: [
          { title: "PACE / NAN September outreach", category: "relationship", detail: "September relaunch on PACE and NAN. One note each. Keep it brief." },
        ],
      },
      {
        isoDate: "2026-09-17",
        steps: [
          { title: "Print — upcoming deliverables", category: "print", detail: "What's in the print queue for October?" },
        ],
      },
      {
        isoDate: "2026-09-18",
        steps: [
          { title: "Week 37 close-out", category: "admin", detail: "Operating Season rhythm check: is the weekly pattern working?" },
        ],
      },
    ],
  },

  {
    isoWeek: 38,
    phase: "Operating Season",
    theme: "Mid-September check — revenue, relationships, build",
    days: [
      {
        isoDate: "2026-09-21",
        steps: [
          { title: "Monthly revenue review", category: "admin", detail: "What came in this month? What's the September projection?" },
          { title: "807 — relationship check-in", category: "relationship", detail: "Beyond the scope — how is 807 doing? Is the relationship strong?" },
        ],
      },
      {
        isoDate: "2026-09-22",
        steps: [
          { title: "Tyler cold storage — mid-month review", category: "build", detail: "Is cold storage on track for winter?" },
        ],
      },
      {
        isoDate: "2026-09-23",
        steps: [
          { title: "Deer Lake — status check (if contract active)", category: "relationship", detail: "How is the Deer Lake engagement going? What does the council need?" },
        ],
      },
      {
        isoDate: "2026-09-24",
        steps: [
          { title: "Build — Saltbox/computing pipeline", category: "build", detail: "What's in the computing pipeline for October?" },
        ],
      },
      {
        isoDate: "2026-09-25",
        steps: [
          { title: "Week 38 close-out", category: "admin", detail: "Three-column review: Revenue (on track?), Relationships (any issues?), Build (cold storage, 807 — on track?)." },
        ],
      },
    ],
  },

  {
    isoWeek: 39,
    phase: "Operating Season",
    theme: "Late September — Q4 planning begins",
    days: [
      {
        isoDate: "2026-09-28",
        steps: [
          { title: "Q4 planning — what does October-December look like?", category: "admin", detail: "Quick sketch of Q4: active contracts, known deliverables, holiday closures, cash flow." },
          { title: "807 — Q4 scope", category: "build", detail: "What does 807 need in Q4? Scope it now." },
        ],
      },
      {
        isoDate: "2026-09-29",
        steps: [
          { title: "Cold storage — pre-winter deadline check", category: "build", detail: "Cold storage needs to be operational before winter. Is Tyler on track?" },
        ],
      },
      {
        isoDate: "2026-09-30",
        steps: [
          { title: "September close-out — monthly review", category: "admin", detail: "One paragraph: what happened in September? Revenue, relationships, build. File it." },
        ],
      },
      {
        isoDate: "2026-10-01",
        steps: [
          { title: "October opens — confirm top three priorities", category: "admin", detail: "What are the three most important things in October? Write them down." },
        ],
      },
      {
        isoDate: "2026-10-02",
        steps: [
          { title: "Week 39 close-out", category: "admin", detail: "Into Q4. What's in good shape? What needs attention?" },
        ],
      },
    ],
  },

  {
    isoWeek: 40,
    phase: "Operating Season",
    theme: "October — active contracts, cold storage, Q4 rhythm",
    days: [
      {
        isoDate: "2026-10-05",
        steps: [
          { title: "807 — October scope confirmation", category: "build", detail: "Confirm October deliverables with 807." },
          { title: "Active contracts — weekly check-in", category: "relationship", detail: "One check-in with each active contract client." },
        ],
      },
      {
        isoDate: "2026-10-06",
        steps: [
          { title: "Tyler — cold storage status", category: "build", detail: "Is cold storage on track for winter?" },
        ],
      },
      {
        isoDate: "2026-10-07",
        steps: [
          { title: "Print — Q4 materials planning", category: "print", detail: "What print materials are needed for Q4?" },
        ],
      },
      {
        isoDate: "2026-10-08",
        steps: [
          { title: "Pipeline — any new outreach to open?", category: "relationship", detail: "PACE, NAN — any movement? Any new potential relationships to start?" },
        ],
      },
      {
        isoDate: "2026-10-09",
        steps: [
          { title: "Week 40 close-out", category: "admin", detail: "October rhythm: is it working?" },
        ],
      },
    ],
  },

  {
    isoWeek: 41,
    phase: "Operating Season",
    theme: "Mid-October — build, relationships, cold storage final push",
    days: [
      {
        isoDate: "2026-10-12",
        steps: [
          { title: "807 — week deliverable", category: "build", detail: "This week's 807 work." },
          { title: "Cold storage — is it operational?", category: "build", detail: "Tyler's cold storage should be operational or nearly so by now. Status check." },
        ],
      },
      {
        isoDate: "2026-10-13",
        steps: [
          { title: "Deer Lake — check-in (if contract active)", category: "relationship", detail: "Midway through the operating engagement — what's the council's experience?" },
        ],
      },
      {
        isoDate: "2026-10-14",
        steps: [
          { title: "Financial review — October mid-month", category: "admin", detail: "Revenue tracking, burn rate, runway projection." },
        ],
      },
      {
        isoDate: "2026-10-15",
        steps: [
          { title: "Build — computing pipeline", category: "build", detail: "What's in the pipeline after current 807 scope?" },
        ],
      },
      {
        isoDate: "2026-10-16",
        steps: [
          { title: "Week 41 close-out", category: "admin", detail: "Mid-October review." },
        ],
      },
    ],
  },

  {
    isoWeek: 42,
    phase: "Operating Season",
    theme: "Late October — winter prep, year-end planning starts",
    days: [
      {
        isoDate: "2026-10-19",
        steps: [
          { title: "Year-end planning — what does December look like?", category: "admin", detail: "Quick sketch: contract renewals, deliverables, year-end financial position." },
          { title: "807 — Q4 relationship check-in", category: "relationship", detail: "Beyond the scope — is the relationship strong going into Q4?" },
        ],
      },
      {
        isoDate: "2026-10-20",
        steps: [
          { title: "Tyler — cold storage operational check", category: "build", detail: "Is cold storage fully operational? Any final items?" },
        ],
      },
      {
        isoDate: "2026-10-21",
        steps: [
          { title: "Print — November materials", category: "print", detail: "Any print materials needed in November?" },
        ],
      },
      {
        isoDate: "2026-10-22",
        steps: [
          { title: "Constellation session review", category: "admin", detail: "Review locked constellation decisions. Are any still open? Are any ready to act on?", link: { label: "Constellation session", path: "/constellation-session" } },
        ],
      },
      {
        isoDate: "2026-10-23",
        steps: [
          { title: "Week 42 close-out", category: "admin", detail: "October done. What carries into November?" },
        ],
      },
    ],
  },

  {
    isoWeek: 43,
    phase: "Operating Season",
    theme: "November opens — contracts, build, pipeline",
    days: [
      {
        isoDate: "2026-10-26",
        steps: [
          { title: "807 — November scope", category: "build", detail: "Confirm November deliverables." },
          { title: "Active contracts — weekly check-in", category: "relationship", detail: "Check in with each active contract client." },
        ],
      },
      {
        isoDate: "2026-10-27",
        steps: [
          { title: "Pipeline — year-end outreach plan", category: "relationship", detail: "Are there any year-end conversations to open? PACE, NAN — last call for 2026." },
        ],
      },
      {
        isoDate: "2026-10-28",
        steps: [
          { title: "Financial — year-end projection", category: "admin", detail: "Project year-end financial position. How does 2026 close?" },
        ],
      },
      {
        isoDate: "2026-10-29",
        steps: [
          { title: "Build — computing work pipeline", category: "build", detail: "What computing work is in the Q4 pipeline?" },
        ],
      },
      {
        isoDate: "2026-10-30",
        steps: [
          { title: "Week 43 close-out", category: "admin", detail: "End of October. November rhythm confirmed?" },
        ],
      },
    ],
  },

  {
    isoWeek: 44,
    phase: "Operating Season",
    theme: "November — operational rhythm, renewal conversations",
    days: [
      {
        isoDate: "2026-11-02",
        steps: [
          { title: "807 — renewal conversation", category: "relationship", detail: "Start the renewal conversation for 2027. What does 807 need from Headwaters next year?" },
          { title: "Deer Lake — renewal or close (if contract active)", category: "proposals", detail: "Where does the Deer Lake engagement go after the initial term? Renewal, expansion, or close?" },
        ],
      },
      {
        isoDate: "2026-11-03",
        steps: [
          { title: "Tyler — cold storage Q4 review", category: "build", detail: "How is cold storage performing? Any issues going into winter?" },
        ],
      },
      {
        isoDate: "2026-11-04",
        steps: [
          { title: "Print — holiday season materials", category: "print", detail: "Any print materials needed for the holiday season?" },
        ],
      },
      {
        isoDate: "2026-11-05",
        steps: [
          { title: "Build — 807 November progress", category: "build", detail: "Mid-November 807 check." },
        ],
      },
      {
        isoDate: "2026-11-06",
        steps: [
          { title: "Week 44 close-out", category: "admin", detail: "November week two. Renewal conversations started?" },
        ],
      },
    ],
  },

  {
    isoWeek: 45,
    phase: "Operating Season",
    theme: "Mid-November — wrap active work, plan December",
    days: [
      {
        isoDate: "2026-11-09",
        steps: [
          { title: "807 — November deliverable progress", category: "build", detail: "Are November deliverables on track?" },
          { title: "Year-end financial review", category: "admin", detail: "Updated year-end projection." },
        ],
      },
      {
        isoDate: "2026-11-10",
        steps: [
          { title: "Active contracts — pre-December check", category: "relationship", detail: "What needs to be done before December? Any year-end deliverables?" },
        ],
      },
      {
        isoDate: "2026-11-11",
        steps: [
          { title: "Remembrance Day — rest if you can", category: "admin", detail: "Non-negotiables. Kids, rest." },
        ],
      },
      {
        isoDate: "2026-11-12",
        steps: [
          { title: "December plan — write it now", category: "admin", detail: "December is short. Write the December plan now: what gets done, what waits until January, what closes." },
        ],
      },
      {
        isoDate: "2026-11-13",
        steps: [
          { title: "Week 45 close-out", category: "admin", detail: "Mid-November check. December is coming fast." },
        ],
      },
    ],
  },

  {
    isoWeek: 46,
    phase: "Operating Season",
    theme: "Late November — year-end prep, renewals, close-outs",
    days: [
      {
        isoDate: "2026-11-16",
        steps: [
          { title: "807 — renewal confirmed or in progress?", category: "relationship", detail: "Is the 2027 807 relationship confirmed? If not, what's the timeline?" },
          { title: "Deer Lake — year-end review (if active)", category: "relationship", detail: "Year-end review with Deer Lake: what happened in the engagement? What does Phase 2 look like?" },
        ],
      },
      {
        isoDate: "2026-11-17",
        steps: [
          { title: "Tyler — year-end cold storage review", category: "build", detail: "Year-end summary of the cold storage project. What was accomplished?" },
        ],
      },
      {
        isoDate: "2026-11-18",
        steps: [
          { title: "Print — year-end materials inventory", category: "print", detail: "What print materials were produced in 2026? Document the full list." },
        ],
      },
      {
        isoDate: "2026-11-19",
        steps: [
          { title: "Pipeline — 2027 plan starts here", category: "relationship", detail: "What does the 2027 proposal pipeline look like? PACE, NAN, Gather Round, new communities — what's the opening plan?" },
        ],
      },
      {
        isoDate: "2026-11-20",
        steps: [
          { title: "Week 46 close-out", category: "admin", detail: "End of November. Six weeks left in 2026." },
        ],
      },
    ],
  },

  {
    isoWeek: 47,
    phase: "Operating Season",
    theme: "December approaches — wind down active work",
    days: [
      {
        isoDate: "2026-11-23",
        steps: [
          { title: "807 — December scope (last active scope of 2026)", category: "build", detail: "What does 807 need in December? Last deliverable of the year." },
          { title: "Active contracts — December close-out plan", category: "admin", detail: "What needs to be completed before the holidays? Make a list and stick to it." },
        ],
      },
      {
        isoDate: "2026-11-24",
        steps: [
          { title: "Year-end financial close", category: "admin", detail: "Prepare the year-end financial summary: revenue, costs, startup budget utilization, runway going into 2027." },
        ],
      },
      {
        isoDate: "2026-11-25",
        steps: [
          { title: "Build — complete any open computing items", category: "build", detail: "What computing work needs to close before year-end?" },
        ],
      },
      {
        isoDate: "2026-11-26",
        steps: [
          { title: "Print — holiday materials", category: "print", detail: "Any holiday season print materials needed?" },
        ],
      },
      {
        isoDate: "2026-11-27",
        steps: [
          { title: "Week 47 close-out", category: "admin", detail: "Thanksgiving week. Rest if you can." },
        ],
      },
    ],
  },

  {
    isoWeek: 48,
    phase: "Operating Season",
    theme: "December — final deliverables, renewals, year-end close",
    days: [
      {
        isoDate: "2026-11-30",
        steps: [
          { title: "December orientation — what absolutely needs to ship?", category: "admin", detail: "Write the list of December must-ships. Be ruthless: if it doesn't need to be done in December, move it to January." },
          { title: "807 — final 2026 deliverable", category: "build", detail: "Deliver the last 807 item of 2026. Thank them for the year." },
        ],
      },
      {
        isoDate: "2026-12-01",
        steps: [
          { title: "Deer Lake — year-end relationship note (if active)", category: "relationship", detail: "One genuine note to the Deer Lake team: what you're proud of from the engagement, and what you're looking forward to in Phase 2." },
        ],
      },
      {
        isoDate: "2026-12-02",
        steps: [
          { title: "Tyler — cold storage year-end summary", category: "build", detail: "Document what was built, what's operational, and what the 2027 plan is." },
        ],
      },
      {
        isoDate: "2026-12-03",
        steps: [
          { title: "2027 planning — first draft", category: "admin", detail: "Write the first draft of the 2027 operating plan. One page. What did 2026 teach you? What's the opening posture for 2027?" },
        ],
      },
      {
        isoDate: "2026-12-04",
        steps: [
          { title: "Week 48 close-out", category: "admin", detail: "Three weeks left. What's in good shape? What needs attention before holidays?" },
        ],
      },
    ],
  },

  {
    isoWeek: 49,
    phase: "Operating Season",
    theme: "Final active week — close everything that can close",
    days: [
      {
        isoDate: "2026-12-07",
        steps: [
          { title: "Active contracts — final deliverables week", category: "relationship", detail: "This is the last full week for active contract work before the holidays. Deliver everything that was promised." },
          { title: "807 — relationship close for 2026", category: "relationship", detail: "Phone call or note: thank 807 for the year, confirm 2027 renewal intent." },
        ],
      },
      {
        isoDate: "2026-12-08",
        steps: [
          { title: "Year-end admin — invoices, records, filings", category: "admin", detail: "Get all outstanding invoices sent. File monthly records." },
        ],
      },
      {
        isoDate: "2026-12-09",
        steps: [
          { title: "Build — final computing close for 2026", category: "build", detail: "Complete and document any remaining computing work." },
        ],
      },
      {
        isoDate: "2026-12-10",
        steps: [
          { title: "2027 operating plan — review and sharpen", category: "admin", detail: "Second pass on the 2027 plan draft. What's clearer now than it was last week?" },
        ],
      },
      {
        isoDate: "2026-12-11",
        steps: [
          { title: "Week 49 close-out", category: "admin", detail: "Two weeks to holidays. What's truly done? What's carrying to January?" },
        ],
      },
    ],
  },

  {
    isoWeek: 50,
    phase: "Operating Season",
    theme: "Wind-down week — protect the non-negotiables",
    days: [
      {
        isoDate: "2026-12-14",
        steps: [
          { title: "Final year-end outreach — any open conversations", category: "relationship", detail: "Any conversations that need to close or reset before year-end? Do them this week." },
          { title: "Financial year-end close", category: "admin", detail: "Final financial close for 2026. Revenue total, costs total, startup budget utilization, 2027 opening position." },
        ],
      },
      {
        isoDate: "2026-12-15",
        steps: [
          { title: "2026 year-end review — write it for yourself", category: "admin", detail: "One page, honest, for you. What happened in 2026? What did you learn? What do you wish you'd done differently? What are you proud of?" },
        ],
      },
      {
        isoDate: "2026-12-16",
        steps: [
          { title: "Print — year-end materials done", category: "print", detail: "Is all print work for 2026 completed and filed?" },
        ],
      },
      {
        isoDate: "2026-12-17",
        steps: [
          { title: "Tyler — year-end check-in", category: "relationship", detail: "Personal check-in with Tyler. How is he doing? What does he need going into the new year?" },
        ],
      },
      {
        isoDate: "2026-12-18",
        steps: [
          { title: "Week 50 close-out — pre-holiday", category: "admin", detail: "One week until the holidays. Everything essential is done or can wait until January. Protect the non-negotiables." },
        ],
      },
    ],
  },

  {
    isoWeek: 51,
    phase: "Operating Season",
    theme: "Holiday week — rest is the work",
    days: [
      {
        isoDate: "2026-12-21",
        steps: [
          { title: "Solstice — mark the turning of the year", category: "admin", detail: "No task. Write a short reflection." },
        ],
      },
      {
        isoDate: "2026-12-22",
        steps: [
          { title: "Pre-holiday close-out", category: "admin", detail: "Send any final year-end notes. File any outstanding records. Then close the laptop." },
        ],
      },
      {
        isoDate: "2026-12-23",
        steps: [
          { title: "Rest", category: "admin", detail: "Kids are home. Be home. The work is done." },
        ],
      },
      {
        isoDate: "2026-12-24",
        steps: [
          { title: "Rest", category: "admin", detail: "Non-negotiables: family first." },
        ],
      },
      {
        isoDate: "2026-12-25",
        steps: [
          { title: "Rest", category: "admin", detail: "Merry Christmas. The plan worked." },
        ],
      },
    ],
  },

  {
    isoWeek: 52,
    phase: "Operating Season",
    theme: "Year close — rest, reflect, and open 2027",
    days: [
      {
        isoDate: "2026-12-28",
        steps: [
          { title: "2026 close — file the year", category: "admin", detail: "Final administrative close for 2026. Everything filed, everything recorded." },
          { title: "2027 plan — finalize and commit", category: "admin", detail: "The 2027 operating plan is ready. Commit to the opening posture. Write the first week's priorities." },
        ],
      },
      {
        isoDate: "2026-12-29",
        steps: [
          { title: "Reflect on the year", category: "admin", detail: "Read the year-end review you wrote in W50. What would you add now? What do you want to carry into 2027?" },
        ],
      },
      {
        isoDate: "2026-12-30",
        steps: [
          { title: "Open the 2027 plan", category: "admin", detail: "Set the 2027 plan somewhere you'll see it. The new year starts fresh." },
        ],
      },
      {
        isoDate: "2026-12-31",
        steps: [
          { title: "New Year's Eve — be present", category: "admin", detail: "Non-negotiables. Rest and celebrate." },
        ],
      },
    ],
  },
];
