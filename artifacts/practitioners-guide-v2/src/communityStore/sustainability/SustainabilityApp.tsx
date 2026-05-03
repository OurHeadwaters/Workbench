import { useState } from "react";
import { SustainabilityShell, type SustainabilityPage } from "./SustainabilityShell";
import Index from "./pages/Index";
import Model from "./pages/Model";
import Roles from "./pages/Roles";
import Handover from "./pages/Handover";
import Burnout from "./pages/Burnout";
import Renewal from "./pages/Renewal";
import Tooling from "./pages/Tooling";
import Indicators from "./pages/Indicators";

export default function SustainabilityApp({
  onBack,
  onNavigateCockpit,
}: {
  onBack: () => void;
  onNavigateCockpit: () => void;
}) {
  const [page, setPage] = useState<SustainabilityPage>("index");

  return (
    <SustainabilityShell page={page} onNavigate={setPage} onBack={onBack}>
      {page === "index"      && <Index onNavigate={(v) => v === "walkthrough" ? onBack() : undefined} />}
      {page === "model"      && <Model />}
      {page === "roles"      && <Roles />}
      {page === "handover"   && <Handover />}
      {page === "burnout"    && <Burnout />}
      {page === "renewal"    && <Renewal />}
      {page === "tooling"    && <Tooling onNavigateCockpit={onNavigateCockpit} />}
      {page === "indicators" && <Indicators />}
    </SustainabilityShell>
  );
}
