CREATE TABLE "contributors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"organization" text,
	"email" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curator_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"curator_id" uuid NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "curator_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "curators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	"is_owner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "curators_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "entry_buckets" (
	"entry_id" uuid NOT NULL,
	"bucket_id" uuid NOT NULL,
	CONSTRAINT "entry_buckets_entry_id_bucket_id_pk" PRIMARY KEY("entry_id","bucket_id")
);
--> statement-breakpoint
CREATE TABLE "entry_subjects" (
	"entry_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	CONSTRAINT "entry_subjects_entry_id_subject_id_pk" PRIMARY KEY("entry_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "library_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"notes" text,
	"status" text DEFAULT 'published' NOT NULL,
	"source_url" text,
	"screenshot_url" text,
	"screenshot_object_path" text,
	"storage_ref" text,
	"content_hash" text,
	"file_size" integer,
	"content_type" text,
	"original_filename" text,
	"file_type" text,
	"contact_info" jsonb,
	"prices" jsonb,
	"dates" jsonb,
	"geography" jsonb,
	"status_flag" text,
	"producer_id" uuid,
	"contributor_id" uuid,
	"created_by_curator_id" uuid,
	"updated_by_curator_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"kind" text,
	"description" text,
	"website_url" text,
	"screenshot_url" text,
	"contact_email" text,
	"contact_phone" text,
	"location" text,
	"status_flag" text,
	"status_notes" text,
	"substitute_for_producer_slug" text,
	"created_by_curator_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_buckets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "share_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"label" text,
	"contributor_id" uuid NOT NULL,
	"preset_subject_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preset_bucket_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_by_curator_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "share_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "financial_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	"watershed_arr" integer NOT NULL,
	"owner_take_home" integer NOT NULL,
	"portfolio_value" integer NOT NULL,
	"xrp_balance" integer NOT NULL,
	"xrp_price_usd" numeric(12, 4) NOT NULL,
	"annual_living_expenses" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "bk_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"normal_side" text NOT NULL,
	"cost_centre_code" text,
	"mirror_account_code" text,
	"notes" text,
	"tax_code" text DEFAULT 'none' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"actor_id" uuid,
	"actor_email" text NOT NULL,
	"actor_role" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_cost_centres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"parent_entity" text NOT NULL,
	"owner" text,
	"description" text,
	"color" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_inventory_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid,
	"transaction_id" uuid,
	"cost_centre_code" text NOT NULL,
	"item_sku" text,
	"item_name" text NOT NULL,
	"quantity" numeric(14, 4) NOT NULL,
	"unit" text,
	"occurred_on" date NOT NULL,
	"vendor" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_receipt_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"original_filename" text NOT NULL,
	"content_type" text NOT NULL,
	"file_size" integer,
	"storage_ref" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"cost_centre_code" text NOT NULL,
	"suggested_account_code" text,
	"occurred_on" date NOT NULL,
	"vendor" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"description" text NOT NULL,
	"notes" text,
	"item_sku" text,
	"item_name" text,
	"quantity" numeric(14, 4),
	"unit" text,
	"rejected_reason" text,
	"approved_transaction_id" uuid,
	"decided_at" timestamp with time zone,
	"decided_by_id" uuid,
	"decided_by_email" text,
	"submitted_by_id" uuid,
	"submitted_by_email" text NOT NULL,
	"submitted_by_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_transaction_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"account_code" text NOT NULL,
	"cost_centre_code" text,
	"memo" text,
	"tax_code" text,
	"debit" numeric(14, 2) DEFAULT 0 NOT NULL,
	"credit" numeric(14, 2) DEFAULT 0 NOT NULL,
	"line_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bk_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"posted_date" date NOT NULL,
	"description" text NOT NULL,
	"reference" text,
	"status" text DEFAULT 'posted' NOT NULL,
	"voided_reason" text,
	"voided_at" timestamp with time zone,
	"reverses_transaction_id" uuid,
	"source_submission_id" uuid,
	"created_by_id" uuid,
	"created_by_email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cleared" boolean DEFAULT false NOT NULL,
	"cleared_at" timestamp with time zone,
	"cleared_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "bk_app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"role" text DEFAULT 'food_handler' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	"last_nudged_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "wordpile_deletions" (
	"clerk_user_id" text NOT NULL,
	"kind" text NOT NULL,
	"id" uuid NOT NULL,
	"deleted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wordpile_deletions_clerk_user_id_kind_id_pk" PRIMARY KEY("clerk_user_id","kind","id"),
	CONSTRAINT "wordpile_deletions_kind_check" CHECK ("wordpile_deletions"."kind" IN ('pile', 'word'))
);
--> statement-breakpoint
CREATE TABLE "wordpile_piles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"build_votes_stacker" integer DEFAULT 0 NOT NULL,
	"build_votes_blocks" integer DEFAULT 0 NOT NULL,
	"build_votes_planks" integer DEFAULT 0 NOT NULL,
	"build_votes_last_choice" text,
	"build_votes_updated_at" timestamp with time zone DEFAULT 'epoch'::timestamptz NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wordpile_short_links" (
	"slug" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"pile_id" uuid,
	"pile_name" text DEFAULT '' NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wordpile_words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pile_id" uuid NOT NULL,
	"word" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"bucket" text DEFAULT 'unsorted' NOT NULL,
	"safer_alternative" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ship_manifest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"org" text,
	"role" text,
	"would_bring" text,
	"would_want" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notification_status" text,
	"reply_status" text,
	"notification_error" text,
	"reply_error" text,
	"source_ip" text,
	"user_agent" text,
	"source" text,
	CONSTRAINT "ship_manifest_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "deadhead_flush_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flushed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"count" integer NOT NULL,
	"proposed_count_before" integer NOT NULL,
	"flush_batch_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deadhead_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_task_id" text NOT NULL,
	"title" text NOT NULL,
	"original_created_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"flushed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"flush_batch_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'proposed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_intake" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"community" text NOT NULL,
	"role" text,
	"what_they_need" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notification_status" text,
	"notification_error" text,
	"source_ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sarge_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_id" uuid NOT NULL,
	"priority_id" text NOT NULL,
	"priority_label" text NOT NULL,
	"action" text NOT NULL,
	"context" text,
	"status" text DEFAULT 'active' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"barrier_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sarge_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_of" text NOT NULL,
	"priorities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"locked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcontract_submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project" text NOT NULL,
	"submitted_by" text NOT NULL,
	"work_date" text NOT NULL,
	"scope_item" text NOT NULL,
	"description" text NOT NULL,
	"hours" numeric(6, 2),
	"rate_per_hour" numeric(8, 2),
	"expense_description" text,
	"expense_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"object_path" text NOT NULL,
	"content_type" text DEFAULT 'image/jpeg' NOT NULL,
	"size_bytes" integer,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_object_path_unique" UNIQUE("object_path")
);
--> statement-breakpoint
CREATE TABLE "pgv2_section_overrides" (
	"section_id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"community_token_code" text DEFAULT 'HWBAND' NOT NULL,
	"community_token_issuer" text,
	"default_pay_currency" text DEFAULT 'token' NOT NULL,
	"missed_shift_threshold" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"currency" text NOT NULL,
	"xrpl_tx_hash" text,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"clerk_user_id" text,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"xrpl_address" text,
	"did_ref" text,
	"tier" text DEFAULT 'task_based' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"missed_shift_count" integer DEFAULT 0 NOT NULL,
	"flagged_for_demotion" boolean DEFAULT false NOT NULL,
	"total_earned_xrp" numeric(18, 6) DEFAULT '0' NOT NULL,
	"total_earned_token" numeric(18, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hh_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"band_id" uuid NOT NULL,
	"posted_by_member_id" uuid NOT NULL,
	"claimed_by_member_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimated_minutes" integer DEFAULT 60 NOT NULL,
	"pay_amount" numeric(18, 6) NOT NULL,
	"pay_currency" text DEFAULT 'token' NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"escrow_sequence" integer,
	"escrow_tx_hash" text,
	"claimed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"available_date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "curator_sessions" ADD CONSTRAINT "curator_sessions_curator_id_curators_id_fk" FOREIGN KEY ("curator_id") REFERENCES "public"."curators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_buckets" ADD CONSTRAINT "entry_buckets_entry_id_library_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."library_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_buckets" ADD CONSTRAINT "entry_buckets_bucket_id_project_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "public"."project_buckets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_subjects" ADD CONSTRAINT "entry_subjects_entry_id_library_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."library_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_subjects" ADD CONSTRAINT "entry_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_contributor_id_contributors_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."contributors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_created_by_curator_id_curators_id_fk" FOREIGN KEY ("created_by_curator_id") REFERENCES "public"."curators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_entries" ADD CONSTRAINT "library_entries_updated_by_curator_id_curators_id_fk" FOREIGN KEY ("updated_by_curator_id") REFERENCES "public"."curators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers" ADD CONSTRAINT "producers_created_by_curator_id_curators_id_fk" FOREIGN KEY ("created_by_curator_id") REFERENCES "public"."curators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_contributor_id_contributors_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."contributors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_created_by_curator_id_curators_id_fk" FOREIGN KEY ("created_by_curator_id") REFERENCES "public"."curators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordpile_words" ADD CONSTRAINT "wordpile_words_pile_id_wordpile_piles_id_fk" FOREIGN KEY ("pile_id") REFERENCES "public"."wordpile_piles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sarge_cards" ADD CONSTRAINT "sarge_cards_week_id_sarge_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."sarge_weeks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_earnings" ADD CONSTRAINT "hh_earnings_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_earnings" ADD CONSTRAINT "hh_earnings_member_id_hh_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_earnings" ADD CONSTRAINT "hh_earnings_task_id_hh_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."hh_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_members" ADD CONSTRAINT "hh_members_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tasks" ADD CONSTRAINT "hh_tasks_band_id_hh_bands_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."hh_bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tasks" ADD CONSTRAINT "hh_tasks_posted_by_member_id_hh_members_id_fk" FOREIGN KEY ("posted_by_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hh_tasks" ADD CONSTRAINT "hh_tasks_claimed_by_member_id_hh_members_id_fk" FOREIGN KEY ("claimed_by_member_id") REFERENCES "public"."hh_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "curator_sessions_token_idx" ON "curator_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "curator_sessions_curator_idx" ON "curator_sessions" USING btree ("curator_id");--> statement-breakpoint
CREATE INDEX "entry_buckets_bucket_idx" ON "entry_buckets" USING btree ("bucket_id");--> statement-breakpoint
CREATE INDEX "entry_subjects_subject_idx" ON "entry_subjects" USING btree ("subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "library_entries_content_hash_idx" ON "library_entries" USING btree ("content_hash") WHERE "library_entries"."content_hash" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "library_entries_status_idx" ON "library_entries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "library_entries_kind_idx" ON "library_entries" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "library_entries_created_at_idx" ON "library_entries" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "bk_accounts_code_idx" ON "bk_accounts" USING btree ("code");--> statement-breakpoint
CREATE INDEX "bk_accounts_cost_centre_idx" ON "bk_accounts" USING btree ("cost_centre_code");--> statement-breakpoint
CREATE INDEX "bk_audit_log_created_at_idx" ON "bk_audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "bk_audit_log_entity_idx" ON "bk_audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bk_cost_centres_code_idx" ON "bk_cost_centres" USING btree ("code");--> statement-breakpoint
CREATE INDEX "bk_inventory_receipts_submission_idx" ON "bk_inventory_receipts" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "bk_inventory_receipts_transaction_idx" ON "bk_inventory_receipts" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "bk_receipt_attachments_submission_idx" ON "bk_receipt_attachments" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "bk_submissions_status_idx" ON "bk_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bk_submissions_submitted_by_idx" ON "bk_submissions" USING btree ("submitted_by_id");--> statement-breakpoint
CREATE INDEX "bk_submissions_cost_centre_idx" ON "bk_submissions" USING btree ("cost_centre_code");--> statement-breakpoint
CREATE INDEX "bk_transaction_lines_transaction_idx" ON "bk_transaction_lines" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "bk_transaction_lines_account_idx" ON "bk_transaction_lines" USING btree ("account_code");--> statement-breakpoint
CREATE INDEX "bk_transaction_lines_cost_centre_idx" ON "bk_transaction_lines" USING btree ("cost_centre_code");--> statement-breakpoint
CREATE INDEX "bk_transactions_posted_date_idx" ON "bk_transactions" USING btree ("posted_date");--> statement-breakpoint
CREATE INDEX "bk_transactions_status_idx" ON "bk_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bk_transactions_reverses_idx" ON "bk_transactions" USING btree ("reverses_transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bk_app_users_clerk_user_id_idx" ON "bk_app_users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "bk_app_users_email_idx" ON "bk_app_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "wordpile_deletions_owner_idx" ON "wordpile_deletions" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "wordpile_piles_owner_idx" ON "wordpile_piles" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "wordpile_short_links_owner_idx" ON "wordpile_short_links" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "wordpile_words_pile_idx" ON "wordpile_words" USING btree ("pile_id");--> statement-breakpoint
CREATE INDEX "ship_manifest_created_at_idx" ON "ship_manifest" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "deadhead_flush_log_flushed_at_idx" ON "deadhead_flush_log" USING btree ("flushed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "deadhead_items_original_task_id_unique" ON "deadhead_items" USING btree ("original_task_id");--> statement-breakpoint
CREATE INDEX "deadhead_items_status_idx" ON "deadhead_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deadhead_items_flushed_at_idx" ON "deadhead_items" USING btree ("flushed_at");--> statement-breakpoint
CREATE INDEX "deadhead_items_batch_idx" ON "deadhead_items" USING btree ("flush_batch_id");--> statement-breakpoint
CREATE INDEX "project_tasks_status_idx" ON "project_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_tasks_created_at_idx" ON "project_tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "community_intake_created_at_idx" ON "community_intake" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "sarge_cards_week_id_idx" ON "sarge_cards" USING btree ("week_id");--> statement-breakpoint
CREATE INDEX "sarge_cards_status_idx" ON "sarge_cards" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sarge_cards_priority_id_idx" ON "sarge_cards" USING btree ("priority_id");--> statement-breakpoint
CREATE INDEX "sarge_weeks_week_of_idx" ON "sarge_weeks" USING btree ("week_of");--> statement-breakpoint
CREATE INDEX "subcontract_submission_project_idx" ON "subcontract_submission" USING btree ("project");--> statement-breakpoint
CREATE INDEX "subcontract_submission_created_at_idx" ON "subcontract_submission" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_assets_uploaded_at_idx" ON "media_assets" USING btree ("uploaded_at");--> statement-breakpoint
CREATE INDEX "hh_earnings_member_id_idx" ON "hh_earnings" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "hh_earnings_band_id_idx" ON "hh_earnings" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_members_band_id_idx" ON "hh_members" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_members_clerk_user_id_idx" ON "hh_members" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "hh_tasks_band_id_idx" ON "hh_tasks" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "hh_tasks_status_idx" ON "hh_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hh_tasks_available_date_idx" ON "hh_tasks" USING btree ("available_date");