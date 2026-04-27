import { AppShell } from "@/components/AppShell";

import Prologue from "@/sections/Prologue";
import WhatItIs from "@/sections/WhatItIs";
import WhyCurrentFails from "@/sections/WhyCurrentFails";
import ColdChain from "@/sections/ColdChain";
import WhoWorks from "@/sections/WhoWorks";
import FirstMorning from "@/sections/FirstMorning";
import WhatStays from "@/sections/WhatStays";
import Ask from "@/sections/Ask";
import Recap from "@/sections/Recap";

/**
 * The walkthrough is a single continuous scroll, framed by the v2-style
 * AppShell (sticky branded header at the top, small footer at the
 * bottom). The Eagle prologue is hoisted ABOVE the shell so it owns the
 * first viewport; once the contractor scrolls past it, the sticky header
 * pins to the top and the document begins.
 *
 * Each section is a self-contained `<section id="...">` with its own
 * background — keeping things this way means the recap can bleed full-
 * width with its dark evergreen background while the rest of the read
 * stays on warm oat paper.
 */
export default function App() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Prologue />
      <AppShell>
        <WhatItIs />
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
