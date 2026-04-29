import { CockpitShell } from "./CockpitShell";
import Pitch from "./screens/Pitch";
import FloorPlan from "./screens/FloorPlan";
import OperatorHome from "./screens/OperatorHome";
import Till from "./screens/Till";
import Locks from "./screens/Locks";
import { getCockpitScreen } from "@/lib/paths";
import { useRoute } from "@/lib/route";

/**
 * Operator-couple cockpit mockup. A phone-first pitch landing plus four
 * linked screens that the contractor can flip through to see how
 * Square + QuickBooks + Local Line + Headwaters compose into a tablet
 * surface a non-trained operator couple can run from day one without
 * ever touching money.
 *
 * Lives at /cockpit and four sub-paths:
 *   /cockpit          → pitch landing (glance-readable on phone)
 *   /cockpit/floor    → 40×80 floor plan
 *   /cockpit/home     → operator-couple home (big tiles)
 *   /cockpit/till     → till sub-mockup
 *   /cockpit/locks    → locked-vs-open permission visual
 */
export default function CockpitApp() {
  const { pathname } = useRoute();
  const screen = getCockpitScreen(pathname);

  return (
    <CockpitShell screen={screen}>
      {screen === "pitch" && <Pitch />}
      {screen === "floor" && <FloorPlan />}
      {screen === "home" && <OperatorHome />}
      {screen === "till" && <Till />}
      {screen === "locks" && <Locks />}
    </CockpitShell>
  );
}
