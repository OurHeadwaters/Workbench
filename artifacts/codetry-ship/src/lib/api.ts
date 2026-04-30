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
