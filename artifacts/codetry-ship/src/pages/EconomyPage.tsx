import { Link } from "wouter";

const HH_BADGES = [
  { label: "Watching", color: "#1f3d2e" },
  { label: "Learning", color: "#1A5FA8" },
  { label: "Practising", color: "#b85a3e" },
  { label: "Teaching", color: "#d4a017" },
];

const HH_SAMPLE_TASKS = [
  { title: "Stack and cover the firewood at the band hall", time: "~45 min", pay: "12 tokens", tag: "Land & Grounds" },
  { title: "Translate the meeting notes into Cree (written)", time: "~1.5 h", pay: "25 tokens", tag: "Language" },
  { title: "Drive the Elder to her Thursday appointment", time: "~2 h", pay: "30 tokens", tag: "Care & Transport" },
];

export function EconomyPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">

      {/* ── boreal field journal hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1f3d2e", color: "#f4ede0" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}odyssey/hempcrete-texture.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.10 }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,22,14,0.4) 100%)" }}
        />
        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-12 pb-14 text-center">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "rgba(212,160,23,0.8)" }}
          >
            codetry · community economy
          </p>
          <h1
            className="font-serif leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 5.5vw, 2.5rem)" }}
          >
            The value is already moving.<br />
            <span style={{ color: "#b85a3e" }}>We just made it visible.</span>
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[44rem] px-6 sm:px-8 pt-10 pb-16">

        {/* ── Premise ── */}
        <section
          className="mt-12 sm:mt-16 border-l-2 pl-6 sm:pl-8"
          style={{ borderColor: "hsl(var(--accent))" }}
        >
          <p className="font-serif text-xl sm:text-2xl leading-snug">
            In every decentralized community, people help each other every day.
            The neighbour who knows how to fix an outboard. The Elder who
            remembers where the food cache used to be. The cousin who shares
            what they know about freight rates. That value flows — it just
            doesn&rsquo;t get counted. Reserves and northern communities are
            where this work was built and tested. The pattern holds everywhere
            it&rsquo;s true.
          </p>
          <p className="mt-4 signoff">— headwaters</p>
        </section>

        {/* ── What this is ── */}
        <section className="mt-12 sm:mt-16 space-y-5 font-serif text-base sm:text-lg leading-relaxed">
          <p>
            The Codetry P2P economy engine makes that value legible. When
            you help someone and they tip you a credit, that credit is real
            and spendable. When you share what you know and someone passes
            a few tokens your way, those tokens land in a wallet that
            belongs to you — not the platform, not the council, not a
            middleman.
          </p>
          <p>
            The system runs on community credit — a token backed by the
            labour and knowledge that&rsquo;s already in your community.
            You earn credit by completing tasks and accepting tips. You
            spend it at local merchants the band has registered. You can
            send it directly to another member for anything: a favour, a
            fish, a fire call at 2 a.m.
          </p>
        </section>

        <hr className="rule mt-12 sm:mt-16" />

        {/* ── Three steps ── */}
        <section className="mt-12 sm:mt-16 space-y-8">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            How it works
          </p>
          <div className="space-y-6">
            <Step number="01" title="Sign up with your email.">
              That&rsquo;s it. A wallet is created for you in the background.
              You won&rsquo;t see it yet — you&rsquo;ll meet it when there&rsquo;s
              actually something in it worth meeting.
            </Step>
            <Step number="02" title="Earn your first credit.">
              Pick up an available task — chop wood, run a message, help with
              a count — or accept a tip from someone you&rsquo;ve already helped.
              When the credit lands, the system will show it to you in plain
              language: exactly what you earned, what it&rsquo;s worth, and
              where you can spend it today.
            </Step>
            <Step number="03" title="Tip someone who helped you.">
              The tip function is always on. If someone taught you something,
              saved you a trip, or shared knowledge that saved you money — send
              them a credit. It takes ten seconds and it shows up in their
              wallet immediately.
            </Step>
          </div>
        </section>

        <hr className="rule mt-12 sm:mt-16" />

        {/* ── Referral ── */}
        <section className="mt-12 sm:mt-16 rounded-sm border px-6 sm:px-8 py-8 sm:py-10 space-y-4"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            Bring someone in
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
            You both get credit.
          </h2>
          <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            Once you&rsquo;re in the system, you get a personal link. Share it with
            anyone in your community. When they sign in and connect their
            account, you both receive a bonus — deposited automatically at
            first sign-in. No tasks required first, no waiting period,
            no asterisks.
          </p>
          <Link
            href="/economy/wallet"
            className="inline-flex items-center gap-2 mt-2 font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            See your referral link →
          </Link>
        </section>

        {/* ── Trust layer ── */}
        <section className="mt-12 sm:mt-16 space-y-5 font-serif text-base sm:text-lg leading-relaxed">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] not-serif"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            What backs it
          </p>
          <p>
            Credits don&rsquo;t disappear. They don&rsquo;t expire without warning.
            Your transaction history is yours to read — every credit in, every
            credit out, every tip, every purchase. The rate at which time
            converts to credit is set by the band, not by us. The governance
            tools to let the community own that rate-setting are on the
            roadmap. V1 is honest about what&rsquo;s not built yet.
          </p>
          <p>
            The wallet your credits live in is custodial by default — the
            platform manages the keys, same as a bank account. If you want
            full personal control (your keys, your wallet, on-chain), that
            path is available. Most people won&rsquo;t need it. The ones who
            do will know.
          </p>
        </section>

        <hr className="rule mt-12 sm:mt-16" />

        {/* ── Helping Hands Hub Panel ── */}
        <section className="mt-12 sm:mt-16">
          <div
            className="rounded-sm border overflow-hidden"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            {/* Panel header bar */}
            <div
              className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{ background: "#1a2e1e" }}
            >
              <div className="flex items-center gap-3">
                <HandsIconSmall />
                <div>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.24em] mb-0.5"
                    style={{ color: "rgba(212,160,23,0.75)" }}
                  >
                    community labour
                  </p>
                  <h2
                    className="font-serif text-xl sm:text-2xl leading-tight"
                    style={{ color: "#f4ede0" }}
                  >
                    Helping Hands
                  </h2>
                </div>
              </div>
              <Link
                href="/economy/helping-hands"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] rounded-sm px-4 py-2.5 shrink-0 transition-all hover:opacity-90"
                style={{ background: "#d4a017", color: "#1a1a0e" }}
              >
                Full hub →
              </Link>
            </div>

            {/* Panel body */}
            <div
              className="px-6 sm:px-8 py-7 space-y-6"
              style={{ background: "hsl(var(--card))" }}
            >
              <p className="font-serif text-base sm:text-lg leading-relaxed">
                Helping Hands is the task-and-credit layer of the Codetry economy. Real work posted by
                your band, your co-op, or your neighbours. Real pay that lands in a wallet that belongs to
                you. Your name on the contributor board.
              </p>

              {/* What / How / Join columns */}
              <div className="grid sm:grid-cols-3 gap-5 pt-2">
                <HHPillar
                  label="What it is"
                  text="Community tasks with a posted rate. Chop wood. Translate a notice. Drive someone to an appointment. Every task shows what it pays."
                />
                <HHPillar
                  label="How you earn"
                  text="Claim a task. Do the work. Mark it done. An admin confirms — and credits land in your wallet immediately, no waiting."
                />
                <HHPillar
                  label="How to join"
                  text="Sign up with your email. A wallet is created in the background. You'll meet it when your first credit arrives."
                />
              </div>

              {/* Sample task feed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    What&rsquo;s on the board now
                  </p>
                  <a
                    href="/headwaters-books/helping-hands"
                    className="font-mono text-[9px] uppercase tracking-[0.14em] hover:opacity-80"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    See all →
                  </a>
                </div>
                <div className="space-y-2">
                  {HH_SAMPLE_TASKS.map((t) => (
                    <div
                      key={t.title}
                      className="flex items-center justify-between gap-4 rounded-sm px-4 py-3"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-foreground truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="font-mono text-[8px] uppercase tracking-[0.14em]"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {t.tag}
                          </span>
                          <span
                            className="font-mono text-[8px]"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            · {t.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className="font-mono text-sm font-bold shrink-0"
                        style={{ color: "#1f3d2e" }}
                      >
                        {t.pay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge progression strip */}
              <div>
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.22em] mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Badge progression — every confirmed shift moves you forward
                </p>
                <div className="flex flex-wrap gap-2">
                  {HH_BADGES.map((b, i) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-2 rounded-sm px-3 py-1.5"
                      style={{ background: `${b.color}18`, border: `1px solid ${b.color}40` }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: b.color }}
                      />
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.14em]"
                        style={{ color: b.color }}
                      >
                        {String(i + 1).padStart(2, "0")} · {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="/headwaters-books/helping-hands"
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  Open the task board →
                </a>
                <Link
                  href="/economy/helping-hands"
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-60"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Learn more about Helping Hands →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule mt-12 sm:mt-16" />

        {/* ── CTA ── */}
        <section className="mt-12 sm:mt-16 space-y-6">
          <p className="font-serif text-base sm:text-lg leading-relaxed">
            The wallet, the tip system, and the task board are being built now.
            When they&rsquo;re ready, you&rsquo;ll be able to earn credits doing
            real work for your community, spend them at local merchants, and
            send them to people who helped you. No bank required.
          </p>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Coming soon — joining the list means you&rsquo;re first in when the
            doors open.
          </p>
          <p className="signoff">— headwaters</p>
        </section>

        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · {new Date().getFullYear()}</p>
          <a
            href="/privacy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Privacy
          </a>
        </footer>
      </div>
    </main>
  );
}

