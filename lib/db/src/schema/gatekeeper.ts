import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Gatekeeper Cap + Workbench Seat
//
// The Gatekeeper is a two-part structure:
//
//   Personal Cap  — held by a named person. Confers knowledge authorship and
//                   cultural authority. The cap holder writes and maintains the
//                   translation mappings that make Bright Side practice legible
//                   to The Systems (health units, regulators, auditors, banks).
//                   The cap cannot be delegated — it follows the person.
//
//   Workbench Seat — the institutional position. Confers continuity and standing
//                    with The Systems. The seat can be handed over during
//                    succession even before a new cap holder is confirmed.
//                    The seat never sits empty: if the cap holder steps down,
//                    the seat passes to an interim occupant nominated by the
//                    founding council until the new cap holder claims it.
//
// The two are linked: the cap holder *is* the seat occupant under normal
// operations. They diverge only during transition periods (succession windows).
//
// Both are traceable with timestamps. The succession log is append-only and
// records every state change for both cap and seat.
// ─────────────────────────────────────────────────────────────────────────────

// ---------- gatekeeper_caps ----------
// One row per cap tenure. Multiple rows exist when the cap has changed hands.
// Exactly one row has is_active = true at any time.
export const gatekeeperCapsTable = pgTable(
  "gatekeeper_caps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // The named person who holds personal authority over the translation mappings.
    holderName: text("holder_name").notNull(),
    // Short description of the knowledge domain this holder was designated for.
    // e.g. "Traditional food systems — wild harvest, elder-certified practice"
    knowledgeDomain: text("knowledge_domain").notNull().default(""),
    // Why this person was designated cap holder; the cultural record.
    rationale: text("rationale").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    heldSince: timestamp("held_since", { withTimezone: true }).notNull().defaultNow(),
    // Set when the holder formally steps down. Null means currently active.
    relinquishedAt: timestamp("relinquished_at", { withTimezone: true }),
    // What happened at relinquishment: "retirement", "succession", "incapacity", etc.
    relinquishedReason: text("relinquished_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    activeIdx: index("gatekeeper_caps_active_idx").on(t.isActive),
    holderIdx: index("gatekeeper_caps_holder_idx").on(t.holderName),
  }),
);

// ---------- gatekeeper_seats ----------
// The Workbench seat — the institutional position that interfaces with The Systems.
// Linked to the cap that grants authorship authority to the seat occupant.
// During normal operations, occupantName === the cap holderName.
// During a succession window, the seat may be held by an interim occupant
// while the cap search is ongoing.
export const gatekeeperSeatsTable = pgTable(
  "gatekeeper_seats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    occupantName: text("occupant_name").notNull(),
    // Which Systems entity this seat primarily interfaces with.
    // e.g. "York-Durham Health Unit — Food Premises Program"
    institutionalContext: text("institutional_context").notNull().default(""),
    // The cap that grants translation authorship to this seat.
    // Null only during the narrow window when a new cap has not yet been assigned.
    capId: uuid("cap_id").references(() => gatekeeperCapsTable.id),
    isActive: boolean("is_active").notNull().default(true),
    isInterim: boolean("is_interim").notNull().default(false),
    occupiedSince: timestamp("occupied_since", { withTimezone: true }).notNull().defaultNow(),
    vacatedAt: timestamp("vacated_at", { withTimezone: true }),
    // How/why the seat was vacated and who it transferred to.
    successionNote: text("succession_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    activeIdx: index("gatekeeper_seats_active_idx").on(t.isActive),
    capIdx: index("gatekeeper_seats_cap_id_idx").on(t.capId),
    occupantIdx: index("gatekeeper_seats_occupant_idx").on(t.occupantName),
  }),
);

// ---------- gatekeeper_mappings ----------
// The translation mappings the cap holder authors and maintains.
// Each row is one Bright Side term → The Systems term pair, tagged by domain
// and sub-domain so the engine can apply only the relevant mappings.
//
// Food domain sub-domains (worked example):
//   wild_game      — wild fish, moose, deer, etc. (elder-certified, seasonal harvest)
//   foraged        — berries, mushrooms, plants harvested from the land
//   fermented      — traditional fermented/preserved foods
//   cultivated     — community gardens, three-sisters planting, etc.
//   processed      — smoked, dried, rendered — traditional preservation methods
//
// Mapping categories mirror The Gate's original five (pragmatism | politics |
// regulations | privacy | banking) but are extended for the food domain:
//   food_safety    — Ontario Food Premises Reg, health-unit-facing language
//   food_sourcing  — supply chain / provenance language for audits
//   food_handling  — preparation, storage, temperature language
export const gatekeeperMappingsTable = pgTable(
  "gatekeeper_mappings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Bright Side / traditional term as used inside the community.
    brightSideTerm: text("bright_side_term").notNull(),
    // The Systems term required by regulators, auditors, or health units.
    systemsTerm: text("systems_term").notNull(),
    // High-level domain: food | land | health | governance | finance
    domain: text("domain").notNull(),
    // More specific category within the domain. For food: food_safety | food_sourcing | food_handling
    // For non-food domains mirrors The Gate: pragmatism | politics | regulations | privacy | banking
    category: text("category").notNull(),
    // Optional sub-domain for food: wild_game | foraged | fermented | cultivated | processed
    subDomain: text("sub_domain"),
    // Full rationale: what regulatory standard or authority requires this substitution.
    rationale: text("rationale").notNull().default(""),
    // The specific regulatory body or standard being satisfied.
    // e.g. "Ontario Food Premises Regulation O. Reg. 493/17, s. 2(1)"
    authority: text("authority").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    // FK to the cap holder who authored this mapping. Preserved even if cap changes hands
    // so history is stable (same denormalization pattern as The Gate's substitutions JSONB).
    authoredByCapId: uuid("authored_by_cap_id").references(() => gatekeeperCapsTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    domainIdx: index("gatekeeper_mappings_domain_idx").on(t.domain),
    categoryIdx: index("gatekeeper_mappings_category_idx").on(t.category),
    activeIdx: index("gatekeeper_mappings_active_idx").on(t.isActive),
    capIdx: index("gatekeeper_mappings_cap_id_idx").on(t.authoredByCapId),
  }),
);

// ---------- gatekeeper_succession_log ----------
// Append-only record of every state change to cap and seat.
// Never updated or deleted — this is the chain of custody.
export const gatekeeperSuccessionLogTable = pgTable(
  "gatekeeper_succession_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // cap_assigned | cap_relinquished | seat_assigned | seat_vacated | mappings_transferred
    eventType: text("event_type").notNull(),
    // Name of the person recording this event.
    actorName: text("actor_name").notNull(),
    // UUID of the cap or seat row this event applies to.
    subjectId: uuid("subject_id").notNull(),
    // "cap" or "seat" — disambiguates which table subjectId references.
    subjectKind: text("subject_kind").notNull(),
    // Human-readable note. Required — no silent record entries.
    note: text("note").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    subjectIdx: index("gatekeeper_succession_log_subject_idx").on(t.subjectId),
    eventTypeIdx: index("gatekeeper_succession_log_event_type_idx").on(t.eventType),
    recordedAtIdx: index("gatekeeper_succession_log_recorded_at_idx").on(t.recordedAt),
  }),
);
