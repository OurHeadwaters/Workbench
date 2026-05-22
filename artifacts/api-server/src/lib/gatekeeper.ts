// ─────────────────────────────────────────────────────────────────────────────
// Gatekeeper — core types, constants, and food system worked example
//
// The Gatekeeper cap + Workbench seat is the resolution of a foundational
// tension in the Headwaters / Bright Side model: how does traditional knowledge
// remain sovereign inside the community while still satisfying The Systems
// (health unit, regulator, auditor, bank) that require their own language?
//
// Answer: the Gatekeeper holds both. The personal cap gives them the cultural
// authority to author the translation mappings. The Workbench seat gives them
// institutional standing so The Systems will receive what they produce.
//
// Neither works alone:
//   Cap without seat → cultural authority with no institutional channel
//   Seat without cap → institutional channel with no authoritative translator
// ─────────────────────────────────────────────────────────────────────────────

// ─── Domain constants ────────────────────────────────────────────────────────

export const GATEKEEPER_DOMAINS = [
  "food",
  "land",
  "health",
  "governance",
  "finance",
] as const;

export type GatekeeperDomain = (typeof GATEKEEPER_DOMAINS)[number];

// Categories within each domain.
// Food extends The Gate's original five with food-specific translation needs.
export const GATEKEEPER_CATEGORIES: Record<GatekeeperDomain, string[]> = {
  food: ["food_safety", "food_sourcing", "food_handling"],
  land: ["pragmatism", "regulations", "politics"],
  health: ["pragmatism", "regulations", "privacy"],
  governance: ["pragmatism", "politics", "regulations"],
  finance: ["banking", "regulations", "pragmatism"],
};

// Sub-domains for food — the specific traditional food practices being translated.
export const FOOD_SUB_DOMAINS = [
  "wild_game",   // wild fish, moose, deer, rabbit — elder-certified, seasonal harvest
  "foraged",     // berries, mushrooms, plants — gathered from the land
  "fermented",   // traditional fermented and naturally preserved foods
  "cultivated",  // community gardens, three-sisters, traditional planting
  "processed",   // smoked, dried, rendered — traditional preservation methods
] as const;

export type FoodSubDomain = (typeof FOOD_SUB_DOMAINS)[number];

// ─── Succession event types ───────────────────────────────────────────────────

export const SUCCESSION_EVENT_TYPES = [
  "cap_assigned",         // a new person takes the personal cap
  "cap_relinquished",     // the current cap holder steps down
  "seat_assigned",        // a person takes the Workbench seat
  "seat_vacated",         // the seat occupant steps down
  "mappings_transferred", // mapping authorship formally moves to new cap holder
] as const;

export type SuccessionEventType = (typeof SUCCESSION_EVENT_TYPES)[number];

// ─── Succession protocol ──────────────────────────────────────────────────────
//
// When the Gatekeeper cap holder steps down, the following sequence applies:
//
//   1. Cap holder notifies founding council (recorded: cap_relinquished event).
//   2. Founding council nominates an interim seat occupant to keep institutional
//      continuity — this person can receive correspondence from The Systems but
//      CANNOT author new mappings (seat.isInterim = true, capId = outgoing cap).
//   3. Founding council selects a new cap holder from the community — a person
//      with the requisite traditional knowledge in the relevant domain.
//   4. New cap holder is formally designated (recorded: cap_assigned event).
//   5. Seat transfers from interim occupant to new cap holder (seat_assigned event).
//   6. New cap holder reviews all existing mappings. Each mapping they adopt is
//      recorded as authored by their cap ID. Mappings they revise are updated
//      in-place; the old rationale and authority text is preserved in history.
//      (recorded: mappings_transferred event).
//   7. Interim seat row is vacated (seat_vacated event).
//
// The chain is traceable: every event has actorName, subjectId, subjectKind,
// note, and recordedAt. Nothing is deleted from the succession log.
//
// ─── What the cap confers ────────────────────────────────────────────────────
//
//   • Authorship of translation mappings (the cultural record)
//   • Standing to certify that a Bright Side term accurately represents a
//     Systems concept (not just a word substitution — a knowledge claim)
//   • Voice in mapping disputes when The Systems challenges a translation
//
// ─── What the seat confers ───────────────────────────────────────────────────
//
//   • Institutional continuity — The Systems have a named contact who persists
//     across changes in community membership
//   • Legal standing to sign compliance documents on behalf of Bright Side
//   • Succession path — the seat is never empty, even when the cap is in transit
//
// ─── What neither can do alone ───────────────────────────────────────────────
//
//   The cap without the seat: the holder can author mappings internally but
//   has no channel to The Systems. Their translations are culturally valid but
//   not institutionally receivable.
//
//   The seat without the cap: the occupant can receive Systems correspondence
//   and sign documents but cannot author new mappings or certify that a
//   translation is accurate. They are a mailbox, not a translator.

