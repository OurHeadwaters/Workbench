import { pgTable, text, uuid, timestamp, integer, index } from "drizzle-orm/pg-core";

export const mediaAssetsTable = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    objectPath: text("object_path").notNull().unique(),
    contentType: text("content_type").notNull().default("image/jpeg"),
    sizeBytes: integer("size_bytes"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_assets_uploaded_at_idx").on(t.uploadedAt)],
);
