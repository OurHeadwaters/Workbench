-- app_settings — owner-managed key/value configuration store.
--
-- Used to persist runtime-configurable settings that should not require
-- a server environment variable change. The initial use-case is
-- river_smith_notify_email, which lets Bobbie update her briefing
-- delivery address from the Kitchen Table without touching secrets.
--
-- key:        unique setting name (e.g. "river_smith_notify_email")
-- value:      plain-text value
-- updated_at: last-write timestamp
CREATE TABLE "app_settings" (
        "key" text PRIMARY KEY NOT NULL,
        "value" text NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
