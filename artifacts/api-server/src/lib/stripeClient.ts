import Stripe from "stripe";

interface StripeCredentials {
  secretKey: string;
  webhookSecret?: string;
}

/**
 * Fetches credentials from the Replit Stripe connection on every call.
 * Connection credentials rotate, so callers must not cache a Stripe client.
 */
async function getStripeCredentials(): Promise<StripeCredentials> {
  if (process.env.STRIPE_SECRET_KEY) {
    return {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const identity = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !identity) {
    throw new Error(
      "Stripe is not available. Connect Stripe through Replit Integrations before taking payments.",
    );
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: identity,
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Could not load Stripe connection credentials (${response.status}).`);
  }

  const payload = (await response.json()) as {
    items?: Array<{ settings?: { secret_key?: string; webhook_secret?: string } }>;
  };
  const settings = payload.items?.[0]?.settings;

  if (!settings?.secret_key) {
    throw new Error("The connected Stripe account does not have a secret key.");
  }

  return {
    secretKey: settings.secret_key,
    webhookSecret: settings.webhook_secret,
  };
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

export async function getStripeWebhookSecret(): Promise<string | null> {
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    return process.env.STRIPE_WEBHOOK_SECRET;
  }
  const { webhookSecret } = await getStripeCredentials();
  return webhookSecret ?? null;
}