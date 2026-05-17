CREATE TABLE "hh_badge_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"domain" text DEFAULT 'knowledge' NOT NULL,
	"stage_model" text DEFAULT 'four_stage' NOT NULL,
	"rate_modifier_enabled" boolean DEFAULT false NOT NULL,
	"proposed_by_member_id" uuid,
	"status" text DEFAULT 'proposed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_member_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"stage" text DEFAULT 'watching' NOT NULL,
	"issued_by_member_id" uuid,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
ALTER TABLE "hh_members" ADD COLUMN "wallet_type" text DEFAULT 'custodial' NOT NULL;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "wallet_revealed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "hh_members" ADD COLUMN "referred_by_member_id" uuid;--> statement-breakpoint
ALTER TABLE "hh_badge_categories" ADD CONSTRAINT "hh_badge_categories_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_badge_categories" ADD CONSTRAINT "hh_badge_categories_proposed_by_member_id_hh_members_id_fk" FOREIGN KEY ("proposed_by_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_member_badges" ADD CONSTRAINT "hh_member_badges_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_member_badges" ADD CONSTRAINT "hh_member_badges_member_id_hh_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_member_badges" ADD CONSTRAINT "hh_member_badges_category_id_hh_badge_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."hh_badge_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_member_badges" ADD CONSTRAINT "hh_member_badges_issued_by_member_id_hh_members_id_fk" FOREIGN KEY ("issued_by_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_referrer_id_hh_members_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_referrals" ADD CONSTRAINT "hh_referrals_referred_member_id_hh_members_id_fk" FOREIGN KEY ("referred_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_from_member_id_hh_members_id_fk" FOREIGN KEY ("from_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tips" ADD CONSTRAINT "hh_tips_to_member_id_hh_members_id_fk" FOREIGN KEY ("to_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hh_badge_cats_band_id_idx" ON "hh_badge_categories" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_badge_cats_status_idx" ON "hh_badge_categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hh_member_badges_member_id_idx" ON "hh_member_badges" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "hh_member_badges_category_id_idx" ON "hh_member_badges" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "hh_member_badges_band_id_idx" ON "hh_member_badges" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_member_badges_member_cat_uniq_idx" ON "hh_member_badges" USING btree ("member_id","category_id");--> statement-breakpoint
CREATE INDEX "hh_referrals_referrer_id_idx" ON "hh_referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "hh_referrals_band_id_idx" ON "hh_referrals" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_tips_from_member_id_idx" ON "hh_tips" USING btree ("from_member_id");--> statement-breakpoint
CREATE INDEX "hh_tips_to_member_id_idx" ON "hh_tips" USING btree ("to_member_id");--> statement-breakpoint
CREATE INDEX "hh_tips_band_id_idx" ON "hh_tips" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_members_referral_code_idx" ON "hh_members" USING btree ("referral_code");--> statement-breakpoint
ALTER TABLE "hh_members" ADD CONSTRAINT "hh_members_referral_code_unique" UNIQUE("referral_code");