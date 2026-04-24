import { getOwnerToken, setOwnerToken } from "@/lib/ownerAuth";
import type { Snapshot } from "@/lib/types";

// All endpoints are prefixed with the artifact-aware path so they survive
// the Replit dev proxy.  The api-server itself mounts everything under /api.
const API_BASE = "/api/check-in";

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getOwnerToken();
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    // Stored passphrase is no longer valid — clear it so the app drops to login.
    setOwnerToken(null);
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function login(passphrase: string): Promise<string> {
  const body = await fetch(`${API_BASE}/owner/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passphrase }),
  });
  if (!body.ok) {
    let message = "Wrong passphrase";
    try {
      const json = (await body.json()) as { error?: string };
      if (json?.error) message = json.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const json = (await body.json()) as { token: string };
  return json.token;
}

export async function verifyToken(): Promise<boolean> {
  try {
    await request<{ ok: boolean }>("/owner/me");
    return true;
  } catch {
    return false;
  }
}

export async function listSnapshots(): Promise<Snapshot[]> {
  const data = await request<{ snapshots: Snapshot[] }>("/snapshots");
  return data.snapshots;
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  const data = await request<{ snapshot: Snapshot | null }>(
    "/snapshots/latest",
  );
  return data.snapshot;
}

export type CreateSnapshotInput = {
  year: number;
  watershedArr: number;
  ownerTakeHome: number;
  portfolioValue: number;
  xrpBalance: number;
  xrpPriceUsd: number;
  annualLivingExpenses: number;
  notes: string | null;
};

export async function createSnapshot(
  input: CreateSnapshotInput,
): Promise<Snapshot> {
  const data = await request<{ snapshot: Snapshot }>("/snapshots", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.snapshot;
}
