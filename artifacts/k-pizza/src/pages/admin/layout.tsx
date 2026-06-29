import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Megaphone, ArrowLeft, ChefHat, Settings, BookOpen, LogOut, Loader2, Quote, Camera, Leaf, Smartphone, Hotel, CalendarClock, Sparkles, GraduationCap, UtensilsCrossed, Sprout, ShoppingBag, Instagram } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AdminLogin from "./login";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin />;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? "bg-primary text-white" : "hover:bg-muted"}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <nav className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-2xl mb-1">Shop Tools</h1>
          <p className="text-sm text-muted-foreground font-sans">Owner & staff</p>
        </div>

        <div className="flex flex-col gap-2 font-sans text-sm">
          <Link href="/admin/orders" className={linkClass(location === "/admin/orders" || location === "/admin")}>
            <ChefHat size={18} /> Kitchen Board
          </Link>
          <Link href="/admin/menu" className={linkClass(location === "/admin/menu")}>
            <BookOpen size={18} /> Menu
          </Link>
          <Link href="/admin/specials" className={linkClass(location === "/admin/specials")}>
            <LayoutDashboard size={18} /> Specials
          </Link>
          <Link href="/admin/promo" className={linkClass(location === "/admin/promo")}>
            <Sparkles size={18} /> This Week Promo
          </Link>
          <Link href="/admin/upsells" className={linkClass(location === "/admin/upsells")}>
            <Megaphone size={18} /> Upsells
          </Link>
          <Link href="/admin/reviews" className={linkClass(location === "/admin/reviews")}>
            <Quote size={18} /> Reviews
          </Link>
          <Link href="/admin/snaps" className={linkClass(location === "/admin/snaps")}>
            <Camera size={18} /> Staff Room
          </Link>
          <Link href="/admin/coop" className={linkClass(location === "/admin/coop")}>
            <Leaf size={18} /> 807 Co-op Crate
          </Link>
          <Link href="/admin/lunch" className={linkClass(location === "/admin/lunch")}>
            <CalendarClock size={18} /> Lunch Club
          </Link>
          <Link href="/admin/catering" className={linkClass(location === "/admin/catering")}>
            <UtensilsCrossed size={18} /> Catering Calendar
          </Link>
          <Link href="/admin/leads" className={linkClass(location === "/admin/leads")}>
            <Smartphone size={18} /> Phone Add-On Inbox
          </Link>
          <Link href="/admin/hotels" className={linkClass(location === "/admin/hotels")}>
            <Hotel size={18} /> Hotel Guest Page
          </Link>
          <Link href="/admin/school-program" className={linkClass(location === "/admin/school-program")}>
            <GraduationCap size={18} /> School Lunch Program
          </Link>
          <Link href="/admin/market-mosaic" className={linkClass(location === "/admin/market-mosaic")}>
            <Sprout size={18} /> Market Mosaic
          </Link>
          <Link href="/admin/producers" className={linkClass(location === "/admin/producers")}>
            <Sprout size={18} /> 807 Producers
          </Link>
          <Link href="/admin/shop-products" className={linkClass(location === "/admin/shop-products")}>
            <ShoppingBag size={18} /> 807 Shop Products
          </Link>
          <Link href="/admin/hinterland-ig" className={linkClass(location === "/admin/hinterland-ig")}>
            <Instagram size={18} /> Hinterland IG Grid
          </Link>
          <Link href="/admin/settings" className={linkClass(location === "/admin/settings")}>
            <Settings size={18} /> Shop Settings
          </Link>
        </div>

        <div className="mt-auto pt-8 border-t border-border space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">
            <ArrowLeft size={18} /> Back to Site
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </nav>
      <main className="flex-1 overflow-auto bg-muted/20">{children}</main>
    </div>
  );
}
