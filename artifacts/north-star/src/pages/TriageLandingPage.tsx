import { useState } from "react";
import { Check, ArrowRight, Loader2, MailCheck, BookOpen, Inbox, Clock, Filter } from "lucide-react";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, GREEN } from "@/lib/theme";

const BASE_API = "/api";

function HeroSection({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: BG }}>
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: TEXT_2 }}>Headwaters</p>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 pb-16 max-w-lg mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-light leading-tight mb-4" style={{ color: TEXT }}>
            Your inbox shouldn't run your morning.
          </h1>
          <p className="text-lg leading-relaxed mb-3" style={{ color: TEXT }}>
            Morning Triage scans your Gmail, surfaces only what actually needs your attention today, and lets you clear it in under five minutes — then your real work begins.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: TEXT_2 }}>
            Free. Built for practitioners, producers, and founders in community economies.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {[
            {
              icon: <Filter size={16} style={{ color: GREEN }} />,
              title: "Filters by what matters to you",
              body: "Set your own keywords, priority senders, and labels. Triage only shows threads that actually require a decision.",
            },
            {
              icon: <Check size={16} style={{ color: GREEN }} />,
              title: "One choice per thread",
              body: "Handle it now, or defer it. No folders, no stars, no elaborate system. Just clear or not clear.",
            },
            {
              icon: <Clock size={16} style={{ color: GREEN }} />,
              title: "Done in under five minutes",
              body: "Your inbox doesn't get to expand into the whole morning. Five minutes, then you're out.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl p-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: TEXT }}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_2 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="w-full rounded-xl py-4 text-base font-medium flex items-center justify-center gap-2 min-h-[56px] active:opacity-80 transition-colors"
          style={{ backgroundColor: AMBER, color: BG }}
        >
          Get early access <ArrowRight size={18} />
        </button>

        <p className="text-xs text-center mt-4" style={{ color: TEXT_2 }}>
          Reads Gmail read-only. Never sends or modifies your inbox on your behalf.
        </p>
      </div>

      <footer className="px-5 pb-8 text-center">
        <p className="text-xs" style={{ color: TEXT_3 }}>
          A Headwaters tool · Built for practitioners, producers, and founders in community economies
        </p>
      </footer>
    </div>
  );
}

function EmailGateSection({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const resp = await fetch(`${BASE_API}/triage/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "morning-triage-landing" }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({})) as { error?: string };
        setError(data.error ?? "Something went wrong — please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("Couldn't connect. Check your connection and try again.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => onDone(), 1400);
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: BG }}>
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: TEXT_2 }}>Headwaters · Morning Triage</p>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 pb-16 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
            <Inbox size={22} style={{ color: GREEN }} />
          </div>
          <h2 className="text-3xl font-light leading-tight mb-3" style={{ color: TEXT }}>
            Leave your email and we'll let you know when it's ready.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: TEXT_2 }}>
            Morning Triage is in active development. Drop your email and we'll send one note when it opens — plus a short read on how practitioners in Headwaters use it every day.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3 rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <MailCheck size={20} style={{ color: GREEN }} className="shrink-0" />
            <p className="text-sm font-medium" style={{ color: GREEN }}>You're on the list. Taking you to the next step…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className="w-full rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              autoComplete="email"
              autoFocus
            />
            {error && <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl py-4 text-base font-medium flex items-center justify-center gap-2 min-h-[56px] disabled:opacity-60 transition-colors"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              {submitting
                ? <Loader2 size={18} className="animate-spin" />
                : <>Notify me when it opens <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        <button
          onClick={onDone}
          className="mt-4 text-xs underline text-center w-full min-h-[44px] flex items-center justify-center"
          style={{ color: TEXT_3 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: BG }}>
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: TEXT_2 }}>Headwaters · Morning Triage</p>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 pb-16 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-light leading-tight mb-3" style={{ color: TEXT }}>
            While you wait — one thing worth reading.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: TEXT_2 }}>
            Morning Triage is one small piece of how practitioners in Headwaters run their days. This is where it comes from.
          </p>
        </div>

        <a
          href="/codetry-handbook/"
          className="block rounded-xl p-5 mb-4 transition-colors group"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: SURFACE_2 }}>
              <BookOpen size={18} style={{ color: TEXT_2 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1" style={{ color: TEXT }}>Read the Handbook — Chapter 1</p>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_2 }}>
                <em>How a Community Runs Its Own Economy.</em> Short. It reframes how practitioners think about time and attention — which is exactly what Triage is designed around.
              </p>
            </div>
            <ArrowRight size={16} className="mt-0.5 shrink-0" style={{ color: TEXT_3 }} />
          </div>
        </a>

        <div className="pt-5 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs" style={{ color: TEXT_3 }}>
            Already have a North Star account?{" "}
            <a href="/north-star/" className="underline" style={{ color: TEXT_2 }}>
              Run triage there →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

type Step = "hero" | "gate" | "cta";

export function TriageLandingPage() {
  const [step, setStep] = useState<Step>("hero");

  return (
    <div>
      {step === "hero" && <HeroSection onContinue={() => setStep("gate")} />}
      {step === "gate" && <EmailGateSection onDone={() => setStep("cta")} />}
      {step === "cta" && <CtaSection />}
    </div>
  );
}
