/**
 * Optional Replit-hosted analytics.
 *
 * The analytics tracker is injected by the publishing proxy when enabled.
 * Keeping this boundary local means development, unpublished previews, and
 * tracker failures never interrupt the visitor's flow.
 */
export type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
  }
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics is optional and must never interrupt a customer flow.
  }
}