import { useLocation } from "wouter";
import { ELEMENT_MAP } from "@/data/forgeData";
import { getFaction } from "@/lib/forgeStorage";
import { GordGuide } from "@/components/forge/GordGuide";

type NavPage = "modules" | "forge" | "great-hall" | "library" | "progress" | "faction" | "battle-feed" | "shallows";

export function ForgeNav({ active }: { active: NavPage }) {
  const [, navigate] = useLocation();
  const faction = getFaction();
  const factionEl = faction ? ELEMENT_MAP[faction] : null;

  const links: { id: NavPage; label: string; path: string }[] = [
    { id: "modules", label: "Modules", path: "/forge/modules" },
    { id: "forge", label: "The Forge", path: "/forge/build" },
    { id: "great-hall", label: "Hall", path: "/forge/great-hall" },
    { id: "library", label: "Library", path: "/forge/library" },
    { id: "progress", label: "Progress", path: "/forge/progress" },
    { id: "battle-feed", label: "Battle Feed", path: "/forge/battle-feed" },
    { id: "shallows", label: "The Shallows", path: "/forge/shallows" },
  ];

  return (
    <>
    <nav
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        paddingLeft: 12,
        paddingRight: 8,
        display: "flex",
        alignItems: "center",
        gap: 0,
        overflowX: "auto",
        overflowY: "hidden",
        height: 48,
        flexShrink: 0,
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      } as React.CSSProperties}
    >
      <style>{`.forge-nav::-webkit-scrollbar { display: none; }`}</style>

      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 12px 0 0",
          display: "flex",
          alignItems: "center",
          gap: 5,
          borderRight: "1px solid rgba(255,255,255,0.1)",
          marginRight: 4,
          flexShrink: 0,
          minHeight: 44,
          minWidth: 44,
        }}
        title="Back to Hub"
      >
        <span
          style={{
            fontSize: 17,
            filter: factionEl ? `drop-shadow(0 0 4px ${factionEl.color})` : "none",
          }}
        >
          {factionEl ? factionEl.emoji : "⚒"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "var(--forge-light)",
            whiteSpace: "nowrap",
            display: "var(--cc-title-display, inline)" as string,
          }}
        >
          Crypto Castle
        </span>
      </button>

      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => navigate(link.path)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 10px",
            height: "100%",
            fontSize: "0.78rem",
            fontWeight: active === link.id ? 700 : 400,
            color: active === link.id ? "var(--forge-orange)" : "var(--forge-muted)",
            borderBottom: active === link.id
              ? "2px solid var(--forge-orange)"
              : "2px solid transparent",
            transition: "color 0.15s",
            flexShrink: 0,
            fontFamily: "var(--font-sans)",
            minHeight: 44,
            minWidth: 44,
            whiteSpace: "nowrap",
          }}
        >
          {link.label}
        </button>
      ))}
    </nav>
    <GordGuide />
    </>
  );
}
