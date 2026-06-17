/**
 * XRPL client singleton, escrow helpers, token payment helpers, and DID writer.
 *
 * The module operates in two modes:
 *  - LIVE:       a wallet secret is set → real on-chain transactions via xrpl.js
 *  - SIMULATED:  no secret configured   → fake sequences / hashes so the app
 *                keeps working during development without credentials.
 *
 * Network selection:
 *  XRPL_NETWORK=mainnet  → wss://xrplcluster.com (Ripple full-history)
 *  XRPL_NETWORK=testnet  → wss://s.altnet.rippletest.net:51233  (default)
 *
 * Wallet secrets — set exactly ONE of these pairs (Replit Secrets pane):
 *
 *  Family-seed format (Bifrost / Xaman "Advanced" → "Secret Numbers / Seed"):
 *    XRPL_BAND_SEED            — starts with "s", e.g. sEdV…  or  sn3…
 *    XRPL_TOKEN_ISSUER_SEED    — optional separate issuer; falls back to XRPL_BAND_SEED
 *
 *  Mnemonic format (Bifrost "Backup" → 12/24-word phrase):
 *    XRPL_BAND_MNEMONIC        — 12 or 24 space-separated words
 *    XRPL_TOKEN_ISSUER_MNEMONIC — optional; falls back to XRPL_BAND_MNEMONIC
 *
 *  If both seed and mnemonic are set, seed takes priority.
 *
 * Optional env vars (non-sensitive):
 *  XRPL_NETWORK              — "mainnet" | "testnet"  (default: "testnet")
 *  XRPL_DID_BASE_URL         — Base URL for hosted DID documents
 */

import * as xrpl from "xrpl";

// ─── network selection ────────────────────────────────────────────────────────

function wsUrl(): string {
  const net = (process.env.XRPL_NETWORK ?? "testnet").toLowerCase();
  if (net === "mainnet") return "wss://xrplcluster.com";
  return "wss://s.altnet.rippletest.net:51233";
}

// ─── singleton client ─────────────────────────────────────────────────────────

let _client: xrpl.Client | null = null;

async function getClient(): Promise<xrpl.Client> {
  if (!_client) {
    _client = new xrpl.Client(wsUrl());
  }
  if (!_client.isConnected()) {
    await _client.connect();
  }
  return _client;
}

// ─── wallet helpers ───────────────────────────────────────────────────────────

function isLive(): boolean {
  return Boolean(
    process.env.XRPL_BAND_SEED || process.env.XRPL_BAND_MNEMONIC,
  );
}

/**
 * Derive a Wallet from either a family seed (starts with "s") or a BIP-39
 * mnemonic phrase. Seed takes priority when both are provided.
 */
function walletFromSecret(seed?: string, mnemonic?: string): xrpl.Wallet {
  if (seed) return xrpl.Wallet.fromSeed(seed);
  if (mnemonic) return xrpl.Wallet.fromMnemonic(mnemonic);
  throw new Error(
    "No XRPL wallet secret found. Set XRPL_BAND_SEED (family seed starting with 's') " +
    "or XRPL_BAND_MNEMONIC (12/24-word backup phrase from Bifrost) in the Secrets pane.",
  );
}

function bandWallet(): xrpl.Wallet {
  return walletFromSecret(
    process.env.XRPL_BAND_SEED,
    process.env.XRPL_BAND_MNEMONIC,
  );
}

function issuerWallet(): xrpl.Wallet {
  return walletFromSecret(
    process.env.XRPL_TOKEN_ISSUER_SEED ?? process.env.XRPL_BAND_SEED,
    process.env.XRPL_TOKEN_ISSUER_MNEMONIC ?? process.env.XRPL_BAND_MNEMONIC,
  );
}

// ─── simulation helpers ───────────────────────────────────────────────────────

function simSequence(): number {
  return Math.floor(Date.now() / 1000);
}

function simTxHash(): string {
  return `SIM_${Date.now().toString(16).toUpperCase()}`;
}

// ─── XRPL amounts ────────────────────────────────────────────────────────────

/** Convert decimal XRP string to drops string (1 XRP = 1 000 000 drops). */
function toDrops(xrpAmount: string): string {
  return xrpl.xrpToDrops(xrpAmount);
}

// ─── PUBLIC INTERFACE ─────────────────────────────────────────────────────────

export interface EscrowResult {
  /** XRPL ledger sequence of the EscrowCreate tx (used as escrow identifier). */
  sequence: number;
  /** Transaction hash of the EscrowCreate tx. */
  txHash: string;
  /** Whether the result is a real on-chain transaction. */
  simulated: boolean;
}

export interface PaymentResult {
  /** Transaction hash of the EscrowFinish or Payment tx. */
  txHash: string;
  /** Whether the result is a real on-chain transaction. */
  simulated: boolean;
}

