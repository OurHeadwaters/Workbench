import { Route, Switch } from "wouter";
import OnePager from "./pages/OnePager";
import HiringTemplates from "./pages/HiringTemplates";
import DeckPlayer from "./components/DeckPlayer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route path={`${BASE}/hiring-templates`} component={HiringTemplates} />
      <Route component={DeckPlayer} />
    </Switch>
  );
}
