-- River Smith nightly briefing engine.
--
-- Stores one row per generated briefing so the Kitchen Table can
-- display the latest briefing and browse an archive of the last 30 days.
--
-- structured_json holds the parsed sections (Eagle's Summary, Waters That
-- Moved, Decisions Needed, For Awareness, Gord's Quiet Note) plus the
-- list of items stripped by the safety gates so Bobbie can review them.
--
-- status:       draft | published
-- triggered_by: scheduled | manual
CREATE TABLE "river_briefings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_markdown" text NOT NULL,
	"structured_json" jsonb,
	"status" text DEFAULT 'published' NOT NULL,
	"triggered_by" text DEFAULT 'scheduled' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "river_briefings_generated_at_idx" ON "river_briefings" USING btree ("generated_at");
--> statement-breakpoint
CREATE INDEX "river_briefings_status_idx" ON "river_briefings" USING btree ("status");