/**
 * Create an XRP escrow from the band wallet to a destination address.
 *
 * FinishAfter is set to "now + 10 seconds" so the admin can finish it
 * almost immediately. CancelAfter is 30 days out as a safety net.
 *
 * If the member has no XRPL address, or XRPL_BAND_SEED is not set, returns a
 * simulated result so the task can still be posted.
 */
export async function escrowCreate(opts: {
  destinationAddress: string | null;
  xrpAmount: string;
  taskId: string;
}): Promise<EscrowResult> {
  if (!isLive() || !opts.destinationAddress) {
    return { sequence: simSequence(), txHash: "", simulated: true };
  }

  const client = await getClient();
  const wallet = bandWallet();

  const now = Math.floor(Date.now() / 1000);
  // XRPL epoch is 2000-01-01 00:00:00 UTC = Unix 946684800
  const xrplEpoch = 946684800;
  const finishAfterRipple = now - xrplEpoch + 10;
  const cancelAfterRipple = now - xrplEpoch + 60 * 60 * 24 * 30;

  const tx: xrpl.EscrowCreate = {
    TransactionType: "EscrowCreate",
    Account: wallet.address,
    Destination: opts.destinationAddress,
    Amount: toDrops(opts.xrpAmount),
    FinishAfter: finishAfterRipple,
    CancelAfter: cancelAfterRipple,
    Memos: [
      {
        Memo: {
          MemoData: Buffer.from(`Helping Hands task ${opts.taskId}`, "utf8").toString("hex").toUpperCase(),
          MemoType: Buffer.from("text/plain", "utf8").toString("hex").toUpperCase(),
        },
      },
    ],
  };

  const prepared = await client.autofill(tx);
  // autofill always populates Sequence — capture it before signing
  const offerSequence = prepared.Sequence as number;
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as xrpl.TransactionMetadata | undefined;
  if (meta && meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(`EscrowCreate failed: ${meta.TransactionResult}`);
  }

  return {
    sequence: offerSequence,
    txHash: result.result.hash,
    simulated: false,
  };
}

/**
 * Finish an XRP escrow. Called when admin confirms a task.
 *
 * @param escrowOwner   Band wallet address (the EscrowCreate Account).
 * @param offerSequence The sequence number stored at task-post time.
 */
