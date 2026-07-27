export type ZoneId = "Z0" | "Z1" | "Z2" | "Z3" | "Z4" | "Z5";

/**
 * AgentRole — named persona for an agent actor.
 *
 * Each role has a distinct responsibility in the Buzz layer. New roles should
 * be added here and documented in AGENT_ROLE_REGISTRY in relay-stub.ts.
 *
 *   river-smith         — nightly strategic review across the seven dimensions
 *   critical-challenger — surfaces counter-arguments and risk flags
 *   r-and-d             — research, discovery, and prototype proposals
 *   ops                 — stability, operations, and scheduling signals
 */
export type AgentRole = "river-smith" | "critical-challenger" | "r-and-d" | "ops";

export interface Constellation {
  id: string;
  slug: string;
  name: string;
  notes: string;
  zone: ZoneId;
  urls: { label: string; url: string }[];
  /** @deprecated use urls */
  url?: string;
  /** @deprecated use urls */
  deepLinks: { label: string; path: string }[];
  colorVar: string;
  active: boolean;
  /**
   * ══════════════════════════════════════════════════════════════════════
   * EAVE RULE — Two-Gate Constitutional Model
   * ══════════════════════════════════════════════════════════════════════
   *
   * The Eave is the protective overhang and hard structural seam that shelters
   * Zone 1 (Circle — private household identity) and Zone 2 (Workbench —
   * operational practitioner layer) from Zone 3 (Community — XRPL wallet,
   * above-board organizational identity).
   * It is defined by intentional architectural absence with two controlled gates:
   *
   * Z1–Z3 absolute prohibition: No direct or composable path may ever connect
   * a Zone 3 wallet address, derived identifier, zone-bind payload, or zone-bind
   * signature to any Zone 1 household record (name + passphrase identity). This
   * includes any path that traverses Zone 2 as an intermediate hop.
   *
   * Z2–Z3 Gate: Contractor identification may appear in controlled, auditable
   * form at the crossing (e.g. for contracts or audit events), but must not
   * persist as a stored reference inside Z2-scoped records (DailyPick, Contract,
   * or equivalent). The giraffe (audit / regulatory visibility) may have sight
   * across this gate, but the audit query shape must not be composable into a
   * Z3 → Z1 reverse lookup.
   *
   * Z1–Z2 Gate: Household context may cross in controlled form (enough to know
   * whose work this is), but remains gated and does not expose private identity
   * outward toward Z3.
   *
   * A household may voluntarily bind its own XRPL wallet using `lib/zone-identity`
   * primitives, stored as a one-way, non-reversible reference. The binding never
   * permits reverse lookup.
   *
   * Any proposed feature, route, migration, or type field that violates these
   * constraints — including the existing `linkedFamilyId` and `linkedShareToken`
   * fields on the `Constellation` type — must be refused or redesigned to respect
   * both gates and the absolute Z1–Z3 prohibition.
   * ══════════════════════════════════════════════════════════════════════
   */
  linkedFamilyId?: string;
  linkedShareToken?: string;
}

export interface Contract {
  id: string;
  name: string;
  constellationId: string;
  weeklyHourTarget: number;
  active: boolean;
  endsOn?: string;
  createdAt: string;
}

export interface ContractMilestone {
  id: string;
  contractId: string;
  description: string;
  /** z3npub of the signing party attesting this milestone. */
  attestedBy: string;
  attestedAt: string; // ISO datetime
}
export interface DailyPick {
  date: string;
  constellationIds: string[];
  pickedAt: string;
  reflection?: string;
  eveningNote?: string;
  hoursByZone?: Partial<Record<ZoneId, number>>;
  acknowledgedGuardrails?: string[];
  /** Discriminates whether this pick was set by a human or an agent. Defaults to "human". */
  actor_type?: "human" | "agent";
  /**
   * Named role of the agent that created or last modified this pick.
   * Only meaningful when actor_type is "agent". Omitted for human-authored picks.
   */
  agent_role?: AgentRole;
}

