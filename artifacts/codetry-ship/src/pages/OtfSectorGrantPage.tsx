import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { applyPageMetadata } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

export function GrantWritingPage() {
  useEffect(() => {
    const siteUrl = new URL(BASE || "/", window.location.origin).toString();
    applyPageMetadata({
      title: "Grant Writing & Funding Preparation | Headwaters",
      description: "Prepare a clear grant application with project scoping, application writing, and a credible implementation budget.",
      path: `${BASE}/funding/grant-writing`,
    });
  }, []);

  const quoteUrl = (placement: "hero" | "footer") =>
    `/quote?intent=grant-writing&source=grant-writing-page&placement=${placement}`;
  const trackQuoteCta = (placement: "hero" | "footer") => {
    trackEvent("quote_landing_cta_clicked", {
      intent: "grant-writing",
      source: "grant-writing-page",
      placement,
    });
  };

  return (
    <main className="min-h-[100dvh] bg-[#FBFBF9] text-[#1C1917] font-sans selection:bg-[#D4A017] selection:text-[#1C1917]">
      <header className="absolute top-0 w-full z-50 px-6 py-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] rounded-sm p-1 -ml-1">
          <img src={`${BASE}/eagle-mark.svg`} alt="" aria-hidden="true" className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-sans font-semibold tracking-wider uppercase text-xs md:text-sm text-[#1C1917]">Headwaters</span>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 lg:px-12 border-b border-[#E7E5E4]">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F4] border border-[#E7E5E4] text-xs font-bold tracking-widest uppercase text-[#57534E]">
            <span className="w-2 h-2 rounded-full bg-[#D4A017]"></span>
            Funding Preparation
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-8 text-[#1C1917]">
            Grant applications grounded in work you can deliver.
          </h1>
          
          <p className="text-xl md:text-2xl text-[#57534E] leading-relaxed mb-10 font-light max-w-3xl">
            We help your organization turn an idea into a clear application, a bounded project scope, and a credible implementation budget.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={quoteUrl("hero")}
              onClick={() => trackQuoteCta("hero")}
              className="inline-flex items-center justify-center gap-3 bg-[#1C1917] text-[#F7F7F5] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#2F3E35] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] focus-visible:ring-offset-2"
              data-testid="link-grant-writing-quote"
            >
              Discuss Your Application <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Distinction Section */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-[#2F3E35]" />
              </div>
              <h2 className="font-serif text-2xl mb-4 text-[#1C1917]">Project Scope & Budget</h2>
              <p className="text-[#57534E] leading-relaxed">
                We shape the proposed work into practical activities, deliverables, timing, and a defensible budget. Base implementation engagements start at $20,000 CAD; unusual scopes receive a custom review. Your organization remains responsible for confirming that every cost is eligible under the program you choose.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center mb-6 border border-[#FFEDD5]">
                <AlertCircle className="w-6 h-6 text-[#D4A017]" />
              </div>
              <h2 className="font-serif text-2xl mb-4 text-[#1C1917]">Application Writing</h2>
              <p className="text-[#57534E] leading-relaxed">
                We can help organize evidence, draft clear responses, and connect the narrative to the scope and budget. Headwaters is <strong>not the applicant</strong> and does not submit on your behalf. Your organization reviews, approves, and submits the final application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facts & Guidelines */}
      <section className="py-20 bg-[#FBFBF9]">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h2 className="text-xs font-bold tracking-widest uppercase text-[#A8A29E] mb-8">Important Context</h2>
          
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-2.5 shrink-0"></span>
              <p className="text-[#57534E] leading-relaxed">
                 <strong className="text-[#1C1917] font-medium block">Requirements change</strong>
                 Funding priorities, eligibility rules, deadlines, forms, and budget rules can change at any time. Your organization must verify the current requirements with the funder before approving or submitting the application.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-2.5 shrink-0"></span>
              <p className="text-[#57534E] leading-relaxed">
                <strong className="text-[#1C1917] font-medium block">Non-Guaranteeing</strong>
                Writing support, project scoping, and budget preparation do not guarantee eligibility, approval, or funding. The funder alone makes funding decisions.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-2.5 shrink-0"></span>
              <p className="text-[#57534E] leading-relaxed">
                <strong className="text-[#1C1917] font-medium block">Privacy and Publication</strong>
                We respect applicant privacy. We do not publish client grant applications or case studies of pre-award work without explicit, opt-in consent.
              </p>
            </li>
          </ul>

          <div className="mt-16 pt-10 border-t border-[#E7E5E4] text-center">
            <h3 className="font-serif text-2xl mb-4 text-[#1C1917]">Ready to frame the work?</h3>
            <p className="text-[#57534E] mb-8">Request a non-binding budgetary quote to include in your application planning.</p>
            <Link 
              href={quoteUrl("footer")}
              onClick={() => trackQuoteCta("footer")}
              className="inline-flex items-center justify-center gap-3 bg-[#1C1917] text-[#F7F7F5] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#2F3E35] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E35] focus-visible:ring-offset-2"
              data-testid="link-grant-writing-quote-bottom"
            >
              Start the Quote Process <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
