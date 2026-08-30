import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
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
import { MillPage } from "@/pages/MillPage";
import { OperatorPage } from "@/pages/OperatorPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { ListenPage } from "@/pages/ListenPage";
import { TheWindowPage } from "@/pages/TheWindowPage";
import { OdysseyPage } from "@/pages/OdysseyPage";
import { StoryPage } from "@/pages/StoryPage";
import { FoundingStoriesPage } from "@/pages/FoundingStoriesPage";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/AmbientBackground";
import { Starfield } from "@/components/Starfield";
import { getStoredOwnerToken } from "@/lib/api";
import { EconomyPage } from "@/pages/EconomyPage";
import { EconomyJoinPage } from "@/pages/EconomyJoinPage";
import { WalletPage } from "@/pages/WalletPage";
import { TipPage } from "@/pages/TipPage";
import { WhatIsCodetryPage } from "@/pages/WhatIsCodetryPage";
import { MapPage } from "@/pages/MapPage";
import { CompassPage } from "@/pages/CompassPage";
import { ConstellationPage } from "@/pages/ConstellationPage";
import { AquiferPage } from "@/pages/AquiferPage";
import { HeadwatersPage, HeadwatersRedirect } from "@/pages/HeadwatersPage";
import { CapCeremonyPage } from "@/pages/CapCeremonyPage";
import { StarterPage } from "@/pages/StarterPage";
import { HeadwatersStartPage } from "@/pages/HeadwatersStartPage";
import { HeadwatersProductsPage } from "@/pages/HeadwatersProductsPage";
import HeadwatersPackagePage from "@/pages/HeadwatersPackagePage";
import { ParrsJarsKitPage } from "@/pages/ParrsJarsKitPage";
import { ParrsJarsHubPage } from "@/pages/ParrsJarsHubPage";
import { KitAccessPage } from "@/pages/KitAccessPage";
import { KitResendPage } from "@/pages/KitResendPage";
import { GordWidget } from "@workspace/gord-widget";
import { StompingGroundsPage } from "@/pages/StompingGroundsPage";
import { CastlePage } from "@/pages/CastlePage";
import { HelpingHandsPage } from "@/pages/HelpingHandsPage";
import { ArcLoginPage } from "@/pages/ArcLoginPage";
import { GoodbyeKitPage } from "@/pages/GoodbyeKitPage";
import { RequireKitToken } from "@/components/RequireKitToken";
import { PilotPage } from "@/pages/PilotPage";
import QuotePage from "@/pages/QuotePage";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!getStoredOwnerToken()) {
    return <Redirect to="/sign-on" />;
  }
  return <Component />;
}

// When visited from codetry.ca, the root path should land on /codetry
// (the practitioner-facing "What is Codetry?" page) rather than the
// community home page. ourheadwaters.ca lands on The Clearing (HeadwatersPage).
function CodetryHostRoot() {
  if (typeof window !== "undefined" && window.location.hostname === "codetry.ca") {
    return <Redirect to="/codetry" />;
  }
  return <HeadwatersPage />;
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
      <Route path="/economy/helping-hands" component={HelpingHandsPage} />
      <Route path="/economy/wallet" component={WalletPage} />
      <Route path="/economy/tip" component={TipPage} />
      <Route path="/economy/join/:code" component={EconomyJoinPage} />

      {/* ── What is Codetry? ── */}
      <Route path="/codetry" component={WhatIsCodetryPage} />

      {/* ── Neighbourhood Map ── */}
      <Route path="/map" component={MapPage} />

      {/* ── Constellation Map — full ecosystem reference ── */}
      <Route path="/constellation" component={ConstellationPage} />

      {/* ── The Legend (zone grid) — /compass redirects here ── */}
      <Route path="/legend" component={CompassPage} />
      <Route path="/compass">{() => <Redirect to="/legend" />}</Route>

      {/* ── Cap Ceremony ── */}
      <Route path="/economy/cap-ceremony" component={CapCeremonyPage} />

      {/* ── The Aquifer — Identity Infrastructure ── */}
      <Route path="/aquifer" component={AquiferPage} />

      {/* ── The Clearing — lives at / ; /headwaters redirects there ── */}
      <Route path="/headwaters" component={HeadwatersRedirect} />

      {/* ── Legacy / stale hyphenated paths → current routes ── */}
      <Route path="/the-shore">{() => <Redirect to="/home" />}</Route>
      <Route path="/what-is-codetry">{() => <Redirect to="/codetry" />}</Route>
      <Route path="/the-work">{() => <Redirect to="/services" />}</Route>
      <Route path="/the-clearing">{() => <Redirect to="/" />}</Route>
      <Route path="/case-studies">{() => <Redirect to="/work" />}</Route>
      <Route path="/the-window">{() => <Redirect to="/window" />}</Route>

      {/* ── Self-serve starter offerings ── */}
      <Route path="/start" component={StarterPage} />

      {/* ── Parr's Jars / TSP funnel ── */}
      <Route path="/headwaters/start" component={HeadwatersStartPage} />
      <Route path="/headwaters/products" component={HeadwatersProductsPage} />
      <Route path="/headwaters/package" component={HeadwatersPackagePage} />

      {/* ── Parr's Jars Kit ── */}
      <Route path="/parrsjars/kit" component={ParrsJarsKitPage} />
      <Route path="/parrsjars/hub">
        {() => (
          <RequireKitToken kitId="pj-solutions-kit">
            <ParrsJarsHubPage />
          </RequireKitToken>
        )}
      </Route>

      {/* ── Kit access (magic link landing) & re-send flow ── */}
      <Route path="/kits/access/:token" component={KitAccessPage} />
      <Route path="/kits/resend" component={KitResendPage} />

      {/* ── Crypto Castle ── */}
      <Route path="/castle" component={CastlePage} />
      <Route path="/stomping-grounds" component={StompingGroundsPage} />

      {/* ── Goodbye Kit landing page ── */}
      <Route path="/goodbye" component={GoodbyeKitPage} />

      {/* ── Care Pilot ── */}
      <Route path="/pilot" component={PilotPage} />
      <Route path="/quote" component={QuotePage} />

      {/* ── The Mill — Zone 2 production framing ── */}
      <Route path="/mill" component={MillPage} />

      {/* ── Arc login (Clerk sign-in for arc artifact) ── */}
      <Route path="/arc/login" component={ArcLoginPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

const STANDALONE_ROUTES = ["/", "/quote", "/start", "/headwaters/start", "/headwaters/products", "/headwaters/package", "/parrsjars/kit", "/parrsjars/hub", "/kits/resend", "/arc/login", "/goodbye"];

function NavShell() {
  const [location] = useLocation();
  if (STANDALONE_ROUTES.includes(location)) return null;
  return (
    <div className="print:hidden">
      <SiteNav />
    </div>
  );
}

function GlobalWidgets() {
  const [location] = useLocation();
  if (STANDALONE_ROUTES.includes(location)) return null;
  return (
    <>
      <KitchenTableButton />
      <GordWidget />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <NavShell />
          <Router />
          <GlobalWidgets />
          <GrainOverlay opacity={0.018} />
          <Starfield />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
