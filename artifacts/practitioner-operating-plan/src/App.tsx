import { Route, Switch } from "wouter";
import OnePager from "./pages/OnePager";
import DeckPlayer from "./components/DeckPlayer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route component={DeckPlayer} />
    </Switch>
  );
}
