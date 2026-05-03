import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/react";
import { RedirectToSignIn } from "@/lib/clerkGates";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";
import Standby from "@/pages/Standby";
import Gate from "@/pages/Gate";
import Dashboard from "@/pages/Dashboard";
import TransactionNew from "@/pages/TransactionNew";
import TransactionDetail from "@/pages/TransactionDetail";
import Accounts from "@/pages/Accounts";
import CostCentres from "@/pages/CostCentres";
import Submissions from "@/pages/Submissions";
import Submit from "@/pages/Submit";
import Handlers from "@/pages/Handlers";
import Users from "@/pages/Users";
import Reconciliation from "@/pages/Reconciliation";
import AccountantHandoff from "@/pages/AccountantHandoff";
import Layout from "@/components/Layout";
import EmbedOpenRecords from "@/embed/OpenRecords";
import EmbedDailyClose from "@/embed/DailyClose";
import EmbedMonthEnd from "@/embed/MonthEnd";

const queryClient = new QueryClient();

// Wouter to Clerk router adapter
function ClerkWouterAdapter({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  const navigate = (to: string) => setLocation(to);
  
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to)}
      appearance={{
        variables: {
          colorPrimary: "hsl(160 40% 25%)",
          colorBackground: "hsl(40 33% 98%)",
          colorText: "hsl(160 40% 15%)",
          colorDanger: "hsl(0 70% 50%)",
          colorInputBackground: "hsl(40 33% 98%)",
          colorInputText: "hsl(160 40% 15%)",
          borderRadius: "0.5rem",
          fontFamily: "'Inter', sans-serif"
        },
        elements: {
          cardBox: "shadow-md border border-[hsl(40_20%_85%)] rounded-lg overflow-hidden",
          card: "bg-[hsl(40_33%_98%)]",
          footer: "bg-[hsl(40_20%_92%)] border-t border-[hsl(40_20%_85%)]"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}

function HomeRedirect() {
  const [, setLocation] = useLocation();
  const { data: me, isLoading } = useGetBookkeeperMe();

  useEffect(() => {
    if (!isLoading && me) {
      if (me.role === "food_handler") {
        setLocation("/submit");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [me, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

type RouteParams = Record<string, string | undefined>;

interface ProtectedRouteProps {
  component: React.ComponentType<{ params: RouteParams }>;
  path?: string;
  nest?: boolean;
}

function ProtectedContent({
  params,
  Component,
}: {
  params: RouteParams;
  Component: React.ComponentType<{ params: RouteParams }>;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isSignedIn) return <RedirectToSignIn />;
  return (
    <Layout>
      <Component params={params} />
    </Layout>
  );
}

function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  return (
    <Route {...rest}>
      {(params: RouteParams) => (
        <ProtectedContent params={params} Component={Component} />
      )}
    </Route>
  );
}

function Router() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo" component={Demo} />
      <Route path="/standby" component={Standby} />
      <Route path="/gate" component={Gate} />
      {/*
        Public, chrome-free embed routes consumed by the Deer Lake
        walkthrough's BookkeepingProof section as iframes. They render
        without Clerk auth so a councillor reading the walkthrough sees
        the books without hitting a sign-in wall, and they pull from a
        shared "Sample · Deer Lake demo" dataset so the demo numbers
        can never be confused for the band's real numbers. See task
        #526 for the rationale.
      */}
      <Route path="/embed/open-records" component={EmbedOpenRecords} />
      <Route path="/embed/daily-close" component={EmbedDailyClose} />
      <Route path="/embed/month-end" component={EmbedMonthEnd} />
      <Route path="/sign-in/*?">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <SignIn routing="path" path={`${basePath}/sign-in`} />
        </div>
      </Route>
      <Route path="/sign-up/*?">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <SignUp routing="path" path={`${basePath}/sign-up`} />
        </div>
      </Route>
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/transactions/new" component={TransactionNew} />
      <ProtectedRoute path="/transactions/:id" component={TransactionDetail} />
      <ProtectedRoute path="/accounts" component={Accounts} />
      <ProtectedRoute path="/cost-centres" component={CostCentres} />
      <ProtectedRoute path="/submissions" component={Submissions} />
      <ProtectedRoute path="/submit" component={Submit} />
      <ProtectedRoute path="/handlers" component={Handlers} />
      <ProtectedRoute path="/users" component={Users} />
      <ProtectedRoute path="/reconciliation" component={Reconciliation} />
      <ProtectedRoute path="/accountant-handoff" component={AccountantHandoff} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ClerkWouterAdapter>
            <Router />
          </ClerkWouterAdapter>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
