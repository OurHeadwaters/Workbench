CREATE TABLE "kit_delivery_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_email" text NOT NULL,
	"kit_id" text NOT NULL,
	"purchase_id" text NOT NULL,
	"error" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kit_delivery_failures_purchase_id_idx" ON "kit_delivery_failures" USING btree ("purchase_id");
--> statement-breakpoint
CREATE INDEX "kit_delivery_failures_resolved_at_idx" ON "kit_delivery_failures" USING btree ("resolved_at");
--> statement-breakpoint
CREATE INDEX "kit_delivery_failures_buyer_email_idx" ON "kit_delivery_failures" USING btree ("buyer_email");
