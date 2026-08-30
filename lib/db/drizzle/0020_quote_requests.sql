CREATE TABLE IF NOT EXISTS "quote_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "quote_number" text NOT NULL,
  "contact_name" text NOT NULL,
  "email" text NOT NULL,
  "role" text,
  "legal_organization_name" text NOT NULL,
  "organization_type" text NOT NULL,
  "organization_address" text NOT NULL,
  "project_title" text NOT NULL,
  "funding_program" text NOT NULL,
  "desired_timing" text NOT NULL,
  "selected_offer" text NOT NULL,
  "project_description" text NOT NULL,
  "special_requirements" text,
  "mode" text NOT NULL,
  "subtotal_cents" integer,
  "tax_cents" integer,
  "total_cents" integer,
  "valid_until" timestamp with time zone,
  "customer_delivery_status" text,
  "customer_delivery_error" text,
  "operator_delivery_status" text,
  "operator_delivery_error" text,
  "source_ip" text,
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "quote_requests_quote_number_idx"
  ON "quote_requests" USING btree ("quote_number");