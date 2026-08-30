CREATE TABLE IF NOT EXISTS "engagement_tenant_integration_configs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_opaque_id" text NOT NULL,
  "integration" text DEFAULT 'z3' NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "allowed_event_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "allowed_payload_fields" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "approved_by" text,
  "approved_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "engagement_tenant_integration_unique"
  ON "engagement_tenant_integration_configs" ("tenant_opaque_id", "integration");