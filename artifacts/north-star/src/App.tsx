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
import { MeetingKitPage } from "@/pages/MeetingKitPage";
import { MoneyMachinePage } from "@/pages/MoneyMachinePage";
import { CockpitPage } from "@/pages/CockpitPage";
import { WindowPage } from "@/pages/WindowPage";
import { ModelPage } from "@/pages/ModelPage";
import { DebriefPage } from "@/pages/DebriefPage";
import { LandPlanPage } from "@/pages/LandPlanPage";
import { KitsPage } from "@/pages/KitsPage";
import { PractitionerApplicationPage } from "@/pages/PractitionerApplicationPage";
import { PractitionerReviewPage } from "@/pages/PractitionerReviewPage";
import { GordWidget } from "@workspace/gord-widget";

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
    <div className="min-h-dvh bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8]">
      {children}
      <CaptureFab />
      <NavBar />
    </div>
  );
}

export default function App() {
  const isOwner = useIsOwner();

  return (
    <ZoneStoreProvider>
    <WouterRouter base={BASE}>
      <Switch>
        <Route path="/onboarding" component={OnboardingPage} />

        {/* ── Today — the front door ── */}
        <Route path="/">
          <OnboardingGuard>
            <AppShell><TodayPage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Cockpit — all ops tools ── */}
        <Route path="/cockpit">
          <OnboardingGuard>
            <AppShell><CockpitPage /></AppShell>
          </OnboardingGuard>
        </Route>
        {/* Debrief lives under cockpit in nav, standalone routes */}
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

        {/* ── Model ── */}
        <Route path="/model">
          <OnboardingGuard>
            <AppShell><ModelPage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Window — public Eave Flow portal (no onboarding gate) ── */}
        <Route path="/window">
          <AppShell><WindowPage /></AppShell>
        </Route>

        {/* ── Zones ── */}
        <Route path="/zones">
          <OnboardingGuard>
            <AppShell><ZonesPage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Guide ── */}
        <Route path="/guide">
          <OnboardingGuard>
            <AppShell><GuidePage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Reviews ── */}
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

        {/* ── Settings ── */}
        <Route path="/settings">
          <OnboardingGuard>
            <AppShell><SettingsPage /></AppShell>
          </OnboardingGuard>
        </Route>

        {/* ── Kits — kit listing + owner drafts ── */}
        <Route path="/kits">
          <AppShell><KitsPage /></AppShell>
        </Route>

        {/* ── Practitioners — application form (public) ── */}
        <Route path="/apply-practitioner">
          <PractitionerApplicationPage />
        </Route>

        {/* ── Arc / Practitioners — owner review screen ── */}
        <Route path="/arc/practitioners">
          <AppShell><PractitionerReviewPage /></AppShell>
        </Route>

        {/* ── Other preserved routes ── */}
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
        <Route path="/council">
          <AppShell><KitchenTablePage /></AppShell>
        </Route>
        <Route path="/money-machine">
          <AppShell><MoneyMachinePage /></AppShell>
        </Route>

        <Route path="/land">
          <OnboardingGuard>
            <AppShell><LandPlanPage /></AppShell>
          </OnboardingGuard>
        </Route>

        <Route><Redirect to="/" /></Route>
      </Switch>
    </WouterRouter>
    <KitchenTableButton />
    <GordWidget founderMode={isOwner} />
    </ZoneStoreProvider>
  );
}
