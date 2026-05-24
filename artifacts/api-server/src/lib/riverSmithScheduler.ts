/**
 * riverSmithScheduler — nightly cron for the River Smith briefing engine.
 *
 * Runs at 23:45 local time every night using a plain setInterval / setTimeout
 * approach so there is no external cron dependency.  The scheduler is wired
 * into app.ts and fires once per process lifetime at the right wall-clock time.
 */

import { generateRiverSmithBriefing } from "../routes/riverSmith";
import { logger } from "./logger";
import {
  sendRiverSmithBriefingEmail,
  sendRiverSmithFailureEmail,
} from "./riverSmithMailer";

function msUntilNextRun(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

async function runNightlyBriefing(): Promise<void> {
  logger.info("river-smith: nightly scheduler firing");
  try {
    const result = await generateRiverSmithBriefing("scheduled");
    logger.info({ id: result.id }, "river-smith: nightly briefing complete");
    await sendRiverSmithBriefingEmail(result.rawMarkdown);
  } catch (err) {
    logger.error({ err }, "river-smith: nightly briefing failed");
    const message = err instanceof Error ? err.message : String(err);
    await sendRiverSmithFailureEmail(message);
  }
}

export function scheduleNightlyBriefing(): void {
  const HOUR = 23;
  const MINUTE = 45;

  const firstDelay = msUntilNextRun(HOUR, MINUTE);
  const humanDelay = `${Math.round(firstDelay / 1000 / 60)} min`;
  logger.info({ nextRunIn: humanDelay }, "river-smith: scheduler armed");

  setTimeout(function tick() {
    void runNightlyBriefing();
    setTimeout(tick, msUntilNextRun(HOUR, MINUTE));
  }, firstDelay);
}
