import { Router, Route, Switch } from "wouter";
import { NavBar } from "@/components/NavBar";
import { TodayPage } from "@/pages/TodayPage";
import { FamilyPage } from "@/pages/FamilyPage";
import { RolesPage } from "@/pages/RolesPage";
import { RoleMemberPage } from "@/pages/RoleMemberPage";
import { KitPage } from "@/pages/KitPage";
import { ActivitiesPage } from "@/pages/ActivitiesPage";
import { BlackoutKitActivity } from "@/pages/activities/BlackoutKitActivity";
import { JunkHuntActivity } from "@/pages/activities/JunkHuntActivity";
import { FireEscapeActivity } from "@/pages/activities/FireEscapeActivity";
import { GatherRoundActivity } from "@/pages/activities/GatherRoundActivity";
import { SettingsPage } from "@/pages/SettingsPage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router base={BASE}>
      <div className="min-h-dvh bg-[#FAF6F0]">
        <Switch>
          <Route path="/" component={TodayPage} />
          <Route path="/family" component={FamilyPage} />
          <Route path="/roles" component={RolesPage} />
          <Route path="/roles/:roleId/member/:memberId" component={RoleMemberPage} />
          <Route path="/kit" component={KitPage} />
          <Route path="/activities" component={ActivitiesPage} />
          <Route path="/activities/blackout-kit" component={BlackoutKitActivity} />
          <Route path="/activities/junk-hunt" component={JunkHuntActivity} />
          <Route path="/activities/fire-escape" component={FireEscapeActivity} />
          <Route path="/activities/gather-round" component={GatherRoundActivity} />
          <Route path="/settings" component={SettingsPage} />
          <Route>
            <div className="flex items-center justify-center min-h-dvh">
              <div className="text-center">
                <h1 className="text-2xl text-[#2E2620] mb-2">Page not found</h1>
                <a href={`${BASE}/`} className="text-[#C7613B] text-sm">Go home</a>
              </div>
            </div>
          </Route>
        </Switch>
        <NavBar />
      </div>
    </Router>
  );
}
