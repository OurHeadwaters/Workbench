import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
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
import PublicShare from "@/pages/share/[token]";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/share/:token" component={PublicShare} />
      <Route>
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
            <Route path="/contributors" component={Contributors} />
            <Route path="/share-links" component={ShareLinks} />
            <Route path="/needs-review" component={NeedsReview} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
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
