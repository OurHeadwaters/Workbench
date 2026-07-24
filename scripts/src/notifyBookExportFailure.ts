import { ReplitConnectors } from "@replit/connectors-sdk";

const TO = process.env.FOUNDER_EMAIL ?? "headwaters@ourheadwaters.ca";
const SUBJECT = "[WARN] Book export failed after handbook data change";

const errorDetail = process.argv[2] ?? "(no detail provided)";

const body = [
  "The automated book export failed after a handbook data change was merged.",
  "",
  `Error detail: ${errorDetail}`,
  "",
  "The exported book files on the site may be stale — check the post-merge log in the Replit agent inbox for the full output.",
  "Common causes: a broken data import, a missing narration file, or a dependency error in the export script.",
  "Re-running the export manually: pnpm --filter @workspace/codetry-handbook run export-book",
  "",
  "— Replit post-merge script",
].join("\n");

function makeRawMessage(to: string, subject: string, text: string): string {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
  ].join("\r\n");
  return Buffer.from(message).toString("base64url");
}

const connectors = new ReplitConnectors();

const raw = makeRawMessage(TO, SUBJECT, body);

const response = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ raw }),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`Gmail send failed (${response.status}): ${text}`);
  process.exit(1);
}

console.log(`Alert sent to ${TO}.`);
