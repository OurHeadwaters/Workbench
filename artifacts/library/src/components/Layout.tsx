import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AlertTriangle, BookOpen, Users, FolderOpen, Tag, Link as LinkIcon, CheckCircle2, Home, LogOut, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/entries", label: "Library", icon: BookOpen },
  { href: "/needs-review", label: "Review Queue", icon: CheckCircle2 },
  { href: "/producers", label: "Producers", icon: Users },
  { href: "/buckets", label: "Project Buckets", icon: FolderOpen },
  { href: "/subjects", label: "Subjects", icon: Tag },
  { href: "/why-stores-fail", label: "Why Stores Fail", icon: AlertTriangle },
  { href: "/phenomena", label: "Phenomena", icon: Network },
  { href: "/contributors", label: "Contributors", icon: Users },
  { href: "/share-links", label: "Share Links", icon: LinkIcon },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useOwnerAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      <aside className="w-full md:w-64 lg:w-72 border-r border-border bg-sidebar shrink-0 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/">
            <h1 className="font-serif text-xl font-bold text-sidebar-primary leading-tight tracking-tight cursor-pointer hover:text-sidebar-foreground transition-colors">
              Northern Food Systems <br />
              <span className="text-muted-foreground font-sans text-sm font-normal tracking-normal mt-1 block">
                Research Library
              </span>
            </h1>
          </Link>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            data-testid="button-owner-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
          <p className="mt-3 px-1 text-[11px] italic leading-snug text-muted-foreground">
            A Headwaters project — We've always known how to fix it, now we can.
          </p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <div className="max-w-6xl mx-auto w-full p-4 md:p-8 lg:p-12 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
