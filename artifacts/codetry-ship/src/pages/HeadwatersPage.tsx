import { Redirect } from "wouter";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Circle, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { applyPageMetadata } from "@/lib/seo";
import { PUBLIC_EXAMPLE_DESTINATIONS } from "@/data/publicExampleDestinations";

const BASE = import.meta.env.BASE_URL ?? "/";

function route(path: string) {
  return `${BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const OFFERS = [
  {
    value: "year 1 codetry engagement",
    number: "01",
    title: "Year 1 · Base build",
    description:
      "Codetry plus the base build using the organization's current strategic plan, with annual mapping, governance record, training, launch acceptance, handoff, reporting, and a roadmap.",
    price:
      "$20,000 CAD. Proposed grant-supported project work; written scope confirms payer and funding conditions.",
  },
  {
    value: "year 2 codetry engagement",
    number: "02",
    title: "Year 2 · Additional layer",
    description:
      "A separate engagement for an additional Codetry layer plus a new annual strategic plan supporting board and training implementation.",
    price:
      "$20,000 CAD. The normal $6,000 operating fee is waived only during a qualifying active annual engagement and is not added on top.",
  },
  {
    value: "needs custom review",
    number: "03",
    title: "Custom review",
    description:
      "A considered starting point for expanded, unusual, or still-forming work that needs a human look before scope is set.",
    price: "Priced after review. The first conversation is about fit and shape, not a commitment.",
  },
] as const;

function quoteLink(offer: (typeof OFFERS)[number]["value"]) {
  return `${route("quote")}?offer=${encodeURIComponent(offer)}`;
}

function trackOfferSelection(
  offer: (typeof OFFERS)[number]["value"],
  location: string,
) {
  trackEvent("consulting_offer_selected", { offer, location });
  trackEvent("offer_selected", { offer, location });
}

function trackPracticalExample(
  example: "co-op" | "care-continuity" | "small-business",
  destination: string,
) {
  trackEvent("homepage_practical_example_clicked", { example, destination });
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const { ref, revealed } = useReveal();
  return (
    <div
      ref={ref}
      className={`transform-gpu transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function HeadwatersPage() {
  useEffect(() => {
    const siteUrl = new URL(BASE, window.location.origin).toString();
    return applyPageMetadata({
      title: "Bobbie Parr | Headwaters & Codetry Ontario",
      description:
        "Bobbie Parr leads Headwaters in Northwestern Ontario, using Codetry to help organizations build practical systems, delivery capacity, and lasting local ownership.",
      path: BASE,
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}#organization`,
            name: "Headwaters",
            url: siteUrl,
            logo: new URL("favicon.svg", siteUrl).toString(),
            founder: { "@id": `${siteUrl}#bobbie-parr` },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Ontario, Canada",
            },
            description:
              "A Northwestern Ontario capacity-building practice using Codetry for work that needs to keep going.",
          },
          {
            "@type": "Person",
            "@id": `${siteUrl}#bobbie-parr`,
            name: "Bobbie Parr",
            url: siteUrl,
            jobTitle: "Headwaters Practitioner",
            worksFor: { "@id": `${siteUrl}#organization` },
            homeLocation: {
              "@type": "AdministrativeArea",
              name: "Northwestern Ontario, Canada",
            },
            knowsAbout: [
              "Codetry",
              "Capacity-building consulting",
              "Community-owned systems",
              "Organizational implementation",
            ],
          },
          {
            "@type": "Service",
            "@id": `${siteUrl}#capacity-building-consulting`,
            name: "Capacity-building consulting",
            serviceType: "Capacity-building consulting",
            provider: { "@id": `${siteUrl}#organization` },
            description:
              "Bounded consulting engagements that help organizations carry important work through to a usable system with practical tools and knowledge left behind.",
            offers: [
              {
                "@type": "Offer",
                name: "Year 1 Codetry engagement",
                price: "20000",
                priceCurrency: "CAD",
                description: "Codetry plus the base build using the organization's current strategic plan.",
              },
              {
                "@type": "Offer",
                name: "Year 2 Codetry engagement",
                price: "20000",
                priceCurrency: "CAD",
                description: "A separate additional Codetry layer plus a new annual strategic plan supporting board and training implementation.",
              },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What do Year 1 and Year 2 cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Year 1 and Year 2 are separate $20,000 CAD engagements. The normal $6,000 operating fee is waived only during a qualifying active annual engagement and is not added to either engagement.",
                },
              },
              {
                "@type": "Question",
                name: "Is the quote binding?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "No. The generated quote is budgetary and non-binding. Eligibility, scope, and security are reviewed before a formal commitment.",
                },
              },
              {
                "@type": "Question",
                name: "Who is Headwaters for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Headwaters works with community organizations, co-ops, nonprofits, and institutions that need practical delivery capacity now and a usable foundation afterward.",
                },
              },
            ],
          },
        ],
      },
    });
  }, []);

  return (
    <main className="font-sans antialiased bg-[#F7F7F5] text-[#1C1917] selection:bg-[#D4A017] selection:text-[#1C1917]">
      <header className="absolute top-0 w-full z-50 px-6 py-8 flex justify-between items-center">
        <a
          href={BASE}
          aria-label="Headwaters home"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm p-1 -ml-1"
        >
          <img src={`${BASE}eagle-mark.svg`} alt="" aria-hidden="true" className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-sans font-semibold tracking-wider uppercase text-xs md:text-sm">Headwaters</span>
        </a>
        <nav aria-label="Page navigation" className="flex items-center gap-4 md:gap-8 text-sm font-medium">
          <a href="#approach" className="hidden md:inline-block hover:text-[#57534E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm p-1">How it works</a>
          <a href="#offers" className="hidden md:inline-block hover:text-[#57534E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm p-1">Offers</a>
          <a
            href={quoteLink("year 1 codetry engagement")}
            onClick={() => trackOfferSelection("year 1 codetry engagement", "header")}
            className="bg-[#1C1917] text-[#F7F7F5] px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-[#2F3E35] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
          >
            Request a quote
          </a>
        </nav>
      </header>

      <section aria-labelledby="quiet-hero-title" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 lg:col-span-7 max-w-3xl">
            <FadeIn>
              <p className="text-xs font-bold tracking-widest uppercase text-[#78716C] mb-6">Capacity-building consulting</p>
              <p className="text-sm font-medium tracking-wide text-[#57534E] mb-4">
                Bobbie Parr · Headwaters Practitioner · Northwestern Ontario
              </p>
              <h1 id="quiet-hero-title" className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.05] tracking-tight mb-8">
                Important work should not depend on finding more hours.
              </h1>
              <p className="text-xl md:text-2xl text-[#57534E] leading-relaxed mb-10 max-w-2xl font-light">
                Through Headwaters and Codetry, organizations move important work into practical systems they can use, own, and keep running.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <a
                  href={quoteLink("year 1 codetry engagement")}
                  onClick={() => trackOfferSelection("year 1 codetry engagement", "hero")}
                  data-testid="quiet-primary-cta"
                  className="inline-flex items-center justify-center gap-3 bg-[#1C1917] text-[#F7F7F5] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#2F3E35] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
                >
                  Request a quote <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <p className="text-sm text-[#78716C] max-w-[200px] leading-snug">
                  A short, practical conversation about the work in front of you.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 relative w-full h-[42vh] min-h-[320px] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl bg-[#E7E5E4] mt-8 lg:mt-0">
            <FadeIn delay={200} className="w-full h-full">
               <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover object-center absolute inset-0"
                  poster={`${BASE}headwaters/eagle-clearing-poster.jpg`}
                  src={`${BASE}headwaters/eagle-clearing.mp4`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/50 via-transparent to-transparent mix-blend-multiply" aria-hidden="true" />
            </FadeIn>
          </div>
        </div>
      </section>

      <section aria-labelledby="problem-title" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="text-xs font-bold tracking-widest uppercase text-[#A8A29E] mb-6">The capacity gap</p>
                <h2 id="problem-title" className="font-serif text-4xl md:text-5xl leading-[1.15] text-[#1C1917]">
                  The work is real.<br/>Time is the constraint.
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center">
              <FadeIn delay={150}>
                <p className="text-xl md:text-2xl text-[#44403C] leading-relaxed mb-10 font-light">
                  A grant deadline, a new service, a better way to coordinate people, or a system that finally needs to be made usable: the need is often clear. What is missing is the protected capacity to make it real.
                </p>
                <p className="text-lg text-[#78716C] leading-relaxed border-l-2 border-[#D4A017] pl-6 py-1 mb-8">
                  Headwaters helps organizations move one bounded piece of work from intention to something people can use, understand, and keep going.
                </p>

                <div className="bg-[#F5F5F4] border border-[#E7E5E4] rounded-2xl p-6 mb-10" data-testid="headwaters-otf-callout">
                  <h3 className="font-serif text-xl mb-2 text-[#1C1917]">Applying for an OTF grant?</h3>
                  <p className="text-[#57534E] mb-4">Get a credible, fixed-fee project scope and budget quote to include in your application.</p>
                  <a href={route("funding/otf-sector-grant")} data-testid="link-headwaters-otf" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[#1C1917] hover:text-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">
                    Prepare your funding quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" aria-labelledby="approach-title" className="py-24 md:py-32 bg-[#1B2621] text-[#F7F7F5]">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="max-w-3xl mb-24">
              <p className="text-xs font-bold tracking-widest uppercase text-[#9CB3A8] mb-6">A practical response</p>
              <h2 id="approach-title" className="font-serif text-4xl md:text-5xl leading-[1.15]">
                Build the capacity into the work.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-[#2F3E35]" aria-hidden="true" />

            {[
              ["01", "Define the project & team", "Name the work in front of you, the people who need to carry it, and the bounded outcome you want to reach."],
              ["02", "Choose the toolkits to increase capacity", "Select the practical tools and specialist delivery capacity that will help your team move the work forward."],
              ["03", "Craft Practical tools", "Shape practical tools with your people so they fit the way you work, not an imagined version of your operation."],
              ["04", "Handoff and Sustainable Growth", "Leave behind usable tools, documentation, and knowledge that support sustainable growth as your organization adds more layers."],
            ].map(([number, title, description], i) => (
              <FadeIn key={number} delay={i * 100} className="relative z-10 flex flex-col">
                <div className="bg-[#1B2621] inline-block pr-6 mb-8 w-fit">
                  <span className="font-serif text-5xl text-[#D4A017]">{number}</span>
                </div>
                <h3 className="text-xl font-medium mb-4 pr-4">{title}</h3>
                <p className="text-[#9CB3A8] leading-relaxed text-base pr-4">
                  {description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="examples-title" className="py-24 md:py-32 bg-[#FAFAF9]">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="max-w-3xl mb-20 lg:mb-24">
              <p className="text-xs font-bold tracking-widest uppercase text-[#A8A29E] mb-6">What this can look like</p>
              <h2 id="examples-title" className="font-serif text-4xl md:text-5xl leading-[1.15] mb-8 text-[#1C1917]">
                Practical apps for real situations.
              </h2>
              <p className="text-xl text-[#57534E] leading-relaxed font-light">
                The work changes with the organization. The promise stays concrete: a practical app your people can use, understand, and keep improving when the engagement is over.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-16 lg:space-y-24">
            <FadeIn>
              <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E7E5E4] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#D4A017]" aria-hidden="true" />

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                  <div className="lg:col-span-4 flex flex-col justify-start">
                    <p className="inline-block bg-[#F5F5F4] text-[#57534E] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8 w-fit border border-[#E7E5E4]">
                      For a co-operative board
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl leading-[1.15] mb-6 text-[#1C1917]">
                      Turn a board priority into work the next board can carry.
                    </h3>
                    <p className="text-[#57534E] leading-relaxed text-lg font-light">
                      A co-op has an important service, capital project, or member initiative that keeps slipping because decisions are scattered, meetings are overloaded, and too much knowledge lives in a few people&apos;s heads.
                    </p>
                  </div>

                  <div className="hidden lg:block lg:col-span-1">
                    <div className="w-px h-full bg-[#E7E5E4] mx-auto" aria-hidden="true" />
                  </div>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-10 lg:gap-12">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#D4A017]" aria-hidden="true" />
                        We might build
                      </h4>
                      <ul className="space-y-4">
                        {[
                          "A bounded project plan with owners and decision points",
                          "A decision-rights map, meeting rhythm, and action tracker",
                          "A member or board onboarding guide for continuity",
                          "A policy index and handoff materials for the next board"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-[#57534E]">
                            <Circle className="w-2 h-2 mt-2 fill-[#D4A017] text-[#D4A017] shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#2F3E35]" aria-hidden="true" />
                        What changes
                      </h4>
                      <p className="text-base text-[#57534E] leading-relaxed mb-8 flex-grow">
                        The board can see what needs a decision, what can move between meetings, and what a new volunteer needs to know without reconstructing the whole project from memory.
                      </p>
                         <a
                          href={PUBLIC_EXAMPLE_DESTINATIONS.coop.href}
                         target="_blank"
                         rel="noopener noreferrer"
                         aria-label="Visit 807 Food Co-op, a co-op powered by Codetry (opens in a new tab)"
                          onClick={() => trackPracticalExample("co-op", PUBLIC_EXAMPLE_DESTINATIONS.coop.analyticsDestination)}
                         data-testid="practical-example-link-coop"
                         className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#1C1917] underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm"
                       >
                         See 807 Food Co-op, a co-op powered by Codetry
                         <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                       </a>
                      <div className="bg-[#F5F5F4] p-5 rounded-2xl border border-[#E7E5E4]">
                        <p className="text-sm text-[#78716C] leading-snug">
                          Often a fit for a <a href={quoteLink("year 1 codetry engagement")} onClick={() => trackOfferSelection("year 1 codetry engagement", "board_case")} className="text-[#1C1917] font-medium underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">Year 1 base build</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>

            <FadeIn>
              <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E7E5E4] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#2F3E35]" aria-hidden="true" />

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                  <div className="lg:col-span-4 flex flex-col justify-start">
                    <p className="inline-block bg-[#F5F5F4] text-[#57534E] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8 w-fit border border-[#E7E5E4]">
                      For a care team under pressure
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl leading-[1.15] mb-6 text-[#1C1917]">
                      Make handoffs and follow-through easier when staffing is tight.
                    </h3>
                    <p className="text-[#57534E] leading-relaxed text-lg font-light">
                      A residential, home-care, or community-support team is managing vacancies, sick calls, inconsistent shift handoffs, and a coordinator who has become the only place where the work still makes sense.
                    </p>
                  </div>

                  <div className="hidden lg:block lg:col-span-1">
                    <div className="w-px h-full bg-[#E7E5E4] mx-auto" aria-hidden="true" />
                  </div>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-10 lg:gap-12">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#D4A017]" aria-hidden="true" />
                        We might build
                      </h4>
                      <ul className="space-y-4">
                        {[
                          "Shift, coverage, and escalation maps",
                          "Onboarding and quick-reference tools from staff knowledge",
                          "Recurring-task checklists and exception tracking",
                          "A maintained handoff system for supervisors and teams"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-[#57534E]">
                            <Circle className="w-2 h-2 mt-2 fill-[#D4A017] text-[#D4A017] shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#2F3E35]" aria-hidden="true" />
                        What changes
                      </h4>
                      <p className="text-base text-[#57534E] leading-relaxed mb-8 flex-grow">
                        The team has a shared way to see what must happen, what is waiting, and who needs to know. The tools support professional judgement; they do not replace licensed staff or clinical decisions.
                      </p>
                        <a
                          href={route(PUBLIC_EXAMPLE_DESTINATIONS.care.href)}
                         target="_blank"
                         rel="noopener noreferrer"
                         aria-label="See the person-centred care continuity pilot, including its meaning layer and first 90 days (opens in a new tab)"
                          onClick={() => trackPracticalExample("care-continuity", route(PUBLIC_EXAMPLE_DESTINATIONS.care.href))}
                         data-testid="practical-example-link-care"
                         className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#1C1917] underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm"
                       >
                         See the person-centred care continuity pilot: its meaning layer and first 90 days
                         <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                       </a>
                      <div className="bg-[#F5F5F4] p-5 rounded-2xl border border-[#E7E5E4]">
                        <p className="text-sm text-[#78716C] leading-relaxed">
                          Often a fit for a <a href={quoteLink("year 1 codetry engagement")} onClick={() => trackOfferSelection("year 1 codetry engagement", "care_case")} className="text-[#1C1917] font-medium underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">Year 1 base build</a> or a <a href={quoteLink("needs custom review")} onClick={() => trackOfferSelection("needs custom review", "care_case")} className="text-[#1C1917] font-medium underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">custom review</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>

            <FadeIn>
              <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E7E5E4] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#D4A017]" aria-hidden="true" />

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                  <div className="lg:col-span-4 flex flex-col justify-start">
                    <p className="inline-block bg-[#F5F5F4] text-[#57534E] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8 w-fit border border-[#E7E5E4]">
                       For a small business with demand to serve
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl leading-[1.15] mb-6 text-[#1C1917]">
                       Use a known bottleneck to earn back the build.
                    </h3>
                    <p className="text-[#57534E] leading-relaxed text-lg font-light">
                       Parr&apos;s Jars is the kind of small-business example this work can serve: existing interest is real, but a known conversion or fulfillment bottleneck keeps some of that demand from becoming completed orders. The point is not to add software for its own sake; it is to make the path from interest to purchase easier to see and improve.
                    </p>
                  </div>

                  <div className="hidden lg:block lg:col-span-1">
                    <div className="w-px h-full bg-[#E7E5E4] mx-auto" aria-hidden="true" />
                  </div>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-10 lg:gap-12">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#D4A017]" aria-hidden="true" />
                        We might build
                      </h4>
                      <ul className="space-y-4">
                        {[
                           "A revenue-first path from interest to purchase",
                           "Workflow support around a known sales or fulfillment bottleneck",
                           "Measures agreed before building: conversion, completed orders, fulfillment time, or another outcome",
                           "An operating tool the team can maintain after handoff"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-[#57534E]">
                            <Circle className="w-2 h-2 mt-2 fill-[#D4A017] text-[#D4A017] shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#2F3E35]" aria-hidden="true" />
                        What changes
                      </h4>
                      <p className="text-base text-[#57534E] leading-relaxed mb-8 flex-grow">
                         Before a commercial build begins, we define measurable revenue outcomes and the evidence we will use to judge progress. The investment is weighed against a credible payback path, not a promise: a $20,000 annual engagement is not automatically appropriate for a brand-new business without validated demand. It can make sense when existing demand and a solvable bottleneck give the work a reasonable chance to earn its way back.
                      </p>
                        <a
                          href={PUBLIC_EXAMPLE_DESTINATIONS.business.href}
                         target="_blank"
                         rel="noopener noreferrer"
                         aria-label="Visit Parr's Jars, a real small-business example (opens in a new tab)"
                          onClick={() => trackPracticalExample("small-business", PUBLIC_EXAMPLE_DESTINATIONS.business.analyticsDestination)}
                         data-testid="practical-example-link-business"
                         className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#1C1917] underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm"
                       >
                         See Parr&apos;s Jars, a real small-business example
                         <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                       </a>
                      <div className="bg-[#F5F5F4] p-5 rounded-2xl border border-[#E7E5E4]">
                        <p className="text-sm text-[#78716C] leading-relaxed">
                           Often a fit for a <a href={quoteLink("year 1 codetry engagement")} onClick={() => trackOfferSelection("year 1 codetry engagement", "community_case")} className="text-[#1C1917] font-medium underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">Year 1 base build</a> or a <a href={quoteLink("year 2 codetry engagement")} onClick={() => trackOfferSelection("year 2 codetry engagement", "community_case")} className="text-[#1C1917] font-medium underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#D4A017] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm">Year 2 additional layer</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="offers" aria-labelledby="offers-title" className="py-24 md:py-32 bg-[#F5F5F4]">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-24">
              <p className="text-xs font-bold tracking-widest uppercase text-[#A8A29E] mb-6">Current ways to begin</p>
              <h2 id="offers-title" className="font-serif text-4xl md:text-5xl leading-[1.15] mb-8 text-[#1C1917]">
                Choose the shape that fits the work.
              </h2>
              <p className="text-xl text-[#57534E] leading-relaxed font-light">
                Year 1 and Year 2 are separate scoped engagements. Each has a defined deliverable and written acceptance boundary.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {OFFERS.map((offer, i) => (
              <FadeIn key={offer.value} delay={i * 150} className="h-full">
                <a
                  href={quoteLink(offer.value)}
                  onClick={() => trackOfferSelection(offer.value, "offers_grid")}
                  data-testid={`quiet-offer-${offer.number}`}
                  className="group flex flex-col h-full bg-white p-8 md:p-10 rounded-3xl border border-[#E7E5E4] hover:border-[#D4A017] hover:shadow-2xl hover:shadow-[#D4A017]/10 transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35]"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
                    <span className="font-serif text-8xl font-black">{offer.number}</span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <span className="font-serif text-2xl md:text-3xl mb-6 text-[#1C1917] group-hover:text-[#D4A017] transition-colors">{offer.title}</span>
                    <span className="text-[#57534E] leading-relaxed mb-10 flex-grow text-base md:text-lg font-light">{offer.description}</span>

                    <div className="pt-8 border-t border-[#E7E5E4] mb-10">
                      <span className="block text-xs font-bold tracking-widest uppercase text-[#1C1917] mb-3">Pricing</span>
                      <span className="text-sm text-[#78716C] leading-relaxed block">{offer.price}</span>
                    </div>

                    <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1C1917] group-hover:text-[#D4A017] transition-colors mt-auto">
                      Choose this path <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <p className="text-center text-sm text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">
              Working commercial policy, pending formal approval. These are proposed grant-supported project engagements, not an award, sponsorship, or unrestricted operating revenue. Fees exclude HST; travel and expenses are reviewed separately.
            </p>
          </FadeIn>
        </div>
      </section>

      <section aria-labelledby="offer-faq-title" className="py-24 md:py-32 bg-[#F7F7F5] border-t border-[#E7E5E4]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <FadeIn>
            <p className="text-xs font-bold tracking-widest uppercase text-[#78716C] mb-6">Before you begin</p>
            <h2 id="offer-faq-title" className="font-serif text-4xl md:text-5xl leading-tight mb-12">
              A clear first step.
            </h2>
            <div className="divide-y divide-[#E7E5E4] border-y border-[#E7E5E4]">
              <div className="py-8">
                <h3 className="font-serif text-2xl mb-3">What do Year 1 and Year 2 cost?</h3>
                <p className="text-[#57534E] text-lg leading-relaxed">
                  Year 1 is $20,000 CAD for Codetry plus the base build using the
                  current strategic plan. Year 2 is a separate $20,000 CAD
                  engagement for an additional layer plus a new annual strategic
                  plan supporting board and training implementation.
                </p>
              </div>
              <div className="py-8">
                <h3 className="font-serif text-2xl mb-3">Is the quote binding?</h3>
                <p className="text-[#57534E] text-lg leading-relaxed">
                  No. The generated quote is budgetary and non-binding.
                  Eligibility, scope, and security are reviewed before a formal
                  commitment.
                </p>
              </div>
              <div className="py-8">
                <h3 className="font-serif text-2xl mb-3">Who is Headwaters for?</h3>
                <p className="text-[#57534E] text-lg leading-relaxed">
                  Headwaters works with community organizations, co-ops,
                  nonprofits, and institutions that need practical delivery
                  capacity now and a usable foundation afterward.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section aria-labelledby="fit-title" className="py-24 md:py-32 bg-[#17211C] text-[#F7F7F5] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,62,53,0.6),transparent_60%)]" aria-hidden="true" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-4xl">
          <FadeIn>
            <p className="text-xs font-bold tracking-widest uppercase text-[#9CB3A8] mb-8">A good fit</p>
            <h2 id="fit-title" className="font-serif text-4xl md:text-5xl leading-[1.15] mb-8">
              For organizations that intend to own what they build.
            </h2>
            <p className="text-xl text-[#9CB3A8] leading-relaxed mb-12 max-w-2xl mx-auto font-light">
              Headwaters works with community organizations, co-ops, nonprofits, and institutions that need practical delivery capacity now and a usable foundation afterward.
            </p>
            <a
              href={quoteLink("needs custom review")}
              onClick={() => trackOfferSelection("needs custom review", "fit_cta")}
              className="inline-flex items-center justify-center gap-3 bg-[#D4A017] text-[#17211C] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#F7F7F5] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17211C]"
            >
              Tell us what is in front of you <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </FadeIn>
        </div>
      </section>

      <footer className="bg-[#101713] text-[#9CB3A8] py-12 border-t border-[#1B2621]">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left flex flex-col gap-1">
            <p className="text-[#F7F7F5] font-sans font-semibold tracking-wider uppercase text-sm">Headwaters</p>
            <p className="text-sm">Capacity-building consulting for work that needs to keep going.</p>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium">
            <a href={quoteLink("year 1 codetry engagement")} onClick={() => trackOfferSelection("year 1 codetry engagement", "footer")} className="hover:text-[#F7F7F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] rounded-sm p-1 -m-1">Request a quote</a>
            <a href={route("privacy")} className="hover:text-[#F7F7F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] rounded-sm p-1 -m-1">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function HeadwatersRedirect() {
  return <Redirect to="/" />;
}
