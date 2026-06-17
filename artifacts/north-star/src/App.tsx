import { useState, useEffect } from "react";
import { Router as WouterRouter, Route, Switch, Redirect } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
import { useStore } from "@/store";
import { NavBar } from "@/components/NavBar";
import { CaptureFab } from "@/components/CaptureFab";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { TodayPage } from "@/pages/TodayPage";
import { ZonesPage } from "@/pages/ZonesPage";
import { GuidePage } from "@/pages/GuidePage";
import { WeeklyPage } from "@/pages/WeeklyPage";
import { SeasonalPage } from "@/pages/SeasonalPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { InboxSetupPage } from "@/pages/InboxSetupPage";
import { TesterKitPage } from "@/pages/TesterKitPage";
import { SponsorIntakePage } from "@/pages/SponsorIntakePage";
import { TriageLandingPage } from "@/pages/TriageLandingPage";
import { ArchiveMiningPage } from "@/pages/ArchiveMiningPage";
import { ZoneDiagramPage } from "@/pages/ZoneDiagramPage";
import { KitchenTablePage } from "@/pages/KitchenTablePage";
import { TablePage } from "@/pages/TablePage";
import { MeetingKitPage } from "@/pages/MeetingKitPage";
import { MoneyMachinePage } from "@/pages/MoneyMachinePage";
import { CockpitPage } from "@/pages/CockpitPage";
import { WindowPage } from "@/pages/WindowPage";
import { ModelPage } from "@/pages/ModelPage";
import { DebriefPage } from "@/pages/DebriefPage";
import { LandPlanPage } from "@/pages/LandPlanPage";
import { KitsPage } from "@/pages/KitsPage";
import { KitPurchasesPage } from "@/pages/KitPurchasesPage";
import { VisionBoardPage } from "@/pages/VisionBoardPage";
import { PractitionerApplicationPage } from "@/pages/PractitionerApplicationPage";
import { PractitionerReviewPage } from "@/pages/PractitionerReviewPage";
import { InboxPage } from "@/pages/InboxPage";
import { ThisWeekPage } from "@/pages/ThisWeekPage";
import { TableRoomPage } from "@/pages/TableRoomPage";
import { GordWidget } from "@workspace/gord-widget";
import { PasswordGate } from "@/components/PasswordGate";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function getOwnerToken(): string | null {
  try {
    return (
      window.localStorage.getItem("library.ownerToken") ||
      window.localStorage.getItem("ownerToken") ||
      null
    );
  } catch {
    return null;
  }
}

function useIsOwner(): boolean {
  const [isOwner, setIsOwner] = useState(() => !!getOwnerToken());
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOwner(!!getOwnerToken());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return isOwner;
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const completed = useStore((s) => s.onboarding.completed);
  if (!completed) return <Redirect to="/onboarding" />;
  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#0B0905" }}>
      {children}
      <CaptureFab />
      <NavBar />
    </div>
  );
}

export default function App() {
  const isOwner = useIsOwner();

  return (
    <PasswordGate>
    <ZoneStoreProvider>
    <WouterRouter base={BASE}>
      <Switch>
        <Route path="/onboarding" component={OnboardingPage} />

        {/* ── Three rooms — main nav ── */}
        <Route path="/">
          <OnboardingGuard>
            <AppShell><InboxPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/this-week">
          <OnboardingGuard>
            <AppShell><ThisWeekPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/table">
          <OnboardingGuard>
            <AppShell><TableRoomPage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Preserved pages (not in main nav) ── */}
        <Route path="/today">
          <OnboardingGuard>
            <AppShell><TodayPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/cockpit">
          <OnboardingGuard>
            <AppShell><CockpitPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/debrief/evening">
          <OnboardingGuard>
            <AppShell><DebriefPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/debrief">
          <OnboardingGuard>
            <AppShell><DebriefPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/model">
          <OnboardingGuard>
            <AppShell><ModelPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/window">
          <AppShell><WindowPage /></AppShell>
        </Route>

        <Route path="/zones">
          <OnboardingGuard>
            <AppShell><ZonesPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/guide">
          <OnboardingGuard>
            <AppShell><GuidePage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/weekly">
          <OnboardingGuard>
            <AppShell><WeeklyPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/seasonal">
          <OnboardingGuard>
            <AppShell><SeasonalPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/settings">
          <OnboardingGuard>
            <AppShell><SettingsPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/kits">
          <AppShell><KitsPage /></AppShell>
        </Route>

        <Route path="/kits/purchases">
          <AppShell><KitPurchasesPage /></AppShell>
        </Route>

        <Route path="/apply-practitioner">
          <PractitionerApplicationPage />
        </Route>

        <Route path="/arc/practitioners">
          <AppShell><PractitionerReviewPage /></AppShell>
        </Route>

        <Route path="/inbox-setup">
          <OnboardingGuard>
            <AppShell><InboxSetupPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/tester-kit">
          <OnboardingGuard>
            <AppShell><TesterKitPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/sponsor-intake">
          <AppShell><SponsorIntakePage /></AppShell>
        </Route>
        <Route path="/triage" component={TriageLandingPage} />
        <Route path="/archive-mining">
          <OnboardingGuard>
            <AppShell><ArchiveMiningPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/zone-diagram">
          <OnboardingGuard>
            <AppShell><ZoneDiagramPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/meeting-kit">
          <OnboardingGuard>
            <AppShell><MeetingKitPage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/council"><Redirect to="/table" /></Route>
        <Route path="/money-machine">
          <AppShell><MoneyMachinePage /></AppShell>
        </Route>
        <Route path="/kitchen-table">
          <OnboardingGuard>
            <AppShell><KitchenTablePage /></AppShell>
          </OnboardingGuard>
        </Route>
        <Route path="/old-table">
          <OnboardingGuard>
            <AppShell><TablePage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/land">
          <OnboardingGuard>
            <AppShell><LandPlanPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/vision-board" component={VisionBoardPage} />

        <Route><Redirect to="/" /></Route>
      </Switch>
    </WouterRouter>
    <KitchenTableButton />
    <GordWidget founderMode={isOwner} />
    </ZoneStoreProvider>
    </PasswordGate>
  );
}
