import { AppShell } from "@/components/AppShell";
import { isCockpitPath, isCheckinSheetsPath, isPlannerPath, isSustainabilityPath } from "@/lib/paths";
import { useRoute } from "@/lib/route";

import Prologue from "@/sections/Prologue";
import WhatItIs from "@/sections/WhatItIs";
import WhatHeadwatersDelivers from "@/sections/WhatHeadwatersDelivers";
import CockpitTeaser from "@/sections/CockpitTeaser";
import BookkeepingProof from "@/sections/BookkeepingProof";
import WhyThisTeam from "@/sections/WhyThisTeam";
import ReworkRisk from "@/sections/ReworkRisk";
import PhaseLocks from "@/sections/PhaseLocks";
import WhyCurrentFails from "@/sections/WhyCurrentFails";
import ColdChain from "@/sections/ColdChain";
import WhoWorks from "@/sections/WhoWorks";
import FirstMorning from "@/sections/FirstMorning";
import WhatStays from "@/sections/WhatStays";
import Ask from "@/sections/Ask";
import Recap from "@/sections/Recap";

import PlannerApp from "@/planner/PlannerApp";
import CockpitApp from "@/cockpit/CockpitApp";
import SustainabilityApp from "@/sustainability/SustainabilityApp";
import CheckinSheets from "@/sections/CheckinSheets";

/**
 * The walkthrough is a single continuous scroll, framed by the v2-style
 * AppShell (sticky branded header at the top, small footer at the
 * bottom). The Eagle prologue is hoisted ABOVE the shell so it owns the
 * first viewport; once the contractor scrolls past it, the sticky header
 * pins to the top and the document begins.
 *
 * Reading order is visual-first: WhatItIs frames the store, then the
 * two visual surfaces land immediately — CockpitTeaser (a phone-friendly
 * preview of the operator-couple tablet) and BookkeepingProof (three
 * live iframes of the actual books screens). The contractor or
 * councillor sees something tangible before any wall of pitch text.
 * The seller-side argument (WhatHeadwatersDelivers + WhyThisTeam) and
 * the contractor's own pain (ReworkRisk → PhaseLocks) come AFTER the
 * visuals, when the reader is already grounded in what the store will
 * actually look and feel like. ReworkRisk names the pain ("the doors
 * got built too small"); PhaseLocks converts the "secured planning"
 * pitch into the literal phase-by-phase lock schedule the contractor
 * can hand to their CFO. The store's own story then follows
 * (WhyCurrentFails → ColdChain → WhoWorks → FirstMorning → WhatStays
 * → Ask → Recap).
 *
 * The /planner sub-route renders the Phase Planner — same artifact, same
 * palette, same shell pattern, different surface. Walkthrough = read.
 * Planner = decide.
 */
export default function App() {
  const { pathname } = useRoute();

  if (isPlannerPath(pathname)) {
    return <PlannerApp />;
  }

  if (isCockpitPath(pathname)) {
    return <CockpitApp />;
  }

  if (isSustainabilityPath(pathname)) {
    return <SustainabilityApp />;
  }

  if (isCheckinSheetsPath(pathname)) {
    return <CheckinSheets />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Prologue />
      <AppShell>
        {/* Visual surfaces (CockpitTeaser, BookkeepingProof) sit at the
            top, immediately after WhatItIs frames the store. Pitch text
            (WhatHeadwatersDelivers, WhyThisTeam) follows. */}
        <WhatItIs />
        <CockpitTeaser />
        <BookkeepingProof />
        <WhatHeadwatersDelivers />
        <WhyThisTeam />
        <ReworkRisk />
        <PhaseLocks />
        <WhyCurrentFails />
        <ColdChain />
        <WhoWorks />
        <FirstMorning />
        <WhatStays />
        <Ask />
        <Recap />
      </AppShell>
    </div>
  );
}
