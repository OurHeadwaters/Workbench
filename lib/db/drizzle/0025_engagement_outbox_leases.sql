ALTER TABLE "engagement_integration_outbox" ADD COLUMN IF NOT EXISTS "claimed_at" timestamp with time zone;
ALTER TABLE "engagement_integration_outbox" ADD COLUMN IF NOT EXISTS "lease_expires_at" timestamp with time zone;
ALTER TABLE "engagement_integration_outbox" ADD COLUMN IF NOT EXISTS "next_attempt_at" timestamp with time zone;