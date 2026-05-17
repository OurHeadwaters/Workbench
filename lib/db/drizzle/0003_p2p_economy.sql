-- P2P Community Economy Engine schema additions
-- Adds: hh_tips, hh_referrals tables, and wallet/referral columns to hh_members
--> statement-breakpoint
CREATE TABLE "hh_tips" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "band_id" uuid NOT NULL,
        "from_member_id" uuid NOT NULL,
        "to_member_id" uuid NOT NULL,
        "amount" numeric(18, 6) NOT NULL,
        "currency" text DEFAULT 'token' NOT NULL,
        "note" text DEFAULT '' NOT NULL,
        "xrpl_tx_hash" text,
        "sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_referrals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "band_id" uuid NOT NULL,
        "referrer_id" uuid NOT NULL,
        "referred_member_id" uuid NOT NULL,
        "referrer_bonus_amount" numeric(18, 6) DEFAULT '5' NOT NULL,
        "referred_bonus_amount" numeric(18, 6) DEFAULT '5' NOT NULL,
        "currency" text DEFAULT 'token' NOT NULL,
        "awarded_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "hh_referrals_referred_member_id_unique" UNIQUE("referred_member_id")
);
--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "wallet_type" text DEFAULT 'custodial' NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "wallet_revealed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "referred_by_member_id" uuid;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_from_member_id_hh_members_id_fk" FOREIGN KEY ("from_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_to_member_id_hh_members_id_fk" FOREIGN KEY ("to_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_referrer_id_hh_members_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_referred_member_id_hh_members_id_fk" FOREIGN KEY ("referred_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hh_members_referral_code_idx" ON "hh_members" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "hh_tips_from_member_id_idx" ON "hh_tips" USING btree ("from_member_id");--> statement-breakpoint
CREATE INDEX "hh_tips_to_member_id_idx" ON "hh_tips" USING btree ("to_member_id");--> statement-breakpoint
CREATE INDEX "hh_tips_band_id_idx" ON "hh_tips" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_referrals_referrer_id_idx" ON "hh_referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "hh_referrals_band_id_idx" ON "hh_referrals" USING btree ("band_id");
