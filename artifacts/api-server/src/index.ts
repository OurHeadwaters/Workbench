import app from "./app";
import { logger } from "./lib/logger";
import { seedBookkeeper } from "./lib/bookkeeperSeed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  if (!process.env.CONFIDENTIAL_NOTIFY_EMAIL) {
    logger.warn(
      "CONFIDENTIAL_NOTIFY_EMAIL is not set — confidential intake notifications will be skipped",
    );
  }

  seedBookkeeper().catch((seedErr) => {
    logger.error({ err: seedErr }, "bookkeeper seed failed");
  });
});
