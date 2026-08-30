ALTER TABLE "engagement_tenant_integration_configs"
  ADD COLUMN IF NOT EXISTS "allowed_outbound_event_types" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "engagement_tenant_integration_configs"
  ADD COLUMN IF NOT EXISTS "outbound_endpoint_url" text;
ALTER TABLE "engagement_tenant_integration_configs"
  ADD COLUMN IF NOT EXISTS "outbound_secret_env_name" text;