interface HHPillarProps {
  label: string;
  text: string;
}

function HHPillar({ label, text }: HHPillarProps) {
  return (
    <div>
      <p
        className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1.5"
        style={{ color: "hsl(var(--accent))" }}
      >
        {label}
      </p>
      <p
        className="font-serif text-sm leading-relaxed"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {text}
      </p>
    </div>
  );
}

function HandsIconSmall() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="rgba(212,160,23,0.12)" />
      <path
        d="M12 20 C10 19 8 16 9 13 C9.5 11 11.5 10 13 11 L13 8 C13 6.9 13.9 6 15 6 C15.7 6 16.3 6.4 16.7 7 C17 6.2 17.8 5.6 18.7 5.6 C19.5 5.6 20.2 6 20.6 6.7 C21 5.8 21.9 5.2 23 5.2 C24.3 5.2 25.4 6.3 25.4 7.5 L25.4 11 C26.9 10 29 11 29.5 13 C30.5 16 28.5 19 26.5 20 L26.5 26 C26.5 28 24.5 30 22.5 30 L19 30 C17 30 15 28 15 26 L15 20 C14 20 12.5 20.5 12 20 Z"
        fill="rgba(212,160,23,0.15)"
        stroke="rgba(212,160,23,0.7)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Step({ number, title, children }: StepProps) {
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
