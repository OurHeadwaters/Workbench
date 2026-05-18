import { Link } from "wouter";
import { ArrowLeft, Zap, DollarSign, Map, AlertTriangle } from "lucide-react";

const SLATE  = "#4B6070";
const TEAL   = "#1F5446";
const GOLD   = "#8B6914";
const RUST   = "#b85a3e";
const RULE   = "hsl(var(--border))";

interface Track { icon: React.ReactNode; title: string; timing: string; body: string; color: string }
interface RevenueOption { letter: string; name: string; ask: string; earn: string; body: string; recommended?: boolean }

const REVENUE: RevenueOption[] = [
  {
    letter: "A",
    name: "Freemium + Licensing",
    ask: "Free for Legacy Pass families",
    earn: "Per-verified-user fee from Gather Round (quarterly)",
    body: "Families pay nothing extra. Gather Round retains the billing relationship. Headwaters earns a licensing fee per verified user — scales with adoption without charging families directly. Lowest friction for the first conversation.",
    recommended: true,
  },
  {
    letter: "B",
    name: "Bundle",
    ask: "Premium add-on at Legacy Pass renewal",
    earn: "Revenue share from Gather Round",
    body: "Gather Round bundles Saltbox access as an official upgrade. Positions Saltbox as a Gather Round product — not a third-party integration. Higher revenue ceiling but requires Gather Round to change their pricing and sales flow.",
  },
  {
    letter: "C",
    name: "Concierge",
    ask: "Direct to family — $97–197 setup + $12–19/month",
    earn: "Full margin, no partnership required",
    body: "Works with any content the family already owns. No Gather Round sign-off needed. Slower to scale but fully independent — the fallback path that proves the model doesn't depend on their cooperation.",
  },
];

const TRACKS: Track[] = [
  {
    icon: <Zap size={14} />,
    title: "Core product polish",
    timing: "Weeks 1–2",
    body: "Offline content delivery, device sync, folder-free organisation. The demo that shows a family loading curriculum on an iPad without internet — no folder management — is the entire argument. Build this first regardless of whether Gather Round says yes.",
    color: TEAL,
  },
  {
    icon: <Map size={14} />,
    title: "Proof of concept",
    timing: "Weeks 2–4",
    body: "XRPL NFT credential simulating a Legacy Pass. Verify it in Saltbox, demonstrate the offline sync flow. Run with 3–5 test families who already own the pass. Capture their friction-reduction story in one paragraph each — that's the evidence package for Gather Round.",
    color: GOLD,
  },
  {
    icon: <DollarSign size={14} />,
    title: "Make contact",
    timing: "Weeks 3–4 (parallel)",
    body: "Research Gather Round's leadership — likely founder-led, small team. Find one real person. Send one warm, specific message: 'I've been building a local-first app for homeschooling families and noticed Legacy Pass holders spend a lot of time managing files. Would it make sense to show you what I've built?' Two sentences. One ask.",
    color: SLATE,
  },
];

const RISKS = [
  {
    title: "Gather Round may not be interested",
    body: "Option C still works — and the XRPL credential makes Saltbox interoperable with any other content provider who wants it.",
  },
  {
    title: "NFT language is a red flag for many families",
    body: "Call it a 'digital credential' or 'verified access pass' in any family-facing communication. The XRPL back-end is an implementation detail.",
  },
  {
    title: "Don't let this crowd out Phase 1",
    body: "Saltbox and Gather Round are a legitimate parallel track — not a replacement for the Deer Lake work that funds the operation. Timebox exploration so it doesn't bleed into core deliverables.",
  },
];

