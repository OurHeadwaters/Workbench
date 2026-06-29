ALTER TABLE "kit_webhook_attempts" ADD COLUMN "resolved_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "kit_webhook_attempts_resolved_at_idx" ON "kit_webhook_attempts" USING btree ("resolved_at");
