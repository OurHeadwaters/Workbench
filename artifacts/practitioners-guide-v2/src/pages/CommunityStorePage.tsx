import { useState } from "react";
import { X } from "lucide-react";
import Prologue from "@/communityStore/walkthrough/Prologue";
import WhatItIs from "@/communityStore/walkthrough/WhatItIs";
import WhyCurrentFails from "@/communityStore/walkthrough/WhyCurrentFails";
import WhatStays from "@/communityStore/walkthrough/WhatStays";
import WhoWorks from "@/communityStore/walkthrough/WhoWorks";
import Ask from "@/communityStore/walkthrough/Ask";
import CockpitTeaser from "@/communityStore/walkthrough/CockpitTeaser";
import FirstMorning from "@/communityStore/walkthrough/FirstMorning";
import ColdChain from "@/communityStore/walkthrough/ColdChain";
import BookkeepingProof from "@/communityStore/walkthrough/BookkeepingProof";
import CheckinSheets from "@/communityStore/walkthrough/CheckinSheets";
import PhaseLocks from "@/communityStore/walkthrough/PhaseLocks";
import PhaseLockSignoff from "@/communityStore/walkthrough/PhaseLockSignoff";
import ReworkRisk from "@/communityStore/walkthrough/ReworkRisk";
import WhatHeadwatersDelivers from "@/communityStore/walkthrough/WhatHeadwatersDelivers";
import WhyThisTeam from "@/communityStore/walkthrough/WhyThisTeam";
import Recap from "@/communityStore/walkthrough/Recap";
import CockpitApp from "@/communityStore/cockpit/CockpitApp";
import PlannerApp from "@/communityStore/planner/PlannerApp";
import SustainabilityApp from "@/communityStore/sustainability/SustainabilityApp";

const BANNER_KEY = "cs-reactivation-banner-dismissed";

function ReactivationBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(BANNER_KEY) === "1"; } catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(BANNER_KEY, "1"); } catch { /* noop */ }
    setDismissed(true);
  };

  return (
    <div
      data-testid="cs-reactivation-banner"
      className="w-full border-b px-5 py-4"
      style={{ background: "rgba(184,90,62,0.08)", borderColor: "rgba(184,90,62,0.30)" }}
    >
      <div className="max-w-[52rem] mx-auto flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "#b85a3e", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
          >
            Template — fill in before sharing
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
            {[
              { label: "Community name", placeholder: "[e.g. — Wabigoon Lake First Nation]" },
              { label: "Contractor name", placeholder: "[e.g. — the general contractor]" },
              { label: "Phase dates", placeholder: "[e.g. — pilot May 2026 · build Jan 2027]" },
              { label: "Funding path", placeholder: "[e.g. — ISC + LFIF grants / self-fund]" },
            ].map(({ label, placeholder }) => (
              <p key={label} className="text-[13px] leading-[1.4]" style={{ color: "#1f3d2e" }}>
                <span className="font-semibold" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{label}:</span>{" "}
                <span style={{ color: "#7e3a25", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "12px" }}>{placeholder}</span>
              </p>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          data-testid="cs-reactivation-banner-dismiss"
          className="shrink-0 rounded p-1 transition-opacity hover:opacity-60"
          style={{ color: "#b85a3e" }}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

type View =
  | "walkthrough"
  | "cockpit"
  | "planner"
  | "sustainability"
  | "phase-lock-signoff"
  | "checkin-sheets";

function Walkthrough({
  onOpenCockpit,
  onOpenPlanner,
  onOpenSustainability,
  onOpenPhaseLockSignoff,
  onOpenCheckinSheets,
}: {
  onOpenCockpit: () => void;
  onOpenPlanner: () => void;
  onOpenSustainability: () => void;
  onOpenPhaseLockSignoff: () => void;
  onOpenCheckinSheets: () => void;
}) {
  return (
    <div>
      <Prologue />
      <WhatItIs />
      <WhyCurrentFails />
      <WhatStays />
      <WhoWorks />
      <CockpitTeaser onOpenCockpit={onOpenCockpit} />
      <FirstMorning onOpenCockpit={onOpenCockpit} />
      <ColdChain />
      <BookkeepingProof />
      <Ask onOpenPlanner={onOpenPlanner} />
      <PhaseLocks onOpenPlanner={onOpenPlanner} />
      <ReworkRisk />
      <WhatHeadwatersDelivers />
      <WhyThisTeam />
      <Recap />

      {/* Secondary nav at foot of walkthrough */}
      <div
        className="w-full border-t py-8 flex flex-wrap justify-center gap-3 px-6"
        style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}
      >
        {[
          { label: "Phase lock sign-off sheet", action: onOpenPhaseLockSignoff, testId: "cs-nav-phase-lock-signoff" },
          { label: "Trial check-in sheets", action: onOpenCheckinSheets, testId: "cs-nav-checkin-sheets" },
          { label: "Build calendar", action: onOpenPlanner, testId: "cs-nav-planner" },
          { label: "Operator-couple cockpit", action: onOpenCockpit, testId: "cs-nav-cockpit" },
          { label: "Sustainability playbook", action: onOpenSustainability, testId: "cs-nav-sustainability" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            data-testid={item.testId}
            className="rounded-lg px-4 py-2.5 border text-[10.5px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
            style={{
              background: "var(--cs-primary)",
              color: "var(--cs-bg)",
              borderColor: "var(--cs-primary)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CommunityStorePage() {
  const [view, setView] = useState<View>("walkthrough");

  const goWalkthrough = () => setView("walkthrough");

  return (
    <div
      className="cs-theme w-full min-h-screen"
      data-testid="community-store-page"
    >
      <ReactivationBanner />
      {view === "walkthrough" && (
        <Walkthrough
          onOpenCockpit={() => setView("cockpit")}
          onOpenPlanner={() => setView("planner")}
          onOpenSustainability={() => setView("sustainability")}
          onOpenPhaseLockSignoff={() => setView("phase-lock-signoff")}
          onOpenCheckinSheets={() => setView("checkin-sheets")}
        />
      )}
      {view === "cockpit" && (
        <CockpitApp onBack={goWalkthrough} />
      )}
      {view === "planner" && (
        <PlannerApp onBack={goWalkthrough} />
      )}
      {view === "sustainability" && (
        <SustainabilityApp
          onBack={goWalkthrough}
          onNavigateCockpit={() => setView("cockpit")}
        />
      )}
      {view === "phase-lock-signoff" && (
        <PhaseLockSignoff onBack={goWalkthrough} />
      )}
      {view === "checkin-sheets" && (
        <CheckinSheets onBack={goWalkthrough} />
      )}
    </div>
  );
}
