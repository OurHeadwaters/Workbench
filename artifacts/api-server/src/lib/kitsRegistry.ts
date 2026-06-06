/**
 * kitsRegistry — canonical list of Headwaters Kits.
 *
 * Naming rule (Kitchen Table, May 25 2026):
 *   - Collective name: Headwaters Kits
 *   - Load-bearing word: Kit
 *   - Rule: single word + one modifier maximum
 *   - "Economy Kit" replaces the mouthful "Community Money Machine Kit"
 *     (two bounded things in one name — fails the Saltbox test).
 *
 * Each entry carries:
 *   id          — stable slug, used in webhook payload from TSP
 *   name        — public display name
 *   tagline     — one sentence for the delivery email
 *   arcNote     — what the buyer should do re: The Arc (self-register, no integration)
 *   contentNote — what the buyer receives / where it lives
 */

export interface Kit {
  id: string;
  name: string;
  tagline: string;
  arcNote: string | null;
  contentNote: string;
}

export const KITS: Record<string, Kit> = {
  "economy-kit": {
    id: "economy-kit",
    name: "Economy Kit",
    tagline: "The blueprint for running a community's own economy.",
    arcNote:
      "To register your Community Money Machine as a steward, visit The Arc directly at ourheadwaters.ca/arc and create your account. The Arc is fully sovereign — no automatic setup happens on purchase.",
    contentNote:
      "Your kit includes the Community Money Machine Blueprint (PDF) and the Codetry Practitioner framework for Zone 3 economic infrastructure.",
  },
  "family-kit": {
    id: "family-kit",
    name: "Family Kit",
    tagline: "Household sovereignty and Zone 0 readiness tools.",
    arcNote: null,
    contentNote:
      "Your kit includes the Saltbox Household Framework, Zone 0 readiness checklists, and the Family Buckets operating model.",
  },
  "homeschool-kit": {
    id: "homeschool-kit",
    name: "Homeschool Kit",
    tagline: "Learning at home in seasonal rhythm with community context.",
    arcNote: null,
    contentNote:
      "Your kit includes the Seasonal Learning Framework, community-anchored curriculum guides, and the Codetry Homeschool Constellation.",
  },
  "community-economy-kit": {
    id: "community-economy-kit",
    name: "Community Economy Kit",
    tagline: "Zone 3 co-op and community institution tools.",
    arcNote:
      "To register your institution in The Arc network, visit ourheadwaters.ca/arc and self-register. Sovereign process — no automatic connection to your purchase.",
    contentNote:
      "Your kit includes the Community Economy Blueprint, co-op formation guides, and the Zone 3 institutional toolkit.",
  },
  "engagement-kit": {
    id: "engagement-kit",
    name: "Engagement Kit",
    tagline: "Practitioner outreach, Stomping Path framing, and first contact.",
    arcNote: null,
    contentNote:
      "Your kit includes the Stomping Path outreach framework, first-contact scripts, and the Headwaters practitioner introduction sequence.",
  },
  "practitioner-kit": {
    id: "practitioner-kit",
    name: "Practitioner Kit",
    tagline: "The full constellation — Operating Plan, Bench, and Codetry practice.",
    arcNote: null,
    contentNote:
      "Your kit includes the Practitioner's Operating Plan, the Bench toolkit, Codetry practice guides, and the Pioneer Path companion.",
  },
  "standby-kit": {
    id: "standby-kit",
    name: "Standby Kit",
    tagline: "Emergency preparedness and Saltbox discipline.",
    arcNote: null,
    contentNote:
      "Your kit includes the Standby Readiness Framework, Saltbox discipline guides, and the Dam Days emergency protocol.",
  },
  "field-guide-finance-kit": {
    id: "field-guide-finance-kit",
    name: "Field Guide Finance Kit",
    tagline: "Practitioner finance — from first dollar to four buckets.",
    arcNote: null,
    contentNote:
      "Your kit includes the Field Guide Finance course, the Four Buckets operating model, and the practitioner financial literacy sequence.",
  },
  "pioneer-path-kit": {
    id: "pioneer-path-kit",
    name: "Pioneer Path Kit",
    tagline: "The 20-station initiation sequence.",
    arcNote: null,
    contentNote:
      "Your kit includes the Pioneer Path guide (all 20 stations), the audio-narrated companion sequence, and the action-gated station worksheets.",
  },
  "handbook-kit": {
    id: "handbook-kit",
    name: "Handbook Kit",
    tagline: "The Codetry Handbook — offline-first reader.",
    arcNote: null,
    contentNote:
      "Your kit includes the Codetry Practitioner's Handbook in full, available as an offline-first web reader (installable as a PWA) and printable PDF.",
  },
  "pj-solutions-kit": {
    id: "pj-solutions-kit",
    name: "PJ Solutions Kit",
    tagline: "Bobbie Parr's full Principles to Preservation workshop suite.",
    arcNote: null,
    contentNote:
      "Your kit includes all 13 redesigned workshop handouts — blanching cheat sheets, dehydrating and freezing flows, station setup worksheets, process documentation sheets, and the Jarista lead magnet. Print-ready, no filler.",
  },
};

export function getKit(id: string): Kit | null {
  return KITS[id] ?? null;
}
