import { ReplitConnectors } from "@replit/connectors-sdk";

const founderEmail = process.env.FOUNDER_EMAIL;
if (!founderEmail) {
  console.warn(
    "WARNING: FOUNDER_EMAIL secret is not set. " +
    "Falling back to hardcoded address headwaters@ourheadwaters.ca. " +
    "Set the FOUNDER_EMAIL secret in the Replit Secrets panel to override."
  );
}
const TO = founderEmail ?? "headwaters@ourheadwaters.ca";
const SUBJECT = "[WARN] GitHub mirror sync failed";

const errorDetail = process.argv[2] ?? "(no detail provided)";

const body = [
  "The automated GitHub backup push just failed.",
  "",
  `Error detail: ${errorDetail}`,
  "",
  "The Replit workbench is still running fine — only the off-site mirror on GitHub is out of date.",
  "Check the post-merge log in the Replit agent inbox for the full output, then re-run or rotate the GITHUB_TOKEN secret if needed.",
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
