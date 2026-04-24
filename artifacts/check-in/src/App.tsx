import { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import NewSnapshot from "@/pages/new-snapshot";
import History from "@/pages/history";
import Layout from "@/components/Layout";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { verifyToken } from "@/lib/api";
import { setOwnerToken } from "@/lib/ownerAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Personal once-a-year tool — the data does not move under our feet.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ProtectedRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/new" component={NewSnapshot} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function PublicRouter() {
  const [location, navigate] = useLocation();

  // The login page is the only public route.  If the unauthenticated user
  // lands on anything else, bounce them to login but remember nothing — once
  // they're back in they always start at the dashboard, which is the right
  // call for a single-page habit tool.
  useEffect(() => {
    if (location !== "/login") navigate("/login");
  }, [location, navigate]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route component={Login} />
    </Switch>
  );
}

function AuthGate() {
  const { isLoggedIn } = useOwnerAuth();
  const [verifying, setVerifying] = useState<boolean>(isLoggedIn);

  // On mount with a stored token, double-check it is still valid.  If the
  // server rejects, verifyToken clears the token via the api helper so the
  // gate flips to the login screen automatically.
  useEffect(() => {
    let cancelled = false;
    if (!isLoggedIn) {
      setVerifying(false);
      return;
    }
    setVerifying(true);
    verifyToken()
      .then((ok) => {
        if (!cancelled) {
          if (!ok) setOwnerToken(null);
          setVerifying(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOwnerToken(null);
          setVerifying(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // We intentionally re-run when isLoggedIn flips so a fresh login also
    // verifies before showing the dashboard.
  }, [isLoggedIn]);

  if (verifying) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return isLoggedIn ? <ProtectedRouter /> : <PublicRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthGate />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
