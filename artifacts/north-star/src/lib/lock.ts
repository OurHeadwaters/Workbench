const KITCHEN_TABLE_KEY = "north-star:unlocked";

export function lockKitchenTable() {
  try { localStorage.removeItem(KITCHEN_TABLE_KEY); } catch {}
  window.location.reload();
}

export function isKitchenTableUnlocked(): boolean {
  try { return localStorage.getItem(KITCHEN_TABLE_KEY) === "1"; } catch { return false; }
}
