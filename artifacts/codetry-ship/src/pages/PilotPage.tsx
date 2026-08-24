import { useEffect } from "react";
import { AmbientBackground, GrainOverlay, ScrollReveal } from "@/components/AmbientBackground";

export function PilotPage() {
  useEffect(() => {
    const title = "Care Pilot | Headwaters";
    const description = "Headwaters care pilots help community partners keep a person’s meaning, preferences, and communication represented alongside existing care.";
    const rootTitle = "Headwaters — How communities run their own economy";
    const rootDescription = "Planning, development, and operations support for northern communities. Built from the ground up in Northwestern Ontario.";
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
    const canonicalUrl = `${window.location.origin}${base}/pilot`;
    const previousValues: Array<{ element: Element; attribute: string; value: string | null }> = [];

    const setMeta = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector(selector);
      if (element) {
        previousValues.push({ element, attribute, value: element.getAttribute(attribute) });
        element.setAttribute(attribute, value);
      }
    };

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);

    const canonical = document.querySelector('link[rel="canonical"]') ?? document.createElement("link");
    const createdCanonical = !canonical.parentNode;
    if (createdCanonical) {
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    previousValues.push({ element: canonical, attribute: "href", value: canonical.getAttribute("href") });
    canonical.setAttribute("href", canonicalUrl);

    return () => {
      document.title = rootTitle;
      for (const previous of previousValues) {
        if (previous.value === null) {
          previous.element.removeAttribute(previous.attribute);
        } else {
          previous.element.setAttribute(previous.attribute, previous.value);
        }
      }
      if (createdCanonical) {
        canonical.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-screen w-full relative bg-background text-foreground selection:bg-primary selection:text-primary-foreground" style={{ background: "#0F1C18" }}>
      <AmbientBackground variant="mist" />
      <GrainOverlay opacity={0.02} />

      <div className="relative z-10 mx-auto max-w-[46rem] px-6 sm:px-8 pt-20 pb-24">
        <ScrollReveal>
          <header className="mb-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5" style={{ color: "rgba(212,160,23,0.8)" }}>
              headwaters &middot; care pilot
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-tight mb-6" style={{ color: "#f4ede0" }}>
              A care pilot for <span style={{ color: "#b85a3e" }}>staying represented.</span>
            </h1>
            <p className="font-serif text-[17px] leading-relaxed" style={{ color: "rgba(244,237,224,0.72)" }}>
              When a person moves through care systems, their own knowing, meaning, preferences, and ways of communicating can easily disappear into the mechanics of the system itself. This is the human-translation gap. Headwaters provides a quality-of-life and meaning layer that stays with the person supported, ensuring they remain represented.
            </p>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <section className="mb-14" aria-labelledby="parallel-care-heading">
            <div className="rounded-md border p-6 sm:p-8" style={{ borderColor: "rgba(244,237,224,0.08)", background: "rgba(15,28,24,0.6)" }}>
              <h2 id="parallel-care-heading" className="font-serif text-2xl mb-3" style={{ color: "#f4ede0" }}>
                Parallel to existing care
              </h2>
              <p className="font-serif text-[15.5px] leading-relaxed" style={{ color: "rgba(244,237,224,0.65)" }}>
                This is an overlay, not a replacement. We do not replace professional judgement, medical directives, or care plans. Your existing organizational tools can remain in use, be overlaid with this meaning layer, or be set aside only where appropriate. The goal is to add a foundation of meaning, not to disrupt the care that works.
              </p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <section className="mb-14" aria-labelledby="who-heading">
            <h2 id="who-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "#d4a017" }}>
              Who this is for
            </h2>
            <p className="font-serif text-[16px] leading-relaxed" style={{ color: "rgba(244,237,224,0.8)" }}>
              This pilot is a quiet, person-centred invitation for <strong>community care organizations</strong> and <strong>practical host partners</strong> who want to help the person supported remain represented, clearly and consistently, in their own care.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <section className="mb-14" aria-labelledby="first-90-heading">
            <h2 id="first-90-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5" style={{ color: "#d4a017" }}>
              What is explored in the first 90 days
            </h2>
            <div className="space-y-6">
              <article className="flex gap-4">
                <span aria-hidden="true" className="font-mono text-[12px] opacity-50 mt-1">01</span>
                <div>
                  <h3 className="font-serif text-lg mb-1" style={{ color: "#f4ede0" }}>Establishing the baseline</h3>
                  <p className="font-serif text-[15px] leading-relaxed" style={{ color: "rgba(244,237,224,0.65)" }}>Understanding the person's current daily rhythms, preferences, and the environments they navigate.</p>
                </div>
              </article>
              <article className="flex gap-4">
                <span aria-hidden="true" className="font-mono text-[12px] opacity-50 mt-1">02</span>
                <div>
                  <h3 className="font-serif text-lg mb-1" style={{ color: "#f4ede0" }}>Mapping communication</h3>
                  <p className="font-serif text-[15px] leading-relaxed" style={{ color: "rgba(244,237,224,0.65)" }}>Translating how they express meaning and comfort into a shared, understandable language for the care team.</p>
                </div>
              </article>
              <article className="flex gap-4">
                <span aria-hidden="true" className="font-mono text-[12px] opacity-50 mt-1">03</span>
                <div>
                  <h3 className="font-serif text-lg mb-1" style={{ color: "#f4ede0" }}>Testing the overlay</h3>
                  <p className="font-serif text-[15px] leading-relaxed" style={{ color: "rgba(244,237,224,0.65)" }}>Integrating this meaning layer alongside existing care plans to observe where clarity and quality of life improve.</p>
                </div>
              </article>
            </div>
          </section>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
          <ScrollReveal delay={400}>
            <section aria-labelledby="provides-heading">
              <h2 id="provides-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "#d4a017" }}>
                What Headwaters provides
              </h2>
              <ul className="space-y-3 font-serif text-[15px] leading-relaxed" style={{ color: "rgba(244,237,224,0.7)" }}>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> The framework and translation layer</li>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> Dedicated practitioner time and guidance</li>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> Portable tools for the host partner and family</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <section aria-labelledby="contributes-heading">
              <h2 id="contributes-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "#d4a017" }}>
                What a host partner contributes
              </h2>
              <ul className="space-y-3 font-serif text-[15px] leading-relaxed" style={{ color: "rgba(244,237,224,0.7)" }}>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> Time and attention from front-line staff</li>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> Willingness to integrate a parallel meaning layer</li>
                <li className="flex gap-3"><span aria-hidden="true" style={{ color: "#b85a3e" }}>&mdash;</span> Candid feedback on what works on the floor</li>
              </ul>
            </section>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={600}>
          <section className="mb-16" aria-labelledby="produces-heading">
            <h2 id="produces-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "#d4a017" }}>
              What a useful pilot produces
            </h2>
            <p className="font-serif text-[16px] leading-relaxed mb-4" style={{ color: "rgba(244,237,224,0.8)" }}>
              At the end of the pilot, the person supported holds a clear, portable meaning record that travels with them. The host partner gains proof of integration with their existing systems and a tangible foundation for scaling this person-centred representation to other individuals in their care model.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={700}>
          <section aria-labelledby="contact-heading" className="rounded-md border p-8 sm:p-10 text-center" style={{ borderColor: "rgba(212,160,23,0.2)", background: "rgba(212,160,23,0.03)" }}>
            <h2 id="contact-heading" className="font-serif text-2xl mb-4" style={{ color: "#f4ede0" }}>
              Begin the conversation
            </h2>
            <p className="font-serif text-[15.5px] leading-relaxed mb-8 max-w-[28rem] mx-auto" style={{ color: "rgba(244,237,224,0.65)" }}>
              This starts as a quiet, safe conversation at a kitchen table. No pitch, no obligations. If you are responsible for a real person and want to explore a pilot, reach out using the path below.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a href={`${import.meta.env.BASE_URL}listen`} aria-label="Explore a private pilot conversation with Bobbie" className="btn-plaque" style={{ padding: "0.8rem 2rem", fontSize: "0.7rem" }}>
                Explore a private pilot conversation
              </a>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-50" style={{ color: "#f4ede0" }}>
                Or use the Kitchen Table widget in the corner
              </p>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
