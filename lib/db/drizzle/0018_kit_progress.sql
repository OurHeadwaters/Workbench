CREATE TABLE "kit_progress" (
  "purchase_id" text PRIMARY KEY NOT NULL,
  "visited_modules" text[] NOT NULL DEFAULT '{}',
  "visited_handouts" text[] NOT NULL DEFAULT '{}',
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);