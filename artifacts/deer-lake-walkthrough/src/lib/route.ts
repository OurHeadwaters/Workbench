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

/**
 * Force the document scroll to the very top, robustly.
 *
 * - `window.scrollTo(0, 0)` covers most modern browsers.
 * - `document.documentElement.scrollTop = 0` and `document.body.scrollTop = 0`
 *   cover the legacy Safari quirk where one or the other holds the scroll.
 * - We schedule the same call again on the next animation frame so that
 *   if React re-renders a longer page (iframes, images) immediately after
 *   the route flip, the final scroll position still ends up at the top.
 */
function scrollToTop() {
  const apply = () => {
    window.scrollTo(0, 0);
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };
  apply();
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(apply);
  }
}

export function useRoute() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  );

  useEffect(() => {
    // Disable the browser's automatic scroll restoration. With it on,
    // tapping the system back button after visiting /cockpit drops the
    // reader part-way down /walkthrough where they were last scrolled.
    // We want every route flip to land at the top of the new screen.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const sync = () => {
      setPathname(window.location.pathname);
      // Browser back/forward also counts as "entering a link" in the
      // user's experience — land at the top of the destination.
      scrollToTop();
    };
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // Always scroll to the top, even when the click is to the same path
    // (e.g. tapping the cockpit-header brand button while already on the
    // cockpit landing). The user's expectation is that *every* click
    // lands them at the top of the screen.
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to);
      window.dispatchEvent(new Event(NAV_EVENT));
    }
    scrollToTop();
  }, []);

  return { pathname, navigate };
}
