import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/react";
import { PilesPage } from "@/pages/PilesPage";
import { PileEditorPage } from "@/pages/PileEditorPage";
import { CheckDraftPage } from "@/pages/CheckDraftPage";
import { TopBar } from "@/components/TopBar";
import { WordpileStore } from "@/lib/store";
import { bootstrapSync } from "@/lib/cloudSync";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

function Router({ clerkEnabled }: { clerkEnabled: boolean }) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <Switch>
      <Route path="/" component={PilesPage} />
      <Route path="/pile/:pileId" component={PileEditorPage} />
      <Route path="/pile/:pileId/check" component={CheckDraftPage} />
      {clerkEnabled && (
        <Route path="/sign-in/*?">
          <AuthScreen>
            <SignIn
              routing="path"
              path={`${basePath}/sign-in`}
              signUpUrl={`${basePath}/sign-up`}
              forceRedirectUrl={`${basePath}/`}
            />
          </AuthScreen>
        </Route>
      )}
      {clerkEnabled && (
        <Route path="/sign-up/*?">
          <AuthScreen>
            <SignUp
              routing="path"
              path={`${basePath}/sign-up`}
              signInUrl={`${basePath}/sign-in`}
              forceRedirectUrl={`${basePath}/`}
            />
          </AuthScreen>
        </Route>
      )}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      {children}
    </div>
  );
}

function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="eyebrow mb-3">Wordpile</p>
      <h1 className="text-3xl mb-4">That page isn't here.</h1>
      <button className="btn-secondary" onClick={() => navigate("/")}>
        Back to piles
      </button>
    </div>
  );
}

// Bootstrap effect: when the Clerk session resolves, push our local snapshot
// up to the server, replace the in-memory state with the merged result, and
// flip the cloud-sync flag on for subsequent mutations. On sign-out we wipe
// the local cache so the next anonymous visitor on this browser doesn't
// inherit the previous user's piles.
//
// `lastUserId` lives in a ref so the effect re-runs only on actual identity
// changes, not every render — and importantly, the bootstrap fires once per
// sign-in, never twice for the same user.
function CloudSyncBridge() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const next = isSignedIn && userId ? userId : null;
    const prev = lastUserId.current;
    if (prev === next) return;

    if (next) {
      // Account switch A -> B without an intermediate sign-out: never upload
      // user A's local cache into user B's account. Wipe local first, then
      // bootstrap B with an empty payload so B receives only their own
      // server-side data.
      //
      // First-ever sign-in (prev === null): keep the local snapshot so any
      // anonymous data the user built up gets migrated up to the cloud
      // rather than being abandoned.
      const isAccountSwitch = prev !== null && prev !== next;
      if (isAccountSwitch) {
        WordpileStore.clearLocal();
      }
      WordpileStore.setCloudUser(next);
      const localSnapshot = WordpileStore.getSnapshot();
      void bootstrapSync(localSnapshot).then((merged) => {
        if (merged) WordpileStore.replaceAll(merged);
      });
    } else {
      // Sign-out. Stop pushing to the cloud, clear local cache, return to
      // anonymous mode with an empty slate.
      WordpileStore.setCloudUser(null);
      WordpileStore.clearLocal();
    }
    lastUserId.current = next;
  }, [isLoaded, isSignedIn, userId]);

  return null;
}

// When Clerk isn't configured at all (e.g. local dev without secrets) we
// degrade to the original anonymous-only experience. Both `TopBar` and
// `Router` are told `clerkEnabled={false}` so they skip every Clerk-only
// hook, route, and component — nothing in this tree may call into Clerk.
function NoClerkApp() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar clerkEnabled={false} />
      <main className="flex-1">
        <Router clerkEnabled={false} />
      </main>
      <footer className="text-center py-8 px-6">
        <p className="eyebrow">Wordpile · saved on this device</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      {CLERK_PUBLISHABLE_KEY ? (
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          appearance={{
            variables: {
              colorPrimary: "#1f3d2e",
              colorBackground: "#f4ede0",
              colorText: "#1f3d2e",
              colorInputBackground: "#ede4d2",
              colorInputText: "#1f3d2e",
              borderRadius: "0.375rem",
              fontFamily: '"Lora", Georgia, serif',
            },
          }}
        >
          <CloudSyncBridge />
          <div className="min-h-screen flex flex-col">
            <TopBar clerkEnabled={true} />
            <main className="flex-1">
              <Router clerkEnabled={true} />
            </main>
            <footer className="text-center py-8 px-6">
              <p className="eyebrow">Wordpile · sign in to sync across devices</p>
            </footer>
          </div>
        </ClerkProvider>
      ) : (
        <NoClerkApp />
      )}
    </WouterRouter>
  );
}
