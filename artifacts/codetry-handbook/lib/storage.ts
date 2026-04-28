// Instrumented AsyncStorage wrapper: every write reports through
// `saveStatus` so the SyncStatusPill in the chrome reflects it.
import AsyncStorage from "@react-native-async-storage/async-storage";

import { trackSave } from "./saveStatus";

export const storage = {
  setItem(key: string, value: string): Promise<void> {
    return trackSave(AsyncStorage.setItem(key, value));
  },
  removeItem(key: string): Promise<void> {
    return trackSave(AsyncStorage.removeItem(key));
  },
};
