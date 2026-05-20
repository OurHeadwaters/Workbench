import type { TrailSign } from "./types";

/**
 * SEED_TRAIL_SIGNS — the first five trail signs on the Headwaters Odyssey.
 * These are self-sponsorships: Headwaters tools recommending each other.
 * They prove the format before external sponsors are onboarded.
 *
 * Used as an in-memory fallback when the API is unavailable.
 */
export const SEED_TRAIL_SIGNS: TrailSign[] = [
  {
    id: "seed-north-star",
    toolName: "North Star",
    problemStatement: "You start each day without a clear structure — priorities scatter and the important gets buried under the urgent.",
    costTier: "free",
    actionUrl: "/north-star/",
    actionLabel: "Open North Star",
    communityProof: "Used daily by Headwaters practitioners across 3 communities",
    zoneTags: ["any"],
    topicTags: ["planning", "triage", "daily", "structure"],
  },
  {
    id: "seed-morning-triage",
    toolName: "Morning Triage",
    problemStatement: "Decision overwhelm hits before 9am — your inbox owns your day before you do.",
    costTier: "free",
    actionUrl: "/north-star/",
    actionLabel: "Start your triage",
    communityProof: "Built into the daily practitioner routine",
    zoneTags: ["Z1", "Z2"],
    topicTags: ["triage", "prioritization", "inbox", "morning"],
  },
  {
    id: "seed-practitioners-guide",
    toolName: "Practitioner's Guide",
    problemStatement: "Client work runs on gut feel — there's no repeatable system for onboarding, scoping, or wrapping up engagements.",
    costTier: "free",
    actionUrl: "/practitioners-guide-v2/",
    actionLabel: "Open the guide",
    communityProof: "The canonical playbook for independent Headwaters practitioners",
    zoneTags: ["Z2"],
    topicTags: ["client-work", "workflow", "contracts", "onboarding"],
  },
  {
    id: "seed-field-guide-finance",
    toolName: "Field Guide Finance",
    problemStatement: "Income and expenses live in four different places — you can't see the full picture until it's too late.",
    costTier: "free",
    actionUrl: "/field-guide-finance/",
    actionLabel: "Open Field Guide Finance",
    communityProof: "Used for monthly closes by the founding Headwaters household",
    zoneTags: ["Z1"],
    topicTags: ["finance", "tracking", "bookkeeping", "income"],
  },
  {
    id: "seed-headwaters-books",
    toolName: "Headwaters Books",
    problemStatement: "Community knowledge stays locked in private documents, group chats, and individual heads.",
    costTier: "free",
    actionUrl: "/headwaters-books/",
    actionLabel: "Browse the catalog",
    communityProof: "Publishing community knowledge since the founding of Headwaters",
    zoneTags: ["Z3", "Z4"],
    topicTags: ["publishing", "community", "knowledge", "writing"],
  },
];
