import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { LobbyPage } from "./pages/LobbyPage";
import OnePager from "./pages/OnePager";
import HiringTemplates from "./pages/HiringTemplates";
import HoursByPillar from "./pages/HoursByPillar";
import ContractTerms from "./pages/ContractTerms";
import DeckPlayer from "./components/DeckPlayer";
import ReferenceCallScript from "./pages/ReferenceCallScript";
import ReferenceCallHandyman from "./pages/ReferenceCallHandyman";
import CandidateTracker from "./pages/CandidateTracker";
import ToolsIndex from "./pages/ToolsIndex";
import SaltYearlySummary from "./pages/SaltYearlySummary";
import PlanYear from "./pages/PlanYear";
import PlanWeek from "./pages/PlanWeek";
import PlanToday from "./pages/PlanToday";
import Week from "./pages/Week";
import WeekCloseOut from "./pages/WeekCloseOut";
import CostReviewModal from "./components/CostReviewModal";
import RateBreakdown from "./pages/RateBreakdown";
import DeerLakeTalkingPoints from "./pages/DeerLakeTalkingPoints";
import DeerLakeRoadmap from "./pages/DeerLakeRoadmap";
import DeerLakeChiefBrief from "./pages/DeerLakeChiefBrief";
import DailyDebrief from "./pages/DailyDebrief";
import EveningDump from "./pages/EveningDump";
import SaltboxGatherRound from "./pages/SaltboxGatherRound";
import ConstellationSession from "./pages/ConstellationSession";

const SaltMonthlyClose = lazy(() => import("./pages/SaltMonthlyClose"));

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/`} component={LobbyPage} />
      <Route path={`${BASE}/deck`} component={DeckPlayer} />
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route path={`${BASE}/hiring-templates`} component={HiringTemplates} />
      <Route path={`${BASE}/hours`} component={HoursByPillar} />
      <Route path={`${BASE}/contract-terms`} component={ContractTerms} />
      <Route path={`${BASE}/tools`} component={ToolsIndex} />
      <Route path={`${BASE}/tools/reference-call`} component={ReferenceCallScript} />
      <Route path={`${BASE}/tools/reference-call-handyman`} component={ReferenceCallHandyman} />
      <Route path={`${BASE}/tools/candidate-tracker`} component={CandidateTracker} />
      <Route path={`${BASE}/tools/salt-close`}>
        <Suspense fallback={<div>Loading…</div>}>
          <SaltMonthlyClose />
        </Suspense>
      </Route>
      <Route path={`${BASE}/tools/salt-yearly`} component={SaltYearlySummary} />
      <Route path={`${BASE}/tools/bench/week`} component={Week} />
      <Route path={`${BASE}/tools/bench/close`} component={WeekCloseOut} />
      <Route path={`${BASE}/tools/cost-review`} component={CostReviewModal} />
      <Route path={`${BASE}/rate-breakdown`} component={RateBreakdown} />
      <Route path={`${BASE}/deer-lake-chief-brief`} component={DeerLakeChiefBrief} />
      <Route path={`${BASE}/deer-lake-talking-points`} component={DeerLakeTalkingPoints} />
      <Route path={`${BASE}/deer-lake-roadmap`} component={DeerLakeRoadmap} />
      <Route path={`${BASE}/debrief`} component={DailyDebrief} />
      <Route path={`${BASE}/debrief/evening`} component={EveningDump} />
      <Route path={`${BASE}/saltbox-gather-round`} component={SaltboxGatherRound} />
      <Route path={`${BASE}/constellation-session`} component={ConstellationSession} />
      <Route path={`${BASE}/plan`} component={PlanYear} />
      <Route path={`${BASE}/plan/today`} component={PlanToday} />
      <Route path={`${BASE}/plan/week/:n`} component={PlanWeek} />
      <Route component={LobbyPage} />
    </Switch>
  );
}
