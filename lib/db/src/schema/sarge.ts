import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Types stored in JSONB columns ───────────────────────────────────────────

export type SargePriority = {
  id: string;
  label: string;
  order: number;
  isActive: boolean;
};

// ─── sarge_weeks ─────────────────────────────────────────────────────────────
//
// One row per planning week. weekOf is an ISO week string e.g. "2026-W18".
// priorities is an ordered list of what Bobbie is focused on this week.
// isLocked becomes true after she confirms the week and sends cards to mobile.

export const sargeWeeksTable = pgTable(
  "sarge_weeks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    weekOf: text("week_of").notNull(),
    priorities: jsonb("priorities")
      .notNull()
      .$type<SargePriority[]>()
      .default([]),
    isLocked: boolean("is_locked").notNull().default(false),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    weekOfIdx: index("sarge_weeks_week_of_idx").on(t.weekOf),
  }),
);

export type SargeWeekRow = typeof sargeWeeksTable.$inferSelect;
export type InsertSargeWeek = typeof sargeWeeksTable.$inferInsert;

// ─── sarge_cards ─────────────────────────────────────────────────────────────
//
// One row per action card. Cards belong to a week and to a priority bucket.
// status: active | done | stuck
// order is the display order within the week (lower = shown first).
// barrierNote is filled when status = stuck.

export const sargeCardsTable = pgTable(
  "sarge_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    weekId: uuid("week_id")
      .notNull()
      .references(() => sargeWeeksTable.id),
    priorityId: text("priority_id").notNull(),
    priorityLabel: text("priority_label").notNull(),
    action: text("action").notNull(),
    context: text("context"),
    status: text("status").notNull().default("active"),
    order: integer("order").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    barrierNote: text("barrier_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    weekIdx: index("sarge_cards_week_id_idx").on(t.weekId),
    statusIdx: index("sarge_cards_status_idx").on(t.status),
    priorityIdx: index("sarge_cards_priority_id_idx").on(t.priorityId),
  }),
);

export type SargeCardRow = typeof sargeCardsTable.$inferSelect;
export type InsertSargeCard = typeof sargeCardsTable.$inferInsert;
