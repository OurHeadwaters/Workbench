import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "./lib/uuid";
import type { AppState, Store, Constellation, ZoneId, ContentBankItem, GmailAccount } from "./types";
import { format, startOfISOWeek, getISOWeek, getYear } from "date-fns";

const ZONE_COLORS: Record<ZoneId, string> = {
  Z0: "45 60% 32%",
  Z1: "142 34% 37%",
  Z2: "220 45% 41%",
  Z3: "288 30% 42%",
  Z4: "38 60% 36%",
  Z5: "200 18% 36%",
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getTodayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getWeekKey(date = new Date()) {
  const mon = startOfISOWeek(date);
  return format(mon, "yyyy-MM-dd");
}

export function getSeasonKey(date = new Date()) {
  const month = date.getMonth();
  const year = getYear(date);
  const season = month < 3 ? "winter" : month < 6 ? "spring" : month < 9 ? "summer" : "fall";
  return `${year}-${season}`;
}

const SEED_CONSTELLATIONS: Omit<Constellation, "id" | "slug" | "colorVar">[] = [
  {
    name: "Saltbox",
    notes: "Homeschool session companion",
    zone: "Z3",
    urls: [
      { label: "Open Saltbox", url: "/gather/" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Practitioner's Guide",
    notes: "The practitioner playbook",
    zone: "Z2",
    urls: [
      { label: "Open Guide", url: "/practitioners-guide-v2/" },
      { label: "Workflow", url: "/practitioners-guide-v2/workflow" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Operating Plan",
    notes: "Daily practitioner operating system",
    zone: "Z1",
    urls: [
      { label: "Open Plan", url: "/practitioner-operating-plan/" },
      { label: "Daily Debrief", url: "/practitioner-operating-plan/debrief" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Field Guide Finance",
    notes: "Financial tracking and reporting",
    zone: "Z1",
    urls: [
      { label: "Open Finance", url: "/field-guide-finance/" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Research Library",
    notes: "Northern food systems research",
    zone: "Z4",
    urls: [
      { label: "Open Library", url: "/library/" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Headwaters Books",
    notes: "Community publishing catalog",
    zone: "Z3",
    urls: [
      { label: "Open Books", url: "/headwaters-books/" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Codetry Handbook",
    notes: "How a community runs its own economy",
    zone: "Z3",
    urls: [
      { label: "Open Handbook", url: "/codetry-handbook/" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Family Buckets",
    notes: "Chores, allowance, household tasks",
    zone: "Z3",
    urls: [],
    deepLinks: [],
    active: true,
  },
];

const SEED_GMAIL_ACCOUNTS: GmailAccount[] = [
  {
    id: "acc-bobbie-personal",
    address: "bobbiepepin@gmail.com",
    label: "Personal",
    fullName: "Bobbie (personal / early journey)",
    enabled: true,
  },
  {
    id: "acc-pj-main",
    address: "parrsjars@gmail.com",
    label: "PJ Main",
    fullName: "Parr's Jars",
    enabled: true,
  },
  {
    id: "acc-pj-orders",
    address: "parrsjars.orders@gmail.com",
    label: "PJ Orders",
    fullName: "Parr's Jars Orders & Invoicing",
    enabled: true,
  },
  {
    id: "acc-pj-info",
    address: "parrsjars.info@gmail.com",
    label: "PJ Info",
    fullName: "Parr's Jars Community & Suppliers",
    enabled: true,
  },
  {
    id: "acc-xbuckets",
    address: "xbucketsapp@gmail.com",
    label: "xBuckets",
    fullName: "xBuckets App & Software",
    enabled: true,
  },
  {
    id: "acc-807foodcoop",
    address: "807foodcoop@gmail.com",
    label: "807 Co-op",
    fullName: "807 Food Co-op (Dryden Coordinator)",
    enabled: true,
  },
  {
    id: "acc-the807foodcoop",
    address: "the807foodcoop@gmail.com",
    label: "807 Board",
    fullName: "807 Food Co-op (Board of Directors)",
    enabled: true,
  },
  {
    id: "acc-807foodhub",
    address: "807foodhub@gmail.com",
    label: "Food Hub",
    fullName: "807 Food Hub Coordinator",
    enabled: true,
  },
  {
    id: "acc-headwaters-alias",
    address: "bobbie@ourheadwaters.ca",
    label: "Headwaters",
    fullName: "Headwaters (alias → Parr's Jars)",
    enabled: true,
    isAlias: true,
    aliasNote: "Auto-forwards to parrsjars@gmail.com. Threads appear in the PJ Main feed until Phase 2 adds true send-as support.",
  },
];

const INITIAL_STATE: AppState = {
  schemaVersion: 6,
  installedAt: new Date().toISOString(),
  onboarding: { completed: false, step: 0 },
  statement: undefined,
  zoneRanking: ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"],
  constellations: SEED_CONSTELLATIONS.map((c) => ({
    ...c,
    id: uuidv4(),
    slug: slugify(c.name),
    colorVar: ZONE_COLORS[c.zone],
  })),
  contracts: [],
  dailyPicks: {},
  weeklyReviews: [],
  seasonalReviews: [],
  guide: { lastSectionByChapter: {} },
  captures: [],
  dismissedNudges: {},
  pendingReplies: {},
  contentBank: [],
  inbox: {
    keywords: ["accountant", "CRA", "bookkeeping", "invoice", "tax"],
    senders: [],
    enabled: false,
    hatLabels: [
      { address: "", label: "Headwaters" },
      { address: "", label: "807 Coord" },
    ],
  },
  gmailAccounts: SEED_GMAIL_ACCOUNTS,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      completeOnboarding: () =>
        set((s) => ({
          onboarding: { ...s.onboarding, completed: true, completedAt: new Date().toISOString() },
        })),

      setOnboardingStep: (step) =>
        set((s) => ({ onboarding: { ...s.onboarding, step } })),

      setStatement: ({ who, why, noFly }) =>
        set({ statement: { who, why, noFly, updatedAt: new Date().toISOString() } }),

      addConstellation: (c) =>
        set((s) => ({
          constellations: [
            ...s.constellations,
            {
              ...c,
              id: uuidv4(),
              slug: slugify(c.name),
              colorVar: ZONE_COLORS[c.zone],
            },
          ],
        })),

      updateConstellation: (id, patch) =>
        set((s) => ({
          constellations: s.constellations.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      removeConstellation: (id) =>
        set((s) => ({ constellations: s.constellations.filter((c) => c.id !== id) })),

      addContract: (c) =>
        set((s) => ({
          contracts: [
            ...s.contracts,
            { ...c, id: uuidv4(), createdAt: new Date().toISOString() },
          ],
        })),

      updateContract: (id, patch) =>
        set((s) => ({
          contracts: s.contracts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      removeContract: (id) =>
        set((s) => ({ contracts: s.contracts.filter((c) => c.id !== id) })),

      setZoneRanking: (zoneRanking) => set({ zoneRanking }),

      getTodayPick: () => {
        const key = getTodayKey();
        return (
          get().dailyPicks[key] ?? {
            date: key,
            constellationIds: [],
            pickedAt: new Date().toISOString(),
          }
        );
      },

      setTodayPick: (patch) =>
        set((s) => {
          const key = getTodayKey();
          const existing = s.dailyPicks[key] ?? {
            date: key,
            constellationIds: [],
            pickedAt: new Date().toISOString(),
          };
          return {
            dailyPicks: { ...s.dailyPicks, [key]: { ...existing, ...patch } },
          };
        }),

      addCapture: ({ text, blobId }) =>
        set((s) => {
          const captures = [
            { id: uuidv4(), createdAt: new Date().toISOString(), text, blobId },
            ...s.captures,
          ].slice(0, 500);
          return { captures };
        }),

      dismissNudge: (key) =>
        set((s) => ({
          dismissedNudges: { ...s.dismissedNudges, [key]: new Date().toISOString() },
        })),

      saveWeeklyReview: (r) =>
        set((s) => {
          const now = new Date().toISOString();
          const existing = s.weeklyReviews.find((w) => w.weekKey === r.weekKey);
          const updated = existing
            ? s.weeklyReviews.map((w) =>
                w.weekKey === r.weekKey ? { ...w, ...r, updatedAt: now } : w
              )
            : [{ ...r, createdAt: now, updatedAt: now }, ...s.weeklyReviews].slice(0, 52);
          return { weeklyReviews: updated };
        }),

      saveSeasonalReview: (r) =>
        set((s) => {
          const now = new Date().toISOString();
          const existing = s.seasonalReviews.find((sr) => sr.seasonKey === r.seasonKey);
          const updated = existing
            ? s.seasonalReviews.map((sr) =>
                sr.seasonKey === r.seasonKey ? { ...sr, ...r, updatedAt: now } : sr
              )
            : [{ ...r, createdAt: now, updatedAt: now }, ...s.seasonalReviews].slice(0, 24);
          return { seasonalReviews: updated };
        }),

      setGuideProgress: (chapterId, sectionId) =>
        set((s) => ({
          guide: {
            ...s.guide,
            lastSectionByChapter: { ...s.guide.lastSectionByChapter, [chapterId]: sectionId },
            lastOpenedAt: new Date().toISOString(),
          },
        })),

      setGuideBookmark: (chapterId) =>
        set((s) => ({ guide: { ...s.guide, bookmarkChapterId: chapterId } })),

      updateInbox: (patch) =>
        set((s) => ({ inbox: { ...s.inbox, ...patch } })),

      updateGmailAccount: (id, patch) =>
        set((s) => ({
          gmailAccounts: s.gmailAccounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      setPendingReply: (threadId, patch) =>
        set((s) => ({
          pendingReplies: {
            ...s.pendingReplies,
            [threadId]: { ...s.pendingReplies[threadId], ...patch },
          },
        })),

      exportBackup: () => {
        const state = get();
        const { exportBackup: _e, importBackup: _i, resetAll: _r, ...data } = state as Store;
        const json = JSON.stringify(data, null, 2);
        set({ lastBackedUpAt: new Date().toISOString() });
        return json;
      },

      importBackup: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.schemaVersion || !data.constellations) return false;
          set({ ...data });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () => set({ ...INITIAL_STATE, installedAt: new Date().toISOString() }),

      setLastBackedUp: () => set({ lastBackedUpAt: new Date().toISOString() }),

      addToContentBank: (item) =>
        set((s) => ({
          contentBank: [
            { ...item, id: uuidv4(), taggedAt: new Date().toISOString() },
            ...s.contentBank.filter((x) => x.threadId !== item.threadId),
          ],
        })),

      updateContentBankItem: (id, patch) =>
        set((s) => ({
          contentBank: s.contentBank.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),

      removeFromContentBank: (id) =>
        set((s) => ({ contentBank: s.contentBank.filter((x) => x.id !== id) })),
    }),
    {
      name: "north-star:v1",
      version: 7,
      migrate(persistedState: unknown, fromVersion: number) {
        const s = persistedState as Record<string, unknown>;
        if (fromVersion < 5) {
          s.gmailAccounts = SEED_GMAIL_ACCOUNTS;
          s.schemaVersion = 5;
        }
        if (fromVersion < 6) {
          const ranking = (s.zoneRanking as string[]) ?? ["Z1", "Z2", "Z3", "Z4"];
          if (!ranking.includes("Z0")) ranking.unshift("Z0");
          if (!ranking.includes("Z5")) ranking.push("Z5");
          s.zoneRanking = ranking;
          s.schemaVersion = 6;
        }
        if (fromVersion < 7) {
          const constellations = (s.constellations as Record<string, unknown>[]) ?? [];
          s.constellations = constellations.map((c) => {
            if (Array.isArray(c.urls) && c.urls.length > 0) return c;
            const fromDeepLinks = Array.isArray(c.deepLinks)
              ? (c.deepLinks as { label: string; path: string }[]).map((dl) => ({
                  label: dl.label,
                  url: dl.path,
                }))
              : [];
            const fromUrl =
              fromDeepLinks.length === 0 && typeof c.url === "string" && c.url
                ? [{ label: "Open", url: c.url as string }]
                : [];
            return { ...c, urls: fromDeepLinks.length > 0 ? fromDeepLinks : fromUrl };
          });
          s.schemaVersion = 7;
        }
        return s as unknown as AppState;
      },
    }
  )
);

export { slugify, ZONE_COLORS };