export interface WeeklyReview {
  weekKey: string;
  shipped: string;
  stalled: string;
  nextIntention: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeasonalReview {
  seasonKey: string;
  whatChanged: string;
  zonesShifted: string;
  statementReflection: string;
  createdAt: string;
  updatedAt: string;
}

export interface Capture {
  id: string;
  createdAt: string;
  text?: string;
  blobId?: string;
  /** Optional zone tag for routing captures into the correct Zone 2 context. */
  zone?: ZoneId;
}

export interface HatLabel {
  address: string;
  label: string;
}

export interface GmailAccount {
  id: string;
  address: string;
  label: string;
  fullName: string;
  enabled: boolean;
  isAlias?: boolean;
  aliasNote?: string;
}

export interface WorkbenchPlan {
  phase: string;
  burstMinutes: number | null;
  windows: string;
  windowNotes: string;
  notes: string;
  updatedAt: string;
}

export interface AppState {
  schemaVersion: number;
  installedAt: string;
  onboarding: {
    completed: boolean;
    completedAt?: string;
    step?: number;
  };
  statement?: {
    who: string;
    why: string;
    noFly: string;
    updatedAt: string;
  };
  zoneRanking: ZoneId[];
  constellations: Constellation[];
  contracts: Contract[];
  contractMilestones: ContractMilestone[];
  dailyPicks: Record<string, DailyPick>;
  weeklyReviews: WeeklyReview[];
  seasonalReviews: SeasonalReview[];
  guide: {
    lastSectionByChapter: Record<string, string>;
    lastOpenedAt?: string;
    bookmarkChapterId?: string;
  };
  captures: Capture[];
  dismissedNudges: Record<string, string>;
  pendingReplies: Record<string, { deferredCount: number; lastDeferred?: string; doneAt?: string }>;
  inbox: {
    keywords: string[];
    senders: string[];
    enabled: boolean;
    hatLabels: HatLabel[];
    lastSavedAt?: string;
  };
  gmailAccounts: GmailAccount[];
  lastBackedUpAt?: string;
  contentBank: ContentBankItem[];
  workbenchPlan?: WorkbenchPlan;
  channels: ChannelMeta[];
}

export interface StoreActions {
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  setStatement: (s: { who: string; why: string; noFly: string }) => void;
  addConstellation: (c: Omit<Constellation, "id" | "slug" | "colorVar">) => void;
  updateConstellation: (id: string, patch: Partial<Constellation>) => void;
  removeConstellation: (id: string) => void;
  addContract: (c: Omit<Contract, "id" | "createdAt">) => void;
  updateContract: (id: string, patch: Partial<Contract>) => void;
  removeContract: (id: string) => void;
  attestMilestone: (milestone: Omit<ContractMilestone, "id" | "attestedAt">) => void;
  setZoneRanking: (z: ZoneId[]) => void;
  getTodayPick: () => DailyPick;
  setTodayPick: (patch: Partial<DailyPick>) => void;
  addCapture: (c: Omit<Capture, "id" | "createdAt">) => void;
  dismissNudge: (key: string) => void;
  saveWeeklyReview: (r: Omit<WeeklyReview, "createdAt" | "updatedAt">) => void;
  saveSeasonalReview: (r: Omit<SeasonalReview, "createdAt" | "updatedAt">) => void;
  setGuideProgress: (chapterId: string, sectionId: string) => void;
  setGuideBookmark: (chapterId: string) => void;
  updateInbox: (patch: Partial<AppState["inbox"]>) => void;
  updateGmailAccount: (id: string, patch: Partial<GmailAccount>) => void;
  setPendingReply: (threadId: string, patch: Partial<AppState["pendingReplies"][string]>) => void;
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  resetAll: () => void;
  setLastBackedUp: () => void;
  addToContentBank: (item: Omit<ContentBankItem, "id" | "taggedAt">) => void;
  updateContentBankItem: (id: string, patch: Partial<ContentBankItem>) => void;
  removeFromContentBank: (id: string) => void;
  setWorkbenchPlan: (plan: Omit<WorkbenchPlan, "updatedAt">) => void;
  addChannel: (c: Pick<ChannelMeta, "label" | "category" | "expiresAt" | "createdBy">) => void;
  expireChannel: (id: string) => void;
}

export type ArchiveContentType =
  | "course-material"
  | "email-sequence"
  | "case-study"
  | "voice-sample"
  | "discard";

export interface ContentBankItem {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  zone: ZoneId;
  contentType: ArchiveContentType;
  notes: string;
  taggedAt: string;
}

export type ChannelCategory = "workbench" | "helping-hands" | "briefing" | "lab" | "main";

export interface ChannelMeta {
  id: string;
  label: string;
  category: ChannelCategory;
  /** ISO string — if present the channel is ephemeral and auto-expires at this time */
  expiresAt?: string;
  createdAt: string;
  createdBy: DailyPick["actor_type"];
  /** ISO string set when the channel is explicitly archived or has expired */
  archivedAt?: string;
}

export type Store = AppState & StoreActions;
