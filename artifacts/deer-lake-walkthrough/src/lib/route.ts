import { useCallback, useEffect, useState } from "react";

/**
 * Minimal client-side router for the two surfaces in this artifact:
 *   /deer-lake-walkthrough/         → walkthrough (council read)
 *   /deer-lake-walkthrough/planner  → planner (decision tool)
 *
 * Pushing a navigation also fires a custom event so any other hook
 * subscribed to the route updates without a full reload.
 */
const NAV_EVENT = "dlw:navigate";

export function useRoute() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  );

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, "", to);
    window.dispatchEvent(new Event(NAV_EVENT));
    window.scrollTo(0, 0);
  }, []);

  return { pathname, navigate };
}
