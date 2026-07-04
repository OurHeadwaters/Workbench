import { useState, type FormEvent } from "react";

const STAGES = [
  {
    n: 1,
    label: "The Doom Crowd",
    desc: "I know the system is extractive. I'm angry about it. I haven't found a community-scale way out yet.",
    accent: "#7a3a28",
  },
  {
    n: 2,
    label: "The Ron Paul Pivot",
    desc: "I'm building household sovereignty — hard assets, self-sufficiency, opting out of dependency. My household comes first.",
    accent: "#6b5a1e",
  },
  {
    n: 3,
    label: "The Ramsey On-Ramp",
    desc: "I've been working on debt and budget discipline. The household is getting clean. I'm wondering what comes after.",
    accent: "#2a5c40",
  },
  {
    n: 4,
    label: "Crypto Corner",
    desc: "I hold keys, not promises. I'm connecting sound money principles to something bigger than my own wallet.",
    accent: "#1A5FA8",
  },
  {
    n: 5,
    label: "The Headwaters Kitchen Table",
    desc: "I'm scaling household sovereignty outward — building co-ops, local institutions, and collective ownership in my community.",
    accent: "#1f3d2e",
  },
  {
    n: 6,
    label: "The Codetry Ship",
    desc: "I'm actively building with others. I have a community to build with and I need the tools and infrastructure.",
    accent: "#4a3c6e",
  },
];

interface InquiryForm {
  name: string;
  community: string;
  whatTheyWorkingOn: string;
  email: string;
  website: string;
}

const EMPTY_FORM: InquiryForm = {
  name: "",
  community: "",
  whatTheyWorkingOn: "",
  email: "",
  website: "",
};

type SubmitState = "idle" | "submitting" | "done" | "error";

const BASE_API = "/api";

function ctaCopy(stage: number): { headline: string; sub: string; cta: string } {
  if (stage <= 2) {
    return {
      headline: "You're finding your footing.",
      sub: "Tell us where you are and what's on your mind. We'll point you to the right starting resource — no pitch, no pressure.",
      cta: "Send your message →",
    };
  }
  if (stage <= 4) {
    return {
      headline: "You're in the transition zone.",
      sub: "You've done the household work. The next move is community-scale. Let's figure out what that looks like for where you are.",
      cta: "Start the conversation →",
    };
  }
  return {
    headline: "You're ready to build.",
    sub: "You have a community and something to build. Let's get on a call and figure out what needs to get built first. Someone will reach back within 48 hours.",
    cta: "Book time or send a note →",
  };
}

function fieldClass() {
  return "w-full border border-[rgba(237,232,213,0.15)] rounded-lg px-3 py-2 text-sm text-[#EDE8D5] bg-[#1A1714] focus:outline-none focus:border-[#C8923A] transition-colors";
}

