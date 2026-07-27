import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "./lib/uuid";
import type { AppState, Store, Constellation, ZoneId, ContentBankItem, GmailAccount, WorkbenchPlan, ChannelMeta, HelpingHandsTask, TriggerDefinition, ImprovementProposal } from "./types";
import type { WorkbenchPlanBurstPayload, HelpingHandsCreatePayload, HelpingHandsClaimPayload, HelpingHandsCompletePayload, HelpingHandsConfirmPayload } from "./lib/relay-event-types";
import { format, startOfISOWeek, getISOWeek, getYear } from "date-fns";
import { publishToRelay, RELAY_EVENT_KINDS } from "./lib/relay-stub";

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
    name: "Deer Lake",
    notes: "Anchor engagement — Phase 1 trial · June 15 soft deadline",
    zone: "Z2",
    urls: [
      { label: "Chief Brief", url: "/north-star/cockpit/deer-lake-brief" },
      { label: "Cockpit", url: "/north-star/cockpit" },
    ],
    deepLinks: [],
    active: true,
  },
  {
    name: "Headwaters Build",
    notes: "Platform, kits, methodology — the Z3 machine",
    zone: "Z3",
    urls: [
      { label: "Model", url: "/north-star/model" },
      { label: "Window", url: "/north-star/window" },
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

const SEED_TRIGGERS: TriggerDefinition[] = [
  {
    id: "morning-manifest-daily",
    name: "Morning Manifest — Daily",
    kind: 1000,
    schedule: "06:00",
    enabled: true,
  },
  {
    id: "end-of-day-review",
    name: "End-of-Day Review",
    kind: 1001,
    condition: "on-debrief-save",
    enabled: true,
  },
];
const INITIAL_STATE: AppState = {
  schemaVersion: 10,
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
  contractMilestones: [],
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
  workbenchPlan: undefined,
  channels: [],
  helpingHandsTasks: [],
  triggers: SEED_TRIGGERS,
  improvementProposals: [],
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

      attestMilestone: ({ contractId, description, attestedBy }) => {
        const now = new Date().toISOString();
        const milestoneId = uuidv4();
        set((s) => ({
          contractMilestones: [
            ...s.contractMilestones,
            { id: milestoneId, contractId, description, attestedBy, attestedAt: now },
          ],
        }));
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.CONTRACT_MILESTONE,
          payload: {
            zone: "Z4",
            actor_type: "human",
            contract_id: contractId,
            milestone_id: milestoneId,
            attested_by: attestedBy,
            attested_at: now,
            description,
          },
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      setZoneRanking: (zoneRanking) => set({ zoneRanking }),

      getTodayPick: () => {
        const key = getTodayKey();
        return (
          get().dailyPicks[key] ?? {
            date: key,
            constellationIds: [],
            pickedAt: new Date().toISOString(),
            actor_type: "human" as const,
          }
        );
      },

      setTodayPick: (patch) => {
        set((s) => {
          const key = getTodayKey();
          const existing = s.dailyPicks[key] ?? {
            date: key,
            constellationIds: [],
            pickedAt: new Date().toISOString(),
            actor_type: "human" as const,
          };
          return {
            dailyPicks: {
              ...s.dailyPicks,
              [key]: { actor_type: "human" as const, ...existing, ...patch },
            },
          };
        });
        const updated = get().getTodayPick();
        const { zoneRanking, workbenchPlan } = get();
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
          payload: {
            zone: "Z2",
            actor_type: (updated.actor_type ?? "human") as "human" | "agent",
            date: updated.date,
            constellation_ids: updated.constellationIds,
            acknowledged_guardrails: updated.acknowledgedGuardrails ?? [],
            zone_ranking: zoneRanking,
            burst_windows: workbenchPlan
              ? { phase: workbenchPlan.phase, windows: workbenchPlan.windows }
              : null,
          },
          z2npub: "z2:local",
          timestamp: new Date().toISOString(),
          signature: "stub",
        });
      },

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

      setWorkbenchPlan: ({ phase, burstMinutes, windows, windowNotes, notes }) => {
        const now = new Date().toISOString();
        set({
          workbenchPlan: {
            phase,
            burstMinutes,
            windows,
            windowNotes,
            notes,
            updatedAt: now,
          },
        });
        if (burstMinutes !== null && burstMinutes !== undefined) {
          const burstPayload: WorkbenchPlanBurstPayload = {
            zone: "Z2",
            actor_type: "human",
            phase,
            burst_minutes: burstMinutes,
            windows,
            started_at: now,
          };
          void publishToRelay({
            kind: RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST,
            payload: burstPayload,
            z2npub: "z2:local",
            timestamp: now,
            signature: "stub",
          });
        }
      },

      addChannel: ({ label, category, expiresAt, createdBy }) =>
        set((s) => ({
          channels: [
            ...s.channels,
            {
              id: uuidv4(),
              label,
              category,
              expiresAt,
              createdAt: new Date().toISOString(),
              createdBy,
            },
          ],
        })),

      expireChannel: (id) =>
        set((s) => ({
          channels: s.channels.map((ch) =>
            ch.id === id ? { ...ch, archivedAt: new Date().toISOString() } : ch
          ),
        })),

      setTrigger: (id, patch) =>
        set((s) => ({
          triggers: s.triggers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      fireTrigger: async (id) => {
        const s = get();
        const trigger = s.triggers.find((t) => t.id === id);
        if (!trigger || !trigger.enabled) return;

        const now = new Date().toISOString();

        if (trigger.kind === RELAY_EVENT_KINDS.MORNING_MANIFEST) {
          const todayPick = s.getTodayPick();
          await publishToRelay({
            kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
            payload: {
              zone: "Z2",
              actor_type: "agent",
              agent_role: "ops",
              date: todayPick.date,
              constellation_ids: todayPick.constellationIds,
              acknowledged_guardrails: todayPick.acknowledgedGuardrails ?? [],
              zone_ranking: s.zoneRanking,
              burst_windows: s.workbenchPlan
                ? { phase: s.workbenchPlan.phase, windows: s.workbenchPlan.windows }
                : null,
            },
            z2npub: "z2:local",
            timestamp: now,
            signature: "stub",
          });
        } else if (trigger.kind === RELAY_EVENT_KINDS.BRIEFING_ENVELOPE) {
          await publishToRelay({
            kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
            payload: {
              zone: "Z2",
              actor_type: "agent",
              agent_role: "river-smith",
              briefing_id: uuidv4(),
              generated_at: now,
              triggered_by: "scheduled",
              safety_flags_count: 0,
            },
            z2npub: "z2:local",
            timestamp: now,
            signature: "stub",
          });
        }

        set((s) => ({
          triggers: s.triggers.map((t) =>
            t.id === id ? { ...t, last_fired: now } : t
          ),
        }));
      },

      addProposal: ({ agent_role, title, description, affected_surface, relay_event_ref }) => {
        const now = new Date().toISOString();
        const proposal: ImprovementProposal = {
          id: uuidv4(),
          agent_role,
          title,
          description,
          affected_surface,
          relay_event_ref,
          status: "proposed",
          created_at: now,
        };
        set((s) => ({ improvementProposals: [proposal, ...s.improvementProposals] }));
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.IMPROVEMENT_PROPOSAL,
          payload: {
            zone: "Z2",
            actor_type: "agent",
            agent_role,
            proposal_id: proposal.id,
            title,
            description,
            affected_surface,
            created_at: now,
          },
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
        return proposal;
      },

      acceptProposal: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          improvementProposals: s.improvementProposals.map((p) =>
            p.id === id ? { ...p, status: "accepted" as const, resolved_at: now } : p,
          ),
        }));
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.IMPROVEMENT_PROPOSAL_OUTCOME,
          payload: {
            zone: "Z2",
            actor_type: "human",
            proposal_id: id,
            outcome: "accepted",
            resolved_at: now,
          },
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      rejectProposal: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          improvementProposals: s.improvementProposals.map((p) =>
            p.id === id ? { ...p, status: "rejected" as const, resolved_at: now } : p,
          ),
        }));
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.IMPROVEMENT_PROPOSAL_OUTCOME,
          payload: {
            zone: "Z2",
            actor_type: "human",
            proposal_id: id,
            outcome: "rejected",
            resolved_at: now,
          },
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      addHelpingHandsTask: ({ title }) => {
        const now = new Date().toISOString();
        const id = uuidv4();
        const task: HelpingHandsTask = { id, title, status: "open", postedAt: now };
        set((s) => ({ helpingHandsTasks: [task, ...s.helpingHandsTasks] }));
        const payload: HelpingHandsCreatePayload = {
          zone: "Z3",
          actor_type: "human",
          task_id: id,
          title,
          posted_at: now,
        };
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.HELPING_HANDS_CREATE,
          payload,
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      claimHelpingHandsTask: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          helpingHandsTasks: s.helpingHandsTasks.map((t) =>
            t.id === id ? { ...t, status: "claimed" as const, claimedAt: now } : t
          ),
        }));
        const payload: HelpingHandsClaimPayload = {
          zone: "Z3",
          actor_type: "human",
          task_id: id,
          claimed_at: now,
        };
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.HELPING_HANDS_CLAIM,
          payload,
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      completeHelpingHandsTask: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          helpingHandsTasks: s.helpingHandsTasks.map((t) =>
            t.id === id ? { ...t, status: "done" as const, completedAt: now } : t
          ),
        }));
        const payload: HelpingHandsCompletePayload = {
          zone: "Z3",
          actor_type: "human",
          task_id: id,
          completed_at: now,
        };
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.HELPING_HANDS_COMPLETE,
          payload,
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      confirmHelpingHandsTask: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          helpingHandsTasks: s.helpingHandsTasks.map((t) =>
            t.id === id ? { ...t, status: "confirmed" as const, confirmedAt: now } : t
          ),
        }));
        const payload: HelpingHandsConfirmPayload = {
          zone: "Z3",
          actor_type: "human",
          task_id: id,
          confirmed_at: now,
        };
        void publishToRelay({
          kind: RELAY_EVENT_KINDS.HELPING_HANDS_CONFIRM,
          payload,
          z2npub: "z2:local",
          timestamp: now,
          signature: "stub",
        });
      },

      archiveHelpingHandsTask: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          helpingHandsTasks: s.helpingHandsTasks.map((t) =>
            t.id === id ? { ...t, archivedAt: now } : t
          ),
        }));
      },
    }),
    {
      name: "north-star:v1",
      version: 10,
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
        if (fromVersion < 8) {
          s.workbenchPlan = undefined;
          s.schemaVersion = 8;
        }
        if (fromVersion < 9) {
          s.channels = [];
          s.schemaVersion = 9;
        }
        if (fromVersion < 10) {
          s.triggers = SEED_TRIGGERS;
          s.schemaVersion = 10;
        }
        return s as unknown as AppState;
      },
    }
  )
);

export { slugify, ZONE_COLORS };
