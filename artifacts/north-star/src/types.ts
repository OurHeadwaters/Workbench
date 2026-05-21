export type ZoneId = "Z0" | "Z1" | "Z2" | "Z3" | "Z4" | "Z5";

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

export interface DailyPick {
  date: string;
  constellationIds: string[];
  pickedAt: string;
  reflection?: string;
  hoursByZone?: Partial<Record<ZoneId, number>>;
  acknowledgedGuardrails?: string[];
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

export type Store = AppState & StoreActions;
