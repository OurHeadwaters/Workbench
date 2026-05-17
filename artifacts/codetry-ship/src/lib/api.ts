/**
 * Tiny fetch helper for the codetry-ship API.  The artifact is mounted
 * under `/codetry-ship/` so the API is one level up at `/api/...`.
 */

const API_PREFIX = "/api/ship-manifest";

export interface SignOnPayload {
  name: string;
  email: string;
  org?: string;
  role?: string;
  wouldBring?: string;
  wouldWant?: string;
  source?: string;
}

export interface SignOnResult {
  ok: true;
  id: string;
  name: string;
  confirmed: true;
}

export class ApiError extends Error {
  status: number;
  retryAfterSec?: number;
  constructor(status: number, message: string, retryAfterSec?: number) {
    super(message);
    this.status = status;
    this.retryAfterSec = retryAfterSec;
  }
}

export async function postSignOn(payload: SignOnPayload): Promise<SignOnResult> {
  const res = await fetch(`${API_PREFIX}/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "Something went wrong saving your sign-on.";
    let retry: number | undefined;
    try {
      const body = (await res.json()) as { error?: string; retryAfterSec?: number };
      if (body.error) msg = body.error;
      retry = body.retryAfterSec;
    } catch {
      // non-JSON body — keep the default message
    }
    throw new ApiError(res.status, msg, retry);
  }
  return (await res.json()) as SignOnResult;
}

export interface ManifestEntry {
  id: string;
  name: string;
  email: string;
  org: string | null;
  role: string | null;
  wouldBring: string | null;
  wouldWant: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  notificationStatus: string | null;
  replyStatus: string | null;
  notificationError: string | null;
  replyError: string | null;
}

const TOKEN_KEY = "codetry-ship:owner-token";

export function getStoredOwnerToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredOwnerToken(token: string | null): void {
  try {
    if (token === null) window.localStorage.removeItem(TOKEN_KEY);
    else window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("headwaters:auth-change"));
  } catch {
    // localStorage may be unavailable; no-op
  }
}

function ownerHeaders(token: string): Record<string, string> {
  return { "x-library-owner-token": token };
}

export async function fetchManifest(
  token: string,
): Promise<{ count: number; entries: ManifestEntry[] }> {
  const res = await fetch(`${API_PREFIX}/`, {
    headers: ownerHeaders(token),
  });
  if (!res.ok) {
    throw new ApiError(res.status, res.status === 401 ? "Wrong passphrase" : "Failed to load manifest");
  }
  return (await res.json()) as { count: number; entries: ManifestEntry[] };
}

export function manifestCsvUrl(): string {
  return `${API_PREFIX}/export.csv`;
}

export async function downloadManifestCsv(token: string): Promise<void> {
  const res = await fetch(manifestCsvUrl(), { headers: ownerHeaders(token) });
  if (!res.ok) throw new ApiError(res.status, "CSV export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const today = new Date().toISOString().slice(0, 10);
  a.download = `codetry-ship-manifest-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ----------------------- community development intake -----------------------

export interface IntakePayload {
  name: string;
  email: string;
  community: string;
  role?: string;
  whatTheyNeed: string;
}

export interface IntakeResult {
  ok: true;
  id: string;
  name: string;
}

export async function postIntake(payload: IntakePayload): Promise<IntakeResult> {
  const res = await fetch("/api/intake", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "Something went wrong. Please try again.";
    let retry: number | undefined;
    try {
      const body = (await res.json()) as { error?: string; retryAfterSec?: number };
      if (body.error) msg = body.error;
      retry = body.retryAfterSec;
    } catch {
      // non-JSON body — keep default
    }
    throw new ApiError(res.status, msg, retry);
  }
  return (await res.json()) as IntakeResult;
}

// ----------------------- deadhead intake -----------------------

export interface DeadheadItem {
  id: string;
  originalTaskId: string;
  title: string;
  originalCreatedAt: string;
  status: string;
  flushedAt: string;
  flushBatchId: string;
}

export interface FlushLogEntry {
  id: string;
  flushedAt: string;
  count: number;
  proposedCountBefore: number;
  flushBatchId: string;
}

export async function fetchDeadheadIntake(
  token: string,
  status?: string,
): Promise<{ total: number; items: DeadheadItem[] }> {
  const url = status
    ? `/api/deadhead/intake?status=${encodeURIComponent(status)}`
    : "/api/deadhead/intake";
  const res = await fetch(url, { headers: ownerHeaders(token) });
  if (!res.ok) {
    throw new ApiError(
      res.status,
      res.status === 401 ? "Unauthorized" : "Failed to load intake",
    );
  }
  return (await res.json()) as { total: number; items: DeadheadItem[] };
}

export async function fetchDeadheadLog(
  token: string,
): Promise<{ total: number; entries: FlushLogEntry[] }> {
  const res = await fetch("/api/deadhead/log", {
    headers: ownerHeaders(token),
  });
  if (!res.ok) {
    throw new ApiError(
      res.status,
      res.status === 401 ? "Unauthorized" : "Failed to load flush log",
    );
  }
  return (await res.json()) as { total: number; entries: FlushLogEntry[] };
}

export async function patchDeadheadItem(
  token: string,
  id: string,
  status: string,
): Promise<{ id: string; status: string }> {
  const res = await fetch(`/api/deadhead/intake/${id}`, {
    method: "PATCH",
    headers: { ...ownerHeaders(token), "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new ApiError(res.status, "Failed to update item status");
  }
  return (await res.json()) as { id: string; status: string };
}

// ──────────────────────────────────────────────────────────────────────────────
// P2P Community Economy Engine
// ──────────────────────────────────────────────────────────────────────────────

const HH_PREFIX = "/api/helping-hands";

async function hhFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${HH_PREFIX}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = "Something went wrong.";
    let retry: number | undefined;
    try {
      const body = (await res.json()) as { error?: string; retryAfterSec?: number };
      if (body.error) msg = body.error;
      retry = body.retryAfterSec;
    } catch {
      // non-JSON body
    }
    throw new ApiError(res.status, msg, retry);
  }
  return (await res.json()) as T;
}

// ── Wallet state ──

export interface WalletState {
  memberId: string;
  firstName: string;
  lastName: string;
  tokenBalance: string;
  xrpBalance: string;
  tokenCode: string;
  walletType: "custodial" | "self_custody";
  walletRevealed: boolean;
  referralCode: string | null;
  referralBonusAmount: string;
  referralCount: number;
}

export async function fetchWallet(): Promise<WalletState> {
  return hhFetch<WalletState>("/my/wallet");
}

// ── Tips ──

export interface TipEntry {
  id: string;
  direction: "sent" | "received";
  otherName: string;
  amount: string;
  currency: string;
  tokenCode: string;
  note: string;
  sentAt: string;
}

export async function fetchMyTips(): Promise<{ tips: TipEntry[] }> {
  return hhFetch<{ tips: TipEntry[] }>("/my/tips");
}

export interface SendTipPayload {
  toMemberId: string;
  amount: string;
  currency?: string;
  note?: string;
}

export interface SendTipResult {
  id: string;
  recipientName: string;
  amount: string;
  currency: string;
  tokenCode: string;
  note: string;
  sentAt: string;
}

export async function sendTip(payload: SendTipPayload): Promise<SendTipResult> {
  return hhFetch<SendTipResult>("/tips", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Member search ──

export interface MemberSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function searchMembers(q: string): Promise<MemberSearchResult[]> {
  const url = `/api/helping-hands/members/search?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "content-type": "application/json" } });
  if (!res.ok) {
    throw new ApiError(res.status, "Search failed");
  }
  return (await res.json()) as MemberSearchResult[];
}

// ── Referral join ──

export interface JoinViaReferralPayload {
  referralCode: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface JoinViaReferralResult {
  memberId: string;
  firstName: string;
  bonusAmount: string;
  tokenCode: string;
}

export async function joinViaReferral(
  payload: JoinViaReferralPayload,
): Promise<JoinViaReferralResult> {
  const { referralCode, ...rest } = payload;
  return hhFetch<JoinViaReferralResult>(`/join/${referralCode}`, {
    method: "POST",
    body: JSON.stringify(rest),
  });
}
