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
  /**
   * Token-gated handout files.  Keys are stable slugs used in the
   * GET /kits/handout?token=xxx&key=yyy endpoint.  Values are the
   * real destination URLs (Google Drive or direct PDF links).
   * Empty-string value means the file is not yet linked.
   */
  handouts?: Record<string, string>;
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
    tagline: "The full constellation — Operating Plan, Workbench, and Codetry practice.",
    arcNote: null,
    contentNote:
      "Your kit includes the Practitioner's Operating Plan, the Workbench toolkit, Codetry practice guides, and the Pioneer Path companion.",
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
    handouts: {
      // ─────────────────────────────────────────────────────────────────────────
      // Replace each value with the real Google Drive share URL or PDF link.
      // Pattern: https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
      // ─────────────────────────────────────────────────────────────────────────

      // Module 1 — Water-Bath Canning
      "wb-process-diagram":           "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "wb-intro-safe-practices":      "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "wb-recipes":                   "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "wb-stages-stations":           "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "wb-canning-cheat-sheet":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",

      // Module 2 — Pressure Canning
      "pc-process-diagram":           "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "pc-intro-safe-practices":      "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "pc-times-table":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "pc-deeper-dive":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "pc-process-the-process":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",

      // Module 3 — Blanching, Freezing & Dehydrating
      "bfd-blanching-cheat-sheet":    "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "bfd-freezing-vs-dehydrating":  "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "bfd-process-the-process":      "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "bfd-dehydrating-diagram":      "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "bfd-freezer-prep":             "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",

      // Module 4 — Cooking With What You Store
      "cook-preserves":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "cook-local-gotos":             "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "cook-just-add-h2o":            "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "cook-value-added-meals":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "cook-harvest-salad":           "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",

      // Module 5 — The System
      "sys-get-started":              "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "sys-food-audit":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "sys-inperson-checklist":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "sys-ratios-cheat-sheet":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "sys-best-methods":             "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",

      // Also-included handouts
      "h-waterbath-vs-pressure":      "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-ratios-cheat-sheet":         "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-local-gotos":                "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-just-add-h2o":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-freezer-prep":               "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-inperson-checklist":         "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-food-audit-worksheet":       "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-tips-faq":                   "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-feedback-worksheet":         "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
      "h-seasonal-recipes":           "https://drive.google.com/drive/folders/1_pj-solutions-kit-placeholder",
    },
  },
  "goodbye-kit": {
    id: "goodbye-kit",
    name: "Goodbye Kit",
    tagline: "The household transition guide — closing one chapter, opening the next with intention.",
    arcNote: null,
    contentNote:
      "Your kit includes the Zone 0 Household Transition Framework, the Family Lifecycle Inventory (what to keep, what to move, what to let go), the Passing It Forward guide for handing off food systems and homestead knowledge to the next generation, and a seasonal closing checklist built for northern households. Everything is delivered as print-ready PDFs in this email.",
  },
};

export function getKit(id: string): Kit | null {
  return KITS[id] ?? null;
}
