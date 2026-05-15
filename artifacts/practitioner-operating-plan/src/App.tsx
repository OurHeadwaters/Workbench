import { Route, Switch } from "wouter";
import Budget from "./pages/slides/Budget";
import CashFlow from "./pages/slides/CashFlow";
import CaseForRate from "./pages/slides/CaseForRate";
import Closing from "./pages/slides/Closing";
import OnePager from "./pages/OnePager";
import Prologue from "./pages/slides/Prologue";
import Cover from "./pages/slides/Cover";
import SlabVsGrassland from "./pages/slides/SlabVsGrassland";
import PathToScale from "./pages/slides/PathToScale";
import SecondAnchorScenarios from "./pages/slides/SecondAnchorScenarios";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Switch>
      <Route path={`${BASE}/slide1`} component={Prologue} />
      <Route path={`${BASE}/slide2`} component={Cover} />
      <Route path={`${BASE}/slide3`} component={SlabVsGrassland} />
      <Route path={`${BASE}/slide4`} component={Budget} />
      <Route path={`${BASE}/slide5`} component={CaseForRate} />
      <Route path={`${BASE}/slide6`} component={CashFlow} />
      <Route path={`${BASE}/slide7`} component={SecondAnchorScenarios} />
      <Route path={`${BASE}/slide8`} component={PathToScale} />
      <Route path={`${BASE}/slide9`} component={Closing} />
      <Route path={`${BASE}/one-pager`} component={OnePager} />
      <Route component={Prologue} />
    </Switch>
  );
}
