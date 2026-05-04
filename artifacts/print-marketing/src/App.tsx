import { Switch, Route, Router as WouterRouter } from "wouter";
import Index from "@/pages/Index";
import PriceList from "@/pages/PriceList";
import MarketDisplay from "@/pages/MarketDisplay";
import PosterParrsJars from "@/pages/PosterParrsJars";
import PosterServices from "@/pages/PosterServices";
import PosterMarket from "@/pages/PosterMarket";
import BusinessCard from "@/pages/BusinessCard";
import Letterhead from "@/pages/Letterhead";
import LogoFormats from "@/pages/LogoFormats";
import SquareSetup from "@/pages/SquareSetup";
import VocabularySheet from "@/pages/VocabularySheet";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/price-list" component={PriceList} />
      <Route path="/market-display" component={MarketDisplay} />
      <Route path="/poster-parrs-jars" component={PosterParrsJars} />
      <Route path="/poster-services" component={PosterServices} />
      <Route path="/poster-market" component={PosterMarket} />
      <Route path="/business-card" component={BusinessCard} />
      <Route path="/letterhead" component={Letterhead} />
      <Route path="/logo-formats" component={LogoFormats} />
      <Route path="/square-setup" component={SquareSetup} />
      <Route path="/vocabulary" component={VocabularySheet} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
