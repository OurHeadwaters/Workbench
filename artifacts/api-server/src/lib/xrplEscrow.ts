// live — called by artifacts/api-server/src/routes/helpingHands.ts
/**
 * xrplEscrow.ts
 *
 * Thin wrapper around xrpl.js for the three lifecycle transactions used in the
 * Helping Hands task-payment flow:
 *
 *   EscrowCreate  — submitted at task post; locks XRP until admin confirms or
 *                   the cancel window opens.
 *   EscrowFinish  — submitted at admin confirm; releases XRP to the worker.
 *   EscrowCancel  — submitted after no-show expiry; returns XRP to the band
 *                   escrow wallet.
 *
 * All operations target the XRPL testnet by default. Set XRPL_NETWORK=mainnet
 * to switch (guarded by an explicit check so accidental mainnet use is loud).
 *
 * Feature-flag gate (checked by callers):
 *   bandUsesXrplEscrow(band) — returns true only when the band row has
 *   xrplEscrowEnabled=true AND the XRPL_ESCROW_SEED env var is set.
 *   This keeps all existing bands on DB-simulation until explicitly opted in.
 *
 * XRPL escrow only supports XRP (not IOU). Token-denominated tasks always fall
 * through to DB simulation regardless of the feature flag.
 *
 * Env vars:
 *   XRPL_ESCROW_SEED            — Family-seed (s…) of the band hot wallet that
 *                                  submits escrow transactions. Required for live
 *                                  mode; absence silently disables the feature.
 *   XRPL_NETWORK                — "testnet" (default) | "mainnet"
 *   XRPL_ESCROW_CANCEL_DELAY_S  — Seconds after task availableDate before the
 *                                  escrow can be canceled. Default: 172800 (2 days).
 *                                  Set to a small value (e.g. 60) for E2E test runs.
 */

import * as xrpl from "xrpl";
import QRCode from "qrcode";
import { logger } from "./logger";

// ── Network configuration ────────────────────────────────────────────────────

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";
const MAINNET_URL = "wss://xrplcluster.com";

function rpcUrl(): string {
  const net = process.env.XRPL_NETWORK ?? "testnet";
  if (net === "mainnet") {
    logger.warn("xrplEscrow: connecting to MAINNET");
    return MAINNET_URL;
  }
  return TESTNET_URL;
}

/** Open a connected xrpl.Client; always disconnect in a finally block. */
async function openClient(): Promise<xrpl.Client> {
  const client = new xrpl.Client(rpcUrl());
  await client.connect();
  return client;
}

// ── XRPL epoch helpers ───────────────────────────────────────────────────────

// XRPL measures time in seconds since 2000-01-01T00:00:00 UTC.
const XRPL_EPOCH_OFFSET = 946684800;

function toXrplTime(date: Date): number {
  return Math.floor(date.getTime() / 1000) - XRPL_EPOCH_OFFSET;
}

// ── Amount helpers ───────────────────────────────────────────────────────────

/** Convert XRP string (e.g. "2.5") to drops string (e.g. "2500000"). */
export function xrpToDrops(xrpAmount: string): string {
  return xrpl.xrpToDrops(xrpAmount);
}

// ── Feature-flag gate ────────────────────────────────────────────────────────

export interface BandEscrowConfig {
  xrplEscrowEnabled: boolean;
}

/**
 * Returns true when this band should use real XRPL testnet escrow for XRP
 * tasks. Requires both the per-band flag AND the signing seed to be present.
 */
export function bandUsesXrplEscrow(band: BandEscrowConfig): boolean {
  return band.xrplEscrowEnabled && !!process.env.XRPL_ESCROW_SEED;
}

/** Derive the escrow wallet address from XRPL_ESCROW_SEED. */
export function escrowWalletAddress(): string {
  const seed = process.env.XRPL_ESCROW_SEED;
  if (!seed) throw new Error("XRPL_ESCROW_SEED is not set");
  return xrpl.Wallet.fromSeed(seed).address;
}

// ── EscrowCreate ─────────────────────────────────────────────────────────────

