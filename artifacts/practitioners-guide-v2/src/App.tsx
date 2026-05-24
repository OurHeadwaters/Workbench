import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScenarioProvider } from "@/lib/scenario";
import { PassphraseGate } from "@/components/PassphraseGate";
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
import { EngagementPricingPage } from "@/pages/EngagementPricingPage";
import { WorkbenchArchivePage } from "@/pages/WorkbenchArchivePage";
import { RefundInvocationLetter } from "@/pages/RefundInvocationLetter";
import { WorkflowPage } from "@/pages/WorkflowPage";
import { DebtAttackPage } from "@/pages/DebtAttackPage";
import { StartupExpensesPage } from "@/pages/StartupExpensesPage";
import { PilotTwoPage } from "@/pages/PilotTwoPage";
import { PromotionalPlanPage } from "@/pages/PromotionalPlanPage";
import { WhatNextPage } from "@/pages/WhatNextPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import CommunityStorePage from "@/pages/CommunityStorePage";
import { SargeHQPage } from "@/pages/SargeHQPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { DeerLakePage } from "@/pages/DeerLakePage";
import { FlaggedPage } from "@/pages/FlaggedPage";
import { AnnualCheckInPage } from "@/pages/AnnualCheckInPage";
import { StrategicLedgerPage } from "@/pages/StrategicLedgerPage";
import { SessionHandoffPage } from "@/pages/SessionHandoffPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { SaltboxGatherRoundPage } from "@/pages/SaltboxGatherRoundPage";
import { GmphPathBPage } from "@/pages/GmphPathBPage";
import { LegacyAssetManagerPage } from "@/pages/LegacyAssetManagerPage";
import { TheGateOverridePage } from "@/pages/TheGateOverridePage";
import { MoneyMachineBlueprintPage } from "@/pages/MoneyMachineBlueprintPage";
import { CryptoCornerPage } from "@/pages/CryptoCornerPage";
import { WatershedCompactPage } from "@/pages/WatershedCompactPage";
import NotFound from "@/pages/not-found";
import { GordWidget } from "@workspace/gord-widget";

const queryClient = new QueryClient();

function GmphPublicShell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 print:px-0 print:py-0 print:max-w-none">
        <GmphPathBPage />
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={WorkspacePage} />
      <Route path="/dashboard" component={IndexPage} />
      <Route path="/salts" component={SaltsPage} />
      <Route path="/contracts" component={ContractsPage} />
      <Route path="/brightside" component={BrightsidePage} />
      <Route path="/compare" component={ComparePage} />
      <Route path="/replication" component={ReplicationPage} />
      <Route path="/codetry-philosophy" component={CodetryPhilosophyPage} />
      <Route path="/codetry" component={CodetryDisciplinePage} />
      <Route path="/archetypes" component={ArchetypesPage} />
      <Route path="/engagement-pricing" component={EngagementPricingPage} />
      <Route path="/workbench" component={WorkbenchArchivePage} />
      <Route path="/workflow" component={WorkflowPage} />
      <Route path="/debt-attack" component={DebtAttackPage} />
      <Route path="/startup-expenses" component={StartupExpensesPage} />
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
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/deer-lake" component={DeerLakePage} />
      <Route path="/flagged" component={FlaggedPage} />
      <Route path="/year/check-in" component={AnnualCheckInPage} />
      <Route path="/strategic-ledger" component={StrategicLedgerPage} />
      <Route path="/session-handoff" component={SessionHandoffPage} />
      <Route path="/saltbox-gather-round" component={SaltboxGatherRoundPage} />
      <Route path="/gmph-path-b" component={GmphPathBPage} />
      <Route path="/the-gate-override" component={TheGateOverridePage} />
      <Route path="/money-machine" component={MoneyMachineBlueprintPage} />
      <Route path="/crypto-corner" component={CryptoCornerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// On the index route, the eagle prologue is hoisted above AppShell so the
// image is truly full-bleed (not pinned inside the main column beside the
// sidebar). Other routes show only AppShell + their content.
function PrologueGate() {
  const [location] = useLocation();
  if (location !== "/dashboard") return null;
  return <EaglePrologue continueId="index-after-prologue" />;
}

function AppContent() {
  return (
    <>
      <PrologueGate />
      <AppShell>
        <Router />
      </AppShell>
    </>
  );
}

// Public routes rendered outside PassphraseGate so they can be shared freely.
// /gmph-path-b — GMPH revenue-share proposal (incoming from main)
// /legacy-asset-manager — Legacy Asset Manager public product funnel (task #1625)
// /watershed-compact — Watershed Compact with Permaculture Zone diagram (task #1829/1838)
function PublicRouter() {
  return (
    <Switch>
      <Route path="/gmph-path-b" component={GmphPublicShell} />
      <Route path="/legacy-asset-manager" component={LegacyAssetManagerPage} />
      <Route path="/watershed-compact" component={WatershedCompactPage} />
      <Route>{null}</Route>
    </Switch>
  );
}

function App() {
  return (
    <ZoneStoreProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <PublicRouter />
          <Switch>
            {/* Suppress public routes so they don't fall through to PassphraseGate */}
            <Route path="/gmph-path-b">{null}</Route>
            <Route path="/legacy-asset-manager">{null}</Route>
            <Route path="/watershed-compact">{null}</Route>
            <Route>
              <PassphraseGate>
                <ScenarioProvider>
                  <AppContent />
                </ScenarioProvider>
                <Toaster />
              </PassphraseGate>
            </Route>
          </Switch>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
    <KitchenTableButton />
    <GordWidget />
    </ZoneStoreProvider>
  );
}

export default App;
