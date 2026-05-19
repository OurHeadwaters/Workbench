// ─── Types ───────────────────────────────────────────────────────────────────

export type Phase = "Pursuit" | "Pivot" | "Operating Season";

export type ActionType = "copy-ai-prompt" | "copy-replit-task-brief";

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
// Sourced here as the plan data is the canonical home for operational deadlines.

/** Bridge capital commitment deadline — "May 30 deadline" (Week 20–21 theme). */
export const BRIDGE_CAPITAL_DEADLINE = "2026-05-30";

/** Hard decision date for Northern Band / Plan B trigger (Week 30 — July 31). */
export const PLAN_B_HARD_DEADLINE = "2026-07-31";

/** Target year for 807 Food Co-operative supply line activation. */
export const SUPPLY_CHAIN_TARGET_YEAR = "2027";

/**
 * Scenario A cost-basis floor — the monthly operating floor if bridge capital
 * does not land by the May 30 deadline. Senior hires are deferred at this level.
 * Referenced throughout the plan as "$48k cost-basis floor".
 */
export const SCENARIO_A_COST_BASIS_MONTHLY = 48_000;

// ─── Data ────────────────────────────────────────────────────────────────────
// Plan anchored to W20, May 18, 2026 (current week as of plan rebuild).
// Three phases: Pursuit (W20–W26), Pivot (W27–W35), Operating Season (W36–W52).

