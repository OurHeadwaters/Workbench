import { Route, Switch } from "wouter";
import OnePager from "./pages/OnePager";
import HiringTemplates from "./pages/HiringTemplates";
import HoursByPillar from "./pages/HoursByPillar";
import ContractTerms from "./pages/ContractTerms";
import DeckPlayer from "./components/DeckPlayer";
import ReferenceCallScript from "./pages/ReferenceCallScript";
import ReferenceCallHandyman from "./pages/ReferenceCallHandyman";
import CandidateTracker from "./pages/CandidateTracker";
import ToolsIndex from "./pages/ToolsIndex";
import SaltMonthlyClose from "./pages/SaltMonthlyClose";
import SaltYearlySummary from "./pages/SaltYearlySummary";
import PlanYear from "./pages/PlanYear";
import PlanWeek from "./pages/PlanWeek";
import PlanToday from "./pages/PlanToday";
import Week from "./pages/Week";
import WeekCloseOut from "./pages/WeekCloseOut";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route path={`${BASE}/hiring-templates`} component={HiringTemplates} />
      <Route path={`${BASE}/hours`} component={HoursByPillar} />
      <Route path={`${BASE}/contract-terms`} component={ContractTerms} />
      <Route path={`${BASE}/tools`} component={ToolsIndex} />
      <Route path={`${BASE}/tools/reference-call`} component={ReferenceCallScript} />
      <Route path={`${BASE}/tools/reference-call-handyman`} component={ReferenceCallHandyman} />
      <Route path={`${BASE}/tools/candidate-tracker`} component={CandidateTracker} />
      <Route path={`${BASE}/tools/salt-close`} component={SaltMonthlyClose} />
      <Route path={`${BASE}/tools/salt-yearly`} component={SaltYearlySummary} />
      <Route path={`${BASE}/tools/bench/week`} component={Week} />
      <Route path={`${BASE}/tools/bench/close`} component={WeekCloseOut} />
      <Route path={`${BASE}/plan`} component={PlanYear} />
      <Route path={`${BASE}/plan/today`} component={PlanToday} />
      <Route path={`${BASE}/plan/week/:n`} component={PlanWeek} />
      <Route component={DeckPlayer} />
    </Switch>
  );
}
