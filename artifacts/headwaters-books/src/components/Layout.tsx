import { useGetBookkeeperMe } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useClerk, SignOutButton } from "@clerk/react";
import { 
  LayoutDashboard, 
  Receipt, 
  BookOpen, 
  Building2, 
  LineChart, 
  Inbox, 
  PenSquare, 
  Users, 
  ShieldCheck, 
  Bell,
  LogOut,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading, isError } = useGetBookkeeperMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-serif text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          You don't have access to this application. Please ensure you are signed in with the correct account or contact the owner for access.
        </p>
        <div className="mt-6">
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="text-sm text-primary hover:underline">Sign out and try again</button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  const role = user.role;
  
  const navItems = [
    { href: "/dashboard", label: "The books today", icon: LayoutDashboard, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/submit", label: "Submit Receipt", icon: PenSquare, roles: ["food_handler"] },
    { href: "/transactions", label: "Transactions", icon: Receipt, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/submissions", label: "Receipts", icon: Inbox, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/accounts", label: "Accounts", icon: BookOpen, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/cost-centres", label: "Cost Centres", icon: Building2, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/pnl", label: "P&L Report", icon: LineChart, roles: ["owner", "bookkeeper"] },
    { href: "/handlers", label: "Food Handlers", icon: Bell, roles: ["owner", "ops_manager", "bookkeeper"] },
    { href: "/users", label: "Users", icon: Users, roles: ["owner"] },
    { href: "/audit", label: "Audit Log", icon: ShieldCheck, roles: ["owner"] },
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <img src="/logo.svg" alt="Headwaters Books" className="w-8 h-8 text-primary" />
          <span className="font-serif font-bold text-lg text-sidebar-foreground">Headwaters</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNav.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate" title={user.email}>
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize truncate">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Headwaters Books" className="w-6 h-6" />
            <span className="font-serif font-bold text-sidebar-foreground">Headwaters</span>
          </div>
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="text-sm text-muted-foreground">Sign out</button>
          </SignOutButton>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
