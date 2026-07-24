import { ReplitConnectors } from "@replit/connectors-sdk";

const FALLBACK = "headwaters@ourheadwaters.ca";
const TO = process.env.FOUNDER_EMAIL ?? FALLBACK;
const configured = Boolean(process.env.FOUNDER_EMAIL);

console.log("─────────────────────────────────────────");
console.log("  Headwaters — alert email smoke test");
console.log("─────────────────────────────────────────");
console.log(`  FOUNDER_EMAIL env var : ${configured ? "SET" : "not set (using fallback)"}`);
console.log(`  Sending test email to : ${TO}`);
console.log("─────────────────────────────────────────\n");

const SUBJECT = "[OK] Headwaters alert smoke test";

const body = [
  "This is a smoke-test email from the Headwaters post-merge notification system.",
  "",
  `Recipient resolved from: ${configured ? "FOUNDER_EMAIL env var" : `fallback default (${FALLBACK})`}`,
  "",
  "If you received this, alert delivery is working correctly.",
  "To change the alert recipient, set the FOUNDER_EMAIL environment variable",
  "in the Replit secrets panel — no code changes needed.",
  "",
  "— scripts/src/smokeTestNotify.ts",
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

console.log(`✅  Test email sent to ${TO}.`);
if (!configured) {
  console.log(`\nTip: set FOUNDER_EMAIL in the Replit secrets panel to route alerts`);
  console.log(`     to a different address without touching any code.`);
}
