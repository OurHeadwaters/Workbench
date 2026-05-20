import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getStoredOwnerToken, setStoredOwnerToken } from "@/lib/api";
import { NeighbourhoodBadge } from "@workspace/zone-store";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
  desktopOnly?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/home",     label: "Home" },
  { href: "/codetry",  label: "What is Codetry?" },
  { href: "/services", label: "The Work" },
  { href: "/work",     label: "Case Studies" },
  { href: "/window",   label: "The Window" },
  { href: "/bio",      label: "About" },
  { href: "/listen",   label: "Listen" },
  { href: "/economy",  label: "Economy", desktopOnly: true },
  { href: "/odyssey",  label: "Odyssey" },
  { href: "/map",      label: "Map" },
];

const TOOLS: { icon: string; name: string; href: string; comingSoon?: boolean }[] = [
  { icon: "📖", name: "The Handbook",          href: "/codetry-handbook/" },
  { icon: "📋", name: "Practitioner's Guide",  href: "/practitioners-guide-v2/" },
  { icon: "📚", name: "The Accounts",          href: "/headwaters-books/" },
  { icon: "🔬", name: "Research Library",      href: "/library/" },
  { icon: "🖨️", name: "Print Marketing Suite", href: "/print-marketing/" },
  { icon: "🚢", name: "Crew Manifest",         href: "/" },
];

function isActive(path: string, location: string): boolean {
  if (path === "/") return location === "/";
  return location.startsWith(path);
}

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [authed, setAuthed] = useState(() => Boolean(getStoredOwnerToken()));
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);

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
    setToolsOpen(false);
    setMobileToolsOpen(false);
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

  useEffect(() => {
    if (!toolsOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setToolsOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(e.target as Node) &&
        toolsBtnRef.current &&
        !toolsBtnRef.current.contains(e.target as Node)
      ) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [toolsOpen]);

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
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`${base}/`}
              className="flex items-center gap-2.5 group"
              aria-label="Headwaters home"
              data-testid="nav-home-link"
            >
              <img
                aria-hidden="true"
                src={`${import.meta.env.BASE_URL}eagle-mark.svg`}
                alt=""
                className="opacity-90 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ width: 36, height: 30, objectFit: "contain" }}
              />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em] hidden sm:inline"
                style={{ color: dark ? "hsl(38 36% 86%)" : "hsl(var(--foreground))", opacity: 0.8 }}
              >
                Headwaters
              </span>
            </a>
            <div className="hidden sm:block">
              <NeighbourhoodBadge zoneId={5} />
            </div>
          </div>

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

            {/* ── Tools dropdown ── */}
            <div className="relative">
              <button
                ref={toolsBtnRef}
                type="button"
                onClick={() => setToolsOpen((o) => !o)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                style={{
                  color: dark
                    ? toolsOpen ? "hsl(38 36% 94%)" : "rgba(235,225,210,0.60)"
                    : toolsOpen ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  background: toolsOpen
                    ? dark ? "rgba(255,255,255,0.08)" : "hsl(var(--muted))"
                    : "transparent",
                }}
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                data-testid="nav-tools-toggle"
              >
                Tools
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    transform: toolsOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s",
                    opacity: 0.7,
                  }}
                >
                  <path d="M1 3l3.5 3L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {toolsOpen && (
                <div
                  ref={toolsDropdownRef}
                  className="absolute right-0 top-full mt-1 rounded-md border shadow-lg py-1 z-50"
                  style={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--card-border))",
                    minWidth: "220px",
                  }}
                  role="menu"
                  data-testid="nav-tools-dropdown"
                >
                  {TOOLS.map(({ icon, name, href, comingSoon }) => (
                    <a
                      key={name}
                      href={comingSoon ? undefined : href}
                      className={`flex items-center gap-2.5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${comingSoon ? "cursor-default opacity-50" : "hover:bg-muted"}`}
                      style={{ color: "hsl(var(--foreground))" }}
                      role="menuitem"
                      aria-disabled={comingSoon}
                      data-testid={`nav-tool-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      <span className="text-base leading-none shrink-0">{icon}</span>
                      <span className="flex-1">{name}</span>
                      {comingSoon && (
                        <span
                          className="font-mono text-[8px] uppercase tracking-[0.12em] rounded-sm px-1.5 py-0.5"
                          style={{ background: "hsl(var(--card-border))", color: "hsl(var(--muted-foreground))" }}
                        >
                          Soon
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

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
            ) : null}
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
          {NAV_LINKS.filter((l) => !l.desktopOnly).map(({ href, label }) => {
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

          {/* ── Tools section in mobile drawer ── */}
          <div
            className="mt-1 rounded-sm border overflow-hidden"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <button
              type="button"
              onClick={() => setMobileToolsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
              aria-expanded={mobileToolsOpen}
              data-testid="mobile-nav-tools-toggle"
            >
              Tools
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                aria-hidden="true"
                style={{
                  transform: mobileToolsOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                  opacity: 0.6,
                }}
              >
                <path d="M1 3l3.5 3L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileToolsOpen && (
              <div
                className="border-t"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                {TOOLS.map(({ icon, name, href, comingSoon }) => (
                  <a
                    key={name}
                    href={comingSoon ? undefined : href}
                    className={`flex items-center gap-2.5 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${comingSoon ? "cursor-default opacity-50" : "hover:bg-muted"}`}
                    style={{ color: "hsl(var(--foreground))" }}
                    aria-disabled={comingSoon}
                    data-testid={`mobile-nav-tool-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    <span className="text-base leading-none shrink-0">{icon}</span>
                    <span className="flex-1">{name}</span>
                    {comingSoon && (
                      <span
                        className="font-mono text-[8px] uppercase tracking-[0.12em] rounded-sm px-1.5 py-0.5"
                        style={{ background: "hsl(var(--card-border))", color: "hsl(var(--muted-foreground))" }}
                      >
                        Soon
                      </span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

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
          ) : null}
          <div
            className="mt-3 pt-3 border-t flex flex-col items-center gap-2"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <NeighbourhoodBadge zoneId={5} />
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
