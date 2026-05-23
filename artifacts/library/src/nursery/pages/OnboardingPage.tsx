import { useState } from "react";
import { api, type NurseryProducer, type CreateIdeaInput } from "../lib/api";
import { Leaf, ChevronRight, Check } from "lucide-react";

interface OnboardingPageProps {
  producer: NurseryProducer;
  onDone: () => void;
}

type Step = "welcome" | "problem" | "translations" | "notes" | "done";

const SEED_IDEA = {
  title: "807 dog-treats / abattoir capacity co-op",
  vernacularName: "the dog-treats problem",
  massityName: "Zone 4 abattoir capacity cooperative",
  problemStatement:
    "Small ruminant producers in Zone 4 face a chronic abattoir access bottleneck. The existing facilities are sized for beef and don't accommodate goat, sheep, or specialty processing without long waits or costly travel. Meanwhile, the 807 local food market (including the growing pet-treat segment) can't source consistent volume. A producer-owned or producer-pooled abattoir co-op could solve both sides: predictable processing access for producers and reliable supply for local buyers.",
  stewardNotes:
    "Seed idea brought to the first nursery session. Keep it in Nursery while we map the active producers. Key question: is the abattoir co-op model the right vehicle or should this go through the existing regional facility with a booking protocol? Put both framings in fodder before graduating.",
};

