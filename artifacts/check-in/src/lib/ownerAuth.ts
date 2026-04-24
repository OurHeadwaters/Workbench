// Token storage shared between the dashboard pages.  The passphrase IS the
// token (see artifacts/api-server/src/routes/checkin.ts), so there is nothing
// to refresh — Bobbie types it once per browser, it sits in localStorage, and
// every API call replays it as a Bearer token.

const STORAGE_KEY = "checkin.ownerToken";

type Listener = () => void;
const listeners = new Set<Listener>();

export function getOwnerToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setOwnerToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore — private mode etc.
  }
  for (const fn of listeners) fn();
}

export function subscribeOwnerToken(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
