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
import { PersonalCashPage } from "@/pages/PersonalCashPage";
import { ComparePage } from "@/pages/ComparePage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/salts" component={SaltsPage} />
      <Route path="/contracts" component={ContractsPage} />
      <Route path="/brightside" component={BrightsidePage} />
      <Route path="/personal-cash" component={PersonalCashPage} />
      <Route path="/compare" component={ComparePage} />
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
