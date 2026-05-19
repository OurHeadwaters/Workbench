import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GatherState, HouseholdReadiness, StandbyStatus, BUILT_IN_ROLES } from "./types";
import type { FamilyMember, KitItem, ActivityCompletion, FireEscapePlan, GatherRoundMessage, StandbyRole, ActivityType } from "./types";

const SCHEMA_VERSION = 1;

const defaultReadiness: HouseholdReadiness = {
  status: "everyday",
  roles: BUILT_IN_ROLES,
  kitItems: [],
  activitiesCompleted: [],
  fireEscapePlan: {
    rooms: [],
    meetingSpot: "",
    navigatorId: null,
    practiceCount: 0,
    lastPracticedDate: null,
    notes: "",
  },
  gatherRoundMessage: {
    whatWeHave: "",
    whatWeNeed: "",
    whatWeCanOffer: "",
    lastDraftedAt: null,
  },
};

const defaultState: GatherState = {
  schemaVersion: SCHEMA_VERSION,
  familyMembers: [],
  readiness: defaultReadiness,
  activeActivity: null,
  onboardingDone: false,
};

interface GatherStore extends GatherState {
  setStatus: (status: StandbyStatus) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id" | "createdAt">) => void;
  updateFamilyMember: (id: string, updates: Partial<Omit<FamilyMember, "id" | "createdAt">>) => void;
  removeFamilyMember: (id: string) => void;
  assignRole: (memberId: string, roleId: string) => void;
  unassignRole: (memberId: string, roleId: string) => void;
  addRole: (role: Omit<StandbyRole, "id" | "isBuiltIn">) => void;
  updateRole: (id: string, updates: Partial<Omit<StandbyRole, "id" | "isBuiltIn">>) => void;
  removeRole: (id: string) => void;
  addKitItem: (item: Omit<KitItem, "id">) => void;
  updateKitItem: (id: string, updates: Partial<Omit<KitItem, "id">>) => void;
  removeKitItem: (id: string) => void;
  checkKitItem: (id: string, checkedById: string) => void;
  checkAllRoleItems: (roleId: string, checkedById: string) => void;
  logActivity: (activity: Omit<ActivityCompletion, "id">) => void;
  setActiveActivity: (activity: ActivityType | null) => void;
  updateFireEscapePlan: (updates: Partial<FireEscapePlan>) => void;
  updateGatherRoundMessage: (updates: Partial<GatherRoundMessage>) => void;
  setOnboardingDone: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  reset: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useGatherStore = create<GatherStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setStatus: (status) =>
        set((s) => ({ readiness: { ...s.readiness, status } })),

      addFamilyMember: (member) =>
        set((s) => ({
          familyMembers: [
            ...s.familyMembers,
            { ...member, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      updateFamilyMember: (id, updates) =>
        set((s) => ({
          familyMembers: s.familyMembers.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      removeFamilyMember: (id) =>
        set((s) => ({
          familyMembers: s.familyMembers.filter((m) => m.id !== id),
        })),

      assignRole: (memberId, roleId) =>
        set((s) => ({
          familyMembers: s.familyMembers.map((m) =>
            m.id === memberId && !m.roleIds.includes(roleId)
              ? { ...m, roleIds: [...m.roleIds, roleId] }
              : m
          ),
        })),

      unassignRole: (memberId, roleId) =>
        set((s) => ({
          familyMembers: s.familyMembers.map((m) =>
            m.id === memberId
              ? { ...m, roleIds: m.roleIds.filter((r) => r !== roleId) }
              : m
          ),
        })),

      addRole: (role) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            roles: [
              ...s.readiness.roles,
              { ...role, id: generateId(), isBuiltIn: false },
            ],
          },
        })),

      updateRole: (id, updates) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            roles: s.readiness.roles.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
          },
        })),

      removeRole: (id) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            roles: s.readiness.roles.filter((r) => r.id !== id),
          },
          familyMembers: s.familyMembers.map((m) => ({
            ...m,
            roleIds: m.roleIds.filter((r) => r !== id),
          })),
        })),

      addKitItem: (item) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            kitItems: [
              ...s.readiness.kitItems,
              { ...item, id: generateId() },
            ],
          },
        })),

      updateKitItem: (id, updates) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            kitItems: s.readiness.kitItems.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          },
        })),

      removeKitItem: (id) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            kitItems: s.readiness.kitItems.filter((item) => item.id !== id),
          },
        })),

      checkKitItem: (id, checkedById) => {
        const today = new Date().toISOString().slice(0, 10);
        set((s) => ({
          readiness: {
            ...s.readiness,
            kitItems: s.readiness.kitItems.map((item) =>
              item.id === id
                ? { ...item, lastCheckedDate: today, lastCheckedById: checkedById }
                : item
            ),
          },
        }));
      },

      checkAllRoleItems: (roleId, checkedById) => {
        const today = new Date().toISOString().slice(0, 10);
        set((s) => ({
          readiness: {
            ...s.readiness,
            kitItems: s.readiness.kitItems.map((item) =>
              item.roleId === roleId
                ? { ...item, lastCheckedDate: today, lastCheckedById: checkedById }
                : item
            ),
          },
        }));
      },

      logActivity: (activity) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            activitiesCompleted: [
              ...s.readiness.activitiesCompleted,
              { ...activity, id: generateId() },
            ],
          },
        })),

      setActiveActivity: (activity) => set({ activeActivity: activity }),

      updateFireEscapePlan: (updates) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            fireEscapePlan: { ...s.readiness.fireEscapePlan, ...updates },
          },
        })),

      updateGatherRoundMessage: (updates) =>
        set((s) => ({
          readiness: {
            ...s.readiness,
            gatherRoundMessage: {
              ...s.readiness.gatherRoundMessage,
              ...updates,
              lastDraftedAt: new Date().toISOString(),
            },
          },
        })),

      setOnboardingDone: () => set({ onboardingDone: true }),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          schemaVersion: state.schemaVersion,
          familyMembers: state.familyMembers,
          readiness: state.readiness,
          onboardingDone: state.onboardingDone,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.familyMembers || !data.readiness) return false;
          set({
            schemaVersion: data.schemaVersion ?? SCHEMA_VERSION,
            familyMembers: data.familyMembers ?? [],
            readiness: { ...defaultReadiness, ...data.readiness },
            onboardingDone: data.onboardingDone ?? false,
            activeActivity: null,
          });
          return true;
        } catch {
          return false;
        }
      },

      reset: () => set(defaultState),
    }),
    {
      name: "saltbox-gather-v1",
      storage: createJSONStorage(() => localStorage),
      version: SCHEMA_VERSION,
      migrate: (state, version) => {
        if (version === 0) {
          return { ...defaultState, ...(state as Partial<GatherState>) };
        }
        return state as GatherState;
      },
    }
  )
);
