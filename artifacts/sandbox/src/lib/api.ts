const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE.replace("/sandbox", "")}/api/sandbox`;

function getToken(): string | null {
  return localStorage.getItem("sandbox_token");
}

export function setToken(token: string) {
  localStorage.setItem("sandbox_token", token);
}

export function clearToken() {
  localStorage.removeItem("sandbox_token");
}

async function req<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  createHousehold: (name: string, passphrase: string, inviteCode?: string) =>
    req<{ token: string; household: SandboxHousehold }>("POST", "/households", { name, passphrase, inviteCode }),
  login: (name: string, passphrase: string) =>
    req<{ token: string; household: SandboxHousehold }>("POST", "/sessions", { name, passphrase }),
  me: () => req<SandboxHousehold>("GET", "/me"),

  // Households (organizer)
  listHouseholds: () => req<SandboxHousehold[]>("GET", "/households"),

  // Invites (organizer)
  listInvites: () => req<SandboxInvite[]>("GET", "/invites"),
  createInvite: (note?: string) => req<SandboxInvite>("POST", "/invites", { note }),
  revokeInvite: (id: string) => req<void>("DELETE", `/invites/${id}`),

  // Buckets
  listBuckets: () => req<SandboxBucket[]>("GET", "/buckets"),
  createBucket: (label: string) =>
    req<SandboxBucket>("POST", "/buckets", { label }),
  updateBucket: (id: string, data: { label?: string; promptText?: string | null }) =>
    req<SandboxBucket>("PATCH", `/buckets/${id}`, data),

  // Posts
  listPosts: (bucketId?: string) =>
    req<SandboxPost[]>("GET", `/posts${bucketId ? `?bucketId=${bucketId}` : ""}`),
  createPost: (bucketId: string, body: string) =>
    req<SandboxPost>("POST", "/posts", { bucketId, body }),
  deletePost: (id: string) => req<void>("DELETE", `/posts/${id}`),

  // Community roles
  listRoles: () => req<SandboxRole[]>("GET", "/roles"),
  createRole: (roleName: string, description: string) =>
    req<SandboxRole>("POST", "/roles", { roleName, description }),
  updateRole: (id: string, data: Partial<{ householdId: string; isPublic: boolean; roleName: string; description: string }>) =>
    req<SandboxRole>("PATCH", `/roles/${id}`, data),
  deleteRole: (id: string) => req<void>("DELETE", `/roles/${id}`),

  // Standby events
  getActiveStandby: () => req<SandboxStandbyEvent | null>("GET", "/standby/active"),
  declareStandby: (name: string) =>
    req<SandboxStandbyEvent>("POST", "/standby", { name }),
  endStandby: (id: string) => req<{ id: string; isActive: boolean }>("POST", `/standby/${id}/end`),

  // Checkins
  listCheckins: () => req<SandboxCheckinSummary>("GET", "/checkins"),
  checkin: () => req<{ ok: boolean }>("POST", "/checkins"),
};

// Types
export interface SandboxHousehold {
  id: string;
  name: string;
  isOrganizer: boolean;
  gatherRoundParticipated: string | null;
  createdAt: string;
}

export interface SandboxInvite {
  id: string;
  code: string;
  note: string;
  createdAt: string;
  usedAt: string | null;
  usedByHouseholdName: string | null;
}

export interface SandboxBucket {
  id: string;
  slug: string;
  label: string;
  isBuiltIn: boolean;
  isHeadsUp: boolean;
  isGatherRound: boolean;
  sortOrder: string;
  promptText: string | null;
}

export interface SandboxPost {
  id: string;
  householdId: string;
  householdName: string;
  bucketId: string;
  bucketSlug: string;
  body: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface SandboxRole {
  id: string;
  roleName: string;
  description: string;
  householdId: string | null;
  householdName: string | null;
  isPublic: boolean;
  assignedByOrganizer: boolean;
}

export interface SandboxStandbyEvent {
  id: string;
  name: string;
  declaredByHouseholdId: string;
  declaredByName: string;
  isActive: boolean;
  declaredAt: string;
  endedAt: string | null;
}

export interface SandboxCheckinSummary {
  eventId: string;
  total: number;
  checkedIn: number;
  myCheckedIn: boolean;
  remaining: { id: string; name: string }[];
  checkins: { householdId: string; householdName: string; checkedInAt: string }[];
}
