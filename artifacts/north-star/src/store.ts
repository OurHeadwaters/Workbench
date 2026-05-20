import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "./lib/uuid";
import type { AppState, Store, Constellation, ZoneId } from "./types";
import { format, startOfISOWeek, getISOWeek, getYear } from "date-fns";

const ZONE_COLORS: Record<ZoneId, string> = {
  Z1: "142 34% 37%",
  Z2: "220 45% 41%",
  Z3: "288 30% 42%",
  Z4: "38 60% 36%",
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
    url: "/gather/",
    deepLinks: [
      { label: "Open Saltbox", path: "/gather/" },
      { label: "Today's session", path: "/gather/" },
    ],
    active: true,
  },
  {
    name: "Practitioner's Guide",
    notes: "The practitioner playbook",
    zone: "Z2",
    url: "/practitioners-guide-v2/",
    deepLinks: [
      { label: "Open Guide", path: "/practitioners-guide-v2/" },
      { label: "Workspace", path: "/practitioners-guide-v2/" },
      { label: "Workflow", path: "/practitioners-guide-v2/workflow" },
    ],
    active: true,
  },
  {
    name: "Operating Plan",
    notes: "Daily practitioner operating system",
    zone: "Z1",
    url: "/practitioner-operating-plan/",
    deepLinks: [
      { label: "Open Plan", path: "/practitioner-operating-plan/" },
      { label: "Daily Debrief", path: "/practitioner-operating-plan/debrief" },
    ],
    active: true,
  },
  {
    name: "Field Guide Finance",
    notes: "Financial tracking and reporting",
    zone: "Z1",
    url: "/field-guide-finance/",
    deepLinks: [
      { label: "Open Finance", path: "/field-guide-finance/" },
    ],
    active: true,
  },
  {
    name: "Research Library",
    notes: "Northern food systems research",
    zone: "Z4",
    url: "/library/",
    deepLinks: [
      { label: "Open Library", path: "/library/" },
    ],
    active: true,
  },
  {
    name: "Headwaters Books",
    notes: "Community publishing catalog",
    zone: "Z3",
    url: "/headwaters-books/",
    deepLinks: [
      { label: "Open Books", path: "/headwaters-books/" },
    ],
    active: true,
  },
  {
    name: "Codetry Handbook",
    notes: "How a community runs its own economy",
    zone: "Z3",
    url: "/codetry-handbook/",
    deepLinks: [
      { label: "Open Handbook", path: "/codetry-handbook/" },
    ],
    active: true,
  },
  {
    name: "Family Buckets",
    notes: "Chores, allowance, household tasks",
    zone: "Z3",
    url: undefined,
    deepLinks: [],
    active: true,
  },
];

const INITIAL_STATE: AppState = {
  schemaVersion: 4,
  installedAt: new Date().toISOString(),
  onboarding: { completed: false, step: 0 },
  statement: undefined,
  zoneRanking: ["Z1", "Z2", "Z3", "Z4"],
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
  inbox: {
    keywords: ["accountant", "CRA", "bookkeeping", "invoice", "tax"],
    senders: [],
    enabled: false,
    hatLabels: [
      { address: "", label: "Headwaters" },
      { address: "", label: "807 Coord" },
    ],
  },
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
    }),
    {
      name: "north-star:v1",
      version: 4,
    }
  )
);

export { slugify, ZONE_COLORS };
