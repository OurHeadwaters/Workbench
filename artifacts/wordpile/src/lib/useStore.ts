import { useSyncExternalStore } from "react";
import { WordpileStore } from "./store";
import type { CommunityPile, WordpileData } from "@/data/types";

export function useWordpile(): WordpileData {
  return useSyncExternalStore(
    WordpileStore.subscribe,
    WordpileStore.getSnapshot,
    () => WordpileStore.getSnapshot(),
  );
}

export function useSelectedPile(): CommunityPile | null {
  const data = useWordpile();
  if (!data.selectedPileId) return null;
  return data.piles[data.selectedPileId] ?? null;
}

export function usePile(pileId: string | undefined): CommunityPile | null {
  const data = useWordpile();
  if (!pileId) return null;
  return data.piles[pileId] ?? null;
}
