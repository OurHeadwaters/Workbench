import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { ApiError, postSignOn, postIntake } from "@/lib/api";

/* ── TSP permaculture zone quiz ────────────────────────────────────────── */

interface PcZone {
  id: string;
  name: string;
  blurb: string;
  guidance: string;
  cta: { label: string; href: string };
  color: string;
}

const PC_ZONES: PcZone[] = [
  {
    id: "Z0",
    name: "The Self",
    blurb: "Skills, knowledge, mindset — you're building your own capacity first.",
    guidance:
      "Right place to start. The Codetry Handbook is a plain-language guide to the whole method — how communities name their work, scope it, and hand it over without losing it. Read it first, then walk the Odyssey.",
    cta: { label: "Read the Handbook →", href: "/codetry-handbook/" },
    color: "#7A4E2D",
  },
  {
    id: "Z1",
    name: "The Home",
    blurb: "Household sorted. You want to connect with neighbours — buying clubs, food security at street level.",
    guidance:
      "This is exactly where the 807 Food Co-op started. A handful of households, one shared order. The numbers below show what three years of that looks like in a northern Ontario town.",
    cta: { label: "See the 807 numbers ↓", href: "#section-outcomes" },
    color: "#1f3d2e",
  },
  {
    id: "Z2",
    name: "The Garden",
    blurb: "You're growing food and hitting the limits of what one farm or garden can do alone.",
    guidance:
      "The route problem is real — one producer can't justify a freight run. Pool the demand across 10–15 households and the math changes. The flywheel section below explains how it works without a grant to get started.",
    cta: { label: "How the flywheel works ↓", href: "#section-flywheel" },
    color: "#2e8b4e",
  },
  {
    id: "Z3",
    name: "The Homestead",
    blurb: "Working homestead. You want to knit it into a supply chain that doesn't depend on chain grocery.",
    guidance:
      "The cold distribution lane ratified at our May 2026 AGM is the infrastructure you're looking for — a bi-weekly route that moves product without depending on individual vehicle runs. The Headwaters Odyssey teaches the method for organising that in your own region.",
    cta: { label: "Start the Odyssey →", href: "/odyssey" },
    color: "#c97c2e",
  },
  {
    id: "Z4",
    name: "The Forest",
    blurb: "Land-scale thinking — watershed economics, long-horizon community ownership.",
    guidance:
      "The northern reserve work is the right lens here. Headwaters is delivering a full store operating system to Deer Lake First Nation — software, accounts, freight, on-site training. Community ownership at that scale is the same model, bigger radius.",
    cta: { label: "Read about the work ↓", href: "#section-trust" },
    color: "#3D4A5C",
  },
  {
    id: "Z5",
    name: "The Wild",
    blurb: "You've built something and you're ready to help others replicate it.",
    guidance:
      "The Odyssey is the method written down — five phases, twenty stations, the same discipline used to build the 807 Food Co-op. If you're at the stage where you want to teach it forward, start there.",
    cta: { label: "Begin the Odyssey →", href: "/odyssey" },
    color: "#5B3E8C",
  },
];

function TspZoneQuiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const zone = PC_ZONES.find((z) => z.id === selected);

  return (
    <div
      className="rounded-sm border print:hidden"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid="section-zone-quiz"
    >
      <div className="px-5 pt-5 pb-3">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.28em] mb-2"
          style={{ color: "hsl(var(--accent))" }}
        >
          start here
        </p>
        <p className="font-serif text-base sm:text-lg leading-snug mb-4">
          Which zone are you working in right now?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PC_ZONES.map((z) => {
            const active = selected === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelected(active ? null : z.id)}
                className="text-left rounded-sm border px-3 py-2.5 transition-all"
                style={{
                  borderColor: active ? z.color : "hsl(var(--card-border))",
                  background: active ? `${z.color}12` : "hsl(var(--card))",
                  boxShadow: active ? `0 0 0 1.5px ${z.color}` : "none",
                }}
                aria-pressed={active}
                data-testid={`zone-btn-${z.id}`}
              >
                <span
                  className="block font-mono text-[9px] uppercase tracking-[0.18em] mb-0.5"
                  style={{ color: active ? z.color : "hsl(var(--muted-foreground))" }}
                >
                  {z.id}
                </span>
                <span
                  className="block font-serif text-[13px] font-medium leading-tight mb-1"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {z.name}
                </span>
                <span
                  className="block font-serif text-[11px] leading-snug"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {z.blurb}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {zone && (
        <div
          className="mx-5 mb-5 mt-1 rounded-sm px-4 py-4"
          style={{
            background: `${zone.color}0d`,
            borderLeft: `3px solid ${zone.color}`,
          }}
          data-testid="zone-guidance"
        >
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2"
            style={{ color: zone.color }}
          >
            {zone.id} · {zone.name}
          </p>
          <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80 mb-3">
            {zone.guidance}
          </p>
          <a
            href={zone.cta.href}
            className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
            style={{ color: zone.color }}
            data-testid="zone-cta"
          >
            {zone.cta.label}
          </a>
        </div>
      )}
    </div>
  );
}

