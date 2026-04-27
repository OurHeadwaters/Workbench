import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { PilesPage } from "@/pages/PilesPage";
import { PileEditorPage } from "@/pages/PileEditorPage";
import { CheckDraftPage } from "@/pages/CheckDraftPage";
import { TopBar } from "@/components/TopBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PilesPage} />
      <Route path="/pile/:pileId" component={PileEditorPage} />
      <Route path="/pile/:pileId/check" component={CheckDraftPage} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="eyebrow mb-3">Wordpile</p>
      <h1 className="text-3xl mb-4">That page isn't here.</h1>
      <button className="btn-secondary" onClick={() => navigate("/")}>
        Back to piles
      </button>
    </div>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1">
          <Router />
        </main>
        <footer className="text-center py-8 px-6">
          <p className="eyebrow">Wordpile · saved on this device</p>
        </footer>
      </div>
    </WouterRouter>
  );
}
