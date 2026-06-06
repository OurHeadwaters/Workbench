CREATE TABLE "kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"content_outline" jsonb,
	"codetry_result" jsonb,
	"payment_rails" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"stripe_product_id" text,
	"stripe_price_id" text,
	"stripe_account_id" text,
	"stripe_checkout_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practitioner_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"community" text NOT NULL,
	"doctrine_summary" text NOT NULL,
	"contact_email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"stripe_account_id" text,
	"clerk_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kits_owner_id_idx" ON "kits" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "kits_status_idx" ON "kits" USING btree ("status");--> statement-breakpoint
CREATE INDEX "practitioner_applications_status_idx" ON "practitioner_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "practitioner_applications_email_idx" ON "practitioner_applications" USING btree ("contact_email");