/**
 * kitTokens — browser-side kit access token helpers.
 *
 * Tokens are stored in localStorage keyed by kit_id so a buyer who owns
 * multiple kits can have all of them available at once. Expiry is validated
 * client-side on read; an expired token is evicted automatically.
 */

const KIT_TOKEN_PREFIX = "headwaters:kit-token:";

export interface StoredKitToken {
  token: string;
  expiresAt: string;
  buyerName: string;
}

export function setKitToken(kitId: string, data: StoredKitToken): void {
  try {
    localStorage.setItem(`${KIT_TOKEN_PREFIX}${kitId}`, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

export function getKitToken(kitId: string): StoredKitToken | null {
  try {
    const raw = localStorage.getItem(`${KIT_TOKEN_PREFIX}${kitId}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredKitToken;
    if (new Date() > new Date(data.expiresAt)) {
      localStorage.removeItem(`${KIT_TOKEN_PREFIX}${kitId}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearKitToken(kitId: string): void {
  try {
    localStorage.removeItem(`${KIT_TOKEN_PREFIX}${kitId}`);
  } catch {
    // no-op
  }
}

// ── Per-token visited-module tracking ─────────────────────────────────────────

const KIT_VISITED_PREFIX = "headwaters:kit-visited:";

export function getVisitedModules(token: string): Set<string> {
  try {
    const raw = localStorage.getItem(`${KIT_VISITED_PREFIX}${token}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function markModuleVisited(token: string, moduleTitle: string): void {
  try {
    const visited = getVisitedModules(token);
    visited.add(moduleTitle);
    localStorage.setItem(
      `${KIT_VISITED_PREFIX}${token}`,
      JSON.stringify(Array.from(visited))
    );
  } catch {
    // localStorage unavailable
  }
}

// ── Per-token visited-handout tracking ────────────────────────────────────────

const KIT_VISITED_HANDOUTS_PREFIX = "headwaters:kit-visited-handouts:";

/**
 * Returns the set of visited handout keys for a given token.
 * Keys are formatted as "<moduleId>:<handoutTitle>".
 */
export function getVisitedHandouts(token: string): Set<string> {
  try {
    const raw = localStorage.getItem(`${KIT_VISITED_HANDOUTS_PREFIX}${token}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function markHandoutVisited(token: string, handoutKey: string): void {
  try {
    const visited = getVisitedHandouts(token);
    visited.add(handoutKey);
    localStorage.setItem(
      `${KIT_VISITED_HANDOUTS_PREFIX}${token}`,
      JSON.stringify(Array.from(visited))
    );
  } catch {
    // localStorage unavailable
  }
}

// ── API fetch helpers ──────────────────────────────────────────────────────────

export interface KitAccessResult {
  ok: true;
  kit: {
    id: string;
    name: string;
    tagline: string;
    arcNote: string | null;
    contentNote: string;
  };
  buyer_name: string;
  purchase_id: string;
  expires_at: string;
}

class KitAccessError extends Error {
  status: number;
  expiredAt?: string;
  constructor(status: number, message: string, expiredAt?: string) {
    super(message);
    this.status = status;
    this.expiredAt = expiredAt;
  }
}

export async function fetchKitAccess(token: string): Promise<KitAccessResult> {
  const res = await fetch(`/api/kits/access/${token}`);
  if (!res.ok) {
    let expiredAt: string | undefined;
    try {
      const body = (await res.json()) as { error?: string; expired_at?: string };
      if (res.status === 410) {
        expiredAt = body.expired_at;
      }
    } catch {
      // non-JSON
    }
    throw new KitAccessError(res.status, `Access check failed (${res.status})`, expiredAt);
  }
  return (await res.json()) as KitAccessResult;
}

export interface ResendResult {
  ok: true;
  sent: boolean;
  mailStatus?: string;
}

export async function resendKitAccess(email: string): Promise<ResendResult> {
  const res = await fetch("/api/kits/resend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    let msg = "Re-send failed. Please try again.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {
      // non-JSON
    }
    throw new Error(msg);
  }
  return (await res.json()) as ResendResult;
}
