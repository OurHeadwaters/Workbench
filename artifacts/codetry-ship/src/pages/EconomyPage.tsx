import { Link } from "wouter";

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

        {/* ── CTA ── */}
        <section className="mt-12 sm:mt-16 space-y-6">
          <p className="font-serif text-base sm:text-lg leading-relaxed">
            The platform is live. The wallet works. There are tasks available
            right now, and merchants who will take the credit. The only thing
            missing is you.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/economy/wallet"
              className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Open my wallet
            </Link>
            <Link
              href="/economy/tip"
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--accent))" }}
            >
              Tip someone →
            </Link>
          </div>
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
