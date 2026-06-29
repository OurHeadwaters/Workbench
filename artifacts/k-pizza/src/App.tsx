import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/lib/api";
import NotFound from "@/pages/not-found";
import LandingPage from "@/components/LandingPage";
import OrderPage from "@/pages/order";
import MenuPage from "@/pages/menu";
import VisitingDrydenPage from "@/pages/visiting-dryden";
import HotelQrCardPage from "@/pages/hotel-qr-card";
import CateringPrintPage from "@/pages/catering-print";
import AdminLayout from "@/pages/admin/layout";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";
import AdminSpecials from "@/pages/admin/specials";
import AdminPromo from "@/pages/admin/promo";
import AdminUpsells from "@/pages/admin/upsells";
import AdminReviews from "@/pages/admin/reviews";
import AdminSnaps from "@/pages/admin/snaps";
import AdminCoop from "@/pages/admin/coop";
import AdminLeads from "@/pages/admin/leads";
import AdminCatering from "@/pages/admin/catering";
import AdminHotels from "@/pages/admin/hotels";
import AdminLunch from "@/pages/admin/lunch";
import AdminSchoolProgram from "@/pages/admin/school-program";
import AdminMarketMosaic from "@/pages/admin/market-mosaic";
import AdminProducers from "@/pages/admin/producers";
import AdminShopProducts from "@/pages/admin/shop-products";
import AdminSettings from "@/pages/admin/settings";
import AdminHinterlandIg from "@/pages/admin/hinterland-ig";
import SchoolProgramPage from "@/pages/school-program";
import MarketMosaicPage from "@/pages/market-mosaic";
import SchoolProgramPrint from "@/pages/school-program-print";
import CommunityPage from "@/pages/community/index";
import LunchClubPage from "@/pages/community/lunch-club";
import FeedYourTeamPage from "@/pages/community/feed-your-team";
import FundraisersPage from "@/pages/community/fundraisers";
import { GordWidget } from "@workspace/gord-widget";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, refetchOnWindowFocus: false } },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/order" component={OrderPage} />
      <Route path="/visiting-dryden" component={VisitingDrydenPage} />
      <Route path="/hotel-qr-card" component={HotelQrCardPage} />
      <Route path="/school-program" component={SchoolProgramPage} />
      <Route path="/school-program/print" component={SchoolProgramPrint} />
      <Route path="/market-mosaic" component={MarketMosaicPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/community/lunch-club" component={LunchClubPage} />
      <Route path="/community/feed-your-team" component={FeedYourTeamPage} />
      <Route path="/community/fundraisers" component={FundraisersPage} />
      <Route path="/catering/print" component={CateringPrintPage} />
      <Route path="/admin" component={() => <AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/orders" component={() => <AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/menu" component={() => <AdminLayout><AdminMenu /></AdminLayout>} />
      <Route path="/admin/specials" component={() => <AdminLayout><AdminSpecials /></AdminLayout>} />
      <Route path="/admin/promo" component={() => <AdminLayout><AdminPromo /></AdminLayout>} />
      <Route path="/admin/upsells" component={() => <AdminLayout><AdminUpsells /></AdminLayout>} />
      <Route path="/admin/reviews" component={() => <AdminLayout><AdminReviews /></AdminLayout>} />
      <Route path="/admin/snaps" component={() => <AdminLayout><AdminSnaps /></AdminLayout>} />
      <Route path="/admin/coop" component={() => <AdminLayout><AdminCoop /></AdminLayout>} />
      <Route path="/admin/leads" component={() => <AdminLayout><AdminLeads /></AdminLayout>} />
      <Route path="/admin/catering" component={() => <AdminLayout><AdminCatering /></AdminLayout>} />
      <Route path="/admin/hotels" component={() => <AdminLayout><AdminHotels /></AdminLayout>} />
      <Route path="/admin/lunch" component={() => <AdminLayout><AdminLunch /></AdminLayout>} />
      <Route path="/admin/school-program" component={() => <AdminLayout><AdminSchoolProgram /></AdminLayout>} />
      <Route path="/admin/market-mosaic" component={() => <AdminLayout><AdminMarketMosaic /></AdminLayout>} />
      <Route path="/admin/producers" component={() => <AdminLayout><AdminProducers /></AdminLayout>} />
      <Route path="/admin/shop-products" component={() => <AdminLayout><AdminShopProducts /></AdminLayout>} />
      <Route path="/admin/products" component={() => <AdminLayout><AdminShopProducts /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><AdminSettings /></AdminLayout>} />
      <Route path="/admin/hinterland-ig" component={() => <AdminLayout><AdminHinterlandIg /></AdminLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <GordWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
