import { Router as WouterRouter, Route, Switch, Redirect } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { useStore } from "@/store";
import { NavBar } from "@/components/NavBar";
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

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const completed = useStore((s) => s.onboarding.completed);
  if (!completed) return <Redirect to="/onboarding" />;
  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#FAFAF9]">
      {children}
      <NavBar />
    </div>
  );
}

export default function App() {
  return (
    <ZoneStoreProvider>
    <WouterRouter base={BASE}>
      <Switch>
        <Route path="/onboarding" component={OnboardingPage} />

        <Route path="/">
          <OnboardingGuard>
            <AppShell>
              <TodayPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/zones">
          <OnboardingGuard>
            <AppShell>
              <ZonesPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/guide">
          <OnboardingGuard>
            <AppShell>
              <GuidePage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/weekly">
          <OnboardingGuard>
            <AppShell>
              <WeeklyPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/seasonal">
          <OnboardingGuard>
            <AppShell>
              <SeasonalPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/settings">
          <OnboardingGuard>
            <AppShell>
              <SettingsPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/inbox-setup">
          <OnboardingGuard>
            <AppShell>
              <InboxSetupPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/tester-kit">
          <OnboardingGuard>
            <AppShell>
              <TesterKitPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route path="/sponsor-intake">
          <AppShell>
            <SponsorIntakePage />
          </AppShell>
        </Route>

        <Route path="/triage" component={TriageLandingPage} />

        <Route path="/archive-mining">
          <OnboardingGuard>
            <AppShell>
              <ArchiveMiningPage />
            </AppShell>
          </OnboardingGuard>
        </Route>

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </WouterRouter>
    </ZoneStoreProvider>
  );
}
