import { Route, Switch } from "wouter";
import OnePager from "./pages/OnePager";
import HiringTemplates from "./pages/HiringTemplates";
import HoursByPillar from "./pages/HoursByPillar";
import DeckPlayer from "./components/DeckPlayer";
import ReferenceCallScript from "./pages/ReferenceCallScript";
import ReferenceCallHandyman from "./pages/ReferenceCallHandyman";
import CandidateTracker from "./pages/CandidateTracker";
import ToolsIndex from "./pages/ToolsIndex";
import SaltMonthlyClose from "./pages/SaltMonthlyClose";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route path={`${BASE}/hiring-templates`} component={HiringTemplates} />
      <Route path={`${BASE}/hours`} component={HoursByPillar} />
      <Route path={`${BASE}/tools`} component={ToolsIndex} />
      <Route path={`${BASE}/tools/reference-call`} component={ReferenceCallScript} />
      <Route path={`${BASE}/tools/reference-call-handyman`} component={ReferenceCallHandyman} />
      <Route path={`${BASE}/tools/candidate-tracker`} component={CandidateTracker} />
      <Route path={`${BASE}/tools/salt-close`} component={SaltMonthlyClose} />
      <Route component={DeckPlayer} />
    </Switch>
  );
}
