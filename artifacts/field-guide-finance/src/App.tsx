import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ClerkProvider, useAuth, SignIn, SignUp } from "@clerk/react";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { LockedPreview } from "@/pages/LockedPreview";
import { UpgradeNudge } from "@/pages/UpgradeNudge";
import { CoursePage } from "@/pages/CoursePage";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

interface MembershipCheckResult {
  eligible: boolean;
  tier: string;
}

function useMembershipCheck(enabled: boolean) {
  return useQuery<MembershipCheckResult>({
    queryKey: ["membership-check"],
    queryFn: async () => {
      const res = await fetch("/api/membership/check", { credentials: "include" });
      if (!res.ok) throw new Error("Membership check failed");
      return res.json() as Promise<MembershipCheckResult>;
    },
    enabled,
    retry: 1,
    staleTime: 60_000,
  });
}

function CourseGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, navigate] = useLocation();

  const { data, isLoading, isError } = useMembershipCheck(!!isLoaded && !!isSignedIn);

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "var(--cream)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!isSignedIn) {
    return <LockedPreview onSignIn={() => navigate("/sign-in")} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "var(--cream)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (isError || !data) {
    return <UpgradeNudge tier="unknown" />;
  }

  if (!data.eligible) {
    return <UpgradeNudge tier={data.tier} />;
  }

  return <CoursePage />;
}

function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ backgroundColor: "var(--cream)" }}>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ backgroundColor: "var(--cream)" }}>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={CourseGate} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route component={CourseGate} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      appearance={{
        variables: {
          colorPrimary: "#C7613B",
          colorForeground: "#2E2010",
          colorMutedForeground: "#6B5744",
          colorDanger: "#B91C1C",
          colorBackground: "#FAF6EF",
          colorNeutral: "#E0D5C8",
          fontFamily: "'Inter', system-ui, sans-serif",
          borderRadius: "0.75rem",
        },
        elements: {
          cardBox: "shadow-md border border-[#E0D5C8] rounded-2xl overflow-hidden w-[440px] max-w-full",
          card: "bg-[#FAF6EF]",
          footer: "bg-[#F0E9DD] border-t border-[#E0D5C8]",
          formButtonPrimary: "bg-[#C7613B] hover:bg-[#A8502E]",
          footerActionLink: "text-[#C7613B]",
        },
      }}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access Field Guide Finance",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ZoneStoreProvider>
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
    <KitchenTableButton />
    </ZoneStoreProvider>
  );
}