// ─── Food system worked example ──────────────────────────────────────────────
//
// The food system is the clearest demonstration of the Gatekeeper's function.
//
// Wild fish and game don't fail the Ontario health unit's standard — they fail
// to be LEGIBLE to it. The health unit's framework assumes:
//   - a licensed supplier (vs. elder-certified seasonal harvester)
//   - a documented chain of custody (vs. oral knowledge of harvest conditions)
//   - a registered processing facility (vs. traditional land-based processing)
//   - a temperature log (vs. elder-assessed freshness / seasonal timing)
//
// The Gatekeeper's job is to translate these equivalencies — not to certify
// that wild harvest meets industrial standards, but to show how the community's
// own standards satisfy the underlying intent of the regulation.
//
// The mappings below are the worked example. Each row shows:
//   Bright Side term   →   The Systems term
//   rationale          →   why this translation holds
//   authority          →   which regulation or standard is being satisfied
//
// This is not legal advice. These mappings represent a starting framework
// for how the Gatekeeper would structure the translation, not a submission
// to any regulatory body.

export type FoodMappingSeed = {
  brightSideTerm: string;
  systemsTerm: string;
  domain: "food";
  category: "food_safety" | "food_sourcing" | "food_handling";
  subDomain: FoodSubDomain;
  rationale: string;
  authority: string;
};

