import { Switch, Route, Router as WouterRouter } from "wouter";
import { PreviewProvider } from "@/context/PreviewContext";
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
import SaltOfTheEarthClub from "@/pages/SaltOfTheEarthClub";
import GoingDigital from "@/pages/GoingDigital";
import RackCardIndigenous from "@/pages/RackCardIndigenous";
import CapabilityStatement from "@/pages/CapabilityStatement";
import ScopeRateSheet from "@/pages/ScopeRateSheet";
import TspGuestForm from "@/pages/TspGuestForm";
import ColdTrailerUpgrade from "@/pages/ColdTrailerUpgrade";
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
      <Route path="/salt-of-the-earth-club" component={SaltOfTheEarthClub} />
      <Route path="/going-digital" component={GoingDigital} />
      <Route path="/rack-card-indigenous" component={RackCardIndigenous} />
      <Route path="/capability-statement" component={CapabilityStatement} />
      <Route path="/scope-rate-sheet" component={ScopeRateSheet} />
      <Route path="/tsp-guest-form" component={TspGuestForm} />
      <Route path="/cold-trailer-upgrade" component={ColdTrailerUpgrade} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <PreviewProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </PreviewProvider>
  );
}
