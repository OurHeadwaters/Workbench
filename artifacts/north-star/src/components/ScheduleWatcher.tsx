/**
 * ScheduleWatcher — app-level component that checks scheduled triggers every minute.
 *
 * Mount once in App.tsx (outside any page route) so scheduled triggers evaluate
 * whenever the app is open, regardless of which page is active.
 *
 * A trigger fires when ALL of:
 *   - enabled is true
 *   - schedule is a valid "HH:MM" string
 *   - current local time is within ±5 minutes of the scheduled time
 *   - last_fired is absent or more than 50 minutes ago (debounce)
 *
 * Renders nothing. Side-effect only.
 */

import { useEffect, useRef } from "react";
import { useStore } from "@/store";

export function ScheduleWatcher() {
  const triggers = useStore((s) => s.triggers);
  const fireTrigger = useStore((s) => s.fireTrigger);

  // Keep stable refs so the interval callback always sees fresh state
  // without needing to re-register the interval on every render.
  const triggersRef = useRef(triggers);
  triggersRef.current = triggers;
  const fireRef = useRef(fireTrigger);
  fireRef.current = fireTrigger;

  useEffect(() => {
    function check() {
      const now = new Date();
      const nowMs = now.getTime();

      for (const t of triggersRef.current) {
        if (!t.enabled || !t.schedule) continue;

        const parts = t.schedule.split(":");
        const sh = parseInt(parts[0] ?? "", 10);
        const sm = parseInt(parts[1] ?? "", 10);
        if (isNaN(sh) || isNaN(sm)) continue;

        const schedDate = new Date(now);
        schedDate.setHours(sh, sm, 0, 0);
        const diff = Math.abs(nowMs - schedDate.getTime());
        if (diff > 5 * 60 * 1000) continue; // outside ±5 min window

        // Debounce: skip if fired within the last 50 minutes
        if (t.last_fired) {
          const sinceLastFire = nowMs - new Date(t.last_fired).getTime();
          if (sinceLastFire < 50 * 60 * 1000) continue;
        }

        void fireRef.current(t.id);
      }
    }

    // Run immediately on mount to catch the case where the app opens mid-window,
    // then repeat every 60 seconds.
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []); // empty deps — intentional; refs carry fresh state

  return null;
}
