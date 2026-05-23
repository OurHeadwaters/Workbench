import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { api, type NurseryProducer } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { GardenFloorPage } from "./pages/GardenFloorPage";
import { IdeaBriefPage } from "./pages/IdeaBriefPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { NurseryLandingPage } from "./pages/NurseryLandingPage";

export function NurseryApp() {
  const [producer, setProducer] = useState<NurseryProducer | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, navigate] = useLocation();

  useEffect(() => {
    api.me()
      .then((p) => setProducer(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleAuth(p: NurseryProducer, isFreshSteward?: boolean) {
    setProducer(p);
    if (isFreshSteward) {
      navigate("/nursery/onboarding");
    } else {
      navigate("/nursery");
    }
  }

  async function handleSignOut() {
    await api.logout().catch(() => {});
    setProducer(null);
    navigate("/nursery");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-[#7A6B60] text-sm">Loading…</div>
      </div>
    );
  }

  if (!producer) {
    const isProtectedRoute = location !== "/nursery";
    if (isProtectedRoute) {
      return <LoginPage onAuth={handleAuth} />;
    }
    return <NurseryLandingPage onSignIn={() => navigate("/nursery/login")} />;
  }

  if (location === "/nursery/onboarding") {
    return <OnboardingPage producer={producer} onDone={() => navigate("/nursery")} />;
  }

  const ideaMatch = location.match(/^\/nursery\/idea\/([^/]+)$/);
  if (ideaMatch) {
    return (
      <IdeaBriefPage
        ideaId={ideaMatch[1]}
        producer={producer}
        onBack={() => navigate("/nursery")}
      />
    );
  }

  return <GardenFloorPage producer={producer} onSignOut={handleSignOut} />;
}
