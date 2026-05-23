import { useLocation } from "wouter";
import { ELEMENT_MAP } from "@/data/forgeData";
import { getFaction } from "@/lib/forgeStorage";

type NavPage = "modules" | "forge" | "great-hall" | "library" | "progress" | "faction";

export function ForgeNav({ active }: { active: NavPage }) {
  const [, navigate] = useLocation();
  const faction = getFaction();
  const factionEl = faction ? ELEMENT_MAP[faction] : null;

  const links: { id: NavPage; label: string; path: string }[] = [
    { id: "modules", label: "Modules", path: "/forge/modules" },
    { id: "forge", label: "The Forge", path: "/forge/build" },
    { id: "great-hall", label: "Great Hall", path: "/forge/great-hall" },
    { id: "library", label: "Library", path: "/forge/library" },
    { id: "progress", label: "Progress", path: "/forge/progress" },
  ];

  return (
    <nav
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 0,
        overflowX: "auto",
        height: 52,
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 16px 0 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          marginRight: 8,
          flexShrink: 0,
          minHeight: 44,
        }}
        title="Back to Hub"
      >
        {factionEl ? (
          <span
            style={{ fontSize: 18, filter: `drop-shadow(0 0 4px ${factionEl.color})` }}
          >
            {factionEl.emoji}
          </span>
        ) : (
          <span style={{ fontSize: 16 }}>⚒</span>
        )}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "0.82rem",
            color: "var(--forge-light)",
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
            padding: "0 14px",
            height: "100%",
            fontSize: "0.82rem",
            fontWeight: active === link.id ? 700 : 500,
            color: active === link.id ? "var(--forge-orange)" : "var(--forge-muted)",
            borderBottom: active === link.id ? "2px solid var(--forge-orange)" : "2px solid transparent",
            transition: "color 0.15s",
            flexShrink: 0,
            fontFamily: "var(--font-sans)",
            minHeight: 44,
          }}
        >
          {link.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <button
        onClick={() => navigate("/forge")}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          cursor: "pointer",
          padding: "4px 12px",
          fontSize: "0.75rem",
          color: "var(--forge-muted)",
          flexShrink: 0,
          fontFamily: "var(--font-sans)",
          minHeight: 36,
        }}
        title="Change faction"
      >
        Change Faction
      </button>
    </nav>
  );
}
