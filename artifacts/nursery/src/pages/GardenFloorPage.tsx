import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { api, type NurseryIdea, type NurseryProducer, type IdeaStage, type CreateIdeaInput } from "@/lib/api";
import { Leaf, Plus, X, LogOut, KeyRound } from "lucide-react";
import { IdeaCard } from "@/components/IdeaCard";
import { InvitePanel } from "@/components/InvitePanel";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STAGES: { key: IdeaStage; label: string; description: string }[] = [
  { key: "nursery", label: "Nursery", description: "forming, tender" },
  { key: "fodder", label: "Fodder", description: "returned, carries history" },
  { key: "fallow", label: "Fallow", description: "resting, not forgotten" },
  { key: "graduated", label: "Graduated", description: "handed to Zone 3 board" },
];

interface GardenFloorPageProps {
  producer: NurseryProducer;
  onSignOut: () => void;
}

export function GardenFloorPage({ producer, onSignOut }: GardenFloorPageProps) {
  const [ideas, setIdeas] = useState<NurseryIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [, navigate] = useLocation();

  const loadIdeas = useCallback(async () => {
    try {
      const data = await api.listIdeas();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ideas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const activeIdeas = ideas.filter((i) => i.stage !== "graduated" && !i.isDraft);
  const draftIdeas = ideas.filter((i) => i.isDraft);
  const graduatedIdeas = ideas.filter((i) => i.stage === "graduated");

  const ideasByStage = (stage: IdeaStage) => activeIdeas.filter((i) => i.stage === stage);

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-[#FFFDF9] border-b border-[#E4D9CC] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EBF3EE] flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 h-4 text-[#4A7C59]" />
            </div>
            <div>
              <h1 className="text-lg text-[#2E2620] leading-none">Zone 4 Nursery</h1>
              <p className="text-xs text-[#7A6B60] mt-0.5">{producer.name}{producer.isSteward ? " · steward" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {producer.isSteward && (
              <button
                onClick={() => setShowInvites(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#4A7C59] hover:bg-[#EBF3EE] transition-colors min-h-[36px]"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Invites
              </button>
            )}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#7A6B60] hover:bg-[#F0E9DF] transition-colors min-h-[36px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <p className="text-sm text-[#C7613B] bg-[#FEF3EE] rounded-lg px-4 py-3 border border-[#F5C9B3] mb-6">
            {error}
          </p>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl text-[#2E2620]">Garden floor</h2>
            <p className="text-sm text-[#7A6B60] mt-1">{activeIdeas.length} active {activeIdeas.length === 1 ? "idea" : "ideas"}</p>
          </div>
          <div className="flex items-center gap-2">
            {!producer.isSteward && (
              <button
                onClick={() => setShowProblemForm(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EBF3EE] text-[#4A7C59] rounded-xl text-sm font-medium hover:bg-[#D9EBE1] transition-colors min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                Flag a problem
              </button>
            )}
            {producer.isSteward && (
              <button
                onClick={() => setShowNewForm(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-[#3D6B4A] transition-colors min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                New idea
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#7A6B60] text-sm">Loading the garden floor…</div>
        ) : activeIdeas.length === 0 && draftIdeas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#EBF3EE] flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-7 h-7 text-[#4A7C59]" />
            </div>
            <h3 className="text-xl text-[#2E2620] mb-2">The floor is bare</h3>
            <p className="text-sm text-[#7A6B60]">
              {producer.isSteward
                ? "Create the first idea to get the nursery growing."
                : "Flag a problem and the steward will tend it into an idea."}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Draft ideas (steward review queue) */}
            {producer.isSteward && draftIdeas.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#C7613B]" />
                  <h3 className="text-sm font-medium text-[#4A3F38] uppercase tracking-wide">
                    Awaiting review ({draftIdeas.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {draftIdeas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onClick={() => navigate(`${BASE}/idea/${idea.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Active stages */}
            {STAGES.filter((s) => s.key !== "graduated").map(({ key, label, description }) => {
              const stageIdeas = ideasByStage(key);
              if (stageIdeas.length === 0) return null;
              return (
                <section key={key}>
                  <div className="flex items-center gap-2 mb-4">
                    <StageDot stage={key} />
                    <div>
                      <h3 className="text-sm font-medium text-[#4A3F38] uppercase tracking-wide inline">
                        {label}
                      </h3>
                      <span className="text-xs text-[#A89A8E] ml-2">{description}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stageIdeas.map((idea) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        onClick={() => navigate(`${BASE}/idea/${idea.id}`)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Graduated shelf */}
        {graduatedIdeas.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#E4D9CC]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#3D3D3D]" />
              <h3 className="text-sm font-medium text-[#4A3F38] uppercase tracking-wide">
                Graduated ({graduatedIdeas.length})
              </h3>
              <span className="text-xs text-[#A89A8E]">handed to Zone 3 board</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {graduatedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => navigate(`${BASE}/idea/${idea.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* New idea modal (steward) */}
      {showNewForm && (
        <NewIdeaModal
          onClose={() => setShowNewForm(false)}
          onCreated={() => { setShowNewForm(false); loadIdeas(); }}
        />
      )}

      {/* Flag problem modal (producer) */}
      {showProblemForm && (
        <FlagProblemModal
          onClose={() => setShowProblemForm(false)}
          onCreated={() => { setShowProblemForm(false); loadIdeas(); }}
        />
      )}

      {/* Invite panel (steward) */}
      {showInvites && (
        <InvitePanel producer={producer} onClose={() => setShowInvites(false)} />
      )}
    </div>
  );
}

function StageDot({ stage }: { stage: IdeaStage }) {
  const colors: Record<IdeaStage, string> = {
    nursery: "bg-[#4A7C59]",
    fodder: "bg-[#C7613B]",
    fallow: "bg-[#6B8F71]",
    graduated: "bg-[#3D3D3D]",
  };
  return <div className={`w-2 h-2 rounded-full ${colors[stage]}`} />;
}

function NewIdeaModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [vernacular, setVernacular] = useState("");
  const [massity, setMassity] = useState("");
  const [problem, setProblem] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data: CreateIdeaInput = {
        title: title.trim(),
        vernacularName: vernacular.trim(),
        massityName: massity.trim(),
        problemStatement: problem.trim(),
        stewardNotes: notes.trim(),
      };
      await api.createIdea(data);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create idea");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="New idea" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 807 dog-treats abattoir co-op"
            className={inputCls}
            required
            autoFocus
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vernacular name">
            <input type="text" value={vernacular} onChange={(e) => setVernacular(e.target.value)} placeholder="How producers say it" className={inputCls} />
          </Field>
          <Field label="Massity name">
            <input type="text" value={massity} onChange={(e) => setMassity(e.target.value)} placeholder="Formal / institution" className={inputCls} />
          </Field>
        </div>
        <Field label="Problem statement">
          <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} placeholder="What problem does this address?" className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Steward notes">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Internal notes for the steward" className={`${inputCls} resize-none`} />
        </Field>
        {error && <p className="text-sm text-[#C7613B]">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">Cancel</button>
          <button type="submit" disabled={loading || !title.trim()} className="flex-1 py-2.5 rounded-xl text-sm bg-[#4A7C59] text-white disabled:opacity-50 transition-colors">
            {loading ? "Creating…" : "Create idea"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function FlagProblemModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.createIdea({ title: title.trim(), problemStatement: problem.trim(), isDraft: true });
      setDone(true);
      setTimeout(onCreated, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Flag a problem" onClose={onClose}>
      {done ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-[#EBF3EE] flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-5 h-5 text-[#4A7C59]" />
          </div>
          <p className="text-sm text-[#4A7C59] font-medium">Problem flagged</p>
          <p className="text-xs text-[#7A6B60] mt-1">The steward will review it soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[#7A6B60]">Describe a problem you're seeing on the land or in the market. The steward will turn it into an idea when they're ready.</p>
          <Field label="Problem title" required>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short name for the problem" className={inputCls} required autoFocus />
          </Field>
          <Field label="Details (optional)">
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} placeholder="What you're seeing, when, where" className={`${inputCls} resize-none`} />
          </Field>
          {error && <p className="text-sm text-[#C7613B]">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">Cancel</button>
            <button type="submit" disabled={loading || !title.trim()} className="flex-1 py-2.5 rounded-xl text-sm bg-[#4A7C59] text-white disabled:opacity-50">
              {loading ? "Submitting…" : "Submit problem"}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] w-full max-w-md p-6 shadow-xl max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg text-[#2E2620]">{title}</h3>
          <button onClick={onClose} className="text-[#7A6B60] hover:text-[#2E2620] p-1 -mr-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-[#C7613B] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#A89A8E] focus:outline-none focus:border-[#4A7C59] transition-colors";
