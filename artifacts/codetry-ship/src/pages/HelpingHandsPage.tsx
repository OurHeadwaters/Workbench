import { Link } from "wouter";

const BADGE_STAGES = [
  {
    id: "watching",
    label: "Watching",
    number: "01",
    icon: WatchingIcon,
    desc: "You're in. You can see the task board, read the notes, and learn what your community needs. No pressure, no count.",
    accent: "#1f3d2e",
    glow: "rgba(31,61,46,0.18)",
  },
  {
    id: "learning",
    label: "Learning",
    number: "02",
    icon: LearningIcon,
    desc: "You've claimed your first task and finished it. The community saw you show up. That counts, and it's on record.",
    accent: "#1A5FA8",
    glow: "rgba(26,95,168,0.18)",
  },
  {
    id: "practising",
    label: "Practising",
    number: "03",
    icon: PractisingIcon,
    desc: "Five confirmed shifts. You're part of the rhythm now. Your name appears on the contributor board.",
    accent: "#b85a3e",
    glow: "rgba(184,90,62,0.18)",
  },
  {
    id: "teaching",
    label: "Teaching",
    number: "04",
    icon: TeachingIcon,
    desc: "Fifteen confirmed shifts. You know the work well enough to show someone else. New members can see your name when they're looking for a guide.",
    accent: "#d4a017",
    glow: "rgba(212,160,23,0.22)",
  },
];

const SAMPLE_TASKS = [
  { title: "Stack and cover the firewood at the band hall", time: "~45 min", pay: "12 tokens", tag: "Land & Grounds" },
  { title: "Translate the meeting notes into Cree (written)", time: "~1.5 h", pay: "25 tokens", tag: "Language & Knowledge" },
  { title: "Drive the Elder to her Thursday appointment", time: "~2 h", pay: "30 tokens", tag: "Care & Transport" },
  { title: "Count and log the food hamper inventory", time: "~30 min", pay: "8 tokens", tag: "Community Ops" },
  { title: "Fix the broken step on the community centre ramp", time: "~1 h", pay: "20 tokens", tag: "Maintenance" },
];