export function StompingPathCTA() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = (field: keyof InquiryForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const stage = STAGES.find((s) => s.n === selectedStage) ?? null;
  const copy = selectedStage ? ctaCopy(selectedStage) : null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState === "submitting" || !selectedStage) return;
    setErrorMsg(null);
    setSubmitState("submitting");
    try {
      const res = await fetch(`${BASE_API}/codetry/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          community: form.community.trim(),
          whatTheyWorkingOn: form.whatTheyWorkingOn.trim(),
          stage: selectedStage,
          website: form.website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Could not send. Try again in a moment.");
        setSubmitState("error");
        return;
      }
      setSubmitState("done");
      setForm(EMPTY_FORM);
    } catch {
      setErrorMsg("Network error. Try again in a moment.");
      setSubmitState("error");
    }
  }

  return (
    <div className="rounded-xl border border-[rgba(237,232,213,0.15)] overflow-hidden">
      <div className="px-4 py-4 border-b border-[rgba(237,232,213,0.15)]">
        <p className="text-xs text-[rgba(237,232,213,0.55)] uppercase tracking-wider font-medium mb-1">
          Where are you on the path?
        </p>
        <p className="text-sm text-[rgba(237,232,213,0.7)]">
          Pick the description that fits. Then we'll show you the right next step.
        </p>
      </div>

      <div className="divide-y divide-[rgba(237,232,213,0.1)]">
        {STAGES.map((s) => {
          const selected = selectedStage === s.n;
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => {
                setSelectedStage(selected ? null : s.n);
                setSubmitState("idle");
                setErrorMsg(null);
                setForm(EMPTY_FORM);
              }}
              className="w-full text-left px-4 py-3 min-h-[56px] transition-colors"
              style={{
                background: selected ? `${s.accent}08` : "transparent",
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] rounded-sm px-2 py-0.5 font-medium"
                  style={{
                    background: selected ? s.accent : "rgba(237,232,213,0.08)",
                    color: selected ? "#fff" : "rgba(237,232,213,0.55)",
                  }}
                >
                  Stage {s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium mb-0.5"
                    style={{ color: selected ? s.accent : "#EDE8D5" }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs text-[rgba(237,232,213,0.55)] leading-relaxed">{s.desc}</p>
                </div>
                <div
                  className="shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center"
                  style={{
                    borderColor: selected ? s.accent : "rgba(237,232,213,0.15)",
                    background: selected ? s.accent : "transparent",
                  }}
                >
                  {selected && (
                    <svg viewBox="0 0 10 10" width="8" height="8" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedStage && stage && copy && (
        <div
          className="px-4 py-5 border-t border-[rgba(237,232,213,0.15)]"
          style={{ background: `${stage.accent}06` }}
        >
          {submitState === "done" ? (
            <div className="text-center py-4">
              <p className="text-base font-medium text-[#EDE8D5] mb-1">
                Message received.
              </p>
              <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed">
                Someone will read it and get back to you within 48 hours.
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: stage.accent }}
              >
                {copy.headline}
              </p>
              <p className="text-sm text-[rgba(237,232,213,0.7)] leading-relaxed mb-4">
                {copy.sub}
              </p>

              {selectedStage >= 5 && (
                <div
                  className="rounded-lg px-3 py-3 mb-4 flex items-start gap-2"
                  style={{
                    background: `${stage.accent}10`,
                    border: `1px solid ${stage.accent}30`,
                  }}
                >
                  <span className="text-sm mt-0.5">📅</span>
                  <div>
                    <p
                      className="text-xs font-medium mb-0.5"
                      style={{ color: stage.accent }}
                    >
                      Book a call
                    </p>
                    <p className="text-xs text-[rgba(237,232,213,0.7)] leading-relaxed">
                      Prefer to get right on a call? Reply to the confirmation email
                      with "call" and we'll set one up. Or fill out the form below
                      and mention it — we'll reach back within 48 hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={(e) => void onSubmit(e)} className="space-y-3">
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set("website")}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden
                  style={{ display: "none" }}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[rgba(237,232,213,0.7)] mb-1">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="First name is fine"
                      className={fieldClass()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[rgba(237,232,213,0.7)] mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                      className={fieldClass()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[rgba(237,232,213,0.7)] mb-1">
                    Community or organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.community}
                    onChange={set("community")}
                    placeholder="Your town, reserve, co-op, or household"
                    className={fieldClass()}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[rgba(237,232,213,0.7)] mb-1">
                    What are you working on? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.whatTheyWorkingOn}
                    onChange={set("whatTheyWorkingOn")}
                    placeholder={
                      selectedStage <= 2
                        ? "What's the situation you're trying to figure out?"
                        : selectedStage <= 4
                        ? "What's the next move you're trying to make? What's holding it?"
                        : "What are you building, and what does your community need most right now?"
                    }
                    className={`${fieldClass()} resize-none`}
                  />
                </div>

                {(submitState === "error") && errorMsg && (
                  <p className="text-xs text-red-600">{errorMsg}</p>
                )}

                <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                    style={{ background: stage.accent }}
                  >
                    {submitState === "submitting" ? "Sending…" : copy.cta}
                  </button>
                  <p className="text-xs text-[rgba(237,232,213,0.55)]">
                    No spam · someone reads every message
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
