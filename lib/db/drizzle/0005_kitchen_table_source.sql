-- Kitchen Table source tagging.
--
-- Adds source + source_ref columns to deadhead_items and project_tasks so
-- every item dropped via "put it on the kitchen table" carries provenance
-- back to the artifact it came from.
--
-- Existing rows are backfilled with source='unknown' so the table view
-- never shows a NULL.
ALTER TABLE "project_tasks" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "source_ref" text;--> statement-breakpoint
ALTER TABLE "deadhead_items" ADD COLUMN "source" text NOT NULL DEFAULT 'unknown';--> statement-breakpoint
ALTER TABLE "deadhead_items" ADD COLUMN "source_ref" text;--> statement-breakpoint
CREATE INDEX "deadhead_items_source_idx" ON "deadhead_items" USING btree ("source");--> statement-breakpoint
CREATE INDEX "project_tasks_source_idx" ON "project_tasks" USING btree ("source");
