import { SustainabilityShell } from "./SustainabilityShell";
import { getSustainabilityPage } from "@/lib/paths";
import { useRoute } from "@/lib/route";
import Index from "./pages/Index";
import Model from "./pages/Model";
import Roles from "./pages/Roles";
import Handover from "./pages/Handover";
import Burnout from "./pages/Burnout";
import Renewal from "./pages/Renewal";
import Tooling from "./pages/Tooling";
import Indicators from "./pages/Indicators";

/**
 * The sustainability & succession playbook. Lives at /sustainability and
 * seven sub-paths.
 *
 *   /sustainability               → entry: the failure pattern, named
 *   /sustainability/model         → store + hotel under one model
 *   /sustainability/roles         → roles & bench depth
 *   /sustainability/handover      → year-by-year, band takes the wheel
 *   /sustainability/burnout       → burnout early-warning protocol
 *   /sustainability/renewal       → contract renewal & turnover
 *   /sustainability/tooling       → Square + QuickBooks continuity
 *   /sustainability/indicators    → leading indicators dashboard
 *
 * The opening page names the contractor-installs-employees failure
 * pattern, anchors it to the hotel as the live in-community example,
 * and tees up the rest of the playbook as the alternative ending.
 *
 * The hotel sections are honest where data is unknown — no invented
 * numbers, no invented contract terms.
 */
export default function SustainabilityApp() {
  const { pathname } = useRoute();
  const page = getSustainabilityPage(pathname);

  return (
    <SustainabilityShell page={page}>
      {page === "index" && <Index />}
      {page === "model" && <Model />}
      {page === "roles" && <Roles />}
      {page === "handover" && <Handover />}
      {page === "burnout" && <Burnout />}
      {page === "renewal" && <Renewal />}
      {page === "tooling" && <Tooling />}
      {page === "indicators" && <Indicators />}
    </SustainabilityShell>
  );
}