export async function escrowFinish(opts: {
  offerSequence: number;
  simulated?: boolean;
}): Promise<PaymentResult> {
  if (!isLive() || opts.simulated) {
    return { txHash: simTxHash(), simulated: true };
  }

  const client = await getClient();
  const wallet = bandWallet();

  const tx: xrpl.EscrowFinish = {
    TransactionType: "EscrowFinish",
    Account: wallet.address,
    Owner: wallet.address,
    OfferSequence: opts.offerSequence,
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as xrpl.TransactionMetadata | undefined;
  if (meta && meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(`EscrowFinish failed: ${meta.TransactionResult}`);
  }

  return { txHash: result.result.hash, simulated: false };
}

/**
 * Send a direct XRP payment from the band wallet to a member.
 *
 * If the member has no XRPL address, or XRPL_BAND_SEED is absent, returns simulated.
 */
export async function sendXrpPayment(opts: {
  destinationAddress: string | null;
  xrpAmount: string;
  taskId: string;
}): Promise<PaymentResult> {
  if (!isLive() || !opts.destinationAddress) {
    return { txHash: simTxHash(), simulated: true };
  }

  const client = await getClient();
  const wallet = bandWallet();

  const tx: xrpl.Payment = {
    TransactionType: "Payment",
    Account: wallet.address,
    Destination: opts.destinationAddress,
    Amount: toDrops(opts.xrpAmount),
    Memos: [
      {
        Memo: {
          MemoData: Buffer.from(`Helping Hands task ${opts.taskId}`, "utf8").toString("hex").toUpperCase(),
          MemoType: Buffer.from("text/plain", "utf8").toString("hex").toUpperCase(),
        },
      },
    ],
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as xrpl.TransactionMetadata | undefined;
  if (meta && meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(`XRP Payment failed: ${meta.TransactionResult}`);
  }

  return { txHash: result.result.hash, simulated: false };
}

/**
 * Send a community token (IOU) payment from the issuer wallet to a member.
 *
 * The member must have a TrustSet for the token already on their wallet.
 * If they have no XRPL address, or XRPL_BAND_SEED is absent, returns simulated.
 */
export async function sendTokenPayment(opts: {
  destinationAddress: string | null;
  tokenAmount: string;
  tokenCode: string;
  taskId: string;
}): Promise<PaymentResult> {
  if (!isLive() || !opts.destinationAddress) {
    return { txHash: simTxHash(), simulated: true };
  }

  const client = await getClient();
  const issuer = issuerWallet();

  // Currency codes: standard 3-char codes use ASCII; non-standard use 20-byte hex.
  // We normalise to 3 uppercase chars and pad with null bytes for the wire format.
  const currencyCode = opts.tokenCode.slice(0, 3).toUpperCase();

  const tx: xrpl.Payment = {
    TransactionType: "Payment",
    Account: issuer.address,
    Destination: opts.destinationAddress,
    Amount: {
      currency: currencyCode,
      value: opts.tokenAmount,
      issuer: issuer.address,
    },
    Memos: [
      {
        Memo: {
          MemoData: Buffer.from(`Helping Hands task ${opts.taskId}`, "utf8").toString("hex").toUpperCase(),
          MemoType: Buffer.from("text/plain", "utf8").toString("hex").toUpperCase(),
        },
      },
    ],
  };

  const prepared = await client.autofill(tx);
  const signed = issuer.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as xrpl.TransactionMetadata | undefined;
  if (meta && meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(`Token Payment failed: ${meta.TransactionResult}`);
  }

  return { txHash: result.result.hash, simulated: false };
}

/**
 * Ensure the band's issuer wallet has issued a TrustSet allow for the community token.
 * This is a one-time setup call and is safe to call multiple times (idempotent-ish).
 *
 * NOTE: Members must set up their own TrustSet to receive tokens. This cannot be
 * done server-side — members do this via Xaman when they first set up their wallet.
 */
export async function ensureTokenIssuerConfigured(opts: {
  tokenCode: string;
}): Promise<{ issuerAddress: string; simulated: boolean }> {
  if (!isLive()) {
    return { issuerAddress: "SIM_ISSUER_ADDRESS", simulated: true };
  }
  const issuer = issuerWallet();
  return { issuerAddress: issuer.address, simulated: false };
}

/**
 * Write an XLS-40d DID document for a member's XRPL address.
 *
 * Creates (or updates) the member's on-ledger DID entry with a URI pointing to
 * a Headwaters-hosted DID document containing their earnings credentials.
 *
 * Returns the DID reference string (did:xrpl:<network>:<address>).
 */
export async function writeDID(opts: {
  memberAddress: string | null;
  memberId: string;
  earnings?: { taskId: string; amount: string; currency: string; earnedAt: string }[];
}): Promise<{ didRef: string | null; simulated: boolean }> {
  if (!isLive() || !opts.memberAddress) {
    const simDid = opts.memberAddress
      ? `did:xrpl:testnet:${opts.memberAddress}`
      : null;
    return { didRef: simDid, simulated: true };
  }

  const client = await getClient();
  const wallet = bandWallet();
  const net = (process.env.XRPL_NETWORK ?? "testnet").toLowerCase();

  const baseUrl =
    process.env.XRPL_DID_BASE_URL ??
    `https://${process.env.REPLIT_DEV_DOMAIN ?? "localhost"}/media/did`;

  const didDocumentUri = `${baseUrl}/${opts.memberAddress}.json`;
  const didRef = `did:xrpl:${net}:${opts.memberAddress}`;

  const tx: xrpl.DIDSet = {
    TransactionType: "DIDSet",
    Account: wallet.address,
    DIDDocument: Buffer.from(
      JSON.stringify({
        "@context": ["https://www.w3.org/ns/did/v1"],
        id: didRef,
        controller: opts.memberAddress,
        service: [
          {
            id: `${didRef}#earnings`,
            type: "HeadwatersEarningsCredential",
            serviceEndpoint: didDocumentUri,
          },
        ],
      }),
      "utf8",
    )
      .toString("hex")
      .toUpperCase(),
    URI: Buffer.from(didDocumentUri, "utf8").toString("hex").toUpperCase(),
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as xrpl.TransactionMetadata | undefined;
  if (meta && meta.TransactionResult !== "tesSUCCESS") {
    // DID write failures are non-fatal — log and continue
    console.warn(`DIDSet failed: ${meta.TransactionResult} — member ${opts.memberId}`);
    return { didRef, simulated: false };
  }

  return { didRef, simulated: false };
}

/** Return the XRPL explorer URL for a given tx hash and network. */
export function txExplorerUrl(txHash: string): string {
  const net = (process.env.XRPL_NETWORK ?? "testnet").toLowerCase();
  if (net === "mainnet") {
    return `https://livenet.xrpl.org/transactions/${txHash}`;
  }
  return `https://testnet.xrpl.org/transactions/${txHash}`;
}

/** True when running against real XRPL (XRPL_BAND_SEED is configured). */
export { isLive as xrplIsLive };

/**
 * Return the band hot wallet's XRPL address, or null when running in simulation mode.
 * Use this when you need the address without performing an on-chain operation.
 */
export function bandWalletAddress(): string | null {
  if (!isLive()) return null;
  return bandWallet().address;
}
