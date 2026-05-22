import { useState, useEffect, useRef, useCallback } from "react";
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
  { icon: "🚢", name: "Crew Manifest",         href: "/", comingSoon: true },
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
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const toolItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

    toolItemRefs.current[0]?.focus();

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
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [toolsOpen]);

  const handleToolsMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const items = toolItemRefs.current.filter(Boolean) as HTMLAnchorElement[];
      const current = document.activeElement as HTMLElement;
      const idx = items.indexOf(current as HTMLAnchorElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % items.length;
        items[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + items.length) % items.length;
        items[prev]?.focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setToolsOpen(false);
        toolsBtnRef.current?.focus();
      } else if (e.key === "Tab") {
        setToolsOpen(false);
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    },
    []
  );

  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  const dark = onDarkHero;

  const navBg = dark
    ? scrolled
      ? "rgba(10,20,15,0.96)"
      : "rgba(10,20,15,0.82)"
    : "hsl(var(--background))";

  const navBorder = dark
    ? scrolled
      ? "rgba(212,160,23,0.18)"
      : "rgba(255,255,255,0.06)"
    : "hsl(var(--card-border))";

  return (
    <>
      <nav
        className="sticky top-0 z-30 w-full border-b"
        style={{
          background: navBg,
          borderColor: navBorder,
          backdropFilter: dark ? "blur(12px)" : undefined,
          WebkitBackdropFilter: dark ? "blur(12px)" : undefined,
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: scrolled
            ? dark
              ? "0 2px 20px rgba(0,0,0,0.5)"
              : "0 2px 12px rgba(10,22,14,0.08)"
            : "none",
        }}
        aria-label="Site navigation"
      >
        <div className="mx-auto max-w-[64rem] px-5 sm:px-8 flex items-center justify-between h-12">

          {/* ── wordmark / trail marker ── */}
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
                className="opacity-85 group-hover:opacity-100 transition-all duration-200 shrink-0"
                style={{
                  width: 36, height: 30, objectFit: "contain",
                  filter: dark ? "brightness(1.1)" : "none",
                }}
              />
              <span
                className="font-serif text-[13px] hidden sm:inline tracking-wide"
                style={{
                  color: dark ? "rgba(244,237,224,0.88)" : "hsl(var(--foreground))",
                  fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}
              >
                Headwaters
              </span>
            </a>
            <div className="hidden sm:block">
              <NeighbourhoodBadge zoneId={5} />
            </div>
          </div>

          {/* ── desktop trail-marker links ── */}
          <div className="hidden sm:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href, location);
              return (
                <a
                  key={href}
                  href={`${base}${href}`}
                  className="trail-nav-link"
                  style={{
                    color: dark
                      ? active ? "#d4a017" : "rgba(244,237,224,0.58)"
                      : active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  }}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {label}
                </a>
              );
            })}

            {/* ── Tools dropdown — textured panel ── */}
            <div className="relative">
              <button
                ref={toolsBtnRef}
                type="button"
                onClick={() => setToolsOpen((o) => !o)}
                className="trail-nav-link flex items-center gap-1"
                style={{
                  color: dark
                    ? toolsOpen ? "#d4a017" : "rgba(244,237,224,0.58)"
                    : toolsOpen ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-haspopup="menu"
                aria-expanded={toolsOpen}
                aria-controls="tools-menu"
                data-testid="nav-tools-toggle"
              >
                Tools
                <svg
                  width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"
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
                  id="tools-menu"
                  ref={toolsDropdownRef}
                  className="absolute right-0 top-full mt-2 rounded-md border shadow-xl py-1.5 z-50"
                  style={{
                    background: dark ? "rgba(10,20,15,0.97)" : "hsl(var(--background))",
                    borderColor: dark ? "rgba(212,160,23,0.22)" : "hsl(var(--card-border))",
                    minWidth: "230px",
                    backdropFilter: "blur(16px)",
                    boxShadow: dark
                      ? "0 12px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,160,23,0.08)"
                      : "0 8px 24px rgba(10,22,14,0.12)",
                  }}
                  role="menu"
                  aria-label={`Tools menu, ${TOOLS.length} items`}
                  onKeyDown={handleToolsMenuKeyDown}
                  data-testid="nav-tools-dropdown"
                >
                  <p
                    className="px-4 pt-1 pb-2 font-mono text-[8px] uppercase tracking-[0.22em]"
                    style={{ color: dark ? "rgba(212,160,23,0.55)" : "hsl(var(--muted-foreground))", opacity: 0.8 }}
                  >
                    Knowledge Lodge
                  </p>
                  {TOOLS.map(({ icon, name, href, comingSoon }, i) => (
                    <a
                      key={name}
                      ref={(el) => { toolItemRefs.current[i] = el; }}
                      href={comingSoon ? undefined : href}
                      className={`flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all ${comingSoon ? "cursor-default opacity-40" : ""}`}
                      style={{
                        color: dark ? "rgba(244,237,224,0.82)" : "hsl(var(--foreground))",
                        borderLeft: "2px solid transparent",
                      }}
                      role="menuitem"
                      aria-disabled={comingSoon ? true : undefined}
                      tabIndex={-1}
                      onClick={comingSoon ? (e) => e.preventDefault() : undefined}
                      onMouseEnter={(e) => {
                        if (!comingSoon) {
                          (e.currentTarget as HTMLElement).style.borderLeftColor = "#d4a017";
                          (e.currentTarget as HTMLElement).style.color = dark ? "#f4ede0" : "hsl(var(--foreground))";
                          (e.currentTarget as HTMLElement).style.background = dark ? "rgba(212,160,23,0.06)" : "hsl(var(--muted))";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
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
                className="trail-nav-link"
                style={{
                  color: isActive("/workbench", location)
                    ? dark ? "#d4a017" : "hsl(var(--foreground))"
                    : dark ? "rgba(244,237,224,0.58)" : "hsl(var(--muted-foreground))",
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
                className="ml-2 btn-plaque text-[9px] py-1.5 px-3"
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
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-sm focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{ color: dark ? "rgba(244,237,224,0.88)" : "hsl(var(--foreground))" }}
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
          background: dark ? "rgba(10,20,15,0.97)" : "hsl(var(--background))",
          borderColor: dark ? "rgba(212,160,23,0.18)" : "hsl(var(--card-border))",
          backdropFilter: "blur(16px)",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.22s ease",
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
                className="px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors border-l-2"
                style={{
                  color: active
                    ? dark ? "#d4a017" : "hsl(var(--foreground))"
                    : dark ? "rgba(244,237,224,0.65)" : "hsl(var(--muted-foreground))",
                  borderLeftColor: active ? "#d4a017" : "transparent",
                  background: active ? "rgba(212,160,23,0.06)" : "transparent",
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
            style={{ borderColor: dark ? "rgba(212,160,23,0.18)" : "hsl(var(--card-border))" }}
          >
            <button
              type="button"
              onClick={() => setMobileToolsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
              style={{ color: dark ? "rgba(244,237,224,0.65)" : "hsl(var(--muted-foreground))" }}
              aria-haspopup="menu"
              aria-expanded={mobileToolsOpen}
              aria-controls="mobile-tools-menu"
              data-testid="mobile-nav-tools-toggle"
            >
              Tools — Knowledge Lodge
              <svg
                width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"
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
                id="mobile-tools-menu"
                role="menu"
                aria-label={`Tools menu, ${TOOLS.length} items`}
                className="border-t"
                style={{ borderColor: dark ? "rgba(212,160,23,0.12)" : "hsl(var(--card-border))" }}
              >
                {TOOLS.map(({ icon, name, href, comingSoon }) => (
                  <a
                    key={name}
                    href={comingSoon ? undefined : href}
                    className={`flex items-center gap-3 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors border-l-2 ${comingSoon ? "cursor-default opacity-40" : ""}`}
                    style={{
                      color: dark ? "rgba(244,237,224,0.75)" : "hsl(var(--foreground))",
                      borderLeftColor: "transparent",
                    }}
                    role="menuitem"
                    aria-disabled={comingSoon ? true : undefined}
                    onClick={comingSoon ? (e) => e.preventDefault() : undefined}
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
              className="px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors border-l-2"
              style={{
                color: isActive("/workbench", location)
                  ? dark ? "#d4a017" : "hsl(var(--foreground))"
                  : dark ? "rgba(244,237,224,0.65)" : "hsl(var(--muted-foreground))",
                borderLeftColor: isActive("/workbench", location) ? "#d4a017" : "transparent",
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
              className="mt-2 btn-plaque w-full justify-center"
              data-testid="mobile-nav-sign-out"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
