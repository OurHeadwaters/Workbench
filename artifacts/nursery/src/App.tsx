import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { api, type NurseryProducer } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { GardenFloorPage } from "./pages/GardenFloorPage";
import { IdeaBriefPage } from "./pages/IdeaBriefPage";
import { OnboardingPage } from "./pages/OnboardingPage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  const [producer, setProducer] = useState<NurseryProducer | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    api.me()
      .then((p) => setProducer(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleAuth(p: NurseryProducer, isFreshSteward?: boolean) {
    setProducer(p);
    if (isFreshSteward) {
      navigate(`${BASE}/onboarding`);
    } else {
      navigate(`${BASE}/`);
    }
  }

  async function handleSignOut() {
    await api.logout().catch(() => {});
    setProducer(null);
    navigate(`${BASE}/`);
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-[#7A6B60] text-sm">Loading…</div>
      </div>
    );
  }

  if (!producer) {
    return <LoginPage onAuth={handleAuth} />;
  }

  return (
    <Switch>
      <Route path={`${BASE}/onboarding`}>
        <OnboardingPage producer={producer} onDone={() => navigate(`${BASE}/`)} />
      </Route>
      <Route path={`${BASE}/idea/:id`}>
        {(params) => (
          <IdeaBriefPage
            ideaId={params.id}
            producer={producer}
            onBack={() => navigate(`${BASE}/`)}
          />
        )}
      </Route>
      <Route>
        <GardenFloorPage producer={producer} onSignOut={handleSignOut} />
      </Route>
    </Switch>
  );
}