interface FormState {
  name: string;
  email: string;
  community: string;
  wouldWant: string;
  website: string; // honeypot
}

const EMPTY: FormState = {
  name: "",
  email: "",
  community: "",
  wouldWant: "",
  website: "",
};

const LISTEN_CANONICAL = "codetry.ca/listen";
const LISTEN_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/listen`
    : `https://${LISTEN_CANONICAL}`;

const FROM_PARAM =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("from") ?? ""
    : "";
const IS_TSP_PATH =
  typeof window !== "undefined" && window.location.pathname.endsWith("/tsp");
const BRIDGE_SOURCE: "youtube" | "tsp" | null =
  FROM_PARAM === "youtube"
    ? "youtube"
    : FROM_PARAM === "tsp" || IS_TSP_PATH
    ? "tsp"
    : null;

interface CoopFormState {
  name: string;
  email: string;
  community: string;
  whatTheyNeed: string;
}

const EMPTY_COOP: CoopFormState = {
  name: "",
  email: "",
  community: "",
  whatTheyNeed: "",
};

export function ListenPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  const [coopForm, setCoopForm] = useState<CoopFormState>(EMPTY_COOP);
  const [coopSubmitting, setCoopSubmitting] = useState(false);
  const [coopError, setCoopError] = useState<string | null>(null);
  const [coopConfirmedName, setCoopConfirmedName] = useState<string | null>(null);

  const onCoopSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (coopSubmitting) return;
    setCoopError(null);
    setCoopSubmitting(true);
    try {
      const res = await postIntake({
        name: coopForm.name.trim(),
        email: coopForm.email.trim(),
        community: coopForm.community.trim(),
        role: "co-op-builder",
        whatTheyNeed: coopForm.whatTheyNeed.trim() || "General inquiry from /listen",
      });
      setCoopConfirmedName(res.name);
      setCoopForm(EMPTY_COOP);
    } catch (err) {
      if (err instanceof ApiError) {
        setCoopError(err.message);
      } else {
        setCoopError("Could not reach the server just now. Try again in a moment.");
      }
    } finally {
      setCoopSubmitting(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await postSignOn({
        name: form.name.trim(),
        email: form.email.trim(),
        org: form.community.trim() || undefined,
        wouldWant: form.wouldWant.trim() || undefined,
        source: "listen-tsp",
      });
      setConfirmedName(res.name);
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not reach the server just now. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="listen-page min-h-screen w-full bg-background text-foreground">

      {/* ── boreal field journal hero — hidden in print ── */}
      <section
        className="relative overflow-hidden print:hidden"
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
            headwaters · heard on the survival podcast
          </p>
          <h1
            className="font-serif leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)" }}
          >
            The supply chain you depend on{" "}
            <span style={{ color: "#b85a3e" }}>was never designed to serve you.</span>
          </h1>
          <p
            className="mt-4 font-serif font-medium"
            style={{ fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)", color: "rgba(244,237,224,0.92)" }}
          >
            A working community food economy — real numbers, real members, real logistics.
            Built by someone who already ran one in northwestern Ontario.
          </p>
          <p
            className="mt-4 font-serif leading-relaxed"
            style={{ fontSize: "clamp(0.9rem, 2.6vw, 1rem)", color: "rgba(244,237,224,0.65)" }}
          >
            Towns of 3,000–10,000 people, hours from the nearest distribution centre.
            Local producers who can&rsquo;t reach markets. Communities bleeding money
            outward to chain grocery. One co-op decided to pool its demand instead — and
            built a food system the chain never would.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 pt-10 pb-16 print:py-0 print:max-w-full">

        {/* ---- YouTube / TSP bridge banner ---- */}
        {BRIDGE_SOURCE && (
          <div
            className="mt-6 rounded-sm border-l-4 px-5 py-4 print:hidden"
            style={{ borderLeftColor: "#b85a3e", background: "hsl(var(--muted))" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "#b85a3e" }}>
              {BRIDGE_SOURCE === "youtube" ? "you found us from the youtube video" : "you found us from the survival podcast"}
            </p>
            <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
              {BRIDGE_SOURCE === "youtube"
                ? "That episode was recorded in 2023. A lot has happened — 807 Food Co-op has moved ~$147,000 through a community-owned channel, and a cold distribution route to Dryden was ratified at our May 2026 AGM. The full picture is below."
                : "Welcome back. The numbers below are current as of 2026 — the co-op has grown since Jack's episode aired."}
            </p>
          </div>
        )}

        {/* ---- print-only one-liner ---- */}
        <p className="hidden print:block mt-3 font-serif text-base leading-snug">
          807 Food Co-op is a member-owned food co-operative in Dryden, Ontario — incorporated under the Co-operative Corporations Act, operated by 14+ member businesses, $147,000 moved through a community-owned channel in 27 months.
        </p>

        {/* ---- Start Here — permaculture zone quiz ---- */}
        <div className="mt-8 print:hidden">
          <TspZoneQuiz />
        </div>

        {/* ---- 807 outcomes block ---- */}
        <section className="mt-8 print:hidden" data-testid="section-outcomes">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            proof it works
          </p>
          <div
            className="rounded-sm border px-6 py-5 space-y-6"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          >
            <p className="font-serif font-semibold text-lg sm:text-xl leading-snug">
              807 Food Co-op — Dryden, Ontario
            </p>

            {/* Local Line — online orders */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                Local Line online orders · Feb 2023 – May 2026
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "142",          label: "Households" },
                  { value: "592",          label: "Orders fulfilled" },
                  { value: "$43,724.59",   label: "Revenue" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p
                      className="font-serif font-semibold leading-none mb-1"
                      style={{ fontSize: "clamp(1.3rem, 3.8vw, 1.85rem)", color: "hsl(var(--foreground))" }}
                    >
                      {value}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                avg order $73.85 · first order Feb 18, 2023
              </p>
            </div>

            {/* Square POS — in-person */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                Square POS in-person (markets + food hub) · 2023–2025
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-serif border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(var(--card-border))" }}>
                      <th className="text-left pb-2 font-semibold">Year</th>
                      <th className="text-right pb-2 font-semibold">Gross</th>
                      <th className="text-right pb-2 font-semibold">Transactions</th>
                      <th className="text-right pb-2 font-semibold">Avg</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/75">
                    <tr style={{ borderBottom: "1px solid hsl(var(--card-border))" }}>
                      <td className="py-1.5">2023</td>
                      <td className="text-right py-1.5">$15,416.96</td>
                      <td className="text-right py-1.5">510</td>
                      <td className="text-right py-1.5">$30.23</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid hsl(var(--card-border))" }}>
                      <td className="py-1.5 font-semibold" style={{ color: "hsl(var(--foreground))" }}>2024</td>
                      <td className="text-right py-1.5 font-semibold" style={{ color: "hsl(var(--foreground))" }}>$79,327.99</td>
                      <td className="text-right py-1.5 font-semibold" style={{ color: "hsl(var(--foreground))" }}>1,707</td>
                      <td className="text-right py-1.5 font-semibold" style={{ color: "hsl(var(--foreground))" }}>$46.47</td>
                    </tr>
                    <tr>
                      <td className="pt-1.5">2025</td>
                      <td className="text-right pt-1.5">$8,951.71</td>
                      <td className="text-right pt-1.5">239</td>
                      <td className="text-right pt-1.5">$37.45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-serif text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                The 2024 spike: an NOHFC People &amp; Talent grant funded a coordinator and regular store hours
                from August 2024 through April 2025. When access and capacity were added, the community
                showed up. The 2025 drop is the grant period ending — not demand collapsing.
              </p>
            </div>

            {/* Combined total */}
            <div
              className="rounded-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3"
              style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--card-border))" }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Combined all-time · 27 months
                </p>
                <p className="font-serif font-semibold text-xl sm:text-2xl" style={{ color: "hsl(var(--foreground))" }}>
                  ~$147,000
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Transactions
                </p>
                <p className="font-serif font-semibold text-xl sm:text-2xl" style={{ color: "hsl(var(--foreground))" }}>
                  ~3,048
                </p>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">
              807foodcoop.ca · parrsjars.ca
            </p>
          </div>
        </section>

        {/* ---- what ownership actually means ---- */}
        <section className="mt-6 print:hidden" data-testid="section-ownership">
          <div
            className="rounded-sm border px-6 py-5 space-y-4"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "hsl(var(--accent))" }}>
              what ownership actually means
            </p>
            <p className="font-serif font-semibold text-base sm:text-lg leading-snug">
              No VC. No franchise fee. No margin pulled to a head office.
            </p>
            <div className="space-y-2 font-serif text-sm sm:text-base leading-relaxed text-foreground/75">
              <p>
                Platform costs: ~$2,500/yr (Local Line SaaS) + ~$20/mo banking. That&rsquo;s the whole overhead stack.
              </p>
              <p>
                Incorporated under Ontario&rsquo;s <em>Co-operative Corporations Act</em>. Members own it — not investors, not a parent organization, not a vendor.
              </p>
              <p>
                <strong style={{ color: "hsl(var(--foreground))" }}>14+ active member businesses</strong> confirmed as of the May 2026 AGM.
              </p>
            </div>
          </div>
        </section>

        {/* ---- primary CTA — Odyssey as next step ---- */}
        <section className="mt-8 print:hidden" data-testid="section-odyssey-cta">
          <div
            className="rounded-sm px-6 py-6 space-y-4"
            style={{ background: "#1f3d2e" }}
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(212,160,23,0.85)" }}
            >
              The free next step
            </p>
            <h2
              className="font-serif text-xl sm:text-2xl leading-snug"
              style={{ color: "#f4ede0" }}
            >
              Start the Headwaters Odyssey — free, self-paced, no account required.
            </h2>
            <p
              className="font-serif text-base leading-relaxed"
              style={{ color: "rgba(244,237,224,0.72)" }}
            >
              A disciplined 5-phase journey that teaches the same naming and organising method used to build the 807 Food Co-op. You work through it at your own pace. Each station unlocks when you do the work.
            </p>
            <a
              href="/odyssey"
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "#b85a3e", color: "#f4ede0" }}
              data-testid="listen-odyssey-cta"
            >
              Begin the Odyssey →
            </a>
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        <p className="mt-6 font-serif text-xl sm:text-2xl leading-snug text-foreground/70 print:hidden">
          Not a co-op pitch. Not a grant application. A working system —
          three years of real numbers, real members, real logistics — in a
          region that the existing food system has never prioritised.
        </p>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- the flywheel ---- */}
        <section className="mt-10 sm:mt-12 space-y-5 font-serif text-base sm:text-lg leading-relaxed print:hidden" data-testid="section-flywheel">
          <p>
            <strong>The insight is simple.</strong> A single farm or store
            can&rsquo;t justify the distribution route. A single household
            can&rsquo;t negotiate freight. But pool the demand — get enough
            households ordering together — and suddenly the route is
            justifiable. The route justifies producers listing. Producers
            attract more members. More members justify better logistics.
          </p>
          <p>
            That&rsquo;s the flywheel. It doesn&rsquo;t require a grant to
            start. It requires a group of people willing to put their name on
            an order before the system exists. The 807 Food Co-op started
            with that. The numbers above are what three years of that looks like.
          </p>
          <p>
            The platform cost is ~$2,500/yr. The overhead is one part-time
            coordinator when a grant supports it, and volunteers when it
            doesn&rsquo;t. The community keeps every dollar of margin that
            would otherwise leave the region.
          </p>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- show notes / episode list ---- */}
        <section
          className="mt-10 sm:mt-12 print:hidden"
          data-testid="section-show-notes"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            episode
          </p>

          <div
            className="rounded-sm border px-5 py-4 space-y-2"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <p className="font-serif font-semibold text-base">
              <a
                href="https://www.thesurvivalpodcast.com/local-food-parr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                &ldquo;Community vs. Collapse&rdquo; — The Survival Podcast
              </a>
            </p>
            <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/70">
              Bobbie Parr sits down with Jack Spirko to talk local food, northern logistics, and what it actually takes to build a community economy from scratch. Recorded in 2023.
            </p>
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- who is bobbie ---- */}
        <section
          className="mt-10 sm:mt-12 print:mt-4"
          data-testid="section-bobbie"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            who is building this
          </p>

          <div
            className="rounded-sm border p-6 sm:p-8 space-y-4 print:border-black print:bg-transparent print:p-0 print:border-0 print:space-y-1"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          >
            <p className="font-serif font-semibold text-lg sm:text-xl">
              Bobbie Parr — Wabigoon, Ontario
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80 print:hidden">
              Bobbie homesteads in Wabigoon with her kids. She holds a degree in
              Community Development with a minor in
              Native Studies. She founded{" "}
              <a
                href="https://parrsjars.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                Parr&rsquo;s Jars
              </a>
              , the{" "}
              <a
                href="https://community-knowledge-hub.replit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                807 Food Co-op
              </a>
              , and{" "}
              <a
                href="https://ourheadwaters.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                Headwaters
              </a>
              , while homeschooling her children on a working homestead.
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80">
              In 2024 the Northwest Ontario Innovation Centre named her{" "}
              <a
                href="https://www.tbnewswatch.com/success/hard-working-innovattors-honoured-9846445"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                <strong>Innovative Hero of the Year</strong>
              </a>. In 2023 she sat down
              with Jack Spirko on{" "}
              <em>The Survival Podcast</em> for the episode{" "}
              <a
                href="https://www.thesurvivalpodcast.com/local-food-parr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                <strong>&ldquo;Community vs. Collapse&rdquo;</strong>
              </a>{" "}
              — the same
              show you&rsquo;re listening to now.
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80 print:hidden">
              She is the practitioner — the person delivering the software,
              training the team, and making the monthly site visits. This is not
              a proposal from an organization. It is a project being built by
              someone who already knows what northern logistics actually costs.
            </p>
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- why now / trust ---- */}
        <section
          className="mt-10 sm:mt-12 print:hidden"
          data-testid="section-trust"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            why this is moving now
          </p>

          <div className="space-y-4">
            <TrustRow
              label="807 Food Co-op"
              detail="A working food co-op in Northwestern Ontario. Real members, real orders, real logistics — the proof-of-concept that Codetry grew out of."
              href="https://community-knowledge-hub.replit.app/"
            />
            <TrustRow
              label="Co-operators CDP financial inclusion project"
              detail="A partnership with a national insurer targeting financial inclusion for northern households. Funding relationship in place."
            />
            <TrustRow
              label="Northern reserve community — expansion in progress"
              detail="Headwaters is delivering the store operating system to a northern First Nations community. Not planned. In progress."
            />
            <TrustRow
              label="The Codetry Handbook"
              detail="A full practitioner guide to running a community economy — the vocabulary, the tools, the operating model. Freely available. Built in the open."
            />
          </div>
        </section>

        {/* ---- what's next ---- */}
        <section className="mt-10 sm:mt-12 print:hidden" data-testid="section-whats-next">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            what&rsquo;s next
          </p>
          <div className="space-y-4">
            <TrustRow
              label="Phase 1 — cold distribution lane (AGM-ratified, May 21 2026)"
              detail="A bi-weekly Thunder Bay/Neebing → Sioux Lookout → Dryden cold run. ~$50K capital, AGM-approved. This is the logistics backbone that lets producers move product without depending on individual vehicle runs. Same flywheel — bigger radius."
            />
            <TrustRow
              label="Phase 2 — northern reserve service"
              detail="Extending the distribution lane into Deer Lake First Nation. Headwaters is already delivering the store operating system there: software, accounts, freight coordination, and on-site training. The lane follows the relationship."
            />
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- form / confirmation ---- */}
        <section className="mt-10 sm:mt-12 print:hidden" data-testid="section-form">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            put your name on the list
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed mb-8 text-foreground/75">
            If you heard this on the podcast and want to know when something
            concrete is available near you — put your name here. That&rsquo;s
            all this is. No pitch, no fundraising number. When there&rsquo;s
            something real to share, we&rsquo;ll write to you.
          </p>

          {confirmedName ? (
            <div
              className="rounded-md border bg-card p-8 sm:p-10 space-y-5"
              style={{ borderColor: "hsl(var(--card-border))" }}
              role="status"
              aria-live="polite"
              data-testid="confirmation"
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                signed on
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
                {confirmedName}, your name is on the list.
              </h2>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-muted-foreground">
                We saved what you wrote. We&rsquo;ll send a short note to the
                email you gave us so you have something on file. After that,
                quiet — until there&rsquo;s a reason to write.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmedName(null)}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  data-testid="link-sign-someone-else"
                >
                  sign someone else on
                </button>
              </div>
              <p className="signoff pt-4">— headwaters</p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-6"
              data-testid="form-listen"
              noValidate
            >
              {/* honeypot */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </label>
              </div>

              <Field
                id="listen-name"
                label="Your name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                testId="input-name"
                hint="The name we&rsquo;ll write back to."
              />
              <Field
                id="listen-email"
                label="Email"
                required
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                testId="input-email"
                hint="We&rsquo;ll send a short confirmation. No list, no marketing."
              />
              <Field
                id="listen-community"
                label="Your community or region (optional)"
                value={form.community}
                onChange={(v) => setForm({ ...form, community: v })}
                testId="input-community"
                hint="Helps us understand where interest is coming from."
              />
              <FieldArea
                id="listen-want"
                label="What would you want from a store like this in your area? (optional)"
                value={form.wouldWant}
                onChange={(v) => setForm({ ...form, wouldWant: v })}
                testId="input-want"
                hint="Plain language is fine. A sentence is enough."
                rows={3}
              />

              {error ? (
                <p
                  role="alert"
                  className="font-sans text-sm text-destructive"
                  data-testid="form-error"
                >
                  {error}
                </p>
              ) : null}

              <p
                className="font-sans text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Your name and email are stored so we can write back to you.{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  See our privacy policy.
                </a>
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  data-testid="button-listen-signon"
                >
                  {submitting ? "Signing on…" : "Put my name on the list"}
                </button>
                <p className="signoff">— headwaters</p>
              </div>

              <p className="font-serif text-sm text-foreground/60 pt-1">
                Have more to say?{" "}
                <Link
                  href="/sign-on"
                  className="underline underline-offset-4 hover:opacity-80"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  Use the full sign-on form →
                </Link>
              </p>
            </form>
          )}
        </section>

        {/* ---- co-op builder CTA ---- */}
        <section className="mt-10 sm:mt-12 print:hidden" data-testid="section-coop-builder">
          <div
            className="rounded-sm border px-6 py-6 space-y-5"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          >
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3"
                style={{ color: "hsl(var(--accent))" }}
              >
                building this in your community?
              </p>
              <h2 className="font-serif text-xl sm:text-2xl leading-snug">
                The platform that runs 807 Food Co-op is available to other co-ops.
              </h2>
              <p className="mt-3 font-serif text-base leading-relaxed text-foreground/75">
                If you&rsquo;re organising something similar — a buying club, a
                food hub, a producer co-op — Headwaters can set up and run the
                same operating stack for your community. Leave your details and
                we&rsquo;ll have a real conversation about whether it fits.
              </p>
            </div>

            {coopConfirmedName ? (
              <div
                role="status"
                aria-live="polite"
                data-testid="coop-confirmation"
                className="space-y-3"
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  received
                </p>
                <p className="font-serif text-lg leading-snug">
                  Got it, {coopConfirmedName}. We&rsquo;ll be in touch.
                </p>
                <p className="font-serif text-sm text-foreground/65">
                  We saved what you wrote. Expect a short note to your inbox — then quiet until there&rsquo;s a reason to write.
                </p>
                <button
                  type="button"
                  onClick={() => setCoopConfirmedName(null)}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  data-testid="coop-reset"
                >
                  submit another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={onCoopSubmit}
                className="space-y-4"
                data-testid="form-coop-builder"
                noValidate
              >
                <Field
                  id="coop-name"
                  label="Your name"
                  required
                  value={coopForm.name}
                  onChange={(v) => setCoopForm({ ...coopForm, name: v })}
                  testId="coop-input-name"
                />
                <Field
                  id="coop-email"
                  label="Email"
                  required
                  type="email"
                  value={coopForm.email}
                  onChange={(v) => setCoopForm({ ...coopForm, email: v })}
                  testId="coop-input-email"
                />
                <Field
                  id="coop-community"
                  label="Community or region"
                  required
                  value={coopForm.community}
                  onChange={(v) => setCoopForm({ ...coopForm, community: v })}
                  testId="coop-input-community"
                  hint="Where are you trying to build?"
                />
                <FieldArea
                  id="coop-need"
                  label="What are you trying to build or solve? (optional)"
                  value={coopForm.whatTheyNeed}
                  onChange={(v) => setCoopForm({ ...coopForm, whatTheyNeed: v })}
                  testId="coop-input-need"
                  hint="A sentence or two is plenty. Early stage is fine."
                  rows={3}
                />

                {coopError ? (
                  <p
                    role="alert"
                    className="font-sans text-sm text-destructive"
                    data-testid="coop-error"
                  >
                    {coopError}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <button
                    type="submit"
                    disabled={coopSubmitting}
                    className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    data-testid="button-coop-submit"
                  >
                    {coopSubmitting ? "Sending…" : "Get in touch →"}
                  </button>
                  <p className="signoff">— headwaters</p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ---- shareable / printable footer block ---- */}
        <section
          className="mt-16 sm:mt-20 rounded-sm border p-6 sm:p-8 print:border-black"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="section-share"
          aria-label="Shareable link and QR code"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5 print:text-black"
            style={{ color: "hsl(var(--accent))" }}
          >
            share this page
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="shrink-0 rounded-sm overflow-hidden bg-white p-2"
              style={{ lineHeight: 0 }}
            >
              <QRCodeSVG
                value={LISTEN_URL}
                size={120}
                fgColor="#1a1a1a"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div className="space-y-2">
              <p
                className="font-mono text-base sm:text-lg font-bold tracking-tight print:text-black"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {LISTEN_CANONICAL}
              </p>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/65 print:text-black">
                Scan the code or type the address. Works on any phone — no app
                required. Share it in your show notes, your group chat, or
                hand someone this page after the episode.
              </p>
            </div>
          </div>
        </section>

        {/* ---- footer ---- */}
        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4 print:hidden"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="footer"
        >
          <p className="signoff">headwaters · {new Date().getFullYear()}</p>
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

// ---- sub-components ----

function TrustRow({
  label,
  detail,
  href,
}: {
  label: string;
  detail: string;
  href?: string;
}) {
  return (
    <div
      className="rounded-sm border px-5 py-4 space-y-1"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <p className="font-serif font-semibold text-base">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            {label}
          </a>
        ) : (
          label
        )}
      </p>
      <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/70">
        {detail}
      </p>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
  type?: string;
  required?: boolean;
  hint?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  testId,
  type = "text",
  required,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-sans text-sm font-medium">
        {label}
        {required ? (
          <span className="ml-1" style={{ color: "hsl(var(--accent))" }}>
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "email" ? "email" : "off"}
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
        style={{ borderColor: "hsl(var(--card-border))" }}
        data-testid={testId}
      />
      {hint ? (
        <p
          className="font-sans text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}

interface FieldAreaProps extends Omit<FieldProps, "type"> {
  rows?: number;
}

function FieldArea({
  id,
  label,
  value,
  onChange,
  testId,
  required,
  hint,
  rows = 3,
}: FieldAreaProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-sans text-sm font-medium"
        dangerouslySetInnerHTML={{
          __html:
            label +
            (required
              ? ' <span style="color:hsl(var(--accent))">*</span>'
              : ""),
        }}
      />
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2 resize-y"
        style={{ borderColor: "hsl(var(--card-border))" }}
        data-testid={testId}
      />
      {hint ? (
        <p
          className="font-sans text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}