export function SaltboxGatherRoundPage() {
  return (
    <div className="space-y-6 pb-12" data-testid="page-saltbox-gather-round">

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: SLATE }}>
          Saltbox × Gather Round · Partnership & ROI Strategy
        </p>
        <h1 className="text-2xl font-bold leading-snug" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
          The Offline Curriculum Easy Button
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
          Gather Round Legacy Pass families spend real time managing downloads. Saltbox — built on the Codetry/Saily framework — solves that with local-first delivery and an XRPL NFT identity layer. This page covers the opportunity, three revenue paths, and a four-week roadmap.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "3", label: "Revenue options", note: "Freemium · Bundle · Concierge" },
          { value: "3", label: "Roadmap tracks",  note: "Polish · Proof · Contact" },
          { value: "4 wk", label: "Sprint target", note: "Demo + user stories + outreach" },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border p-3 bg-muted/30">
            <p className="text-2xl font-bold leading-none mb-1">{k.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{k.label}</p>
            <p className="text-[10px] text-muted-foreground leading-snug">{k.note}</p>
          </div>
        ))}
      </div>

      {/* The opportunity */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: TEAL }}>The Opportunity</h2>
        <div className="rounded-lg border divide-y bg-card text-card-foreground">
          {[
            {
              label: "Gather Round Legacy Pass",
              body: "Families pay once for lifetime access to Gather Round's full curriculum library — but delivery is entirely download-based. Families manage folders, PDFs, and content files manually across devices. That's friction every single week.",
            },
            {
              label: "Saltbox is the easy button",
              body: "Saltbox hosts content on-device, syncs offline, and organises materials so families don't have to. For a Legacy Pass holder: log in once, your curriculum is there, works without internet, always current. No folders.",
            },
            {
              label: "The identity layer — XRPL NFT",
              body: "A Legacy Pass holder's ownership is verified via an XRPL NFT credential. Saltbox reads that credential without calling back to Gather Round's server. The pass travels with the family — not with a download link. This is what makes the partnership real rather than just a referral arrangement.",
            },
            {
              label: "Why this matters to Headwaters",
              body: "Saltbox already needs to exist for the Codetry model to reach homeschooling communities in the north. Gather Round families give Saltbox a proven customer base, a credibility story, and a revenue path — before a single NAN community is formally onboarded.",
            },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex gap-3 p-4" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${RULE}` : "none" }}>
              <div className="w-0.5 rounded-full self-stretch min-h-4 flex-shrink-0" style={{ backgroundColor: TEAL }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: TEAL }}>{item.label}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue options */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: SLATE }}>Three Revenue Paths</h2>
        <div className="space-y-3">
          {REVENUE.map((opt) => (
            <div
              key={opt.letter}
              className="rounded-lg border bg-card p-4 flex gap-4"
              style={opt.recommended ? { borderColor: SLATE, boxShadow: `0 0 0 1px ${SLATE}22` } : {}}
            >
              <div
                className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-sm font-black text-white"
                style={{ backgroundColor: SLATE }}
              >
                {opt.letter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold">{opt.name}</span>
                  {opt.recommended && (
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${SLATE}18`, color: SLATE }}
                    >
                      Start here
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2">
                  <p className="text-[10px] text-muted-foreground"><span className="font-semibold">Ask:</span> {opt.ask}</p>
                  <p className="text-[10px] text-muted-foreground"><span className="font-semibold">Earn:</span> {opt.earn}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{opt.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap tracks */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>Four-Week Roadmap</h2>
        <div className="space-y-3">
          {TRACKS.map((t) => (
            <div key={t.title} className="rounded-lg border bg-card p-4 flex gap-3">
              <div
                className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-white"
                style={{ backgroundColor: t.color }}
              >
                {t.icon}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold">{t.title}</span>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${t.color}18`, color: t.color }}
                  >
                    {t.timing}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-muted/30 p-4 mt-3">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>What a successful sprint looks like</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Working demo. Three user stories from real families. One warm, specific outreach message sent to one real person at Gather Round. You are in conversation — not waiting on a decision. Everything else is optional.
          </p>
        </div>
      </section>

      {/* Risks */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: RUST }}>
          <AlertTriangle size={13} />
          Risks & Honest Limits
        </h2>
        <div className="rounded-lg border divide-y bg-card">
          {RISKS.map((r) => (
            <div key={r.title} className="flex gap-3 p-4">
              <div className="w-0.5 rounded-full self-stretch min-h-4 flex-shrink-0" style={{ backgroundColor: RUST }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: RUST }}>{r.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* First action */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: TEAL }}>Your Next Move</h2>
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: TEAL }}>The one thing to do this week</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Write one paragraph that describes the Legacy Pass download problem in plain language — from the family's perspective. Read it to someone who homeschools. If they say "yes, exactly" — that's your opening line for the Gather Round email.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: TEAL }}>The email is not a pitch</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              It is a problem statement followed by a question: <em>"I've been building a local-first app for homeschooling families and noticed Legacy Pass holders spend a lot of time managing files. Would it make sense to show you what I've built?"</em> That's it. Two sentences. One ask. Do not pitch the NFT in the first email.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-link */}
      <div className="rounded-lg border p-4 text-sm text-muted-foreground leading-relaxed" style={{ borderColor: `${SLATE}40`, backgroundColor: `${SLATE}08` }}>
        <span className="font-semibold" style={{ color: SLATE }}>Full coaching doc</span> available in the{" "}
        <a
          href="/practitioner-operating-plan/saltbox-gather-round"
          className="underline underline-offset-2"
          style={{ color: SLATE }}
        >
          Practitioner's Operating Plan
        </a>
        {" "}— includes first-email language, NFT framing guidance, and a note on keeping this sprint within Phase 1 capacity.
      </div>

    </div>
  );
}