export function OnboardingPage({ producer, onDone }: OnboardingPageProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [formData, setFormData] = useState<CreateIdeaInput>({
    title: SEED_IDEA.title,
    vernacularName: SEED_IDEA.vernacularName,
    massityName: SEED_IDEA.massityName,
    problemStatement: SEED_IDEA.problemStatement,
    stewardNotes: SEED_IDEA.stewardNotes,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      await api.createIdea(formData);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create idea");
    } finally {
      setLoading(false);
    }
  }

  const steps: Step[] = ["welcome", "problem", "translations", "notes"];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="flex flex-col">
      {step !== "done" && (
        <div className="flex items-center justify-center gap-2 pb-6">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i <= stepIdx ? "w-6 bg-[#4A7C59]" : "w-3 bg-[#E4D9CC]"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="w-full max-w-lg">
          {step === "welcome" && (
            <WelcomeStep producerName={producer.name} onNext={() => setStep("problem")} />
          )}
          {step === "problem" && (
            <ProblemStep
              title={formData.title ?? ""}
              problemStatement={formData.problemStatement ?? ""}
              onTitle={(v) => setFormData((d) => ({ ...d, title: v }))}
              onProblem={(v) => setFormData((d) => ({ ...d, problemStatement: v }))}
              onNext={() => setStep("translations")}
              onBack={() => setStep("welcome")}
            />
          )}
          {step === "translations" && (
            <TranslationsStep
              vernacular={formData.vernacularName ?? ""}
              massity={formData.massityName ?? ""}
              onVernacular={(v) => setFormData((d) => ({ ...d, vernacularName: v }))}
              onMassity={(v) => setFormData((d) => ({ ...d, massityName: v }))}
              onNext={() => setStep("notes")}
              onBack={() => setStep("problem")}
            />
          )}
          {step === "notes" && (
            <NotesStep
              notes={formData.stewardNotes ?? ""}
              onNotes={(v) => setFormData((d) => ({ ...d, stewardNotes: v }))}
              loading={loading}
              error={error}
              onCreate={handleCreate}
              onBack={() => setStep("translations")}
            />
          )}
          {step === "done" && (
            <DoneStep onDone={onDone} />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ producerName, onNext }: { producerName: string; onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-[#EBF3EE] flex items-center justify-center mx-auto mb-6">
        <Leaf className="w-7 h-7 text-[#4A7C59]" />
      </div>
      <h1 className="text-3xl text-[#2E2620] mb-3">Welcome, {producerName}</h1>
      <p className="text-[#7A6B60] mb-2 leading-relaxed">
        You're the first steward in the Zone 4 Nursery.
      </p>
      <p className="text-sm text-[#7A6B60] mb-8 leading-relaxed max-w-sm mx-auto">
        The nursery is where your group logs problems, shapes ideas, and moves them through a lifecycle before they reach the Zone 3 board. Let's plant the first seed together.
      </p>
      <p className="text-xs text-[#A89A8E] mb-8">
        We'll walk you through creating the 807 dog-treats / abattoir idea — a real problem the group is already sitting with. You can edit anything.
      </p>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-[#3D6B4A] transition-colors"
      >
        Plant the first idea
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ProblemStep({ title, problemStatement, onTitle, onProblem, onNext, onBack }: {
  title: string; problemStatement: string;
  onTitle: (v: string) => void; onProblem: (v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-[#4A7C59] font-medium uppercase tracking-wide mb-1">Step 1 of 3</p>
        <h2 className="text-2xl text-[#2E2620] mb-2">Name the problem</h2>
        <p className="text-sm text-[#7A6B60]">
          Every idea starts as a problem someone is living. Give it a working title and write what you're seeing.
        </p>
      </div>
      <div className="space-y-4">
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Problem statement">
          <textarea
            value={problemStatement}
            onChange={(e) => onProblem(e.target.value)}
            rows={6}
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>
      <StepNav onBack={onBack} onNext={onNext} canNext={!!title.trim()} />
    </div>
  );
}

function TranslationsStep({ vernacular, massity, onVernacular, onMassity, onNext, onBack }: {
  vernacular: string; massity: string;
  onVernacular: (v: string) => void; onMassity: (v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-[#4A7C59] font-medium uppercase tracking-wide mb-1">Step 2 of 3</p>
        <h2 className="text-2xl text-[#2E2620] mb-2">Both sides of the fence</h2>
        <p className="text-sm text-[#7A6B60] leading-relaxed">
          Every idea has two dialects: the vernacular — how producers talk about it in the field — and the systems dialect — how institutions, grant bodies, and boards frame it. Naming both helps ideas travel.
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-[#EBF3EE] rounded-xl p-4 border border-[#B8D9C3]">
          <Field label="Vernacular name" sublabel="How producers say it">
            <input
              type="text"
              value={vernacular}
              onChange={(e) => onVernacular(e.target.value)}
              className={inputCls}
              placeholder="e.g. the dog-treats problem"
            />
          </Field>
        </div>
        <div className="bg-[#F0F0F0] rounded-xl p-4 border border-[#C8C8C8]">
          <Field label="Systems name" sublabel="Formal / institution register">
            <input
              type="text"
              value={massity}
              onChange={(e) => onMassity(e.target.value)}
              className={inputCls}
              placeholder="e.g. Zone 4 abattoir capacity cooperative"
            />
          </Field>
        </div>
      </div>
      <StepNav onBack={onBack} onNext={onNext} canNext />
    </div>
  );
}

function NotesStep({ notes, onNotes, loading, error, onCreate, onBack }: {
  notes: string; onNotes: (v: string) => void;
  loading: boolean; error: string;
  onCreate: () => void; onBack: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-[#4A7C59] font-medium uppercase tracking-wide mb-1">Step 3 of 3</p>
        <h2 className="text-2xl text-[#2E2620] mb-2">Steward notes</h2>
        <p className="text-sm text-[#7A6B60]">
          Private notes only stewards see. What are the open questions? What needs to happen before this can move?
        </p>
      </div>
      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder="Open questions, next steps, context…"
        />
      </Field>
      {error && <p className="text-sm text-[#C7613B] mt-3">{error}</p>}
      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="px-4 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">
          Back
        </button>
        <button
          onClick={onCreate}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "Planting…" : "Plant this idea"}
          {!loading && <Leaf className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function DoneStep({ onDone }: { onDone: () => void }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-[#EBF3EE] flex items-center justify-center mx-auto mb-6">
        <Check className="w-7 h-7 text-[#4A7C59]" />
      </div>
      <h2 className="text-2xl text-[#2E2620] mb-3">The first seed is planted</h2>
      <p className="text-sm text-[#7A6B60] mb-8 max-w-sm mx-auto leading-relaxed">
        The 807 abattoir idea is now in the Nursery stage. As you work with your group, you'll move it through Fodder and Fallow toward graduation — when the Zone 3 board is ready to take it.
      </p>
      <p className="text-xs text-[#A89A8E] mb-8">
        Invite your producers with a code from the Invites panel so they can weigh in and flag new problems.
      </p>
      <button
        onClick={onDone}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-[#3D6B4A] transition-colors"
      >
        Open the garden floor
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepNav({ onBack, onNext, canNext }: { onBack: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onBack} className="px-4 py-2.5 rounded-xl text-sm text-[#7A6B60] border border-[#E4D9CC] hover:bg-[#F0E9DF] transition-colors">
        Back
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm disabled:opacity-50 transition-colors"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Field({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#4A3F38] mb-0.5 uppercase tracking-wide">{label}</label>
      {sublabel && <p className="text-xs text-[#7A6B60] mb-1.5">{sublabel}</p>}
      {!sublabel && <div className="mb-1.5" />}
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#A89A8E] focus:outline-none focus:border-[#4A7C59] transition-colors";
