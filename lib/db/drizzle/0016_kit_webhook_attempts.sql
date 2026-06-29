CREATE TABLE "kit_webhook_attempts" (
	"event_id" text PRIMARY KEY NOT NULL,
	"kit_id" text NOT NULL,
	"buyer_email" text NOT NULL,
	"purchase_id" text NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL,
	"last_attempt_at" timestamp with time zone DEFAULT now() NOT NULL
);
