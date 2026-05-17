CREATE TABLE "hh_bonuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"currency" text NOT NULL,
	"reason" text NOT NULL,
	"milestone" integer NOT NULL,
	"awarded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_envelope_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"envelope_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"merchant_id" uuid NOT NULL,
	"band_id" uuid NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"currency" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"xrpl_tx_hash" text,
	"spent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_envelopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"band_id" uuid NOT NULL,
	"label" text NOT NULL,
	"icon" text DEFAULT 'wallet' NOT NULL,
	"currency" text DEFAULT 'token' NOT NULL,
	"monthly_budget" numeric(18, 6) DEFAULT '0' NOT NULL,
	"spent_this_month" numeric(18, 6) DEFAULT '0' NOT NULL,
	"spent_month" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_merchants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"merchant_wallet" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hh_bands" ADD COLUMN "reliability_bonus_threshold" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_bands" ADD COLUMN "reliability_bonus_amount" numeric(18, 6) DEFAULT '5' NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_bands" ADD COLUMN "reliability_bonus_currency" text DEFAULT 'token' NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "completed_shift_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "no_show_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_bonuses" ADD CONSTRAINT "hh_bonuses_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_bonuses" ADD CONSTRAINT "hh_bonuses_member_id_hh_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelope_transactions" ADD CONSTRAINT "hh_envelope_transactions_envelope_id_hh_envelopes_id_fk" FOREIGN KEY ("envelope_id") REFERENCES "public"."hh_envelopes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelope_transactions" ADD CONSTRAINT "hh_envelope_transactions_member_id_hh_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelope_transactions" ADD CONSTRAINT "hh_envelope_transactions_merchant_id_hh_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."hh_merchants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelope_transactions" ADD CONSTRAINT "hh_envelope_transactions_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelopes" ADD CONSTRAINT "hh_envelopes_member_id_hh_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_envelopes" ADD CONSTRAINT "hh_envelopes_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_merchants" ADD CONSTRAINT "hh_merchants_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hh_bonuses_member_id_idx" ON "hh_bonuses" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "hh_bonuses_band_id_idx" ON "hh_bonuses" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_env_txn_envelope_id_idx" ON "hh_envelope_transactions" USING btree ("envelope_id");--> statement-breakpoint
CREATE INDEX "hh_env_txn_member_id_idx" ON "hh_envelope_transactions" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "hh_env_txn_band_id_idx" ON "hh_envelope_transactions" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_envelopes_member_id_idx" ON "hh_envelopes" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "hh_envelopes_band_id_idx" ON "hh_envelopes" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_merchants_band_id_idx" ON "hh_merchants" USING btree ("band_id");