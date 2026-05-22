import { useState, useEffect, useCallback } from "react";
import {
  api,
  type NurseryIdeaDetail,
  type NurseryProducer,
  type IdeaStage,
  type StageHistoryEntry,
} from "@/lib/api";
import { ArrowLeft, Leaf, Trash2, X, AlertTriangle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface IdeaBriefPageProps {
  ideaId: string;
  producer: NurseryProducer;
  onBack: () => void;
}

const STAGE_LABELS: Record<IdeaStage, string> = {
  nursery: "Nursery",
  fodder: "Fodder",
  fallow: "Fallow",
  graduated: "Graduated",
};

const STAGE_STYLES: Record<IdeaStage | "draft", { badge: string; bg: string; border: string }> = {
  nursery:   { badge: "bg-[#EBF3EE] text-[#4A7C59]", bg: "bg-[#F7FCF8]", border: "border-[#B8D9C3]" },
  fodder:    { badge: "bg-[#FEF3EE] text-[#C7613B]", bg: "bg-[#FFF9F6]", border: "border-[#F5C9B3]" },
  fallow:    { badge: "bg-[#EFF4F0] text-[#6B8F71]", bg: "bg-[#F8FAF8]", border: "border-[#BDD4C1]" },
  graduated: { badge: "bg-[#F0F0F0] text-[#3D3D3D]", bg: "bg-[#F8F8F8]", border: "border-[#C8C8C8]" },
  draft:     { badge: "bg-[#F0E9DF] text-[#7A6B60]", bg: "bg-[#FFFDF9]", border: "border-[#E4D9CC]" },
};

const ALLOWED_TRANSITIONS: Record<IdeaStage, IdeaStage[]> = {
  nursery:   ["fodder", "fallow", "graduated"],
  fodder:    ["fallow", "graduated"],
  fallow:    ["nursery", "fodder", "graduated"],
  graduated: [],
};

export function IdeaBriefPage({ ideaId, producer, onBack }: IdeaBriefPageProps) {
  const [idea, setIdea] = useState<NurseryIdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showStageMove, setShowStageMove] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditNotes, setShowEditNotes] = useState(false);

  const loadIdea = useCallback(async () => {
    try {
      const data = await api.getIdea(ideaId);
      setIdea(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load idea");
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => { loadIdea(); }, [loadIdea]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      await api.addComment(ideaId, comment.trim());
      setComment("");
      await loadIdea();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  }

  async function approveDraft() {
    if (!idea) return;
    try {
      await api.updateIdea(ideaId, { isDraft: false });
      await loadIdea();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve");
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-sm text-[#7A6B60]">Loading…</p>
      </div>
    );
  }

  if (error && !idea) {
    return (
      <div className="min-h-dvh bg-[#FAF6F0] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-[#C7613B] mb-4">{error}</p>
          <button onClick={onBack} className="text-sm text-[#4A7C59] underline">Go back</button>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const stageKey = idea.isDraft ? "draft" : idea.stage;
  const styles = STAGE_STYLES[stageKey];
  const transitions = ALLOWED_TRANSITIONS[idea.stage];

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-[#FFFDF9] border-b border-[#E4D9CC] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#7A6B60] hover:text-[#2E2620] transition-colors min-h-[36px]">
            <ArrowLeft className="w-4 h-4" />
            Garden floor
          </button>
          <div className="flex items-center gap-2">
            {producer.isSteward && !idea.isDraft && idea.stage !== "graduated" && transitions.length > 0 && (
              <button
                onClick={() => setShowStageMove(true)}
                className="px-3 py-2 rounded-lg text-xs bg-[#EBF3EE] text-[#4A7C59] hover:bg-[#D9EBE1] transition-colors min-h-[36px]"
              >
                Move stage
              </button>
            )}
            {producer.isSteward && idea.isDraft && (
              <button
                onClick={approveDraft}
                className="px-3 py-2 rounded-lg text-xs bg-[#4A7C59] text-white hover:bg-[#3D6B4A] transition-colors min-h-[36px]"
              >
                Approve idea
              </button>
            )}
            {producer.isSteward && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg text-[#C7613B] hover:bg-[#FEF3EE] transition-colors min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Stage badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${styles.badge}`}>
            <Leaf className="w-3 h-3" />
            {idea.isDraft ? "Draft · awaiting steward review" : STAGE_LABELS[idea.stage]}
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl text-[#2E2620] leading-snug mb-2">{idea.title}</h1>
          <p className="text-sm text-[#7A6B60]">
            Added by {idea.createdByProducerName} · {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
          </p>
        </div>

        {/* Problem statement */}
        {idea.problemStatement && (
          <Section title="Problem statement">
            <p className="text-[#2E2620] text-sm leading-relaxed whitespace-pre-wrap">{idea.problemStatement}</p>
          </Section>
        )}

        {/* Both-sides panel */}
        {(idea.vernacularName || idea.massityName) && (
          <Section title="Both sides of the fence">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TranslationPanel
                label="Vernacular"
                subtitle="How producers say it"
                text={idea.vernacularName}
                accent="#4A7C59"
                bg="#EBF3EE"
                border="#B8D9C3"
              />
              <TranslationPanel
                label="Massity"
                subtitle="Institution / formal register"
                text={idea.massityName}
                accent="#3D3D3D"
                bg="#F0F0F0"
                border="#C8C8C8"
              />
            </div>
          </Section>
        )}

        {/* Steward notes */}
        {producer.isSteward && (
          <Section
            title="Steward notes"
            action={
              <button
                onClick={() => setShowEditNotes(true)}
                className="text-xs text-[#4A7C59] hover:underline"
              >
                Edit
              </button>
            }
          >
            {idea.stewardNotes ? (
              <p className="text-[#2E2620] text-sm leading-relaxed whitespace-pre-wrap">{idea.stewardNotes}</p>
            ) : (
              <p className="text-[#A89A8E] text-sm italic">No steward notes yet.</p>
            )}
          </Section>
        )}

        {/* Stage history */}
        {idea.stageHistory && (idea.stageHistory as StageHistoryEntry[]).length > 0 && (
          <Section title="Movement log">
            <StageTimeline history={idea.stageHistory as StageHistoryEntry[]} initialStage="nursery" />
          </Section>
        )}

        {/* Comments */}
        <Section title={`Discussion (${idea.comments.length})`}>
          <div className="space-y-4 mb-4">
            {idea.comments.length === 0 ? (
              <p className="text-sm text-[#A89A8E] italic">No comments yet. Be first to weigh in.</p>
            ) : (
              idea.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EBF3EE] flex items-center justify-center flex-shrink-0 text-xs font-medium text-[#4A7C59]">
                    {c.producerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-xs font-medium text-[#2E2620]">{c.producerName}</span>
                      <span className="text-xs text-[#A89A8E]">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-[#4A3F38] leading-relaxed whitespace-pre-wrap">{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#A89A8E] focus:outline-none focus:border-[#4A7C59] transition-colors"
            />
            <button
              type="submit"
              disabled={submittingComment || !comment.trim()}
              className="px-4 py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              {submittingComment ? "…" : "Post"}
            </button>
          </form>
        </Section>

        {error && (
          <p className="text-sm text-[#C7613B] bg-[#FEF3EE] rounded-lg px-4 py-3 border border-[#F5C9B3]">
            {error}
          </p>
        )}
      </div>

      {/* Stage move modal */}
      {showStageMove && (
        <StageMoveModal
          idea={idea}
          transitions={transitions}
          onClose={() => setShowStageMove(false)}
          onMoved={() => { setShowStageMove(false); loadIdea(); }}
        />
      )}

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          title={idea.title}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            await api.deleteIdea(ideaId);
            onBack();
          }}
        />
      )}

      {/* Edit notes modal */}
      {showEditNotes && (
        <EditNotesModal
          current={idea.stewardNotes}
          onClose={() => setShowEditNotes(false)}
          onSaved={async (notes) => {
            await api.updateIdea(ideaId, { stewardNotes: notes });
            setShowEditNotes(false);
            await loadIdea();
          }}
        />
      )}
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function TranslationPanel({ label, subtitle, text, accent, bg, border }: {
  label: string; subtitle: string; text: string; accent: string; bg: string; border: string;
}) {
  return (
    <div className="rounded-xl border p-4" style={{ background: bg, borderColor: border }}>
      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: accent }}>{label}</p>
      <p className="text-xs mb-2" style={{ color: "#7A6B60" }}>{subtitle}</p>
      {text ? (
        <p className="text-sm text-[#2E2620] italic leading-relaxed">"{text}"</p>
      ) : (
        <p className="text-sm text-[#A89A8E]">Not yet defined</p>
      )}
    </div>
  );
}

function StageTimeline({ history, initialStage }: { history: StageHistoryEntry[]; initialStage: IdeaStage }) {
  const dotColors: Record<IdeaStage, string> = {
    nursery: "#4A7C59",
    fodder: "#C7613B",
    fallow: "#6B8F71",
    graduated: "#3D3D3D",
  };
  return (
    <ol className="space-y-3">
      {history.map((entry, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: dotColors[entry.stage] }} />
            {i < history.length - 1 && <div className="w-px flex-1 bg-[#E4D9CC] mt-1" />}
          </div>
          <div className="pb-3">
            <span className="font-medium text-[#2E2620]">{STAGE_LABELS[entry.stage]}</span>
            {entry.note && <span className="text-[#7A6B60]"> — {entry.note}</span>}
            <div className="text-xs text-[#A89A8E] mt-0.5">
              {entry.movedBy} · {format(new Date(entry.movedAt), "MMM d, yyyy")}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StageMoveModal({ idea, transitions, onClose, onMoved }: {
  idea: NurseryIdeaDetail;
  transitions: IdeaStage[];
  onClose: () => void;
  onMoved: () => void;
}) {
  const [target, setTarget] = useState<IdeaStage | "">("");
  const [note, setNote] = useState("");
  const [graduationReason, setGraduationReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMove() {
    if (!target) return;
    if (target === "graduated" && !graduationReason.trim()) {
      setError("A reason is required to graduate an idea.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.moveStage(idea.id, target, note.trim() || undefined, graduationReason.trim() || undefined);
      onMoved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to move");
    } finally {
      setLoading(false);
    }
  }

  const STAGE_DESC: Record<IdeaStage, string> = {
    nursery:   "forming, tender",
    fodder:    "returned, carries history",
    fallow:    "resting, not forgotten",
    graduated: "handed to Zone 3 board",
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg text-[#2E2620]">Move stage</h3>
          <button onClick={onClose} className="text-[#7A6B60]"><X className="w-4 h-4" /></button>
        </div>

        <p className="text-sm text-[#7A6B60] mb-4">Currently in <strong className="text-[#2E2620]">{STAGE_LABELS[idea.stage]}</strong>. Move it to:</p>

        <div className="space-y-2 mb-4">
          {transitions.map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                target === t
                  ? "border-[#4A7C59] bg-[#EBF3EE]"
                  : "border-[#E4D9CC] hover:border-[#B8D9C3]"
              }`}
            >
              <div className="text-sm font-medium text-[#2E2620]">{STAGE_LABELS[t]}</div>
              <div className="text-xs text-[#7A6B60]">{STAGE_DESC[t]}</div>
            </button>
          ))}
        </div>

        {target && (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                Movement note <span className="font-normal normal-case text-[#7A6B60]">(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why this move?"
                className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm focus:outline-none focus:border-[#4A7C59] transition-colors"
              />
            </div>

            {target === "graduated" && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                  Graduation reason <span className="text-[#C7613B]">*</span>
                </label>
                <textarea
                  value={graduationReason}
                  onChange={(e) => setGraduationReason(e.target.value)}
                  rows={3}
                  placeholder="What makes this ready for the Zone 3 board?"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm focus:outline-none focus:border-[#4A7C59] transition-colors resize-none"
                  required
                />
                <p className="text-xs text-[#A89A8E] mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-[#C7613B]" />
                  This action is deliberate and records graduation. The Zone 3 board vote happens offline.
                </p>
              </div>
            )}
          </>
        )}

        {error && <p className="text-sm text-[#C7613B] mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={!target || loading || (target === "graduated" && !graduationReason.trim())}
            className="flex-1 py-2.5 rounded-xl text-sm bg-[#4A7C59] text-white disabled:opacity-50 transition-colors"
          >
            {loading ? "Moving…" : "Move"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ title, onClose, onConfirm }: {
  title: string; onClose: () => void; onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-lg text-[#2E2620] mb-2">Delete idea?</h3>
        <p className="text-sm text-[#7A6B60] mb-5">
          This will permanently remove "<strong>{title}</strong>" and all its history. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">
            Cancel
          </button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); }}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm bg-[#C7613B] text-white disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditNotesModal({ current, onClose, onSaved }: {
  current: string; onClose: () => void; onSaved: (notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(current);
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[#2E2620]">Edit steward notes</h3>
          <button onClick={onClose} className="text-[#7A6B60]"><X className="w-4 h-4" /></button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] focus:outline-none focus:border-[#4A7C59] transition-colors resize-none mb-4"
          placeholder="Internal notes for the steward…"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC]">Cancel</button>
          <button
            onClick={async () => { setLoading(true); await onSaved(notes); }}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm bg-[#4A7C59] text-white disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
