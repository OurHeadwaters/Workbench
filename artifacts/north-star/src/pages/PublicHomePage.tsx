import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { BG, SURFACE, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, FONT_DISPLAY } from "@/lib/theme";

export function PublicHomePage() {
  const [checkoutState, setCheckoutState] = useState<"idle" | "starting" | "error">("idle");

  async function startBookCheckout(): Promise<void> {
    setCheckoutState("starting");
    try {
      const response = await fetch("/api/kits/handbook/checkout", { method: "POST" });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error ?? "Could not start checkout.");
      window.location.assign(payload.url);
    } catch {
      setCheckoutState("error");
    }
  }

  return (
    <div className="min-h-dvh flex flex-col font-sans selection:bg-amber-900/30 selection:text-amber-100" style={{ backgroundColor: BG, color: TEXT }}>
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(11, 9, 5, 0.85)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 p-2 -ml-2">
          <span className="text-xl tracking-wide" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>Headwaters</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="p-2 transition-colors hover:text-white" style={{ color: TEXT_2 }}>How it works</a>
          <a href="#book" className="p-2 transition-colors hover:text-white" style={{ color: TEXT_2 }}>The book</a>
          <a href="#private-demonstration" className="p-2 transition-colors hover:text-white" style={{ color: TEXT_2 }}>Private demonstration</a>
        </nav>
        <Link href="/onboarding" className="p-2 text-sm font-medium transition-colors hover:opacity-80" style={{ color: TEXT }}>
          Sign in
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest font-medium mb-8" style={{ color: AMBER }}>
            Person-Supported Care
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight mb-8" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
            Help the person be seen.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: TEXT_2 }}>
            The person supported is often the missing voice in the system. Headwaters adds a quality-of-life and meaning layer that stays with the person and is used with them.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a 
              href="#private-demonstration"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-medium flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              See the private demonstration <ArrowRight size={18} />
            </a>
            <a 
              href="mailto:hello@ourheadwaters.ca"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-medium flex items-center justify-center transition-colors hover:bg-white/5 active:scale-95"
              style={{ color: TEXT, border: `1px solid ${BORDER}` }}
            >
              Start a care conversation
            </a>
          </div>
        </section>

        {/* Positioning Statement */}
        <section className="w-full px-6 py-20 md:py-28" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-8" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
              Headwaters helps the person supported remain represented.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: TEXT_2 }}>
              A practical quality-of-life and meaning layer used with the person supported. It helps staff translate the person’s own knowing, preferences, and ways of communicating into something the people around them can use.
            </p>
          </div>
        </section>

        {/* The Gap */}
        <section className="w-full px-6 py-24 md:py-32 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-5 md:sticky md:top-32">
              <h2 className="text-3xl md:text-4xl font-normal leading-tight" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                The gap is not always another tool.
              </h2>
            </div>
            <div className="md:col-span-7 space-y-8 text-lg md:text-xl leading-relaxed" style={{ color: TEXT_2 }}>
              <p>
                Most systems can hold plans, tasks, reports, and records. They do not always represent how the person understands their own life, what matters to them, what causes distress, or what helps them participate.
              </p>
              <p>
                That missing layer affects quality of life first. It also makes it harder for staff to provide person-centred support when the person’s own meaning is not available in a usable form.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="w-full px-6 py-24 md:py-32" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium mb-6" style={{ color: AMBER }}>01</span>
                <h3 className="text-xl md:text-2xl font-normal mb-4" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>Listen with the person</h3>
                <p className="text-base leading-relaxed" style={{ color: TEXT_2 }}>
                  Spend time understanding what matters most to them, how they communicate naturally, and what their version of a good day actually looks like.
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium mb-6" style={{ color: AMBER }}>02</span>
                <h3 className="text-xl md:text-2xl font-normal mb-4" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>Translate the meaning</h3>
                <p className="text-base leading-relaxed" style={{ color: TEXT_2 }}>
                  Turn their lived experience and personal preferences into clear, structured, and usable guidance that their entire support network can rely on.
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium mb-6" style={{ color: AMBER }}>03</span>
                <h3 className="text-xl md:text-2xl font-normal mb-4" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>Support better action</h3>
                <p className="text-base leading-relaxed" style={{ color: TEXT_2 }}>
                  Equip staff, family, and caregivers with the immediate insight they need to provide truly person-centred care in the moments that matter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Book */}
        <section id="book" className="w-full px-6 py-24 md:py-32" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(210px,300px)_1fr] gap-12 md:gap-20 items-center">
            <div className="mx-auto md:mx-0 w-full max-w-[280px]">
              <img
                src={`${import.meta.env.BASE_URL}headwaters-book-cover-art.png`}
                alt="Cover of Headwaters: How a Community Runs Its Own Economy"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full rounded-sm shadow-2xl"
                style={{ boxShadow: "0 20px 50px rgba(0,0,0,.38)" }}
              />
            </div>
            <article>
              <p className="text-xs uppercase tracking-widest font-medium mb-6" style={{ color: AMBER }}>
                The book
              </p>
              <h2 className="text-3xl md:text-5xl font-normal leading-tight mb-6" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                How a Community Runs Its Own Economy
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-5" style={{ color: TEXT_2 }}>
                A Headwaters field guide for people building work that stays rooted in the community that owns it.
              </p>
              <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: TEXT_3 }}>
                Digital PDF edition · immediate secure download by email · no print edition or shipping
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={() => void startBookCheckout()}
                  disabled={checkoutState === "starting"}
                  className="px-7 py-4 rounded-full text-base font-medium transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-70"
                  style={{ backgroundColor: AMBER, color: BG }}
                >
                  {checkoutState === "starting" ? "Opening secure checkout…" : "Buy the digital book · $39 CAD"}
                </button>
                {checkoutState === "error" && (
                  <p role="alert" className="text-sm" style={{ color: "#e69a83" }}>
                    Checkout could not start. Please try again shortly.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* Existing tools & Who it is for */}
        <section className="w-full px-6 py-24 md:py-32" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="text-2xl md:text-3xl font-normal leading-tight mb-8" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                Fill the gap. Do not force a replacement.
              </h2>
              <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: TEXT_2 }}>
                <p>
                  Current systems can remain in use internally. This layer can sit beside, overlay, connect to, or be set aside where it does not fit.
                </p>
                <p>
                  It does not replace staff judgement, care plans, or existing organizational software.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-normal leading-tight mb-8" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                For people and the people supporting them.
              </h2>
              <ul className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: TEXT_2 }}>
                <li className="flex items-start gap-4">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: AMBER }} />
                  <span>For the person supported, to have their meaning and preferences held and respected.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: AMBER }} />
                  <span>For support staff, to have practical guidance that makes person-centred care possible.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: AMBER }} />
                  <span>For families and networks, to trust that the person is seen and understood.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Private Demo */}
        <section id="private-demonstration" className="w-full px-6 py-32 md:py-40 text-center flex flex-col items-center" style={{ backgroundColor: BG }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-normal leading-tight mb-6" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
              See the layer in practice.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-12" style={{ color: TEXT_2 }}>
              Take a quiet look at how the translation layer works for a person supported and their team.
            </p>
            <a 
              href="mailto:hello@ourheadwaters.ca"
              className="inline-flex px-10 py-5 rounded-full text-base font-medium items-center justify-center transition-colors hover:bg-white/5 active:scale-95 mb-10"
              style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid ${BORDER}` }}
            >
              Request a private demonstration
            </a>
            <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: TEXT_3 }}>
              Headwaters is in early stages of development and testing with select organizations.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-12 text-sm flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderTop: `1px solid ${BORDER}`, color: TEXT_3 }}>
        <div className="p-2 -ml-2">&copy; {new Date().getFullYear()} Headwaters.</div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a href="mailto:hello@ourheadwaters.ca" className="p-2 transition-colors hover:text-white">Contact</a>
          <a href="#" className="p-2 transition-colors hover:text-white">Privacy</a>
          <a href="#" className="p-2 transition-colors hover:text-white">Legal</a>
          <Link href="/onboarding" className="p-2 transition-colors hover:text-white font-medium" style={{ color: TEXT_2 }}>
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
