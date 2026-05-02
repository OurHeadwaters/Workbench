import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SignOnPage } from "@/pages/SignOnPage";
import { ManifestPage } from "@/pages/ManifestPage";
import { BioPage } from "@/pages/BioPage";
import { HomePage } from "@/pages/HomePage";
import { SowPage } from "@/pages/SowPage";
import { BrightSidePage } from "@/pages/BrightSidePage";
import { DeadheadIntakePage } from "@/pages/DeadheadIntakePage";
import { ServicesPage } from "@/pages/ServicesPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/bio" component={BioPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/sign-on" component={SignOnPage} />
      <Route path="/manifest" component={ManifestPage} />
      <Route path="/sow" component={SowPage} />
      <Route path="/bright-side" component={BrightSidePage} />
      <Route path="/deadhead/intake" component={DeadheadIntakePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
