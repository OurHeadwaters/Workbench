import { Switch, Route, Router as WouterRouter } from "wouter";
import { ZoneStoreProvider } from "@workspace/zone-store";
import { KitchenTableButton } from "@workspace/kitchen-table-client/react";
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
import CapabilityStatementPublic from "@/pages/CapabilityStatementPublic";
import ScopeRateSheet from "@/pages/ScopeRateSheet";
import TspGuestForm from "@/pages/TspGuestForm";
import ColdTrailerUpgrade from "@/pages/ColdTrailerUpgrade";
import TylerSubmit from "@/pages/TylerSubmit";
import NorthernPilotPitch from "@/pages/NorthernPilotPitch";
import DeerLakePartnership from "@/pages/DeerLakePartnership";
import GillesPitch from "@/pages/GillesPitch";
import PaceReferral from "@/pages/PaceReferral";
import PaceSelfServe from "@/pages/PaceSelfServe";
import NorthernEconomicTools from "@/pages/NorthernEconomicTools";
import InternalScopePlan from "@/pages/InternalScopePlan";
import BrandingKit from "@/pages/BrandingKit";
import Privacy from "@/pages/Privacy";
import CoopComplianceNotice from "@/pages/CoopComplianceNotice";
import ProjectOverview from "@/pages/ProjectOverview";
import CodetryIntroLetter from "@/pages/CodetryIntroLetter";
import CodetryFundingBrief from "@/pages/CodetryFundingBrief";
import CodetryOnePager from "@/pages/CodetryOnePager";
import CodetryPilotProposal from "@/pages/CodetryPilotProposal";
import CodetryIntroLetterSandyLake from "@/pages/CodetryIntroLetterSandyLake";
import CodetryPilotProposalSandyLake from "@/pages/CodetryPilotProposalSandyLake";
import CodetryIntroLetterDeerLake from "@/pages/CodetryIntroLetterDeerLake";
import CodetryPilotProposalDeerLake from "@/pages/CodetryPilotProposalDeerLake";
import CodetryFundingBriefDeerLake from "@/pages/CodetryFundingBriefDeerLake";
import DeerLakeWhyNow from "@/pages/DeerLakeWhyNow";
import NANOutreachPacket from "@/pages/NANOutreachPacket";
import CodetryPacketSandyLake from "@/pages/CodetryPacketSandyLake";
import CodetryPacketDeerLake from "@/pages/CodetryPacketDeerLake";
import CodetryPacketFoodSystems from "@/pages/CodetryPacketFoodSystems";
import ConstellationSessionMay16 from "@/pages/ConstellationSessionMay16";
import XRPLTip from "@/pages/XRPLTip";
import CommunityFinanceBrief from "@/pages/CommunityFinanceBrief";
import EngineOnePager from "@/pages/EngineOnePager";
import DeerLakeFirstEngine from "@/pages/DeerLakeFirstEngine";
import DeerLakeYouthOdyssey from "@/pages/DeerLakeYouthOdyssey";
import InternalDocs from "@/pages/InternalDocs";
import SoftwareSystemsBundle from "@/pages/SoftwareSystemsBundle";
import WatershedVisionPage from "@/pages/WatershedVision";
import GovernanceCard from "@/pages/GovernanceCard";
import EcosystemGuide from "@/pages/EcosystemGuide";
import MoneyMachineReport from "@/pages/MoneyMachineReport";
import NorthernPantryPrintable from "@/pages/NorthernPantryPrintable";
import ParrsJarsEmailSequence from "@/pages/ParrsJarsEmailSequence";
import PJKitIndex from "@/pages/PJKitIndex";
import PJSafePractices from "@/pages/PJSafePractices";
import PJBlanchingProcess from "@/pages/PJBlanchingProcess";
import PJBlanchingCheatSheet from "@/pages/PJBlanchingCheatSheet";
import PJDehydratingProcess from "@/pages/PJDehydratingProcess";
import PJFreezingDryingCheatSheet from "@/pages/PJFreezingDryingCheatSheet";
import PJProcessTheProcess from "@/pages/PJProcessTheProcess";
import PJBlanchingUses from "@/pages/PJBlanchingUses";
import PJStagesStations from "@/pages/PJStagesStations";
import PJStationSetup from "@/pages/PJStationSetup";
import PJObjectiveOutcomes from "@/pages/PJObjectiveOutcomes";
import PJJaristaLeadMagnet from "@/pages/PJJaristaLeadMagnet";
import OCAPartnershipBrief from "@/pages/OCAPartnershipBrief";
import CDPGrantNarrative from "@/pages/CDPGrantNarrative";
import OCAOutreachPacket from "@/pages/OCAOutreachPacket";
import NotFound from "@/pages/not-found";
import { GordWidget } from "@workspace/gord-widget";
import { PrintEcosystemFooter } from "@/components/PrintEcosystemFooter";

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
      <Route path="/capability-statement/view" component={CapabilityStatementPublic} />
      <Route path="/scope-rate-sheet" component={ScopeRateSheet} />
      <Route path="/tsp-guest-form" component={TspGuestForm} />
      <Route path="/cold-trailer-upgrade" component={ColdTrailerUpgrade} />
      <Route path="/tyler-submit" component={TylerSubmit} />
      <Route path="/northern-pilot" component={NorthernPilotPitch} />
      <Route path="/deer-lake-partnership" component={DeerLakePartnership} />
      <Route path="/gilles-pitch" component={GillesPitch} />
      <Route path="/pace-referral" component={PaceReferral} />
      <Route path="/pace-self-serve" component={PaceSelfServe} />
      <Route path="/northern-economic-tools" component={NorthernEconomicTools} />
      <Route path="/engine-one-pager" component={EngineOnePager} />
      <Route path="/internal-scope-plan" component={InternalScopePlan} />
      <Route path="/brand" component={BrandingKit} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/coop-compliance-notice" component={CoopComplianceNotice} />
      <Route path="/overview" component={ProjectOverview} />
      <Route path="/codetry-intro-letter" component={CodetryIntroLetter} />
      <Route path="/codetry-funding-brief" component={CodetryFundingBrief} />
      <Route path="/codetry-one-pager" component={CodetryOnePager} />
      <Route path="/codetry-pilot-proposal" component={CodetryPilotProposal} />
      <Route path="/codetry-intro-letter-sandy-lake" component={CodetryIntroLetterSandyLake} />
      <Route path="/codetry-pilot-proposal-sandy-lake" component={CodetryPilotProposalSandyLake} />
      <Route path="/codetry-intro-letter-deer-lake" component={CodetryIntroLetterDeerLake} />
      <Route path="/codetry-pilot-proposal-deer-lake" component={CodetryPilotProposalDeerLake} />
      <Route path="/codetry-funding-brief-deer-lake" component={CodetryFundingBriefDeerLake} />
      <Route path="/deer-lake-why-now" component={DeerLakeWhyNow} />
      <Route path="/deer-lake-first-engine" component={DeerLakeFirstEngine} />
      <Route path="/deer-lake-youth-odyssey" component={DeerLakeYouthOdyssey} />
      <Route path="/nan-outreach-packet" component={NANOutreachPacket} />
      <Route path="/codetry-packet-sandy-lake" component={CodetryPacketSandyLake} />
      <Route path="/codetry-packet-deer-lake" component={CodetryPacketDeerLake} />
      <Route path="/codetry-packet-food-systems" component={CodetryPacketFoodSystems} />
      <Route path="/constellation-session-may16" component={ConstellationSessionMay16} />
      <Route path="/watershed-vision" component={WatershedVisionPage} />
      <Route path="/xrpl-tip" component={XRPLTip} />
      <Route path="/community-finance-brief" component={CommunityFinanceBrief} />
      <Route path="/governance-card" component={GovernanceCard} />
      <Route path="/money-machine-report" component={MoneyMachineReport} />
      <Route path="/ecosystem-guide" component={EcosystemGuide} />
      <Route path="/internal" component={InternalDocs} />
      <Route path="/suite/northern-pantry" component={NorthernPantryPrintable} />
      <Route path="/suite/parrs-jars-email-sequence" component={ParrsJarsEmailSequence} />
      <Route path="/pj-kit" component={PJKitIndex} />
      <Route path="/pj-kit/safe-practices" component={PJSafePractices} />
      <Route path="/pj-kit/blanching-process" component={PJBlanchingProcess} />
      <Route path="/pj-kit/blanching-cheat-sheet" component={PJBlanchingCheatSheet} />
      <Route path="/pj-kit/dehydrating-process" component={PJDehydratingProcess} />
      <Route path="/pj-kit/freezing-drying-cheat-sheet" component={PJFreezingDryingCheatSheet} />
      <Route path="/pj-kit/process-the-process" component={PJProcessTheProcess} />
      <Route path="/pj-kit/blanching-uses" component={PJBlanchingUses} />
      <Route path="/pj-kit/stages-stations" component={PJStagesStations} />
      <Route path="/pj-kit/station-setup" component={PJStationSetup} />
      <Route path="/pj-kit/objective-outcomes" component={PJObjectiveOutcomes} />
      <Route path="/pj-kit/jarista-guide" component={PJJaristaLeadMagnet} />
      <Route path="/oca-partnership-brief" component={OCAPartnershipBrief} />
      <Route path="/cdp-grant-narrative" component={CDPGrantNarrative} />
      <Route path="/oca-outreach-packet" component={OCAOutreachPacket} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ZoneStoreProvider>
    <PreviewProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <KitchenTableButton />
      <GordWidget />
      <PrintEcosystemFooter />
    </PreviewProvider>
    </ZoneStoreProvider>
  );
}