export function HelpingHandsPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1a2e1e", color: "#f4ede0" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,160,23,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, rgba(10,22,14,0.5) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-14 pb-16 text-center">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "rgba(212,160,23,0.75)" }}
          >
            codetry · community labour · helping hands
          </p>

          <div className="flex justify-center mb-6" aria-hidden>
            <HeroHandsSVG />
          </div>

          <h1
            className="font-serif leading-[1.15] tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)" }}
          >
            Helping Hands
          </h1>
          <p
            className="font-serif text-lg sm:text-xl leading-relaxed mb-2"
            style={{ color: "rgba(244,237,224,0.78)" }}
          >
            Earn. Build. Be Known.
          </p>
          <p
            className="font-serif text-base leading-relaxed mt-4"
            style={{ color: "rgba(244,237,224,0.58)", maxWidth: "28rem", margin: "1rem auto 0" }}
          >
            Real tasks. Real pay. Your name on the board. Community labour made visible, valued, and yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a
              href="/headwaters-books/helping-hands"
              className="inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] rounded-sm px-6 py-3 transition-all hover:opacity-90"
              style={{ background: "#d4a017", color: "#1a1a0e" }}
            >
              Open the task board →
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] rounded-sm px-6 py-3 transition-all hover:opacity-80"
              style={{ background: "rgba(244,237,224,0.08)", color: "rgba(244,237,224,0.82)", border: "1px solid rgba(244,237,224,0.18)" }}
            >
              How it works ↓
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[44rem] px-6 sm:px-8 pt-10 pb-20">

        {/* ── What it is ── */}
        <section
          className="mt-12 sm:mt-16 border-l-2 pl-6 sm:pl-8"
          style={{ borderColor: "hsl(var(--accent))" }}
        >
          <p className="font-serif text-xl sm:text-2xl leading-snug">
            Helping Hands is the community labour layer of the Codetry economy. Every task is posted by your band,
            your co-op, or your neighbour. Every credit you earn lands in a wallet that belongs to you — not
            the platform, not the council. The work you do gets counted. Your name gets known.
          </p>
          <p className="mt-4 signoff">— headwaters</p>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="mt-16 sm:mt-20">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            How it works
          </p>
          <div className="space-y-7">
            <HowStep number="01" title="See what needs doing.">
              The task board is always open. Chop wood. Translate a notice. Drive someone to their appointment.
              Help count the food hamper. Every task shows exactly what it pays and how long it takes.
            </HowStep>
            <HowStep number="02" title="Claim it. Do it. Mark it done.">
              One tap to claim. Do the work. Mark it complete. An admin confirms — and your credit arrives
              immediately, directly to your wallet. No bank transfer, no waiting.
            </HowStep>
            <HowStep number="03" title="Watch your name rise.">
              Every confirmed shift adds to your record. Hit milestones and you move through the badge stages —
              from Watching to Teaching. The board remembers what you've done.
            </HowStep>
          </div>
        </section>

        <hr className="rule mt-16 sm:mt-20" />

        {/* ── Badge progression ── */}
        <section className="mt-16 sm:mt-20">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Badge progression
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl leading-tight mb-8">
            Every shift is on record.<br />
            <span style={{ color: "hsl(var(--accent))" }}>Your stage shows what you've built.</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {BADGE_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="rounded-sm border p-5 relative overflow-hidden"
                  style={{
                    borderColor: "hsl(var(--card-border))",
                    background: "hsl(var(--card))",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-sm"
                    style={{
                      background: `radial-gradient(ellipse at 0% 0%, ${stage.glow} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: stage.accent }}
                    >
                      <Icon />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.2em]"
                          style={{ color: stage.accent }}
                        >
                          {stage.number}
                        </span>
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.2em]"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          ·
                        </span>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold"
                          style={{ color: stage.accent }}
                        >
                          {stage.label}
                        </span>
                      </div>
                      <p
                        className="font-serif text-sm sm:text-base leading-relaxed"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p
            className="mt-6 font-serif text-sm leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Badges are automatic — no application, no committee. Your confirmed shifts speak for themselves.
            Reliability bonuses are awarded at milestones and land in your wallet the same way task pay does: immediately.
          </p>
        </section>

        <hr className="rule mt-16 sm:mt-20" />

        {/* ── Sample tasks ── */}
        <section className="mt-16 sm:mt-20">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            What's on the board
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl leading-tight mb-8">
            Real tasks, posted by your community.
          </h2>
          <div className="space-y-3">
            {SAMPLE_TASKS.map((task) => (
              <div
                key={task.title}
                className="rounded-sm border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-foreground">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.16em] rounded-sm px-2 py-0.5"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {task.tag}
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {task.time}
                    </span>
                  </div>
                </div>
                <span
                  className="font-mono text-sm font-bold shrink-0"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  {task.pay}
                </span>
              </div>
            ))}
          </div>
          <p
            className="mt-5 font-serif text-sm leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            These are sample tasks. The live board reflects what your community has posted today.
          </p>
        </section>

        <hr className="rule mt-16 sm:mt-20" />

        {/* ── Your first credit ── */}
        <section className="mt-16 sm:mt-20 rounded-sm border px-6 sm:px-8 py-8 sm:py-10 space-y-4"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}>
          <div className="flex items-center gap-3 mb-2">
            <TorchIcon />
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              Your first credit
            </p>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
            Your wallet shows up when there&rsquo;s something in it worth meeting.
          </h2>
          <p
            className="font-serif text-base sm:text-lg leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Sign up with your email. Pick up a task. Mark it done. When the admin confirms it, the credit
            lands in your wallet and the system tells you in plain language: what you earned, what it&rsquo;s
            worth, and where you can spend it today. No bank, no waiting, no asterisks.
          </p>
          <a
            href="/headwaters-books/helping-hands"
            className="inline-flex items-center gap-2 mt-2 font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            Open the task board →
          </a>
        </section>

        {/* ── Dam Days hook ── */}
        <section
          className="mt-10 rounded-sm border-l-2 pl-6 sm:pl-8 py-4"
          style={{ borderColor: "rgba(212,160,23,0.4)" }}
        >
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            Coming · Dam Days
          </p>
          <p
            className="font-serif text-sm leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Every task you complete will soon connect to Dam Days — the community record of what got done
            and who showed up. When the integration lands, your task history becomes part of the story.
          </p>
        </section>

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · helping hands · {new Date().getFullYear()}</p>
          <Link
            href="/economy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            ← Community Economy
          </Link>
        </footer>
      </div>
    </main>
  );
}

function HowStep({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <span
        className="font-mono text-[13px] font-bold shrink-0 mt-1 w-6 text-right"
        style={{ color: "hsl(var(--accent))" }}
      >
        {number}
      </span>
      <div className="space-y-1.5">
        <p className="font-sans text-base font-semibold">{title}</p>
        <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

function HeroHandsSVG() {
  return (
    <svg width="80" height="68" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="40" cy="62" rx="28" ry="5" fill="rgba(212,160,23,0.12)" />
      <path
        d="M18 38 C14 36 10 30 12 24 C13 20 17 18 20 20 L20 14 C20 11 22 9 25 9 C26 9 27 9.5 28 10.5 C28.5 8.5 30 7 32 7 C33.5 7 34.8 7.8 35.5 9 C36.2 7.5 37.5 6.5 39 6.5 C41 6.5 42.8 8 43 10 C44 9 45.5 8.5 47 9 C49 9.8 50 11.8 50 14 L50 20 C53 18 57 20 58 24 C60 30 56 36 52 38 L52 50 C52 54 48 58 44 58 L36 58 C32 58 28 54 28 50 L28 38 C24 38 20 39 18 38 Z"
        fill="rgba(244,237,224,0.12)"
        stroke="rgba(244,237,224,0.35)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M28 22 L28 38 M35.5 10 L35.5 38 M43 10 L43 38 M50 20 L50 38"
        stroke="rgba(212,160,23,0.5)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="40" cy="15" r="2.5" fill="rgba(212,160,23,0.6)" />
      <path
        d="M34 52 C34 54 37 56 40 56 C43 56 46 54 46 52"
        stroke="rgba(212,160,23,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function WatchingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="rgba(244,237,224,0.9)" />
      <path d="M2 12 C5 6 9 3 12 3 C15 3 19 6 22 12 C19 18 15 21 12 21 C9 21 5 18 2 12 Z"
        stroke="rgba(244,237,224,0.8)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function LearningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L22 8 L12 13 L2 8 Z" stroke="rgba(244,237,224,0.9)" strokeWidth="1.5" fill="rgba(244,237,224,0.15)" strokeLinejoin="round" />
      <path d="M6 10.5 L6 16 C6 16 9 19 12 19 C15 19 18 16 18 16 L18 10.5" stroke="rgba(244,237,224,0.8)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function PractisingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 11 L9 4 C9 3.4 9.4 3 10 3 L14 3 C14.6 3 15 3.4 15 4 L15 11" stroke="rgba(244,237,224,0.9)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="6" y="11" width="12" height="10" rx="1.5" stroke="rgba(244,237,224,0.8)" strokeWidth="1.5" fill="rgba(244,237,224,0.1)" />
      <path d="M12 14 L12 18" stroke="rgba(244,237,224,0.9)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 16 L14 16" stroke="rgba(244,237,224,0.9)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeachingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="3" stroke="rgba(244,237,224,0.9)" strokeWidth="1.5" fill="rgba(244,237,224,0.15)" />
      <path d="M7 17 C7 14 9 12 12 12 C15 12 17 14 17 17" stroke="rgba(244,237,224,0.8)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="8" r="2" stroke="rgba(212,160,23,0.9)" strokeWidth="1.2" fill="rgba(212,160,23,0.15)" />
      <path d="M17 14.5 C17 13 18 12 19 12 C20 12 21 13 21 14.5" stroke="rgba(212,160,23,0.8)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M20 10 L22 8" stroke="rgba(212,160,23,0.6)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function TorchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 16 L10 9" stroke="#d4a017" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16 L13 16" stroke="#d4a017" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="10" cy="7" rx="3" ry="4" fill="rgba(212,160,23,0.2)" stroke="#d4a017" strokeWidth="1.2" />
      <circle cx="10" cy="6" r="1.5" fill="#d4a017" opacity="0.7" />
    </svg>
  );
}
