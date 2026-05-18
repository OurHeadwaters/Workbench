import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { SiteNav } from "@/components/SiteNav";
import { getStoredOwnerToken } from "@/lib/api";
import { EconomyPage } from "@/pages/EconomyPage";
import { EconomyJoinPage } from "@/pages/EconomyJoinPage";
import { WalletPage } from "@/pages/WalletPage";
import { TipPage } from "@/pages/TipPage";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!getStoredOwnerToken()) {
    return <Redirect to="/sign-on" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
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
      <Route path="/window" component={TheWindowPage} />
      <Route path="/odyssey" component={OdysseyPage} />
      <Route path="/bright-side" component={BrightSidePage} />
      <Route path="/deadhead/intake">
        {() => <ProtectedRoute component={DeadheadIntakePage} />}
      </Route>

      {/* ── P2P Community Economy Engine ── */}
      <Route path="/economy" component={EconomyPage} />
      <Route path="/economy/wallet" component={WalletPage} />
      <Route path="/economy/tip" component={TipPage} />
      <Route path="/economy/join/:code" component={EconomyJoinPage} />

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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
