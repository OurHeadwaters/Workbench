import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pgv2SectionOverridesTable = pgTable("pgv2_section_overrides", {
  sectionId: text("section_id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
