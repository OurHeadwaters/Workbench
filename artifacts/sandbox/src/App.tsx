import { Router, Route, Switch, Redirect } from "wouter";
import { useEffect, useState } from "react";
import { api, type SandboxHousehold, clearToken } from "@/lib/api";
import { LoginPage } from "@/pages/LoginPage";
import { BoardPage } from "@/pages/BoardPage";
import { HeadsUpPage } from "@/pages/HeadsUpPage";
import { StandbyPage } from "@/pages/StandbyPage";
import { GatherRoundPage } from "@/pages/GatherRoundPage";
import { OrganizerPage } from "@/pages/OrganizerPage";
import { NavBar } from "@/components/NavBar";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export type AppContext = {
  household: SandboxHousehold;
  onSignOut: () => void;
};

export default function App() {
  const [household, setHousehold] = useState<SandboxHousehold | null | "loading">("loading");

  useEffect(() => {
    api.me().then(setHousehold).catch(() => setHousehold(null));
  }, []);

  function handleSignOut() {
    clearToken();
    setHousehold(null);
  }

  if (household === "loading") {
    return (
      <div className="min-h-dvh bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-[#7A6B60] text-sm">Loading…</div>
      </div>
    );
  }

  if (!household) {
    return <LoginPage onAuth={setHousehold} />;
  }

  return (
    <Router base={BASE}>
      <div className="min-h-dvh bg-[#FAF6F0] pb-20">
        <Switch>
          <Route path="/" component={() => <BoardPage household={household} onSignOut={handleSignOut} />} />
          <Route path="/heads-up" component={() => <HeadsUpPage household={household} />} />
          <Route path="/standby" component={() => <StandbyPage household={household} />} />
          <Route path="/gather-round" component={() => <GatherRoundPage household={household} />} />
          <Route path="/organizer" component={() =>
            household.isOrganizer
              ? <OrganizerPage household={household} />
              : <Redirect to="/" />
          } />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
        <NavBar isOrganizer={household.isOrganizer} />
      </div>
    </Router>
  );
}