export const FOOD_SYSTEM_SEED_MAPPINGS: FoodMappingSeed[] = [
  // ── FOOD SAFETY ──────────────────────────────────────────────────────────

  {
    brightSideTerm: "elder-certified harvest",
    systemsTerm: "approved source",
    domain: "food",
    category: "food_safety",
    subDomain: "wild_game",
    rationale:
      "Ontario food law requires food to come from an 'approved source' — a " +
      "term defined as a source that produces food under conditions at least " +
      "equivalent to provincial standards. Elder-certified harvest is the " +
      "community's equivalent standard: a designated knowledge holder has " +
      "assessed the animal, the harvest conditions, the time, and the method. " +
      "The translation does not claim that the elder is a licensed inspector; " +
      "it claims that the certification process satisfies the underlying " +
      "intent of the approved-source requirement.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 2(1) — definition of 'approved source'",
  },
  {
    brightSideTerm: "seasonal harvest",
    systemsTerm: "food obtained in accordance with applicable law",
    domain: "food",
    category: "food_safety",
    subDomain: "wild_game",
    rationale:
      "Wild game harvested under a valid Ontario hunting licence, or under " +
      "Indigenous harvesting rights protected by s. 35 of the Constitution " +
      "Act 1982, is obtained in accordance with applicable law. 'Seasonal " +
      "harvest' is Bright Side shorthand for this legal and ecological " +
      "compliance — the season itself is the compliance mechanism.",
    authority:
      "Ontario Fish and Wildlife Conservation Act, R.S.O. 1997, c. 41; " +
      "Constitution Act 1982, s. 35 (Aboriginal rights)",
  },
  {
    brightSideTerm: "traditional knowledge of harvest conditions",
    systemsTerm: "documented food safety assessment",
    domain: "food",
    category: "food_safety",
    subDomain: "wild_game",
    rationale:
      "Health units require evidence that the safety of harvested food was " +
      "assessed. Traditional knowledge of harvest conditions — the harvester's " +
      "observation of the animal's behaviour, the water quality of the harvest " +
      "location, the temperature and time from kill to cooling — constitutes a " +
      "safety assessment. The Gatekeeper documents the assessment criteria in " +
      "writing so the health unit has a record to review.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 52 — sources of food",
  },
  {
    brightSideTerm: "land-based processing",
    systemsTerm: "food prepared in a regulated premises or under an exemption",
    domain: "food",
    category: "food_safety",
    subDomain: "wild_game",
    rationale:
      "Butchering and processing game meat on the land where it was harvested " +
      "falls under the personal-use exemption in the Food Premises Regulation " +
      "when the food is for personal, family, or community consumption and not " +
      "sold commercially. Where the community shares food without monetary " +
      "exchange, this exemption applies. The translation makes this explicit " +
      "so the health unit understands the regulatory basis.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 3 — exemptions; " +
      "Ontario Food Safety and Quality Act, 2001, S.O. 2001, c. 20",
  },

  // ── FORAGED ──────────────────────────────────────────────────────────────

  {
    brightSideTerm: "gathered from the land",
    systemsTerm: "wild-harvested food from an approved source",
    domain: "food",
    category: "food_sourcing",
    subDomain: "foraged",
    rationale:
      "Foraged foods — berries, mushrooms, plants — require the same " +
      "'approved source' translation as wild game. 'Gathered from the land' " +
      "encodes the community's sourcing standard: knowledge of the specific " +
      "location, the absence of contamination (pesticide spray areas, " +
      "industrial runoff), and the harvest method. The Gatekeeper documents " +
      "these criteria as the sourcing standard for audit purposes.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 2(1) — approved source",
  },
  {
    brightSideTerm: "elder's knowledge of the land",
    systemsTerm: "food safety assessment by a qualified person",
    domain: "food",
    category: "food_safety",
    subDomain: "foraged",
    rationale:
      "Regulators require that food safety decisions be made by a person " +
      "with relevant knowledge and training. Elder knowledge of the land — " +
      "the ability to identify safe vs. contaminated harvest areas, safe vs. " +
      "toxic species, and optimal vs. degraded harvest conditions — is the " +
      "community's equivalent of formal food safety training for the purposes " +
      "of wild-harvest assessment. The qualification is knowledge-based, not " +
      "credential-based.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 4 — operator responsibilities",
  },

  // ── FERMENTED ────────────────────────────────────────────────────────────

  {
    brightSideTerm: "traditionally fermented",
    systemsTerm: "food prepared using a controlled fermentation process",
    domain: "food",
    category: "food_handling",
    subDomain: "fermented",
    rationale:
      "Traditional fermentation methods (salt-curing, lacto-fermentation, " +
      "smoke-curing) use the same pathogen-control mechanisms as industrial " +
      "processes: pH reduction, water activity reduction, or oxygen exclusion. " +
      "The translation reframes the process in the language the health unit " +
      "uses so that the safety mechanism is visible, not just the practice name.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 59 — " +
      "temperature control; Codex Alimentarius — fermented foods guidelines",
  },
  {
    brightSideTerm: "naturally preserved",
    systemsTerm: "shelf-stable food product processed to inhibit microbial growth",
    domain: "food",
    category: "food_handling",
    subDomain: "fermented",
    rationale:
      "Smoking, drying, and fat-packing are traditional preservation methods " +
      "that reduce water activity and/or introduce antimicrobial compounds " +
      "(smoke phenols). 'Shelf-stable' and 'microbial growth inhibition' are " +
      "the Systems terms for exactly this result. The translation does not " +
      "change the process — it names what the process achieves.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 59(2) — " +
      "potentially hazardous food definition and water activity standard",
  },

  // ── PROCESSED (smoked, dried, rendered) ─────────────────────────────────

  {
    brightSideTerm: "smoked over open fire",
    systemsTerm: "cold-smoked or hot-smoked using an accepted smoking process",
    domain: "food",
    category: "food_handling",
    subDomain: "processed",
    rationale:
      "Traditional open-fire smoking achieves the same outcome as commercial " +
      "smoking equipment: a specific internal temperature and/or smoke exposure " +
      "time that inhibits pathogens. The translation maps the practice to the " +
      "regulatory category ('cold-smoked' or 'hot-smoked') based on the " +
      "actual temperature achieved, so the health unit can evaluate it against " +
      "the standard it already knows.",
    authority:
      "CFIA Fish and Seafood Products Inspection Regulations; " +
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 59",
  },
  {
    brightSideTerm: "dried on the rack",
    systemsTerm: "dehydrated food with water activity below 0.85",
    domain: "food",
    category: "food_handling",
    subDomain: "processed",
    rationale:
      "Air-drying meat and fish is a controlled dehydration process. The " +
      "safety criterion is water activity (aw): at aw < 0.85, most bacterial " +
      "pathogens cannot grow. Traditional knowledge of 'dry enough' — the " +
      "texture, colour, and bend test — is the community's empirical measure " +
      "of this threshold. The translation states the regulatory standard " +
      "alongside the traditional indicator.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 59(2); " +
      "Codex Alimentarius HACCP guidelines — water activity control",
  },
  {
    brightSideTerm: "rendered fat",
    systemsTerm: "processed animal fat — clarified by heat to remove moisture and protein",
    domain: "food",
    category: "food_handling",
    subDomain: "processed",
    rationale:
      "Rendering is a thermal process that eliminates pathogens through " +
      "sustained heat above 70°C and drives water activity below the growth " +
      "threshold for most spoilage organisms. The regulatory system recognises " +
      "this as a validated preservation method. The translation names the " +
      "process in Systems language while preserving the Bright Side term for " +
      "internal use.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 59; " +
      "CFIA Meat Hygiene Directives — rendered animal fats",
  },

  // ── CULTIVATED ───────────────────────────────────────────────────────────

  {
    brightSideTerm: "community garden harvest",
    systemsTerm: "produce grown under a food safety plan",
    domain: "food",
    category: "food_sourcing",
    subDomain: "cultivated",
    rationale:
      "Community gardens operated by the Bright Side community have defined " +
      "practices for soil sourcing, composting, water use, and harvest hygiene. " +
      "These practices constitute a food safety plan even without the formal " +
      "document name. The Gatekeeper's role is to record the existing practices " +
      "in a format the health unit recognises as a plan.",
    authority:
      "Ontario Food Premises Regulation O. Reg. 493/17, s. 52; " +
      "Canada GAP (Good Agricultural Practices) — fresh produce standard",
  },
  {
    brightSideTerm: "three-sisters planting",
    systemsTerm: "integrated polyculture using complementary crops (corn, beans, squash)",
    domain: "food",
    category: "food_sourcing",
    subDomain: "cultivated",
    rationale:
      "Three-sisters planting is a specific traditional agricultural practice " +
      "with known agronomy: nitrogen fixation by the beans, ground-cover by " +
      "the squash, structural support by the corn. The Systems term names " +
      "the ecological function so the practice is legible in agricultural and " +
      "land-use planning contexts (zoning, grant applications, health unit " +
      "garden assessments).",
    authority:
      "Canada GAP Program — fresh produce food safety; " +
      "Ontario Ministry of Agriculture, Food and Rural Affairs — crop practices",
  },
];
