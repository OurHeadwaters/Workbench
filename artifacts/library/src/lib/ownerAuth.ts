const STORAGE_KEY = "library.ownerToken";

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
  if (token) {
    try {
      window.dispatchEvent(new CustomEvent("owner-token-updated"));
    } catch {
      // ignore
    }
  }
}

export function subscribeOwnerToken(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isLoggedIn(): boolean {
  return !!getOwnerToken();
}
