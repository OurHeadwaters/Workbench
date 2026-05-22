const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE.replace("/nursery", "")}/api/nursery`;

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  join: (name: string, passphrase: string, inviteCode?: string) =>
    req<{ producer: NurseryProducer }>("POST", "/producers", { name, passphrase, inviteCode }),
  login: (name: string, passphrase: string) =>
    req<{ producer: NurseryProducer }>("POST", "/sessions", { name, passphrase }),
  logout: () => req<void>("DELETE", "/sessions"),
  me: () => req<NurseryProducer>("GET", "/me"),

  // Invites (steward only)
  listInvites: () => req<NurseryInvite[]>("GET", "/invites"),
  createInvite: (note: string, isStewardInvite: boolean) =>
    req<NurseryInvite>("POST", "/invites", { note, isStewardInvite }),
  revokeInvite: (id: string) => req<void>("DELETE", `/invites/${id}`),

  // Ideas
  listIdeas: () => req<NurseryIdea[]>("GET", "/ideas"),
  getIdea: (id: string) => req<NurseryIdeaDetail>("GET", `/ideas/${id}`),
  createIdea: (data: CreateIdeaInput) => req<NurseryIdea>("POST", "/ideas", data),
  updateIdea: (id: string, data: UpdateIdeaInput) => req<NurseryIdea>("PATCH", `/ideas/${id}`, data),
  deleteIdea: (id: string) => req<void>("DELETE", `/ideas/${id}`),
  moveStage: (id: string, stage: IdeaStage, note?: string, graduationReason?: string) =>
    req<NurseryIdea>("POST", `/ideas/${id}/stage`, { stage, note, graduationReason }),

  // Comments
  listComments: (ideaId: string) => req<NurseryComment[]>("GET", `/ideas/${ideaId}/comments`),
  addComment: (ideaId: string, body: string) =>
    req<NurseryComment>("POST", `/ideas/${ideaId}/comments`, { body }),
};

export type IdeaStage = "nursery" | "fodder" | "fallow" | "graduated";

export interface NurseryProducer {
  id: string;
  name: string;
  isSteward: boolean;
  createdAt: string;
}

export interface NurseryInvite {
  id: string;
  code: string;
  note: string;
  isStewardInvite: boolean;
  createdAt: string;
  usedAt: string | null;
  usedByProducerName: string | null;
}

export interface NurseryIdea {
  id: string;
  title: string;
  vernacularName: string;
  massityName: string;
  problemStatement: string;
  stage: IdeaStage;
  stageHistory: StageHistoryEntry[];
  stewardNotes: string;
  isDraft: boolean;
  graduationReason: string | null;
  createdByProducerId: string;
  createdByProducerName: string;
  updatedAt: string;
  createdAt: string;
}

export interface NurseryIdeaDetail extends NurseryIdea {
  comments: NurseryComment[];
}

export interface StageHistoryEntry {
  stage: IdeaStage;
  movedAt: string;
  movedBy: string;
  note: string;
}

export interface NurseryComment {
  id: string;
  ideaId: string;
  producerId: string;
  producerName: string;
  body: string;
  createdAt: string;
}

export interface CreateIdeaInput {
  title: string;
  vernacularName?: string;
  massityName?: string;
  problemStatement?: string;
  stewardNotes?: string;
  isDraft?: boolean;
}

export interface UpdateIdeaInput {
  title?: string;
  vernacularName?: string;
  massityName?: string;
  problemStatement?: string;
  stewardNotes?: string;
  isDraft?: boolean;
}