export interface EscrowCreateOpts {
  /** Worker's XRPL address — funds are escrowed to this destination. */
  destinationAddress: string;
  /** Task pay amount in XRP (not drops). */
  payAmountXrp: string;
  /**
   * ISO-8601 date string of the task's availableDate (e.g. "2026-06-10").
   * CancelAfter is set to this date + XRPL_ESCROW_CANCEL_DELAY_S seconds.
   */
  taskAvailableDate: string;
}

export interface EscrowCreateResult {
  /** Hash of the submitted EscrowCreate transaction (stored in escrow_tx_hash). */
  txHash: string;
  /** Ledger sequence of the EscrowCreate tx (stored in escrow_sequence). */
  sequence: number;
  /** Address of the escrow wallet (= XRPL_ESCROW_SEED wallet). */
  ownerAddress: string;
}

export async function submitEscrowCreate(opts: EscrowCreateOpts): Promise<EscrowCreateResult> {
  const seed = process.env.XRPL_ESCROW_SEED;
  if (!seed) throw new Error("XRPL_ESCROW_SEED is not set");

  const wallet = xrpl.Wallet.fromSeed(seed);

  const cancelDelaySec = parseInt(process.env.XRPL_ESCROW_CANCEL_DELAY_S ?? "172800", 10);
  const availableMs = new Date(opts.taskAvailableDate + "T00:00:00Z").getTime();
  const cancelAfterDate = new Date(availableMs + cancelDelaySec * 1000);

  // FinishAfter = 2 seconds from now so EscrowFinish is available almost
  // immediately after the ledger closes (testnet blocks ~3-4 s).
  const finishAfterDate = new Date(Date.now() + 2000);

  const escrowTx: xrpl.EscrowCreate = {
    TransactionType: "EscrowCreate",
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(opts.payAmountXrp),
    Destination: opts.destinationAddress,
    FinishAfter: toXrplTime(finishAfterDate),
    CancelAfter: toXrplTime(cancelAfterDate),
  };

  const client = await openClient();
  try {
    const prepared = await client.autofill(escrowTx);
    const { tx_blob, hash } = wallet.sign(prepared);
    const result = await client.submitAndWait(tx_blob);

    const meta = result.result.meta;
    if (meta && typeof meta === "object" && "TransactionResult" in meta) {
      if (meta.TransactionResult !== "tesSUCCESS") {
        throw new Error(`EscrowCreate failed: ${meta.TransactionResult}`);
      }
    }

    const sequence = (prepared as { Sequence: number }).Sequence;
    logger.info({ txHash: hash, sequence, destination: opts.destinationAddress }, "xrplEscrow: EscrowCreate submitted");

    return { txHash: hash, sequence, ownerAddress: wallet.address };
  } finally {
    await client.disconnect();
  }
}

// ── EscrowFinish ─────────────────────────────────────────────────────────────

export interface EscrowFinishOpts {
  /** Address of the account that created the escrow (= escrow wallet address). */
  ownerAddress: string;
  /** Sequence number of the EscrowCreate transaction (stored in escrow_sequence). */
  escrowSequence: number;
}

export interface EscrowFinishResult {
  /** Hash of the submitted EscrowFinish transaction (stored in xrpl_tx_hash on hh_earnings). */
  txHash: string;
}

export async function submitEscrowFinish(opts: EscrowFinishOpts): Promise<EscrowFinishResult> {
  const seed = process.env.XRPL_ESCROW_SEED;
  if (!seed) throw new Error("XRPL_ESCROW_SEED is not set");

  const wallet = xrpl.Wallet.fromSeed(seed);

  const finishTx: xrpl.EscrowFinish = {
    TransactionType: "EscrowFinish",
    Account: wallet.address,
    Owner: opts.ownerAddress,
    OfferSequence: opts.escrowSequence,
  };

  const client = await openClient();
  try {
    const prepared = await client.autofill(finishTx);
    const { tx_blob, hash } = wallet.sign(prepared);
    const result = await client.submitAndWait(tx_blob);

    const meta = result.result.meta;
    if (meta && typeof meta === "object" && "TransactionResult" in meta) {
      if (meta.TransactionResult !== "tesSUCCESS") {
        throw new Error(`EscrowFinish failed: ${meta.TransactionResult}`);
      }
    }

    logger.info({ txHash: hash, escrowSequence: opts.escrowSequence }, "xrplEscrow: EscrowFinish submitted");
    return { txHash: hash };
  } finally {
    await client.disconnect();
  }
}

