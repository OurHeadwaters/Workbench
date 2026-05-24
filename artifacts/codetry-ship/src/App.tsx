import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SignOnPage } from "@/pages/SignOnPage";
import { ManifestPage } from "@/pages/ManifestPage";
import { BioPage } from "@/pages/BioPage";
import { HomePage } from "@/pages/HomePage";
import { LandingPage } from "@/pages/LandingPage";
import { SowPage } from "@/pages/SowPage";
import { BrightSidePage } from "@/pages/BrightSidePage";
import { DeadheadIntakePage } from "@/pages/DeadheadIntakePage";
import { ServicesPage } from "@/pages/ServicesPage";
import { WorkPage } from "@/pages/WorkPage";
import { WorkbenchPage } from "@/pages/WorkbenchPage";
import { OperatorPage } from "@/pages/OperatorPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { ListenPage } from "@/pages/ListenPage";
import { TheWindowPage } from "@/pages/TheWindowPage";
import { OdysseyPage } from "@/pages/OdysseyPage";
import { StoryPage } from "@/pages/StoryPage";
import { FoundingStoriesPage } from "@/pages/FoundingStoriesPage";
import { SiteNav } from "@/components/SiteNav";
import { getStoredOwnerToken } from "@/lib/api";
import { EconomyPage } from "@/pages/EconomyPage";
import { EconomyJoinPage } from "@/pages/EconomyJoinPage";
import { WalletPage } from "@/pages/WalletPage";
import { TipPage } from "@/pages/TipPage";
import { WhatIsCodetryPage } from "@/pages/WhatIsCodetryPage";
import { MapPage } from "@/pages/MapPage";
import { CompassPage } from "@/pages/CompassPage";
import { CapCeremonyPage } from "@/pages/CapCeremonyPage";
import { GordWidget } from "@/components/GordWidget";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!getStoredOwnerToken()) {
    return <Redirect to="/sign-on" />;
  }
  return <Component />;
}

// When visited from codetry.ca, the root path should land on /codetry
// (the practitioner-facing "What is Codetry?" page) rather than the
// community home page. ourheadwaters.ca continues to land on HomePage.
function CodetryHostRoot() {
  if (typeof window !== "undefined" && window.location.hostname === "codetry.ca") {
    return <Redirect to="/codetry" />;
  }
  return <HomePage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={CodetryHostRoot} />
      <Route path="/home" component={HomePage} />
      <Route path="/bio" component={BioPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/work" component={WorkPage} />
      <Route path="/sign-on" component={SignOnPage} />
      <Route path="/operator" component={OperatorPage} />
      <Route path="/workbench">
        {() => <ProtectedRoute component={WorkbenchPage} />}
      </Route>
      <Route path="/manifest">
        {() => <ProtectedRoute component={ManifestPage} />}
      </Route>
      <Route path="/sow">
        {() => <ProtectedRoute component={SowPage} />}
      </Route>
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/listen" component={ListenPage} />
      <Route path="/tsp" component={ListenPage} />
      <Route path="/window" component={TheWindowPage} />
      <Route path="/odyssey" component={OdysseyPage} />
      <Route path="/story" component={StoryPage} />
      <Route path="/founding-stories" component={FoundingStoriesPage} />
      <Route path="/bright-side" component={BrightSidePage} />
      <Route path="/deadhead/intake">
        {() => <ProtectedRoute component={DeadheadIntakePage} />}
      </Route>

      {/* ── P2P Community Economy Engine ── */}
      <Route path="/economy" component={EconomyPage} />
      <Route path="/economy/wallet" component={WalletPage} />
      <Route path="/economy/tip" component={TipPage} />
      <Route path="/economy/join/:code" component={EconomyJoinPage} />

      {/* ── What is Codetry? ── */}
      <Route path="/codetry" component={WhatIsCodetryPage} />

      {/* ── Neighbourhood Map ── */}
      <Route path="/map" component={MapPage} />

      {/* ── Headwaters Compass ── */}
      <Route path="/compass" component={CompassPage} />

      {/* ── Cap Ceremony ── */}
      <Route path="/economy/cap-ceremony" component={CapCeremonyPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="print:hidden">
            <SiteNav />
          </div>
          <Router />
        </WouterRouter>
        <Toaster />
        <KitchenTableButton />
        <GordWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
