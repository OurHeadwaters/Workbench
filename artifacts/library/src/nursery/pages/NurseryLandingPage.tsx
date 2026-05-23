import { useLocation } from "wouter";
import { Leaf, ArrowRight, Sprout, Users, Lightbulb } from "lucide-react";

interface NurseryLandingPageProps {
  onSignIn: () => void;
}

export function NurseryLandingPage({ onSignIn }: NurseryLandingPageProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-[#E4D9CC]">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBF3EE] flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-[#4A7C59]" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#2E2620]">Zone 4 Nursery</span>
            <span className="text-xs text-[#A89A8E] ml-2">Northern Food Systems</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF3EE] flex items-center justify-center mb-8">
            <Sprout className="w-7 h-7 text-[#4A7C59]" />
          </div>

          <h1 className="text-3xl text-[#2E2620] leading-snug mb-4">
            Where ideas take root<br />before they're ready to build.
          </h1>
          <p className="text-base text-[#7A6B60] leading-relaxed mb-10 max-w-lg">
            The Zone 4 Nursery is a producer-led space for tending early-stage food system ideas.
            Problems get named, translated, and nurtured — then handed to the Zone 3 board when
            they're ready for real investment.
          </p>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <FeatureCard
              icon={<Lightbulb className="w-4 h-4 text-[#4A7C59]" />}
              title="Name a problem"
              body="Producers flag what they're seeing on the land or in the market — in their own words."
            />
            <FeatureCard
              icon={<Leaf className="w-4 h-4 text-[#4A7C59]" />}
              title="Tend the idea"
              body="Stewards shape flagged problems into briefs with vernacular names, system names, and context."
            />
            <FeatureCard
              icon={<Users className="w-4 h-4 text-[#4A7C59]" />}
              title="Graduate it"
              body="When an idea is ready, it moves to the Zone 3 board with a full brief and community backing."
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => navigate("/nursery/onboarding")}
              className="flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-[#3D6B4A] transition-colors min-h-[44px]"
            >
              Start Steward Onboarding
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="text-sm text-[#4A7C59] hover:text-[#3D6B4A] underline underline-offset-2 transition-colors"
            >
              Already a producer? Sign in
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-[#E4D9CC]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-[#A89A8E]">
            Zone 4 Nursery · Part of the Headwaters Northern Food Systems network
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4D9CC] p-4">
      <div className="w-7 h-7 rounded-lg bg-[#EBF3EE] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-[#2E2620] mb-1">{title}</h3>
      <p className="text-xs text-[#7A6B60] leading-relaxed">{body}</p>
    </div>
  );
}
