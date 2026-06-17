/**
 * kitTokensCleanup — daily purge of expired kit purchase tokens.
 *
 * Each kit token has a 30-day expiry. Without a cleanup job the kit_tokens
 * table grows indefinitely and full-table scans on the buyer_email index
 * become expensive. This scheduler deletes rows where expires_at < NOW()
 * once per day at 03:15 local time, well clear of the 23:45 River Smith run.
 */

import { logger } from "./logger";
import { db, kitTokensTable } from "@workspace/db";
import { lt, sql } from "drizzle-orm";
import { sendKitTokensCleanupFailureEmail } from "./riverSmithMailer";

function msUntilNextRun(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

async function purgeExpiredKitTokens(): Promise<void> {
  logger.info("kit-tokens: starting expired token cleanup");
  try {
    const deleted = await db
      .delete(kitTokensTable)
      .where(lt(kitTokensTable.expiresAt, sql`NOW()`))
      .returning({ token: kitTokensTable.token });

    logger.info(
      { deletedCount: deleted.length },
      "kit-tokens: expired token cleanup complete",
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "kit-tokens: expired token cleanup failed");
    void sendKitTokensCleanupFailureEmail(message);
  }
}

export function scheduleKitTokensCleanup(): void {
  const HOUR = 3;
  const MINUTE = 15;

  const firstDelay = msUntilNextRun(HOUR, MINUTE);
  const humanDelay = `${Math.round(firstDelay / 1000 / 60)} min`;
  logger.info({ nextRunIn: humanDelay }, "kit-tokens: cleanup scheduler armed");

  setTimeout(function tick() {
    void purgeExpiredKitTokens();
    setTimeout(tick, msUntilNextRun(HOUR, MINUTE));
  }, firstDelay);
}
