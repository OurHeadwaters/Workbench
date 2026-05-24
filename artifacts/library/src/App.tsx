import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PrivacyPage from "@/pages/privacy";
import Home from "@/pages/home";
import Entries from "@/pages/entries/index";
import NewEntry from "@/pages/entries/new";
import EntryDetail from "@/pages/entries/[id]";
import Producers from "@/pages/producers/index";
import ProducerDetail from "@/pages/producers/[slug]";
import Subjects from "@/pages/subjects/index";
import Buckets from "@/pages/buckets/index";
import Contributors from "@/pages/contributors/index";
import ShareLinks from "@/pages/share-links/index";
import NeedsReview from "@/pages/needs-review";
import TeamPage from "@/pages/team/index";
import ConfidentialQueue from "@/pages/confidential/queue";
import PublicShare from "@/pages/share/[token]";
import PublicWhyStoresFail from "@/pages/share/why-stores-fail";
import WhyStoresFail from "@/pages/why-stores-fail";
import Phenomena, { PhenomenonDetailPage } from "@/pages/phenomena";
import ReverseTest from "@/pages/reverse-test";
import Login from "@/pages/login";
import Layout from "@/components/Layout";
import NurseryLayout from "@/components/NurseryLayout";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { ReactNode } from "react";
import { NurseryApp } from "@/nursery/NurseryApp";
import { GordWidget } from "@/components/GordWidget";

const queryClient = new QueryClient();

function RequireOwner({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useOwnerAuth();
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <>{children}</>;
}

function NurseryWrapper() {
  const { isLoggedIn } = useOwnerAuth();
  if (isLoggedIn) {
    return <Layout><NurseryApp /></Layout>;
  }
  return <NurseryLayout><NurseryApp /></NurseryLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/share/:token/why-stores-fail" component={PublicWhyStoresFail} />
      <Route path="/share/:token" component={PublicShare} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/login" component={Login} />
      {/* Nursery routes — clean shell for producers; full library shell for authenticated owners */}
      <Route path="/nursery/onboarding" component={NurseryWrapper} />
      <Route path="/nursery/idea/:id" component={NurseryWrapper} />
      <Route path="/nursery" component={NurseryWrapper} />
      <Route>
        <RequireOwner>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/entries" component={Entries} />
              <Route path="/entries/new" component={NewEntry} />
              <Route path="/entries/:id" component={EntryDetail} />
              <Route path="/producers" component={Producers} />
              <Route path="/producers/:slug" component={ProducerDetail} />
              <Route path="/subjects" component={Subjects} />
              <Route path="/buckets" component={Buckets} />
              <Route path="/why-stores-fail">
                <WhyStoresFail />
              </Route>
              <Route path="/phenomena">
                <Phenomena />
              </Route>
              <Route path="/phenomena/:id">
                <PhenomenonDetailPage />
              </Route>
              <Route path="/reverse-test">
                <ReverseTest />
              </Route>
              <Route path="/contributors" component={Contributors} />
              <Route path="/share-links" component={ShareLinks} />
              <Route path="/team" component={TeamPage} />
              <Route path="/needs-review" component={NeedsReview} />
              <Route path="/confidential/queue" component={ConfidentialQueue} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </RequireOwner>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ZoneStoreProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <KitchenTableButton />
        <GordWidget />
      </TooltipProvider>
    </QueryClientProvider>
    </ZoneStoreProvider>
  );
}

export default App;