// ── EscrowCancel ─────────────────────────────────────────────────────────────

export interface EscrowCancelOpts {
  /** Address of the account that created the escrow. */
  ownerAddress: string;
  /** Sequence number of the EscrowCreate transaction. */
  escrowSequence: number;
}

export interface EscrowCancelResult {
  txHash: string;
}

/**
 * Submit EscrowCancel. This can only succeed after the escrow's CancelAfter
 * ripple-time has passed. If the ledger rejects the transaction (e.g.
 * tecNO_TARGET or tecNO_PERMISSION), the error is surfaced to the caller so
 * the route can log it and continue with the DB-state transition regardless —
 * the on-chain cancel can be retried once CancelAfter has passed.
 */
export async function submitEscrowCancel(opts: EscrowCancelOpts): Promise<EscrowCancelResult> {
  const seed = process.env.XRPL_ESCROW_SEED;
  if (!seed) throw new Error("XRPL_ESCROW_SEED is not set");

  const wallet = xrpl.Wallet.fromSeed(seed);

  const cancelTx: xrpl.EscrowCancel = {
    TransactionType: "EscrowCancel",
    Account: wallet.address,
    Owner: opts.ownerAddress,
    OfferSequence: opts.escrowSequence,
  };

  const client = await openClient();
  try {
    const prepared = await client.autofill(cancelTx);
    const { tx_blob, hash } = wallet.sign(prepared);
    const result = await client.submitAndWait(tx_blob);

    const meta = result.result.meta;
    if (meta && typeof meta === "object" && "TransactionResult" in meta) {
      if (meta.TransactionResult !== "tesSUCCESS") {
        throw new Error(`EscrowCancel failed: ${meta.TransactionResult}`);
      }
    }

    logger.info({ txHash: hash, escrowSequence: opts.escrowSequence }, "xrplEscrow: EscrowCancel submitted");
    return { txHash: hash };
  } finally {
    await client.disconnect();
  }
}

// ── Wallet balance ────────────────────────────────────────────────────────────

export interface WalletBalanceResult {
  /** Classic XRPL address of the escrow hot wallet. */
  address: string;
  /** Current XRP balance as a decimal string (e.g. "24.5"). */
  balanceXrp: string;
  /** Low-balance threshold in XRP (from XRPL_LOW_BALANCE_THRESHOLD_XRP, default 10). */
  lowBalanceThresholdXrp: string;
  /** True when balanceXrp < lowBalanceThresholdXrp. */
  isLowBalance: boolean;
  /** Base64-encoded PNG data URL of a QR code encoding the wallet address. */
  qrCodeDataUrl: string;
}

/**
 * Fetch the current XRP balance of the escrow wallet and return a funding
 * summary including a QR code so admins can top up via Xaman or any XRPL
 * wallet without copying the address manually.
 *
 * Env vars:
 *   XRPL_ESCROW_SEED               — required (throws if absent)
 *   XRPL_LOW_BALANCE_THRESHOLD_XRP — alert threshold in XRP (default: 10)
 */
export async function getWalletBalance(): Promise<WalletBalanceResult> {
  const seed = process.env.XRPL_ESCROW_SEED;
  if (!seed) throw new Error("XRPL_ESCROW_SEED is not set");

  const wallet = xrpl.Wallet.fromSeed(seed);
  const address = wallet.address;

  const thresholdXrp = process.env.XRPL_LOW_BALANCE_THRESHOLD_XRP ?? "10";

  const client = await openClient();
  let balanceXrp: string;
  try {
    const raw = await client.getXrpBalance(address);
    balanceXrp = String(raw);
  } finally {
    await client.disconnect();
  }

  const isLowBalance = parseFloat(balanceXrp) < parseFloat(thresholdXrp);

  // QR code encodes the plain address — universally scannable by Xaman,
  // XUMM, and any XRPL-aware wallet for manual top-up.
  const qrCodeDataUrl = await QRCode.toDataURL(address, { width: 256 });

  logger.info(
    { address, balanceXrp, thresholdXrp, isLowBalance },
    "xrplEscrow: getWalletBalance",
  );

  return { address, balanceXrp, lowBalanceThresholdXrp: thresholdXrp, isLowBalance, qrCodeDataUrl };
}
