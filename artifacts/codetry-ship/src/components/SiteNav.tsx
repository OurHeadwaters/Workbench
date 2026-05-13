import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getStoredOwnerToken, setStoredOwnerToken } from "@/lib/api";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/home",     label: "Home" },
  { href: "/services", label: "The Work" },
  { href: "/work",     label: "Case Studies" },
  { href: "/bio",      label: "About" },
];

function isActive(path: string, location: string): boolean {
  if (path === "/") return location === "/";
  return location.startsWith(path);
}

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(() => Boolean(getStoredOwnerToken()));
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function syncAuth() {
      setAuthed(Boolean(getStoredOwnerToken()));
    }
    window.addEventListener("storage", syncAuth);
    window.addEventListener("headwaters:auth-change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("headwaters:auth-change", syncAuth);
    };
  }, []);

  const onDarkHero = location === "/";

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  const dark = onDarkHero;

  return (
    <>
      <nav
        className="sticky top-0 z-30 w-full border-b"
        style={{
          background: dark
            ? "hsl(145 36% 16%)"
            : "hsl(var(--background))",
          borderColor: dark
            ? "rgba(255,255,255,0.08)"
            : "hsl(var(--card-border))",
          transition: "background 0.2s, border-color 0.2s",
        }}
        aria-label="Site navigation"
      >
        <div className="mx-auto max-w-[64rem] px-5 sm:px-8 flex items-center justify-between h-12">

          {/* ── wordmark ── */}
          <a
            href={`${base}/`}
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="Headwaters home"
            data-testid="nav-home-link"
          >
            <img
              src={`${import.meta.env.BASE_URL}eagle-circle.png`}
              alt=""
              aria-hidden="true"
              className="w-7 h-7 opacity-90 group-hover:opacity-100 transition-opacity rounded-full"
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em] hidden sm:inline"
              style={{ color: dark ? "hsl(38 36% 86%)" : "hsl(var(--foreground))", opacity: 0.8 }}
            >
              Headwaters
            </span>
          </a>

          {/* ── desktop links ── */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href, location);
              return (
                <a
                  key={href}
                  href={`${base}${href}`}
                  className="px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                  style={{
                    color: dark
                      ? active ? "hsl(38 36% 94%)" : "rgba(235,225,210,0.60)"
                      : active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    background: active
                      ? dark ? "rgba(255,255,255,0.08)" : "hsl(var(--muted))"
                      : "transparent",
                  }}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {label}
                </a>
              );
            })}
            {authed && (
              <a
                href={`${base}/workbench`}
                className="px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                style={{
                  color: isActive("/workbench", location)
                    ? dark ? "hsl(38 36% 94%)" : "hsl(var(--foreground))"
                    : dark ? "rgba(235,225,210,0.60)" : "hsl(var(--muted-foreground))",
                  background: isActive("/workbench", location)
                    ? dark ? "rgba(255,255,255,0.08)" : "hsl(var(--muted))"
                    : "transparent",
                }}
                aria-current={isActive("/workbench", location) ? "page" : undefined}
                data-testid="nav-link-workbench"
              >
                Workbench
              </a>
            )}
            {authed ? (
              <button
                type="button"
                onClick={() => setStoredOwnerToken(null)}
                className="ml-3 px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
                style={{
                  color: dark ? "rgba(235,225,210,0.60)" : "hsl(var(--muted-foreground))",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "hsl(var(--card-border))"}`,
                }}
                data-testid="nav-sign-out"
              >
                Sign out
              </button>
            ) : (
              <>
                <a
                  href={`${base}/operator`}
                  className="px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                  style={{
                    color: isActive("/operator", location)
                      ? dark ? "hsl(38 36% 94%)" : "hsl(var(--foreground))"
                      : dark ? "rgba(235,225,210,0.60)" : "hsl(var(--muted-foreground))",
                    background: isActive("/operator", location)
                      ? dark ? "rgba(255,255,255,0.08)" : "hsl(var(--muted))"
                      : "transparent",
                  }}
                  aria-current={isActive("/operator", location) ? "page" : undefined}
                  data-testid="nav-operator"
                >
                  Operator
                </a>
                <a
                  href={`${base}/sign-on`}
                  className="ml-1 px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
                  style={{
                    background: "hsl(var(--accent))",
                    color: "hsl(var(--accent-foreground))",
                  }}
                  data-testid="nav-cta"
                >
                  Sign on
                </a>
              </>
            )}
          </div>

          {/* ── mobile hamburger ── */}
          <button
            ref={toggleRef}
            type="button"
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-sm focus:outline-none focus-visible:ring-2"
            style={{ color: dark ? "hsl(38 36% 86%)" : "hsl(var(--foreground))" }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen((o) => !o)}
            data-testid="nav-mobile-toggle"
          >
            <span
              className="block w-5 h-px rounded-full transition-all origin-center"
              style={{
                background: "currentColor",
                transform: open ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-5 h-px rounded-full transition-all"
              style={{
                background: "currentColor",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px rounded-full transition-all origin-center"
              style={{
                background: "currentColor",
                transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── mobile drawer ── */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        className="sm:hidden fixed top-12 left-0 right-0 z-20 border-b"
        style={{
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--card-border))",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.18s ease",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
        data-testid="mobile-nav-drawer"
      >
        <div className="flex flex-col px-5 py-4 gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href, location);
            return (
              <a
                key={href}
                href={`${base}${href}`}
                className="px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
                style={{
                  color: active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  background: active ? "hsl(var(--muted))" : "transparent",
                }}
                aria-current={active ? "page" : undefined}
                data-testid={`mobile-nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {label}
              </a>
            );
          })}
          {authed && (
            <a
              href={`${base}/workbench`}
              className="px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
              style={{
                color: isActive("/workbench", location) ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                background: isActive("/workbench", location) ? "hsl(var(--muted))" : "transparent",
              }}
              aria-current={isActive("/workbench", location) ? "page" : undefined}
              data-testid="mobile-nav-link-workbench"
            >
              Workbench
            </a>
          )}
          {authed ? (
            <button
              type="button"
              onClick={() => setStoredOwnerToken(null)}
              className="mt-2 px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-left transition-opacity hover:opacity-80"
              style={{
                color: "hsl(var(--muted-foreground))",
                border: "1px solid hsl(var(--card-border))",
              }}
              data-testid="mobile-nav-sign-out"
            >
              Sign out
            </button>
          ) : (
            <>
              <a
                href={`${base}/operator`}
                className="px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
                style={{
                  color: isActive("/operator", location) ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  background: isActive("/operator", location) ? "hsl(var(--muted))" : "transparent",
                }}
                aria-current={isActive("/operator", location) ? "page" : undefined}
                data-testid="mobile-nav-operator"
              >
                Operator
              </a>
              <a
                href={`${base}/sign-on`}
                className="mt-1 px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-center transition-opacity hover:opacity-90"
                style={{
                  background: "hsl(var(--accent))",
                  color: "hsl(var(--accent-foreground))",
                }}
                data-testid="mobile-nav-cta"
              >
                Sign on →
              </a>
            </>
          )}
          <div
            className="mt-3 pt-3 border-t"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <p
              className="font-mono text-[9px] uppercase tracking-[0.22em] text-center"
              style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
            >
              headwaters · dryden, ontario
            </p>
          </div>
        </div>
      </div>

      {/* drawer backdrop */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 z-10"
          style={{ background: "rgba(0,0,0,0.15)" }}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
