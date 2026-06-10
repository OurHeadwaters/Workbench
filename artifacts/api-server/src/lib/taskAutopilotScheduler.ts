/**
 * taskAutopilotScheduler — weekly cleanup for the task autopilot store.
 *
 * Runs once per week using the same setTimeout/reschedule pattern as
 * riverSmithScheduler.  On each run it calls archiveClearedTasks() and logs
 * how many tasks were moved to the archive file.
 *
 * Configuration (environment variables):
 *   TASK_ARCHIVE_OLDER_THAN_DAYS  — how old a CLEARED task must be before it
 *                                   is archived (default: 30 days)
 *
 * The job fires on Mondays at 02:00 local time.  If the process starts after
 * that window it waits until the following Monday.
 */

import { archiveClearedTasks } from "../routes/taskAutopilot";
import { logger } from "./logger";

const DEFAULT_OLDER_THAN_DAYS = 30;
const RUN_DAY_OF_WEEK = 1;
const RUN_HOUR = 2;
const RUN_MINUTE = 0;

function olderThanDays(): number {
  const raw = process.env.TASK_ARCHIVE_OLDER_THAN_DAYS;
  if (!raw) return DEFAULT_OLDER_THAN_DAYS;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_OLDER_THAN_DAYS;
}

function msUntilNextWeeklyRun(dayOfWeek: number, hour: number, minute: number): number {
  const now = new Date();
  const target = new Date(now);

  target.setHours(hour, minute, 0, 0);

  const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
  target.setDate(target.getDate() + daysUntilTarget);

  if (target <= now) {
    target.setDate(target.getDate() + 7);
  }

  return target.getTime() - now.getTime();
}

async function runWeeklyArchive(): Promise<void> {
  const days = olderThanDays();
  logger.info({ olderThanDays: days }, "task-autopilot: weekly archive scheduler firing");
  try {
    const result = archiveClearedTasks(days);
    logger.info(
      { archived: result.archived, olderThanDays: days, cutoff: result.cutoff },
      "task-autopilot: weekly archive complete",
    );
  } catch (err) {
    logger.error({ err }, "task-autopilot: weekly archive failed");
  }
}

export function scheduleWeeklyArchive(): void {
  const firstDelay = msUntilNextWeeklyRun(RUN_DAY_OF_WEEK, RUN_HOUR, RUN_MINUTE);
  const humanDelay = `${Math.round(firstDelay / 1000 / 60 / 60)} hr`;
  logger.info({ nextRunIn: humanDelay }, "task-autopilot: weekly archive scheduler armed");

  setTimeout(function tick() {
    void runWeeklyArchive();
    setTimeout(tick, msUntilNextWeeklyRun(RUN_DAY_OF_WEEK, RUN_HOUR, RUN_MINUTE));
  }, firstDelay);
}
