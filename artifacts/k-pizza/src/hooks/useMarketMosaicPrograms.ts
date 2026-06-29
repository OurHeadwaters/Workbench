import { useState, useEffect } from "react";

export interface CommunityProgram {
  id: string;
  name: string;
  description: string;
  href: string;
  enabled: boolean;
}

export const FALLBACK_PROGRAMS: CommunityProgram[] = [
  {
    id: "lunch-club",
    name: "Lunch Club",
    description:
      "A standing weekly lunch drop for offices, trades, schools, and government departments. Pick a day — hot food shows up every week.",
    href: "/community/lunch-club",
    enabled: true,
  },
  {
    id: "feed-your-team",
    name: "Feed Your Team",
    description:
      "Catering and group orders for crews of any size — downtown Dryden pickup or short-haul delivery. Order by 10am for same-day lunch.",
    href: "/community/feed-your-team",
    enabled: true,
  },
  {
    id: "fundraisers",
    name: "Community Fundraisers",
    description:
      "Wholesale pizza drives and cooked slice sponsorships for schools, hockey teams, scouts, and local organizations.",
    href: "/community/fundraisers",
    enabled: true,
  },
  {
    id: "days-of-summer",
    name: "Days of Summer Deals",
    description:
      "Thursday market hop specials and Local Hour deals tied to the 807 Thursday drop and the Dryden Farmers' Market season.",
    href: "/market-mosaic",
    enabled: true,
  },
];

const MARKET_MOSAIC_URL = "https://community-knowledge-hub.replit.app/market/";

function tryMapPrograms(data: unknown): CommunityProgram[] | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  let arr: unknown[] | null = null;
  if (Array.isArray(data)) arr = data;
  else if (Array.isArray(d.programs)) arr = d.programs;
  else if (Array.isArray(d.items)) arr = d.items;
  else if (Array.isArray(d.markets)) arr = d.markets;
  else if (Array.isArray(d.regions)) arr = d.regions;

  if (!arr) return null;

  const mapped = arr
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    )
    .filter((item) => typeof item.name === "string" && String(item.name).trim())
    .map((item, i): CommunityProgram => {
      const name = String(item.name).trim();
      const id = String(
        item.id ??
          item.slug ??
          name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ??
          `program-${i}`
      );
      const description = String(
        item.description ?? item.blurb ?? item.summary ?? ""
      );
      const enabled =
        item.enabled !== false &&
        item.active !== false &&
        item.disabled !== true;

      let href = "/community";
      const n = name.toLowerCase();
      if (n.includes("lunch")) href = "/community/lunch-club";
      else if (n.includes("team") || n.includes("catering"))
        href = "/community/feed-your-team";
      else if (n.includes("fundrais") || n.includes("drive"))
        href = "/community/fundraisers";
      else if (
        n.includes("summer") ||
        n.includes("mosaic") ||
        n.includes("market")
      )
        href = "/market-mosaic";

      return { id, name, description, href, enabled };
    });

  return mapped.length > 0 ? mapped : null;
}

export function useMarketMosaicPrograms() {
  const [programs, setPrograms] =
    useState<CommunityProgram[]>(FALLBACK_PROGRAMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    fetch(MARKET_MOSAIC_URL, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        clearTimeout(timer);
        if (cancelled) return;
        const remote = tryMapPrograms(data);
        if (remote && remote.length > 0) {
          const merged = FALLBACK_PROGRAMS.map((fb) => {
            const match = remote.find((m) => {
              const ml = m.name.toLowerCase();
              const fbl = fb.id.replace(/-/g, " ");
              return ml.includes(fbl) || fbl.includes(ml.replace(/\s+/g, "-"));
            });
            if (match) return { ...fb, name: match.name, enabled: match.enabled };
            return fb;
          });
          setPrograms(merged);
        }
      })
      .catch(() => {
        clearTimeout(timer);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { programs: programs.filter((p) => p.enabled), loading };
}
