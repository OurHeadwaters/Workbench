import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const communityIntakeTable = pgTable(
  "community_intake",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    community: text("community").notNull(),
    role: text("role"),
    whatTheyNeed: text("what_they_need").notNull(),
    status: text("status").notNull().default("new"),
    notificationStatus: text("notification_status"),
    notificationError: text("notification_error"),
    sourceIp: text("source_ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("community_intake_created_at_idx").on(table.createdAt),
  }),
);

export type CommunityIntakeRow = typeof communityIntakeTable.$inferSelect;
export type InsertCommunityIntakeRow = typeof communityIntakeTable.$inferInsert;
