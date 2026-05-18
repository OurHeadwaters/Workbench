import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

/**
 * odyssey_artwork — community-contributed art shown along the Odyssey trail.
 *
 * Concept: "pebbles left for the next person." Artists from the communities
 * this journey passes through submit work; approved pieces become the
 * default image for a story context and stay viewable in the gallery.
 * XRPL addresses allow tip-the-artist via community tokens.
 *
 * storyContext format: "odyssey" | "odyssey:phase:01" | "handbook:station:01"
 * status: "pending" | "approved" | "rejected"
 */
export const odysseyArtworkTable = pgTable(
  "odyssey_artwork",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /* Artist */
    artistName:         text("artist_name").notNull(),
    artistLocation:     text("artist_location"),
    artistNation:       text("artist_nation"),
    artistStatement:    text("artist_statement"),
    artistContact:      text("artist_contact"),
    artistXrplAddress:  text("artist_xrpl_address"),

    /* Artwork */
    title:              text("title"),
    imageStorageKey:    text("image_storage_key").notNull(),
    imageAltText:       text("image_alt_text"),
    medium:             text("medium"),

    /* Placement */
    storyContext:       text("story_context").notNull().default("odyssey"),
    sortOrder:          integer("sort_order").notNull().default(0),
    isDefault:          boolean("is_default").notNull().default(false),

    /* Moderation */
    status:             text("status").notNull().default("pending"),
    approvedAt:         timestamp("approved_at", { withTimezone: true }),
    approvedBy:         text("approved_by"),
    rejectionReason:    text("rejection_reason"),

    /* Tips — tallied off-chain; XRPL transactions verified separately */
    tipCount:           integer("tip_count").notNull().default(0),

    submittedAt:        timestamp("submitted_at", { withTimezone: true })
                          .notNull()
                          .defaultNow(),
  },
  (table) => ({
    storyContextIdx:  index("odyssey_artwork_story_context_idx").on(table.storyContext),
    statusIdx:        index("odyssey_artwork_status_idx").on(table.status),
    isDefaultIdx:     index("odyssey_artwork_is_default_idx").on(table.isDefault),
    submittedAtIdx:   index("odyssey_artwork_submitted_at_idx").on(table.submittedAt),
  }),
);

export type OdysseyArtworkRow     = typeof odysseyArtworkTable.$inferSelect;
export type InsertOdysseyArtwork  = typeof odysseyArtworkTable.$inferInsert;