export const PLAN_2026: Week[] = [

  // ══════════════════════════════════════════════════════════
  //  PURSUIT  W20–W26  (May 18 – Jul 3, 2026)
  //  Northern Band pursuit / bridge capital crunch
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 20,
    phase: "Pursuit",
    theme: "Bridge capital push — May 30 deadline",
    days: [
      {
        isoDate: "2026-05-18",
        steps: [
          {
            title: "Set the week's single objective: bridge capital committed or escalated by May 30",
            detail: "Write it on paper. Every task this week is in service of that one outcome. Clear the decks of everything that isn't bridge capital, Northern Band, or a non-negotiable family obligation.",
          },
          {
            title: "Send written follow-up to bridge funder — request written commitment by May 30",
            detail: "Clear, one-paragraph note: state the deadline, what a commitment looks like (email confirmation, wire reference, or signed term sheet), and the consequence of missing it (Scenario A cost-basis floor, senior hires deferred).",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft bridge funder follow-up",
                content: "Draft a one-paragraph follow-up email to a bridge capital funder for a northern Ontario Indigenous food-systems engagement. The engagement is the Headwaters / Northern Band store project. We need written commitment of bridge funding by May 30, 2026. If the commitment doesn't land by May 30, we drop to the $48k cost-basis floor (Scenario A), defer senior hires, and run bridge capital outreach in parallel with Northern Band. Tone: direct, professional, not threatening. Show the consequence as a planning fact, not a negotiating threat. Do not use jargon or acronyms.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-19",
        steps: [
          {
            title: "Northern Band — confirm council calendar: is there a scheduled date before June 15?",
            detail: "Reach through the existing channel (council liaison or band office contact). One clear question: is there a council or committee meeting between now and June 15 where the Headwaters engagement can be on the agenda?",
          },
          {
            title: "Review V7 financial model — confirm Phase 1 flat-fee posture and trial framing",
            detail: "$25,000 flat fee, 8-week trial, Bobbie solo, 40 hr/wk. The trial is intentionally below cost — the entry price for a bounded first engagement. Make sure the pitch framing matches this: it's a trial-first offer, not a full-year ask.",
            link: { label: "View V7 scenario", path: "/practitioners-guide-v2/" },
          },
          {
            title: "Gather Round — send first-contact Instagram DM to Rebecca Spooner",
            detail: "The tools are fully built as of today: QR device-to-device handoff, Legacy Pass NFT verification, Evidence Package print doc, and the Gather Round pitch doc are all live. The first-contact channel is Instagram DM (@homeschoolon) — no public business inquiry email exists. The only action is sending a 2-sentence message: a plain-language problem statement and one question. Do not pitch the credential architecture in the first message. Lead with the Legacy Pass download problem, then ask if it's worth a 20-minute call.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the Instagram DM",
                content: "Write a 2-sentence Instagram DM from a homeschool mom who is also a developer. She is reaching out to Rebecca Spooner, founder of Gather Round Homeschool (@homeschoolon). The message should: (1) open by naming the Legacy Pass download management problem in plain language — families spending real time downloading PDFs, sorting files across devices, losing access without internet; (2) ask if it would make sense to show Rebecca a local-first tool she has built for exactly this problem. Tone: warm, peer-to-peer, not a cold pitch. No jargon. No mention of blockchain, NFTs, or XRPL in the first message. Two sentences only. She is a Canadian homeschool mom building tools for families like Gather Round's own customers — that's the common ground.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-20",
        steps: [
          {
            title: "Prepare one-page Northern Band council brief for a May/June meeting",
            detail: "One page, no appendices. Header: what the trial is. Body: what it costs (Phase 1 flat, Phase 2 rates), what the council can stop at any time, what the community gets. Footer: the practitioner's contact and the ask (a 30-minute meeting or a BCR date).",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft council brief",
                content: "Draft a one-page council brief for a northern Ontario First Nations band council. The subject is a proposed community food store engagement with Headwaters Development Services. Phase 1: 8-week trial at a $25,000 flat fee — Bobbie leads, 40 hr/wk, solo. Phase 2 (if council confirms after trial): Bobbie at $175/hr + Tyler (distribution subcontract) at $70/hr, each 160 hr/mo = $39,200/mo total billed. Council can stop at the end of Phase 1 with no penalty. The engagement runs the store on behalf of the band; the store belongs to the community. Format: heading, 3-4 short paragraphs, no bullet lists, plain language. Tone: respectful, direct, community-minded. No jargon.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-21",
        steps: [
          {
            title: "Gilles check-in — where does the Northern Band conversation stand from his view?",
            detail: "Gilles is the relationship anchor. Fifteen minutes on the phone: what's his read of the council's mood? Any back-channel intel on the June calendar? Any advice on timing the council brief delivery?",
          },
          {
            title: "Weekly close-out — review non-negotiables: kids, sleep, partner time",
            detail: "Write a one-paragraph honest note. Did this week breach any of the three non-negotiables? If yes, flag it. Two consecutive flagged weeks is the Plan B trigger for sole-customer dependency. One flag is information, not a crisis.",
          },
        ],
      },
      {
        isoDate: "2026-05-22",
        steps: [
          {
            title: "Week 20 review: bridge capital status, Northern Band status, next actions",
            detail: "Three columns on paper: Bridge Capital (committed / pending / no response), Northern Band (meeting confirmed / in progress / no date), Week 21 actions. File the note in /Operations. This becomes the weekly habit.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 21,
    phase: "Pursuit",
    theme: "Northern Band soft deadline approach",
    days: [
      {
        isoDate: "2026-05-25",
        steps: [
          {
            title: "Send council brief to Northern Band liaison — request agenda placement",
            detail: "Attach the one-pager prepared last week. Ask for a 15-minute slot on the next council or committee meeting. Frame it as information, not a sales call.",
          },
          {
            title: "Bridge capital: follow-up call or written status check",
            detail: "May 30 deadline is 5 days away. If no written commitment yet, call. Document the outcome of the call in writing.",
          },
          {
            title: "Gather Round — follow up if no DM response; prepare 20-minute demo script",
            detail: "If no response to the Instagram DM sent last Tuesday, send one light follow-up — same channel, one sentence: 'Wanted to make sure this didn't get buried — happy to share a quick demo if the timing is ever right.' Do not send more than two total messages before waiting. In parallel, prepare the 20-minute demo script for the first call if she does respond. A successful first call covers: (1) the Legacy Pass download problem restated from the family's experience; (2) a live demo of the QR device handoff — one device to another, no internet, no account; (3) the credential flow in plain language — 'your pass travels with your family, not with a login'; (4) the ask: a 90-day pilot with 5 families, flat fee, before any per-user rate conversation.",
          },
        ],
      },
      {
        isoDate: "2026-05-26",
        steps: [
          {
            title: "Prepare Scenario A cost-basis transition plan — in case bridge doesn't land",
            detail: "Scenario A: $48k cost-basis floor, defer Senior Engineer #2, Outreach, and Trainer hires. Write the one-page version: what changes, what stays the same, what the runway looks like at the floor. This is not pessimism — it's the responsible thing to have ready.",
          },
        ],
      },
      {
        isoDate: "2026-05-27",
        steps: [
          {
            title: "Northern Band — confirm or request a June meeting date",
            detail: "One clear ask: is there a council date before June 15 where the Headwaters brief can be on the agenda? If yes, confirm and calendar it immediately. If no, ask what the earliest available date is.",
          },
          {
            title: "Review Plan B trigger conditions — is any trigger approaching?",
            detail: "The four triggers: hard no from council, stall past June 15, bridge doesn't land by May 30, practitioner burnout signal. Which are live? Which need monitoring? Update the risk log.",
            link: { label: "Plan B overview", path: "/practitioners-guide-v2/" },
          },
        ],
      },
      {
        isoDate: "2026-05-28",
        steps: [
          {
            title: "Gilles deepening — schedule a longer conversation about Northern Band strategy",
            detail: "Not a status call — a strategy conversation. What does Gilles think the council needs to hear that it hasn't heard yet? What's the gap between the practitioner's framing and the council's actual concern?",
          },
        ],
      },
      {
        isoDate: "2026-05-29",
        steps: [
          {
            title: "Bridge capital deadline eve — document current status in writing",
            detail: "One paragraph: committed, pending, or no response. If pending, what specifically is the funder waiting on? If no response, send a final written notice today and prepare to activate Scenario A tomorrow.",
          },
          {
            title: "Weekly close-out — non-negotiables check",
            detail: "Honest note: kids, sleep, partner time — all three intact this week?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 22,
    phase: "Pursuit",
    theme: "Bridge capital deadline and Northern Band council window",
    days: [
      {
        isoDate: "2026-06-01",
        steps: [
          {
            title: "Bridge capital: committed or activate Scenario A",
            detail: "May 30 was the deadline. If committed: record it in writing, update the financial model, calendar the wire date. If not committed: activate Scenario A today — drop to the $48k cost-basis floor, defer the senior hires, update the runway model. Do not wait for another week.",
          },
        ],
      },
      {
        isoDate: "2026-06-02",
        steps: [
          {
            title: "Northern Band council date — confirm or request urgently",
            detail: "June 15 is the soft deadline. Confirm a meeting date is on the council calendar. If no date is confirmed, send a written note through the Gilles channel asking for the next available slot.",
          },
          {
            title: "Update financial model for bridge capital outcome",
            detail: "Whatever happened on June 1: update the runway model to reflect the actual starting position. Share the updated one-pager with Gilles if appropriate.",
          },
        ],
      },
      {
        isoDate: "2026-06-03",
        steps: [
          {
            title: "IFNA cluster — background research in preparation for a first call",
            detail: "Independent First Nations Alliance member communities on the Thunder Bay → Sioux Lookout → Dryden corridor. Who is the current economic development lead at IFNA? What's the right entry point — cluster-level or band-direct? Document findings in /Operations/IFNA.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Research IFNA entry points",
                content: "Help me prepare for a first outreach call to the Independent First Nations Alliance (IFNA) in northern Ontario. IFNA represents First Nations communities along the Thunder Bay → Sioux Lookout → Dryden corridor. I am the lead practitioner at Headwaters Development Services, proposing a community food store operating system (store-in-a-box: Square POS, Local Line procurement, full back-office) that runs on the same freight corridor the IFNA communities already use. I need to know: (1) who the current economic development lead at IFNA is likely to be, (2) whether to approach the alliance-level or go band-direct to a specific member community first, and (3) what tone and framing works best for a cold call to an Indigenous economic development arm in northern Ontario. Focus on what would make a first 30-minute call land well.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-06-04",
        steps: [
          {
            title: "Gilles call — council brief debrief and June 15 strategy",
            detail: "What feedback has Gilles heard since the brief went to the liaison? What's the council's current mood? What's the single best action in the next 10 days to move the conversation forward?",
          },
        ],
      },
      {
        isoDate: "2026-06-05",
        steps: [
          {
            title: "Weekly close-out — document bridge capital status, Northern Band status, risk flags",
            detail: "Three-column note: Bridge Capital, Northern Band, Plan B triggers. Any trigger closer to firing this week than last week? File in /Operations.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 23,
    phase: "Pursuit",
    theme: "Northern Band council meeting prep",
    days: [
      {
        isoDate: "2026-06-08",
        steps: [
          {
            title: "Northern Band — rehearse the council presentation out loud",
            detail: "Fifteen minutes, out loud, to nobody. The brief should be 12 minutes of content and 3 minutes of silence for questions. Trim anything that isn't essential. The council's time is the most constrained resource in this conversation.",
          },
          {
            title: "Prepare answers to the five most likely council questions",
            detail: "Write the answers in plain language. (1) What does it cost? (2) What does the community control? (3) What happens if we want to stop? (4) Who is Tyler and why is he on the bill? (5) What happened at the last store that tried this?",
          },
        ],
      },
      {
        isoDate: "2026-06-09",
        steps: [
          {
            title: "IFNA — send first outreach note to economic development contact",
            detail: "One paragraph: who Headwaters is, what the store-in-a-box does, why IFNA communities are the right second call after Northern Band, and the ask (a 30-minute call). Do not attach a deck. Attach nothing.",
          },
        ],
      },
      {
        isoDate: "2026-06-10",
        steps: [
          {
            title: "Shibogama First Nations Council — background research",
            detail: "Member communities along the Wasaya/Bearskin airline corridor. Who is the economic development lead? What is the current strategic priority? Document in /Operations/Shibogama.",
          },
          {
            title: "Prepare weekly financial review — runway projection at current cost basis",
            detail: "How many weeks of runway at the current cost basis? What does the runway look like if Northern Band signs (Phase 1 only)? What does it look like at Scenario A floor with Plan B parallel?",
          },
        ],
      },
      {
        isoDate: "2026-06-11",
        steps: [
          {
            title: "Northern Band — final prep for any council meeting this week",
            detail: "Confirm logistics: who is in the room, how long, who chairs, what the decision process looks like after the meeting. Know the answer to 'what happens next' before you walk in.",
          },
        ],
      },
      {
        isoDate: "2026-06-12",
        steps: [
          {
            title: "Weekly close-out — document Northern Band meeting outcome (if held)",
            detail: "If the council meeting happened: write the outcome in one paragraph. What was the response? What is the next step? What is the expected decision timeline? If no meeting happened: note the gap and set the June 15 soft-deadline protocol.",
          },
          {
            title: "Non-negotiables check — kids, sleep, partner time",
            detail: "Flag any breach. Two consecutive weeks flagged = Plan B trigger for sole-customer dependency.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 24,
    phase: "Pursuit",
    theme: "June 15 soft deadline — pivot signal or continue",
    days: [
      {
        isoDate: "2026-06-15",
        steps: [
          {
            title: "June 15 soft deadline — formal assessment",
            detail: "Evaluate: is there a signed contract, a signed BCR, or a concrete next council date on the calendar? If yes to any: continue Pursuit. If no to all: send the one-paragraph pivot note through the Northern Band channel and open Plan B's IFNA outreach in parallel — do not wait for a reply.",
          },
          {
            title: "If pivoting: send Northern Band pivot note",
            detail: "One paragraph through the existing channel: 'I'm moving a portion of capacity to parallel outreach while the Northern Band conversation continues. I remain committed to the engagement and will update you when the next council date is confirmed.' Do not burn the bridge. Do not apologize.",
          },
        ],
      },
      {
        isoDate: "2026-06-16",
        steps: [
          {
            title: "IFNA — follow up on outreach note if no response yet",
            detail: "One short follow-up. Warm close: 'Happy to work around your schedule — even a 20-minute call would be valuable.' If no response after two attempts, move to band-direct approach.",
          },
          {
            title: "Keewaytinook Okimakanak (KO) — background research",
            detail: "Long-standing operational sophistication: KO Telehealth, KORI, K-Net. The economic development contact is the right door — not K-Net directly. What food-systems work is currently in their portfolio? Document in /Operations/KO.",
          },
        ],
      },
      {
        isoDate: "2026-06-17",
        steps: [
          {
            title: "Gilles deepening — strategy conversation (scheduled last week)",
            detail: "Longer format: 45–60 minutes. What is the council's actual concern — the cost? The control? The precedent? The relationship? What would need to be true for them to say yes quickly?",
          },
        ],
      },
      {
        isoDate: "2026-06-18",
        steps: [
          {
            title: "Financial model review — update runway projection for current scenario",
            detail: "Where are we now: bridge capital status, Northern Band status, Plan B activity level. Update the three-scenario runway (Plan A only, Plan A + Plan B parallel, Plan B only). Which scenario is the operating assumption this week?",
          },
        ],
      },
      {
        isoDate: "2026-06-19",
        steps: [
          {
            title: "Weekly close-out — June 15 checkpoint documented",
            detail: "One-page note: June 15 assessment outcome, current operating assumption (Plan A / parallel / Plan B), next trigger date (July 31 hard deadline), risk flags. File in /Operations.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 25,
    phase: "Pursuit",
    theme: "Parallel outreach opens — Gilles deepening",
    days: [
      {
        isoDate: "2026-06-22",
        steps: [
          {
            title: "IFNA first call — if scheduled, run it; if not, re-attempt contact",
            detail: "First call: 30 minutes. The pitch: same freight corridor, same POS, different community. Walk through the procurement dashboard. Ask what their biggest current concern about community food access is — listen more than you talk.",
          },
          {
            title: "Northern Band — stay warm, no pressure",
            detail: "One short note to the liaison: 'Checking in — is there anything I can provide ahead of the next council meeting?' This maintains the relationship without forcing a timeline.",
          },
        ],
      },
      {
        isoDate: "2026-06-23",
        steps: [
          {
            title: "Shibogama — send first outreach note",
            detail: "Same format as IFNA: one paragraph, no deck, ask for a 30-minute call. Lead with the corridor pricing angle: cross-reserve freight pass-through, nothing marked up.",
          },
          {
            title: "Plan B grant-shaped workstreams — identify which are ready to submit",
            detail: "Review the 807 co-op infrastructure, Food Hub on Wheels, and jar recycling loop. Which are closest to a submittable state? Which funder is the best first attempt? Document the readiness assessment.",
          },
        ],
      },
      {
        isoDate: "2026-06-24",
        steps: [
          {
            title: "Gilles deepening call — what is the council's actual walk-away condition?",
            detail: "Direct question: if Northern Band doesn't proceed, what is the most likely stated reason? What's the thing the practitioner can't change, and what's the thing that could still move?",
          },
        ],
      },
      {
        isoDate: "2026-06-25",
        steps: [
          {
            title: "V7 rate model — prepare a simplified one-page cost summary for outreach calls",
            detail: "$175/hr Bobbie, $70/hr Tyler, 160 hr/mo each = $39,200/mo total billed. Phase 1: $25k flat trial. This one-pager goes to any warm prospect who asks 'what does it cost?' before a full proposal.",
          },
        ],
      },
      {
        isoDate: "2026-06-26",
        steps: [
          {
            title: "Weekly close-out — outreach call log, Northern Band status, runway update",
            detail: "Document: every outreach contact this week, response or no response, next step for each. Northern Band: any new information. Runway: current scenario assumption.",
          },
          {
            title: "Non-negotiables check",
            detail: "Flag any breach. Honest note.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 26,
    phase: "Pursuit",
    theme: "Pre-July 31 hard deadline — runway reconciliation",
    days: [
      {
        isoDate: "2026-06-29",
        steps: [
          {
            title: "Runway reconciliation — update month-by-month cash schedule to July 31",
            detail: "The July 31 hard deadline is five weeks away. How much runway remains at the current cost basis? What is the cash position on July 31 if: (a) Northern Band signs Phase 1, (b) Northern Band stalls, (c) Plan B produces a warm partner? Document all three.",
          },
        ],
      },
      {
        isoDate: "2026-06-30",
        steps: [
          {
            title: "Northern Band — final push before July 31 protocol",
            detail: "Through Gilles or the liaison: is there any council date between now and July 31? If yes, calendar it. If no, ask what it would take to get one. The goal is a concrete next step — not a soft agreement to meet 'sometime soon'.",
          },
          {
            title: "IFNA / Shibogama / KO — status check on all open outreach",
            detail: "Which calls have happened? Which have a scheduled date? Which have gone cold? Rank by warmth and set the next action for each.",
          },
        ],
      },
      {
        isoDate: "2026-07-01",
        steps: [
          {
            title: "Canada Day — reduced operational pace; family time protected",
            detail: "Complete one desk task (runway model update or outreach follow-up) if needed, then close the laptop. No client-facing communication today.",
          },
        ],
      },
      {
        isoDate: "2026-07-02",
        steps: [
          {
            title: "Windigo First Nations Council — background research and outreach prep",
            detail: "Member communities span the Sioux Lookout / Pickle Lake catchment. Multi-community engagement is realistic. Document the economic development contact and the right lead-with angle.",
          },
        ],
      },
      {
        isoDate: "2026-07-03",
        steps: [
          {
            title: "Weekly close-out — Pursuit phase checkpoint",
            detail: "Seven weeks into Pursuit. Write the honest assessment: Northern Band trajectory (yes / stalling / cooling), outreach heat map (which circles are warm), Plan B readiness (which grant-shaped workstreams could submit in the next 30 days), runway position. File in /Operations.",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  PIVOT  W27–W35  (Jul 6 – Sep 4, 2026)
  //  Plan B outreach activation + Gilles deepening
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 27,
    phase: "Pivot",
    theme: "July 31 hard deadline — watch and outreach acceleration",
    days: [
      {
        isoDate: "2026-07-06",
        steps: [
          {
            title: "Set Pivot phase operating rhythm",
            detail: "Pivot runs W27–W35. The rhythm: Mondays set the week's priorities. Fridays close out with an honest three-column note (Northern Band, outreach, runway). No more than one 'waiting for a response' item per column — chase or move on.",
          },
          {
            title: "IFNA — follow-up or first call debrief",
            detail: "If the first call happened in Pursuit: document the outcome and the ask they left with. If not yet: this week is the last warm-window attempt before moving to band-direct.",
          },
        ],
      },
      {
        isoDate: "2026-07-07",
        steps: [
          {
            title: "Shibogama — first call (if scheduled)",
            detail: "30-minute intro: Headwaters, the store-in-a-box, the corridor pricing model. Listen for their current food-access pain point. Ask who else on their member list is having the same conversation.",
          },
          {
            title: "NAN Economic Development — background research",
            detail: "Nishnawbe Aski Nation's economic development apparatus. Who is the current director? What corridor-scale initiatives are in their current portfolio? Document in /Operations/NAN.",
          },
        ],
      },
      {
        isoDate: "2026-07-08",
        steps: [
          {
            title: "Gilles check-in — Northern Band trajectory assessment",
            detail: "Three weeks to the hard deadline. What is Gilles' honest read: is Northern Band still a live conversation, or is it cooling beyond recovery? What one action could move it before July 31?",
          },
        ],
      },
      {
        isoDate: "2026-07-09",
        steps: [
          {
            title: "Plan B grant workstream — 807 co-op infrastructure scoping",
            detail: "The 807 co-op infrastructure (cold storage, hub equipment, distribution rigging) fits the LFIF/ICBF envelope. Is the co-op board willing to be the proponent on a follow-on application? Schedule a call to find out.",
          },
        ],
      },
      {
        isoDate: "2026-07-10",
        steps: [
          {
            title: "Weekly close-out — July 31 countdown: 21 days",
            detail: "Northern Band status, outreach heat map, Plan B grant readiness, runway position. Is any trigger at the point of firing? If yes, document the decision and the action taken.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 28,
    phase: "Pivot",
    theme: "Outreach deepening — Shibogama, KO, NAN",
    days: [
      {
        isoDate: "2026-07-13",
        steps: [
          {
            title: "KO — send first outreach note to economic development contact",
            detail: "One paragraph: Headwaters, the store-in-a-box, and why KO's operational sophistication (KO Telehealth, KORI) means the infrastructure-as-public-good framing lands naturally. Ask for a 30-minute call.",
          },
          {
            title: "IFNA — debrief first call; set next step",
            detail: "If the call happened: what did they say, what did they ask, what is the next action? If no call yet: decide to go band-direct or move IFNA to the cold list.",
          },
        ],
      },
      {
        isoDate: "2026-07-14",
        steps: [
          {
            title: "NAN Economic Development — send first outreach note",
            detail: "Corridor template pitch, not a single-store pitch: one install, then the next community inherits the same software and back-office at an install fee. Ask for a meeting with the economic development team.",
          },
          {
            title: "Prepare outreach call log for all active prospects",
            detail: "Spreadsheet: prospect name, first contact date, call date (if any), outcome, next action, next action date. Keep this current — it's the only way to know where the heat actually is.",
          },
        ],
      },
      {
        isoDate: "2026-07-15",
        steps: [
          {
            title: "Northern Band — written status check (two weeks to hard deadline)",
            detail: "Short note through the channel: 'Checking in — is there a council date between now and July 31 where the Headwaters engagement can be on the agenda?' One question, one ask.",
          },
        ],
      },
      {
        isoDate: "2026-07-16",
        steps: [
          {
            title: "Gilles deepening — strategy conversation, not status update",
            detail: "What does Gilles think about the outreach circles? Is there a door he can open to Shibogama, KO, or NAN that the practitioner can't open cold? What's his honest assessment of the Northern Band trajectory now?",
          },
        ],
      },
      {
        isoDate: "2026-07-17",
        steps: [
          {
            title: "Weekly close-out — outreach call log updated, runway refreshed",
            detail: "July 31 is 14 days away. Outreach: rank all prospects by heat. Plan B grant: which application is closest to submittable? Runway: what is the cash position on Aug 1 under each scenario?",
          },
          {
            title: "Non-negotiables check",
            detail: "Pivot phase is high-activity. Flag any breach. Two consecutive weeks = trigger.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 29,
    phase: "Pivot",
    theme: "July 31 countdown — decision-ready",
    days: [
      {
        isoDate: "2026-07-20",
        steps: [
          {
            title: "Prepare the July 31 decision brief",
            detail: "One page: Northern Band status (signed / council date confirmed / stalling / cooling), top three outreach prospects and their status, runway position on Aug 1, recommended operating assumption for August. Have this ready before July 31 — not on the day.",
          },
        ],
      },
      {
        isoDate: "2026-07-21",
        steps: [
          {
            title: "Shibogama — first or second call",
            detail: "If no call yet: final warm-window attempt. If first call happened: debrief and set the next action.",
          },
          {
            title: "KO — follow-up if no response to outreach note",
            detail: "One short follow-up. If no response after two attempts, note it and move the call to the cold list.",
          },
        ],
      },
      {
        isoDate: "2026-07-22",
        steps: [
          {
            title: "807 co-op — call with co-op board on application proponent question",
            detail: "Is the board willing to be the proponent on a follow-on LFIF/ICBF application? Which program gets first attempt? What is the expected timeline for a decision? Document the outcome.",
          },
        ],
      },
      {
        isoDate: "2026-07-23",
        steps: [
          {
            title: "Financial model update — three scenarios for August",
            detail: "Scenario 1: Northern Band signs Phase 1. Scenario 2: Northern Band stalls, outreach produces one warm partner. Scenario 3: Plan B only, no Northern Band, grant applications in progress. Monthly cash position for each through Dec 31.",
          },
        ],
      },
      {
        isoDate: "2026-07-24",
        steps: [
          {
            title: "Weekly close-out — July 31 brief finalized",
            detail: "The decision brief is ready. File it in /Operations. Review with Gilles if possible before July 31.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 30,
    phase: "Pivot",
    theme: "July 31 hard deadline — decide and act",
    days: [
      {
        isoDate: "2026-07-27",
        steps: [
          {
            title: "Northern Band — final contact before July 31",
            detail: "One clear message through the channel: the practitioner's planning horizon requires a council date or a contract indication by July 31. If no response by EOD July 31, the operating assumption shifts to Plan B capacity allocation.",
          },
        ],
      },
      {
        isoDate: "2026-07-28",
        steps: [
          {
            title: "Review July 31 decision brief with Gilles",
            detail: "Walk Gilles through the three scenarios. What is his recommendation? What would he do differently? What are the relationship implications of each path?",
          },
          {
            title: "LFIF follow-on application — draft outline if 807 co-op confirmed as proponent",
            detail: "If the co-op board confirmed: start the application outline this week. Timeline, equipment list, community benefit statement. The application is due when it's ready, not at the deadline — start now.",
          },
        ],
      },
      {
        isoDate: "2026-07-29",
        steps: [
          {
            title: "NAN Economic Development — first call (if scheduled)",
            detail: "Corridor template pitch: one install, then the next community inherits the same system. Listen for what NAN is currently trying to fund at the corridor scale.",
          },
        ],
      },
      {
        isoDate: "2026-07-30",
        steps: [
          {
            title: "Prepare August operating rhythm — regardless of Northern Band outcome",
            detail: "August starts Monday Aug 3. What are the three things that must happen in August regardless of which scenario is operating? Write them down. This week's close-out is the last Pursuit/Pivot-boundary document.",
          },
        ],
      },
      {
        isoDate: "2026-07-31",
        steps: [
          {
            title: "July 31 hard deadline — formal decision and documentation",
            detail: "Evaluate: Northern Band signed, concrete council date, or stalling past the runway trough. If stalling: treat Northern Band as paused (not killed), move all team capacity to Plan B, submit the LFIF follow-on the same week if ready, schedule the first NAN economic development call. Document the decision in writing. This is not a gut call — it's a planned response to a pre-agreed trigger.",
          },
          {
            title: "July close-out — honest month review",
            detail: "What happened in July? What was decided? What is the August operating assumption? What are the three most important actions in the next 30 days? File the note in /Operations.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 31,
    phase: "Pivot",
    theme: "Plan B activation — grant workstreams and warm outreach",
    days: [
      {
        isoDate: "2026-08-03",
        steps: [
          {
            title: "Set August Plan B operating rhythm",
            detail: "Mondays: outreach call or grant workstream progress. Wednesdays: Gilles or warm-prospect call. Fridays: close-out note. The rhythm is the same as Pursuit but the energy shifts from waiting to building.",
          },
          {
            title: "LFIF follow-on — begin application draft if not already started",
            detail: "Funding envelope: community infrastructure (cold storage, hub equipment, distribution rigging). Proponent: 807 co-op board (if confirmed). Write the community benefit section first — it's the hardest part and it shapes the rest.",
          },
        ],
      },
      {
        isoDate: "2026-08-04",
        steps: [
          {
            title: "IFNA — second call or band-direct first call",
            detail: "If IFNA alliance-level is stalling: pick the specific member community most likely to move and call the band directly. Use the 'same corridor, different store' framing.",
          },
        ],
      },
      {
        isoDate: "2026-08-05",
        steps: [
          {
            title: "Shibogama — second call or relationship deepening",
            detail: "If first call happened: what did they ask for? Can you send a one-page cost summary tailored to their community's freight position? Do that today.",
          },
          {
            title: "Northern Band — stay-warm note (not a deadline)",
            detail: "One short note: 'The Northern Band engagement remains a priority. I'll continue to make myself available when the council's calendar opens.' No pressure. No deadline language.",
          },
        ],
      },
      {
        isoDate: "2026-08-06",
        steps: [
          {
            title: "Workshops and training cohorts — assess grant-shaped readiness",
            detail: "Capacity-building programs (food-handling, store operations, bookkeeping) are a natural FedNor / NOHFC envelope. What would a submittable application look like? Who is the proponent? Document the readiness assessment.",
          },
        ],
      },
      {
        isoDate: "2026-08-07",
        steps: [
          {
            title: "Weekly close-out — Plan B activation week 1",
            detail: "Outreach heat map, grant application status (LFIF draft, other), Northern Band pulse, runway position. The note should show momentum, not stasis.",
          },
          {
            title: "Non-negotiables check",
            detail: "Plan B activation is high-energy. Protect kids, sleep, partner time.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 32,
    phase: "Pivot",
    theme: "Co-pitch exploration and grant drafts",
    days: [
      {
        isoDate: "2026-08-10",
        steps: [
          {
            title: "Identify the first co-pitch partner candidate",
            detail: "A co-pitch requires a band partner as proponent. Which warm outreach prospect is closest to saying yes to a co-pitch application? What would they need to see to agree? Document the assessment.",
          },
        ],
      },
      {
        isoDate: "2026-08-11",
        steps: [
          {
            title: "LFIF application — community benefit section draft review",
            detail: "Read the draft out loud. Does it sound like the community wrote it, or like a consultant wrote it? The community benefit section should be in the band's voice, not the practitioner's.",
          },
          {
            title: "KO — first or second call",
            detail: "Lead with the KORI/KO Telehealth analogy: you already operate community infrastructure at scale — the store is the same model applied to food. Listen for where their food-systems portfolio actually sits.",
          },
        ],
      },
      {
        isoDate: "2026-08-12",
        steps: [
          {
            title: "Gilles deepening — what's the best outreach lead right now?",
            detail: "Ask Gilles directly: of all the outreach circles, which one does he think is closest to a yes? Does he have a relationship with anyone in the Shibogama / KO / NAN ecosystem that would make an introduction faster than a cold call?",
          },
        ],
      },
      {
        isoDate: "2026-08-13",
        steps: [
          {
            title: "NAN Economic Development — second contact or call debrief",
            detail: "If the first call happened: what is the ask? Can NAN facilitate an introduction to a member community that is already considering a store? If no call yet: final warm-window attempt.",
          },
        ],
      },
      {
        isoDate: "2026-08-14",
        steps: [
          {
            title: "Weekly close-out — co-pitch prospect identified or not",
            detail: "The most important output from this week: is there one warm prospect willing to explore a co-pitch application? If yes, name them and note the next step. If no, note the gap and adjust the Plan B sequencing.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 33,
    phase: "Pivot",
    theme: "Gilles deepening and 807 co-op infrastructure",
    days: [
      {
        isoDate: "2026-08-17",
        steps: [
          {
            title: "Schedule a longer Gilles session — 60–90 minutes, not a status call",
            detail: "The topic: what does a Plan B operating season look like from his perspective? What's the corridor's biggest food-access problem that isn't being addressed? What would Headwaters need to build to be the answer to that problem?",
          },
        ],
      },
      {
        isoDate: "2026-08-18",
        steps: [
          {
            title: "807 co-op — LFIF application progress review",
            detail: "How far along is the application? Equipment list, community benefit section, proponent confirmation. What is the expected submission date? What is blocking the next section?",
          },
          {
            title: "Jar recycling loop — feasibility and grant program match",
            detail: "Circular-economy and waste-diversion programs at the federal and Northern Ontario level. Which program specifically? Who is the proponent? Is this active or deferred? Document the decision.",
          },
        ],
      },
      {
        isoDate: "2026-08-19",
        steps: [
          {
            title: "Windigo First Nations Council — first call (if scheduled)",
            detail: "Multi-community framing: one install, then the next community inherits the same system. Windigo's structure is a feature if they're already operating across multiple member communities.",
          },
        ],
      },
      {
        isoDate: "2026-08-20",
        steps: [
          {
            title: "Gilles 60–90 minute session",
            detail: "Deep strategy conversation. Document the key insights immediately after — not the next day. What changed in your understanding of the corridor? What changed in the operating plan?",
          },
        ],
      },
      {
        isoDate: "2026-08-21",
        steps: [
          {
            title: "Weekly close-out — Pivot phase mid-point assessment",
            detail: "Honest mid-Pivot assessment: what has changed since July 31? Which outreach prospects are live? Which grants are in progress? What is the operating assumption for September? File in /Operations.",
          },
          {
            title: "Non-negotiables check",
            detail: "August is a high-activity month. Protect the three non-negotiables.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 34,
    phase: "Pivot",
    theme: "Grant application push and warm prospect deepening",
    days: [
      {
        isoDate: "2026-08-24",
        steps: [
          {
            title: "LFIF application — equipment and budget section",
            detail: "Cold storage, hub equipment, distribution rigging. Each item: description, supplier quote, purpose, community benefit. The budget section is the most scrutinized part of any LFIF application — be precise.",
          },
        ],
      },
      {
        isoDate: "2026-08-25",
        steps: [
          {
            title: "Top warm prospect — relationship deepening call",
            detail: "Whichever outreach prospect is currently warmest: schedule a follow-up call this week. Move from introductory to substantive: what would a scoping engagement look like for their community? What questions do they need answered before they can say yes to a call with their council?",
          },
        ],
      },
      {
        isoDate: "2026-08-26",
        steps: [
          {
            title: "Northern Band — check in through Gilles",
            detail: "Not a direct contact. Ask Gilles: what is the council's current mood? Is there any indication of a fall council calendar? Should the practitioner send a brief update note or stay quiet for now?",
          },
        ],
      },
      {
        isoDate: "2026-08-27",
        steps: [
          {
            title: "Financial close for bridge period — Q3 bookkeeping",
            detail: "July and August actuals: what was spent, what was invoiced, what was received. Update the QuickBooks (or equivalent) entries. Make sure the bridge capital is correctly recorded. Prepare the Q3 summary for the bookkeeper.",
          },
        ],
      },
      {
        isoDate: "2026-08-28",
        steps: [
          {
            title: "Weekly close-out — grant progress, prospect heat, Q3 actuals",
            detail: "Three-column note: grant applications (status, next action), outreach (heat map, next contacts), runway (Q3 actuals vs projection). Any gap between the projection and the actual? If yes, document it now.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 35,
    phase: "Pivot",
    theme: "Pivot-to-Operating handoff preparation",
    days: [
      {
        isoDate: "2026-08-31",
        steps: [
          {
            title: "Prepare the Operating Season launch note",
            detail: "Operating Season starts Sep 7. Write a one-page internal note: what is the operating assumption for September (Plan A contract, Plan B parallel, Plan B only)? What are the three most important milestones for October, November, and December? What is the year-end audit preparation timeline?",
          },
        ],
      },
      {
        isoDate: "2026-09-01",
        steps: [
          {
            title: "LFIF application — final section and internal review",
            detail: "Read the full application as if you are the funder. Is the community benefit clear? Is the budget defensible? Is the proponent credible? Mark any section that needs strengthening before submission.",
          },
        ],
      },
      {
        isoDate: "2026-09-02",
        steps: [
          {
            title: "Co-pitch partner — confirm or move on",
            detail: "Is there a band partner willing to co-sign a grant application? If yes: schedule the co-pitch call this week. If no: note the gap and plan the fall outreach calendar without assuming a co-pitch.",
          },
          {
            title: "Gilles check-in — Operating Season prep",
            detail: "Brief call: what does Gilles think the fall priority should be? Northern Band, outreach, or grant execution? What's his read on the corridor's rhythm in September and October?",
          },
        ],
      },
      {
        isoDate: "2026-09-03",
        steps: [
          {
            title: "Operating Season calendar — set monthly milestones Sep–Dec",
            detail: "For each month: one primary milestone, one secondary milestone, one non-negotiable family commitment. Write it down. Share with Gilles if appropriate.",
          },
        ],
      },
      {
        isoDate: "2026-09-04",
        steps: [
          {
            title: "Pivot phase close-out — honest nine-week retrospective",
            detail: "What did Pivot accomplish? Northern Band: where did it land? Plan B: which circles are warm, which are cold, which grants are in flight? Personal: how many non-negotiable breaches? What would you do differently in the next nine weeks? File the note in /Operations — this is the most important document of the year so far.",
          },
          {
            title: "Non-negotiables check — Pivot phase final",
            detail: "Two consecutive breaches in any month = trigger to flag. How did the Pivot phase land on all three: kids, sleep, partner time?",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  OPERATING SEASON  W36–W52  (Sep 7 – Dec 31, 2026)
  //  Contract execution or scaled Plan B + year-end audit
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 36,
    phase: "Operating Season",
    theme: "Operating Season launch",
    days: [
      {
        isoDate: "2026-09-07",
        steps: [
          {
            title: "Operating Season Day 1 — confirm the operating assumption for fall",
            detail: "Which scenario is live: (1) Northern Band Phase 1 underway, (2) Plan B outreach producing a warm partner, (3) Plan B only with grant applications in flight? Write it down. The fall operating plan follows from this.",
          },
          {
            title: "Set the Operating Season weekly rhythm",
            detail: "Mondays: primary client or grant work. Wednesdays: outreach or relationship call. Fridays: close-out note. One Gilles call per month minimum.",
          },
        ],
      },
      {
        isoDate: "2026-09-08",
        steps: [
          {
            title: "Northern Band — September status check",
            detail: "If Phase 1 is underway: confirm the weekly reporting cadence with the council liaison. If stalled: check in through Gilles for fall council calendar. If paused: no contact until Gilles signals a re-opening.",
          },
          {
            title: "LFIF application — final review and submission prep",
            detail: "If the application is complete: get the proponent's sign-off and submit. If not complete: set a hard submission date (no later than Oct 1) and identify the one section still blocking it.",
          },
        ],
      },
      {
        isoDate: "2026-09-09",
        steps: [
          {
            title: "Warm prospect deepening — schedule next call with the warmest outreach contact",
            detail: "Move from introductory to substantive. What would a scoping engagement look like? What does their council need to see before saying yes?",
          },
        ],
      },
      {
        isoDate: "2026-09-10",
        steps: [
          {
            title: "V7 financial model review — September actuals vs projection",
            detail: "Update the model with September's opening cash position. Flag any variance from the July 31 projection.",
          },
        ],
      },
      {
        isoDate: "2026-09-11",
        steps: [
          {
            title: "Weekly close-out — Operating Season Week 1",
            detail: "One-paragraph note: operating assumption confirmed, primary client or grant status, outreach heat map. File in /Operations.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 37,
    phase: "Operating Season",
    theme: "October milestone prep and outreach follow-through",
    days: [
      {
        isoDate: "2026-09-14",
        steps: [
          {
            title: "October milestone: what is the single most important thing to accomplish by Oct 31?",
            detail: "Write it at the top of a blank page. Everything else this month is in service of it. Do not add a second item until the first is confirmed.",
          },
          {
            title: "Plan B grant — second application scoping",
            detail: "If LFIF is submitted or close to submission: which is the next grant-shaped workstream to develop? Workshops and training cohorts, Food Hub on Wheels, or something else? What's the application timeline?",
          },
        ],
      },
      {
        isoDate: "2026-09-15",
        steps: [
          {
            title: "Outreach — second contact with the top two warm prospects",
            detail: "Move the conversation forward. Offer to send the one-page cost summary tailored to their community. Ask for a date to talk to their council liaison.",
          },
        ],
      },
      {
        isoDate: "2026-09-16",
        steps: [
          {
            title: "Gilles — monthly check-in",
            detail: "Brief call: what is he hearing about the corridor? Any new community considering a store? Any shift in Northern Band's position? Any door he can open this month that the practitioner can't?",
          },
        ],
      },
      {
        isoDate: "2026-09-17",
        steps: [
          {
            title: "Year-end audit timeline — draft the Q4 schedule",
            detail: "The year-end audit runs November–December. What needs to be in place by Nov 1 for the audit to go smoothly? Financial records current, producer agreements filed, staff hours logged, council reports on file. Draft the checklist now.",
          },
        ],
      },
      {
        isoDate: "2026-09-18",
        steps: [
          {
            title: "Weekly close-out — September Week 2",
            detail: "Primary milestone progress, outreach contacts this week, grants in flight. Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 38,
    phase: "Operating Season",
    theme: "Client execution and grant submission",
    days: [
      {
        isoDate: "2026-09-21",
        steps: [
          {
            title: "Primary client work — whatever the operating assumption requires",
            detail: "If Northern Band Phase 1 is underway: week 3 of 8 (or wherever we are). Deliver the week's planned output. If Plan B: the primary client is the grant application or the warm outreach prospect.",
          },
        ],
      },
      {
        isoDate: "2026-09-22",
        steps: [
          {
            title: "LFIF application — submit if ready; final review if not",
            detail: "Target submission date: Sept 30 at the latest. If any section is still incomplete, it becomes today's task.",
          },
        ],
      },
      {
        isoDate: "2026-09-23",
        steps: [
          {
            title: "Second grant application — first section draft",
            detail: "Workshops and training cohorts or Food Hub on Wheels — whichever is next in the queue. Write the first section today. Progress over perfection.",
          },
        ],
      },
      {
        isoDate: "2026-09-24",
        steps: [
          {
            title: "Warm prospect — council liaison introduction request",
            detail: "If any prospect has agreed to a scoping call: ask for an introduction to their council liaison. The council liaison is the door to a BCR. Do not skip this step.",
          },
        ],
      },
      {
        isoDate: "2026-09-25",
        steps: [
          {
            title: "Weekly close-out — September Week 3",
            detail: "LFIF status, second grant status, outreach council-liaison introductions, primary client progress. One paragraph. File in /Operations.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 39,
    phase: "Operating Season",
    theme: "September close-out",
    days: [
      {
        isoDate: "2026-09-28",
        steps: [
          {
            title: "LFIF — submit application",
            detail: "Last chance before the September 30 self-imposed deadline. Submit today. File the submission confirmation in /Operations/Grants.",
          },
        ],
      },
      {
        isoDate: "2026-09-29",
        steps: [
          {
            title: "September financial close — actuals vs projection",
            detail: "Three months into the operating year (Jun–Sep). What are the actual revenues and costs? How does that compare to the V7 projection? Update the financial model. Flag any variance to Gilles if material.",
          },
        ],
      },
      {
        isoDate: "2026-09-30",
        steps: [
          {
            title: "Outreach heat map — September update",
            detail: "Rank all active outreach contacts by heat. Who is warm, who is cooling, who has gone cold? Set the October follow-up calendar based on this ranking.",
          },
        ],
      },
      {
        isoDate: "2026-10-01",
        steps: [
          {
            title: "October operating plan — set the month's three milestones",
            detail: "One primary (client / grant), one secondary (outreach), one non-negotiable (family). Write them on paper. Post them somewhere visible.",
          },
        ],
      },
      {
        isoDate: "2026-10-02",
        steps: [
          {
            title: "Monthly close-out — September retrospective",
            detail: "What did September accomplish? What didn't happen that was supposed to? What is the operating assumption going into October? File the note in /Operations. This is the monthly habit that will make the year-end audit straightforward.",
          },
          {
            title: "Non-negotiables check — September month-end",
            detail: "How many weeks in September had a breach? If two or more: flag for the Plan B trigger review.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 40,
    phase: "Operating Season",
    theme: "October deep work",
    days: [
      {
        isoDate: "2026-10-05",
        steps: [
          {
            title: "Primary client or grant — week's main deliverable set and started",
            detail: "One clear deliverable this week. Write it at the top of the close-out note on Friday.",
          },
          {
            title: "Second grant application — community benefit section",
            detail: "The community benefit section is always the hardest. Write it first. Make it specific: what does a family in this community gain from the store in year one?",
          },
        ],
      },
      {
        isoDate: "2026-10-06",
        steps: [
          {
            title: "Northern Band — quarterly check-in through Gilles",
            detail: "One call, one question: is there any indication the council is considering reopening the Headwaters engagement conversation in Q4? No pressure, no ask. Just stay informed.",
          },
        ],
      },
      {
        isoDate: "2026-10-07",
        steps: [
          {
            title: "Warm prospect — follow-up call or note",
            detail: "Move the warmest prospect forward. What is the next concrete step toward a council introduction?",
          },
        ],
      },
      {
        isoDate: "2026-10-08",
        steps: [
          {
            title: "Year-end audit prep — producer agreements audit",
            detail: "Pull all active producer agreements. Are they current? Are the terms still accurate? File the list in /Operations/Producers. Any gaps need to be closed before the year-end audit.",
          },
        ],
      },
      {
        isoDate: "2026-10-09",
        steps: [
          {
            title: "Weekly close-out — October Week 1",
            detail: "Primary deliverable: done or not? Grant: which section is next? Outreach: any movement? Non-negotiables: all intact?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 41,
    phase: "Operating Season",
    theme: "Mid-October execution",
    days: [
      {
        isoDate: "2026-10-12",
        steps: [
          {
            title: "Thanksgiving (Canada) — reduced pace",
            detail: "One desk task if needed. Otherwise: protect family time. No client-facing communication.",
          },
        ],
      },
      {
        isoDate: "2026-10-13",
        steps: [
          {
            title: "Primary client or grant — week's main deliverable",
            detail: "Back to full pace after the long weekend. Clear one concrete deliverable by Thursday.",
          },
          {
            title: "Gilles — October check-in",
            detail: "Monthly call. What's his read on the corridor in October? Any new doors? Any relationship risks to manage?",
          },
        ],
      },
      {
        isoDate: "2026-10-14",
        steps: [
          {
            title: "Second grant — equipment and budget section",
            detail: "Budget is the most scrutinized section. Be precise. Every line item should have a purpose statement and a supplier reference.",
          },
        ],
      },
      {
        isoDate: "2026-10-15",
        steps: [
          {
            title: "Outreach — cold circle first contact attempt",
            detail: "If all warm and warm-mid circles have been contacted: make one cold-circle first contact. Treaty 3 Grand Council secretariat or Dryden-area bands. A cold call is still a call.",
          },
        ],
      },
      {
        isoDate: "2026-10-16",
        steps: [
          {
            title: "Weekly close-out — October Week 2",
            detail: "Primary deliverable status. Grant: on track for submission by Nov 1? Outreach: cold circle contacted? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 42,
    phase: "Operating Season",
    theme: "Grant push and year-end audit prep",
    days: [
      {
        isoDate: "2026-10-19",
        steps: [
          {
            title: "Second grant application — final sections",
            detail: "Executive summary and organizational capacity sections. These go last because they're easier when the rest of the application exists. Write tight.",
          },
        ],
      },
      {
        isoDate: "2026-10-20",
        steps: [
          {
            title: "Year-end audit prep — financial records audit",
            detail: "Pull the QuickBooks (or equivalent) records. Are all invoices filed? Are all expenses categorized? Are the payroll records current? Identify any gaps and close them now, not in December.",
          },
        ],
      },
      {
        isoDate: "2026-10-21",
        steps: [
          {
            title: "Warm prospect — council liaison meeting (if arranged)",
            detail: "If a council liaison meeting is on the calendar: prepare a one-page community brief tailored to their specific community. No generic decks.",
          },
        ],
      },
      {
        isoDate: "2026-10-22",
        steps: [
          {
            title: "Second grant — internal review",
            detail: "Read the full application as the funder. Is the community benefit specific? Is the budget defensible? Is the proponent credible? Mark what needs revision.",
          },
        ],
      },
      {
        isoDate: "2026-10-23",
        steps: [
          {
            title: "Weekly close-out — October Week 3",
            detail: "Grant: ready for submission by Nov 1? Financial records: any gaps closed? Outreach: council liaison meeting outcome. Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 43,
    phase: "Operating Season",
    theme: "October close and November launch",
    days: [
      {
        isoDate: "2026-10-26",
        steps: [
          {
            title: "Second grant — submit",
            detail: "File the submission confirmation in /Operations/Grants. Note the expected decision timeline.",
          },
          {
            title: "November operating plan — set the month's three milestones",
            detail: "One primary (client / grant), one secondary (outreach or year-end audit prep), one non-negotiable (family). November is the last full month before the audit crunch.",
          },
        ],
      },
      {
        isoDate: "2026-10-27",
        steps: [
          {
            title: "Northern Band — Q4 check-in through Gilles",
            detail: "Is there any council calendar movement before year-end? If yes: prepare a brief update note. If no: maintain the relationship and plan for a January re-opening.",
          },
        ],
      },
      {
        isoDate: "2026-10-28",
        steps: [
          {
            title: "Outreach — November calendar set",
            detail: "Book all November outreach calls now. The year-end audit crunch in November and December will squeeze outreach time. Get the calls on the calendar before it fills.",
          },
        ],
      },
      {
        isoDate: "2026-10-29",
        steps: [
          {
            title: "Year-end audit prep — council report template",
            detail: "Draft the year-end report template for the council: what the store accomplished, what was spent, what was produced, what the community got. This template makes the December report a fill-in exercise, not a writing exercise.",
          },
        ],
      },
      {
        isoDate: "2026-10-30",
        steps: [
          {
            title: "Monthly close-out — October retrospective",
            detail: "Three months in the Operating Season. What happened? What didn't? What is the operating assumption going into November? File in /Operations. Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 44,
    phase: "Operating Season",
    theme: "November — year-end audit begins",
    days: [
      {
        isoDate: "2026-11-02",
        steps: [
          {
            title: "Year-end audit — financial records final audit",
            detail: "All invoices filed, all expenses categorized, all payroll records current. Hand the complete package to the bookkeeper for the year-end review. This is the last week to catch gaps before the audit crunch.",
          },
        ],
      },
      {
        isoDate: "2026-11-03",
        steps: [
          {
            title: "Primary client work — November deliverable",
            detail: "Whatever the operating assumption requires: deliver the November milestone by Nov 28.",
          },
        ],
      },
      {
        isoDate: "2026-11-04",
        steps: [
          {
            title: "Gilles — November check-in",
            detail: "Monthly call. Any corridor news? Any relationship risks heading into year-end? What's his priority for the December conversation?",
          },
        ],
      },
      {
        isoDate: "2026-11-05",
        steps: [
          {
            title: "Outreach — November call 1",
            detail: "Warmest active prospect. Move the conversation forward. If no warm prospect remains active: start the Treaty 3 / cold-circle sequence.",
          },
        ],
      },
      {
        isoDate: "2026-11-06",
        steps: [
          {
            title: "Weekly close-out — November Week 1",
            detail: "Year-end audit: financial records handed to bookkeeper? Primary deliverable: on track? Outreach: one call done. Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 45,
    phase: "Operating Season",
    theme: "Year-end audit — producer and staff records",
    days: [
      {
        isoDate: "2026-11-09",
        steps: [
          {
            title: "Year-end audit — producer agreement audit",
            detail: "Confirm all active producer agreements are current, signed, and filed. Any producer whose agreement lapsed or was never formalized: contact them this week. Do not carry an unsigned agreement into the year-end report.",
          },
        ],
      },
      {
        isoDate: "2026-11-10",
        steps: [
          {
            title: "Remembrance Day observance",
            detail: "Reduced pace. One desk task if needed. No client-facing communication.",
          },
        ],
      },
      {
        isoDate: "2026-11-11",
        steps: [
          {
            title: "Remembrance Day — honour the day",
            detail: "If this falls on a Wednesday: no operational work. Observe the day with your family.",
          },
        ],
      },
      {
        isoDate: "2026-11-12",
        steps: [
          {
            title: "Year-end audit — staff hours and payroll records",
            detail: "All staff hours logged for the year. All payroll records filed. Any discrepancy between hours claimed and hours recorded: investigate and resolve before the audit.",
          },
        ],
      },
      {
        isoDate: "2026-11-13",
        steps: [
          {
            title: "Weekly close-out — November Week 2",
            detail: "Producer agreements: all current? Staff records: all filed? Primary deliverable: on track? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 46,
    phase: "Operating Season",
    theme: "Year-end audit — council report draft",
    days: [
      {
        isoDate: "2026-11-16",
        steps: [
          {
            title: "Council report — draft the year-end narrative",
            detail: "Using the template from Week 43: fill in the actuals. What did the store do in year one? What was spent? What was produced? What did the community gain? One page of honest numbers and one paragraph of plain-language narrative.",
          },
        ],
      },
      {
        isoDate: "2026-11-17",
        steps: [
          {
            title: "Outreach — November call 2",
            detail: "Second warm outreach call of the month. If a council introduction is on the table: schedule it for December.",
          },
        ],
      },
      {
        isoDate: "2026-11-18",
        steps: [
          {
            title: "Financial model — November actuals vs projection",
            detail: "Update the V7 model with November actuals. Six months into the engagement (if Plan A is running). Flag any material variance.",
          },
        ],
      },
      {
        isoDate: "2026-11-19",
        steps: [
          {
            title: "Year-end audit — bookkeeper review meeting",
            detail: "Meet with the bookkeeper (or review their preliminary report). What questions do they have? What documents are still outstanding? Set a hard deadline for the complete bookkeeper package: Dec 15.",
          },
        ],
      },
      {
        isoDate: "2026-11-20",
        steps: [
          {
            title: "Weekly close-out — November Week 3",
            detail: "Council report draft: done? Bookkeeper meeting: done? Outreach: two calls this month? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 47,
    phase: "Operating Season",
    theme: "November push — wrap active workstreams",
    days: [
      {
        isoDate: "2026-11-23",
        steps: [
          {
            title: "Primary client work — November deliverable final push",
            detail: "Deliver the November milestone by Friday. If it's not deliverable by Friday, escalate and document the reason.",
          },
        ],
      },
      {
        isoDate: "2026-11-24",
        steps: [
          {
            title: "Year-end audit — impact data collection",
            detail: "Collect the data that the year-end report needs: sales by category (if store is running), producer volume by producer, household accounts served, staff hours by role. This data takes longer to gather than expected — start now.",
          },
        ],
      },
      {
        isoDate: "2026-11-25",
        steps: [
          {
            title: "Gilles — November close-out call",
            detail: "Brief call. What does he want to see in the year-end report? What does the council care about most? Is there anything the report should address that a standard financial audit wouldn't surface?",
          },
        ],
      },
      {
        isoDate: "2026-11-26",
        steps: [
          {
            title: "Grant applications — status check on submitted applications",
            detail: "LFIF, second grant: any decision or adjudicator communication? Document the current status of each. If any application is approaching its adjudication window, confirm receipt with the program officer.",
          },
        ],
      },
      {
        isoDate: "2026-11-27",
        steps: [
          {
            title: "Monthly close-out — November retrospective",
            detail: "Four months in Operating Season. What happened? Year-end audit: on track for Dec 31? Primary client: November milestone delivered? Outreach: any warm prospects entering December? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 48,
    phase: "Operating Season",
    theme: "December — year-end audit crunch",
    days: [
      {
        isoDate: "2026-11-30",
        steps: [
          {
            title: "December operating plan — protect the audit crunch",
            detail: "December has two competing demands: year-end audit and holiday family time. Write the December calendar now. Block the audit weeks. Block the family days. The two should not collide.",
          },
        ],
      },
      {
        isoDate: "2026-12-01",
        steps: [
          {
            title: "Year-end audit — bookkeeper package: all documents delivered by Dec 15",
            detail: "Confirm with the bookkeeper that the Dec 15 deadline is firm. If they need anything, deliver it today.",
          },
          {
            title: "Council report — second draft",
            detail: "Incorporate any feedback from the Gilles call. Tighten the narrative. The report should answer the council's question before they ask it.",
          },
        ],
      },
      {
        isoDate: "2026-12-02",
        steps: [
          {
            title: "Primary client work — December deliverable set",
            detail: "What is the December milestone? It should be achievable by Dec 19. Write it down.",
          },
        ],
      },
      {
        isoDate: "2026-12-03",
        steps: [
          {
            title: "Northern Band — year-end check-in through Gilles",
            detail: "Is there any chance of a January conversation? What does Gilles recommend as the year-end posture: a brief update note, a report summary, or silence until January?",
          },
        ],
      },
      {
        isoDate: "2026-12-04",
        steps: [
          {
            title: "Weekly close-out — December Week 1",
            detail: "Audit timeline: on track for Dec 15 bookkeeper package? December deliverable: set? Northern Band: year-end posture decided? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 49,
    phase: "Operating Season",
    theme: "Bookkeeper package and impact data",
    days: [
      {
        isoDate: "2026-12-07",
        steps: [
          {
            title: "Year-end audit — complete bookkeeper package assembly",
            detail: "All invoices, all expense records, all payroll records, all producer payments, all council invoices issued. The package is complete when the bookkeeper can do the year-end review without asking for anything else.",
          },
        ],
      },
      {
        isoDate: "2026-12-08",
        steps: [
          {
            title: "Impact data — finalize the year-one numbers",
            detail: "The numbers the council report will carry: total revenue, total cost, net to community (if store model), producer volume, households served, staff hours. Lock these numbers this week.",
          },
        ],
      },
      {
        isoDate: "2026-12-09",
        steps: [
          {
            title: "Outreach — December check-in with warmest active prospect",
            detail: "One short note: 'Looking forward to continuing this conversation in January. Happy to send a year-one cost summary tailored to your community if that would be useful.' No ask. Just stay warm.",
          },
        ],
      },
      {
        isoDate: "2026-12-10",
        steps: [
          {
            title: "Primary client — December deliverable progress check",
            detail: "Is the December milestone on track? If not: escalate today, not next week.",
          },
        ],
      },
      {
        isoDate: "2026-12-11",
        steps: [
          {
            title: "Weekly close-out — December Week 2",
            detail: "Bookkeeper package: delivered or on track for Dec 15? Impact data: locked? Outreach: year-end note sent? Primary deliverable: on track?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 50,
    phase: "Operating Season",
    theme: "Year-end report and council brief",
    days: [
      {
        isoDate: "2026-12-14",
        steps: [
          {
            title: "Bookkeeper package — deliver to bookkeeper by Dec 15",
            detail: "Today or tomorrow at the latest. File the delivery confirmation in /Operations.",
          },
        ],
      },
      {
        isoDate: "2026-12-15",
        steps: [
          {
            title: "Year-end report — final draft",
            detail: "Incorporate the locked impact data. Read it out loud. Does it answer the council's question: was this year worth it? If yes: it's done. If no: revise the narrative section.",
          },
          {
            title: "Primary client — December milestone delivery",
            detail: "Deliver the December milestone this week if possible. The window before the holiday close is narrow.",
          },
        ],
      },
      {
        isoDate: "2026-12-16",
        steps: [
          {
            title: "Gilles — year-end report review",
            detail: "Send Gilles the draft year-end report. Ask one question: is there anything here the council will push back on, and is it answerable?",
          },
        ],
      },
      {
        isoDate: "2026-12-17",
        steps: [
          {
            title: "Pilot #2 brief — begin draft",
            detail: "Based on year-one learnings: what does the Pilot #2 brief look like? Which community is the most likely second store? What would the year-two engagement look like? This brief is for January, but starting the thinking now.",
          },
        ],
      },
      {
        isoDate: "2026-12-18",
        steps: [
          {
            title: "Weekly close-out — December Week 3",
            detail: "Bookkeeper package: delivered. Year-end report: final draft done. December milestone: delivered or final push next week? Non-negotiables check.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 51,
    phase: "Operating Season",
    theme: "Year-end close and holiday wind-down",
    days: [
      {
        isoDate: "2026-12-21",
        steps: [
          {
            title: "Year-end report — distribute to council and band office",
            detail: "Send one copy to the council liaison, one to the band office, and file one in /Operations. The report is the practitioner's primary Year 1 legacy document.",
          },
          {
            title: "December milestone — final delivery if not yet complete",
            detail: "This is the last full week. Any deliverable not yet complete needs to land today or tomorrow.",
          },
        ],
      },
      {
        isoDate: "2026-12-22",
        steps: [
          {
            title: "Pilot #2 brief — complete first draft",
            detail: "Ready to present to a prospective Pilot #2 community in January. One page: what the second store is, what the community gets, what it costs, what the practitioner brings from year one.",
          },
        ],
      },
      {
        isoDate: "2026-12-23",
        steps: [
          {
            title: "Store moves to holiday reduced hours — confirm with all staff",
            detail: "Dec 24–Jan 1: confirm hours with food handler and OM (if applicable). The community should know the holiday schedule well in advance.",
          },
          {
            title: "Financial model — year-end update with full-year actuals",
            detail: "Update the V7 model with the full year actuals. What was the final position? Was the V7 projection accurate? What would you change in the year-two model?",
          },
        ],
      },
      {
        isoDate: "2026-12-24",
        steps: [
          {
            title: "Staff year-end recognition — written notes and confirmed bonuses",
            detail: "Every team member who completed the year gets a written note. The bonus is secondary to the recognition.",
          },
        ],
      },
      {
        isoDate: "2026-12-25",
        steps: [
          {
            title: "Christmas Day — full rest",
            detail: "The practitioner ran a community food system for a year while protecting family time. Both are true today. Rest.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 52,
    phase: "Operating Season",
    theme: "Year-end — year-two planning seeds",
    days: [
      {
        isoDate: "2026-12-28",
        steps: [
          {
            title: "Year retrospective — honest full-year review",
            detail: "Write the one-page honest year review. What went better than expected? What went worse? What was the right call at each trigger point (bridge capital, June 15, July 31)? What would you do differently in year two? File in /Operations. This is the most important document you write all year.",
          },
        ],
      },
      {
        isoDate: "2026-12-29",
        steps: [
          {
            title: "Year-two goals — set three objectives for Q1 2027",
            detail: "Write them down: (1) what is the primary engagement (Northern Band year 2, new community, Plan B scale), (2) what is the outreach target (which community is the Pilot #2 candidate), (3) what is the personal goal (kids, sleep, partner time maintained for 12 consecutive weeks)?",
          },
        ],
      },
      {
        isoDate: "2026-12-30",
        steps: [
          {
            title: "Gilles — year-end call and thank-you",
            detail: "One call: thank him for the year. What is his read of the corridor heading into 2027? What does he think Headwaters should prioritize in Q1?",
          },
          {
            title: "Non-negotiables — full-year check",
            detail: "How many weeks in 2026 had a non-negotiables breach? If more than four: what changes in 2027 to protect the three non-negotiables? Write the change, not just the intention.",
          },
        ],
      },
      {
        isoDate: "2026-12-31",
        steps: [
          {
            title: "New Year's Eve — close the year",
            detail: "File the last close-out note of 2026 in /Operations. One paragraph: what was 2026? What is 2027 going to be? Then close the laptop and celebrate with your family.",
          },
        ],
      },
      {
        isoDate: "2027-01-01",
        steps: [
          {
            title: "New Year's Day — full rest",
            detail: "Protect family time. No operational decisions today. Year one is done.",
          },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the local calendar date as "YYYY-MM-DD" (no UTC shift).
 * Using toISOString() would give the UTC date, which can be one day behind
 * in timezones west of UTC — this helper always uses the device's local date.
 */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getWeek(isoWeek: number): Week | undefined {
  return PLAN_2026.find((w) => w.isoWeek === isoWeek);
}

/**
 * Returns the week for the given calendar date (using local date, not UTC).
 * On Saturday, returns the week containing the previous Friday.
 * On Sunday, returns the week containing the upcoming Monday.
 */
export function getTodayWeek(): Week | undefined {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

  if (dow === 6) {
    // Saturday → show Friday's week
    const fri = new Date(today);
    fri.setDate(today.getDate() - 1);
    const friStr = toLocalISODate(fri);
    return PLAN_2026.find((w) => w.days.some((d) => d.isoDate === friStr));
  }

  if (dow === 0) {
    // Sunday → show Monday's week
    const mon = new Date(today);
    mon.setDate(today.getDate() + 1);
    const monStr = toLocalISODate(mon);
    return PLAN_2026.find((w) => w.days.some((d) => d.isoDate === monStr));
  }

  const todayStr = toLocalISODate(today);
  return PLAN_2026.find((w) => w.days.some((d) => d.isoDate === todayStr));
}

/**
 * Returns the week and day for display in the Today view (using local date).
 * On Saturday, returns Friday's plan with a weekend flag.
 * On Sunday, returns Monday's plan with a weekend flag.
 */
export function getTodayDay(): { week: Week; day: Day; weekendMode?: "saturday" | "sunday" } | undefined {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun, 6=Sat

  if (dow === 6) {
    // Saturday → show Friday's plan
    const fri = new Date(today);
    fri.setDate(today.getDate() - 1);
    const friStr = toLocalISODate(fri);
    for (const week of PLAN_2026) {
      const day = week.days.find((d) => d.isoDate === friStr);
      if (day) return { week, day, weekendMode: "saturday" };
    }
    return undefined;
  }

  if (dow === 0) {
    // Sunday → show Monday's plan
    const mon = new Date(today);
    mon.setDate(today.getDate() + 1);
    const monStr = toLocalISODate(mon);
    for (const week of PLAN_2026) {
      const day = week.days.find((d) => d.isoDate === monStr);
      if (day) return { week, day, weekendMode: "sunday" };
    }
    return undefined;
  }

  const todayStr = toLocalISODate(today);
  for (const week of PLAN_2026) {
    const day = week.days.find((d) => d.isoDate === todayStr);
    if (day) return { week, day };
  }
  return undefined;
}

export function formatDateRange(week: Week): string {
  const dates = week.days.map((d) => new Date(d.isoDate + "T12:00:00"));
  const first = dates[0];
  const last = dates[dates.length - 1];
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (first.getMonth() === last.getMonth()) {
    return `${first.toLocaleDateString("en-CA", { month: "short" })} ${first.getDate()}–${last.getDate()}`;
  }
  return `${first.toLocaleDateString("en-CA", opts)} – ${last.toLocaleDateString("en-CA", opts)}`;
}

export const PHASE_ORDER: Phase[] = ["Pursuit", "Pivot", "Operating Season"];

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; dot: string }> = {
  Pursuit: { bg: "rgba(184,90,62,0.12)", text: "#b85a3e", dot: "#b85a3e" },
  Pivot: { bg: "rgba(31,61,46,0.15)", text: "#1f3d2e", dot: "#1f3d2e" },
  "Operating Season": { bg: "rgba(122,122,110,0.15)", text: "#4a5240", dot: "#7a7a6e" },
};
