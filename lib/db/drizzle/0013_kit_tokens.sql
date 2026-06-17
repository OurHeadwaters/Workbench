CREATE TABLE "kit_tokens" (
  "token" text PRIMARY KEY NOT NULL,
  "kit_id" text NOT NULL,
  "buyer_email" text NOT NULL,
  "buyer_name" text NOT NULL,
  "purchase_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_processed_events" (
  "event_id" text PRIMARY KEY NOT NULL,
  "processed_at" timestamp with time zone DEFAULT now() NOT NULL,
  "purchase_id" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kit_tokens_buyer_email_idx" ON "kit_tokens" USING btree ("buyer_email");
--> statement-breakpoint
CREATE INDEX "kit_tokens_expires_at_idx" ON "kit_tokens" USING btree ("expires_at");
--> statement-breakpoint
CREATE INDEX "kit_tokens_kit_id_idx" ON "kit_tokens" USING btree ("kit_id");
