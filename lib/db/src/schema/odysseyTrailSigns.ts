import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

/**
 * odyssey_trail_signs — the Headwaters Odyssey sponsor registry.
 *
 * Concept: "signs on the trail." When a user is in a zone or working on a
 * topic that maps to a known problem, they encounter a contextual trail sign —
 * a practical, low-cost, community-vetted tool recommendation. Sponsors earn
 * placement by proving value first, not by paying upfront.
 *
 * zoneTags: comma-separated zone IDs ("Z1", "Z2", "Z3", "Z4", or "any")
 * topicTags: comma-separated keywords ("finance", "planning", "triage", …)
 * costTier: "free" | "$" | "$$" | "$$$"
 * status: "pending" | "approved" | "rejected"
 */
export const odysseyTrailSignsTable = pgTable(
  "odyssey_trail_signs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    toolName:         text("tool_name").notNull(),
    problemStatement: text("problem_statement").notNull(),
    costTier:         text("cost_tier").notNull().default("free"),
    actionUrl:        text("action_url").notNull(),
    actionLabel:      text("action_label").notNull().default("Take a look"),
    communityProof:   text("community_proof"),

    zoneTags:         text("zone_tags").notNull().default("any"),
    topicTags:        text("topic_tags").notNull().default(""),

    status:           text("status").notNull().default("pending"),
    approvedAt:       timestamp("approved_at", { withTimezone: true }),
    approvedBy:       text("approved_by"),
    rejectionReason:  text("rejection_reason"),

    submitterName:    text("submitter_name"),
    submitterEmail:   text("submitter_email"),
    submitterNote:    text("submitter_note"),

    submittedAt:      timestamp("submitted_at", { withTimezone: true })
                        .notNull()
                        .defaultNow(),
    updatedAt:        timestamp("updated_at", { withTimezone: true })
                        .notNull()
                        .defaultNow(),
  },
  (table) => ({
    statusIdx:    index("odyssey_trail_signs_status_idx").on(table.status),
    zoneTagsIdx:  index("odyssey_trail_signs_zone_tags_idx").on(table.zoneTags),
  }),
);

export type OdysseyTrailSignRow    = typeof odysseyTrailSignsTable.$inferSelect;
export type InsertOdysseyTrailSign = typeof odysseyTrailSignsTable.$inferInsert;
