CREATE TABLE "rate_limits" (
  "key" text PRIMARY KEY NOT NULL,
  "count" integer DEFAULT 1 NOT NULL,
  "reset_at" bigint NOT NULL
);
