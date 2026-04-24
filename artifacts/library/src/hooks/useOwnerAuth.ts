import { useSyncExternalStore } from "react";
import {
  getOwnerToken,
  subscribeOwnerToken,
  setOwnerToken,
} from "@/lib/ownerAuth";

export function useOwnerAuth(): {
  token: string | null;
  isLoggedIn: boolean;
  logout: () => void;
} {
  const token = useSyncExternalStore(
    subscribeOwnerToken,
    getOwnerToken,
    () => null,
  );
  return {
    token,
    isLoggedIn: !!token,
    logout: () => setOwnerToken(null),
  };
}
