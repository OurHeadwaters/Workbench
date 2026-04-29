import { AppShell } from "@/components/AppShell";
import { isCockpitPath, isPlannerPath, isSustainabilityPath } from "@/lib/paths";
import { useRoute } from "@/lib/route";

import Prologue from "@/sections/Prologue";
import WhatItIs from "@/sections/WhatItIs";
import WhatHeadwatersDelivers from "@/sections/WhatHeadwatersDelivers";
import CockpitTeaser from "@/sections/CockpitTeaser";
import BookkeepingProof from "@/sections/BookkeepingProof";
import WhyThisTeam from "@/sections/WhyThisTeam";
import ReworkRisk from "@/sections/ReworkRisk";
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

/**
 * The walkthrough is a single continuous scroll, framed by the v2-style
 * AppShell (sticky branded header at the top, small footer at the
 * bottom). The Eagle prologue is hoisted ABOVE the shell so it owns the
 * first viewport; once the contractor scrolls past it, the sticky header
 * pins to the top and the document begins.
 *
 * Reading order is seller-side-first: after WhatItIs frames the store,
 * the next sections (WhatHeadwatersDelivers + CockpitTeaser +
 * BookkeepingProof + WhyThisTeam) answer the contractor's unanswered
 * questions — what is being sold and why this team is the one to sell
 * it. ReworkRisk then names the contractor's own pain (the doors got
 * built too small) and frames Headwaters as the thing that makes that
 * pain stop. Only then does the document pivot back to the store's own
 * story (WhyCurrentFails → ColdChain → WhoWorks → FirstMorning →
 * WhatStays → Ask → Recap).
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

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Prologue />
      <AppShell>
        {/* New sections insert AFTER <WhatHeadwatersDelivers />, not appended at the end. */}
        <WhatItIs />
        <WhatHeadwatersDelivers />
        <CockpitTeaser />
        <BookkeepingProof />
        <WhyThisTeam />
        <ReworkRisk />
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
