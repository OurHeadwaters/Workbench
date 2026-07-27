-- Add proof_of_work column to river_briefings.
--
-- Stores the structured proof-of-work block computed at generation time,
-- capturing what changed vs. the previous briefing (changed fields, summary,
-- previous snapshot hash). Nullable so existing rows are unaffected.
ALTER TABLE "river_briefings" ADD COLUMN "proof_of_work" jsonb;
