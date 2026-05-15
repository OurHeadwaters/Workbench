import { getOwnerToken } from "@/lib/ownerAuth";

export const apiBase = "";

export function apiHeaders(token?: string | null): Record<string, string> {
  const t = token ?? getOwnerToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
