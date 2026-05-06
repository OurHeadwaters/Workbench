import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScenarioProvider } from "@/lib/scenario";
import { AppShell } from "@/components/AppShell";
import { EaglePrologue } from "@/components/EaglePrologue";
import { IndexPage } from "@/pages/IndexPage";
import { SaltsPage } from "@/pages/SaltsPage";
import { ContractsPage } from "@/pages/ContractsPage";
import { BrightsidePage } from "@/pages/BrightsidePage";
import { ComparePage } from "@/pages/ComparePage";
import { ReplicationPage } from "@/pages/ReplicationPage";
import { CodetryDisciplinePage } from "@/pages/CodetryDisciplinePage";
import { CodetryPhilosophyPage } from "@/pages/CodetryPhilosophyPage";
import { ArchetypesPage } from "@/pages/ArchetypesPage";
import { WorkbenchArchivePage } from "@/pages/WorkbenchArchivePage";
import { RefundInvocationLetter } from "@/pages/RefundInvocationLetter";
import { WorkflowPage } from "@/pages/WorkflowPage";
import { DebtAttackPage } from "@/pages/DebtAttackPage";
import { PilotTwoPage } from "@/pages/PilotTwoPage";
import { PromotionalPlanPage } from "@/pages/PromotionalPlanPage";
import { WhatNextPage } from "@/pages/WhatNextPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import CommunityStorePage from "@/pages/CommunityStorePage";
import { SargeHQPage } from "@/pages/SargeHQPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/salts" component={SaltsPage} />
      <Route path="/contracts" component={ContractsPage} />
      <Route path="/brightside" component={BrightsidePage} />
      <Route path="/compare" component={ComparePage} />
      <Route path="/replication" component={ReplicationPage} />
      <Route path="/codetry-philosophy" component={CodetryPhilosophyPage} />
      <Route path="/codetry" component={CodetryDisciplinePage} />
      <Route path="/archetypes" component={ArchetypesPage} />
      <Route path="/workbench" component={WorkbenchArchivePage} />
      <Route path="/workflow" component={WorkflowPage} />
      <Route path="/debt-attack" component={DebtAttackPage} />
      <Route path="/pilot-two" component={PilotTwoPage} />
      <Route path="/promo-plan" component={PromotionalPlanPage} />
      <Route path="/what-next" component={WhatNextPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route
        path="/refund-invocation-letter"
        component={RefundInvocationLetter}
      />
      <Route path="/community-store/:rest*" component={CommunityStorePage} />
      <Route path="/sarge" component={SargeHQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// On the index route, the eagle prologue is hoisted above AppShell so the
// image is truly full-bleed (not pinned inside the main column beside the
// sidebar). Other routes show only AppShell + their content.
function PrologueGate() {
  const [location] = useLocation();
  if (location !== "/") return null;
  return <EaglePrologue continueId="index-after-prologue" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScenarioProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <PrologueGate />
            <AppShell>
              <Router />
            </AppShell>
          </WouterRouter>
        </ScenarioProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
