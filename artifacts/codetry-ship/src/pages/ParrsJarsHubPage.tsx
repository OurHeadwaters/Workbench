import React, { useState, useCallback, useEffect } from "react";
import { useKitAccess } from "@/lib/useKitAccess";
import { getVisitedHandouts, markHandoutVisited, getVisitedModules, markModuleVisited, syncKitProgress } from "@/lib/kitTokens";
import getStartedImg from "@assets/IMG_1184_1780775510410.PNG";
import foodAuditImg from "@assets/IMG_1130_1780775510411.PNG";
import inPersonChecklistImg from "@assets/IMG_1187_1780775510410.PNG";
import tipsImg from "@assets/IMG_1188_1780775510410.PNG";
import valueAddedMealsImg from "@assets/IMG_1196_1780775510410.PNG";
import ratiosImg from "@assets/IMG_1197_1780775510410.PNG";
import cheatSheetsOverviewImg from "@assets/IMG_1198_1780775510410.PNG";

import waterbathIntroImg from "@assets/IMG-1950_1780775540401.PNG";
import waterbathProcessImg from "@assets/IMG-1949_1780775540402.PNG";
import waterbathCheatSheetImg from "@assets/IMG-1952_1780775540401.PNG";
import waterbathRecipesImg from "@assets/IMG-1956_1780775540401.PNG";
import waterbathStationsImg from "@assets/IMG-1957_1780775540401.PNG";
import waterbathOverviewImg from "@assets/IMG-1948_1780775540402.PNG";
import processTheProcessWBImg from "@assets/IMG-1947_1780775540402.PNG";

import pressureIntroImg from "@assets/IMG_2158_1780775510409.PNG";
import pressureCanningImg from "@assets/IMG_2159_1780775510409.PNG";
import pressureProcessImg from "@assets/IMG_2160_1780775510409.PNG";
import pressureTimesImg from "@assets/IMG_2161_1780775510408.PNG";
import pressureDiagramImg from "@assets/IMG_2162_1780775510408.PNG";
import pressureDeeperImg from "@assets/IMG_2163_1780775510408.PNG";

import cookingWithPreservesImg from "@assets/IMG_3081_1780775510405.PNG";
import localGotosImg from "@assets/IMG_3104_1780775510407.PNG";
import justAddH2OImg from "@assets/IMG_3105_1780775510407.PNG";
import nowForTheFunImg from "@assets/IMG_3083_1780775510407.PNG";
import fallHarvestImg from "@assets/IMG_3107_1780775540402.PNG";
import freezerPrepImg from "@assets/IMG_3080_1780775540402.PNG";

const FOREST = "#1f3d2e";
const RUST = "#b85a3e";
const GOLD = "#c89a2e";
const MUTED = "#6b6b5e";
const CREAM = "#f4ede0";
const INK = "#2c2c2c";

type HandoutItem = {
  title: string;
  img: string;
  desc: string;
};

type Module = {
  id: string;
  color: string;
  label: string;
  title: string;
  intro: string;
  handouts: HandoutItem[];
};

const MODULES: Module[] = [
  {
    id: "foundation",
    color: FOREST,
    label: "Foundation",
    title: "The System",
    intro: "Start here. These are the worksheets and frameworks that run underneath every method — how to think about what you eat, what you store, and what you're building toward.",
    handouts: [
      { title: "Get Started", img: getStartedImg, desc: "Start where you are. Use what you have. Do what you can. The three rules and a method for figuring out your seasonal foods, preferences, and best preservation approach." },
      { title: "Eat What You Store & Store What You Eat", img: foodAuditImg, desc: "Food audit worksheet. Track food items and household consumption levels — the foundation of a pantry that isn't just storage." },
      { title: "In-Person Checklist", img: inPersonChecklistImg, desc: "Pre-workshop readiness: tracked foods, food safety basics, knowing what you want to get out of the series, signed waiver." },
      { title: "Tips & FAQ", img: tipsImg, desc: "\"I've got too much ____ at once.\" \"What are some good recipes?\" \"Can I reuse canning lids?\" Common questions, pointed answers, and where to go next." },
      { title: "Value-Added Meals", img: valueAddedMealsImg, desc: "Planning & meal sheets, freezer meals, dairy & desserts, using pantry preps, adding nutrition, stretching ingredients. The six areas of a pantry-powered kitchen." },
      { title: "Ratios Cheat Sheet", img: ratiosImg, desc: "Pickles 1:1 (vinegar:H2O). Ferments (tbsp salt:cup H2O). Water levels in canning pot. The numbers that matter, on one page." },
      { title: "Cheat Sheets Overview", img: cheatSheetsOverviewImg, desc: "Index of all cheat sheets: blanching, safe ratios, best methods, freezing vs dehydrating, canning, fermenting. Bonus: food audit sheets, tips, FAQ, recipes, meal inspirations." },
    ],
  },
  {
    id: "waterbath",
    color: RUST,
    label: "Module 1",
    title: "Water-Bath Canning",
    intro: "High-acid foods: pickles, relishes, jams, tomato recipes, fruit, sauces. If the pH is below 4.6, this is your method. September 6, 2022.",
    handouts: [
      { title: "Introduction & Safe Practices", img: waterbathIntroImg, desc: "Sanitization, knife handling, water-bath canning process. Hot pack jars. Under 4.6 pH. Have first aid handy. Start with a vinegar and salt brine." },
      { title: "Water-Bath Canning Overview", img: waterbathOverviewImg, desc: "What to water-bath can: fruit & jams (applesauce, pie filling), sauces (BBQ, vinaigrette, salsa), pickles & relish (cucumbers, carrots, beets, garlic, eggs). Use trusted recipes." },
      { title: "Process Diagram — Water-Bath", img: waterbathProcessImg, desc: "Full circular process: sterilize → fill jars → fill pot → boil → listen for the pop → remove rings for storage → check seal. Equipment list. September 6, 2022." },
      { title: "Process the Process — Water-Bath", img: processTheProcessWBImg, desc: "Benefits, tips, remember. Role of acidity. Add a grape leaf for crisper pickles. Start with hot jars. Submerge with 1\" overtop. Use bottled lemon juice." },
      { title: "Canning Cheat Sheet (Waterbath or Pressure)", img: waterbathCheatSheetImg, desc: "Low pH = high acid = water-bath. High pH = low acid = pressure. Visual decision guide. Botulism explained. \"Don't make huge batches until you've tried the recipe canned and aged.\"" },
      { title: "Waterbath Recipes", img: waterbathRecipesImg, desc: "Pickles brine (8c vinegar, 8c water, pickling salt, peppercorns, garlic, dill). Salsa (30 tomatoes). Canned tomatoes (add citric acid, bottled lemon juice, or vinegar per quart)." },
      { title: "Stages & Stations — Water-Bath", img: waterbathStationsImg, desc: "First: sanitize counters, jars & lids. Stage 1: wash & prep, make brine & salsa, fill jars hot. Stage 2: start canners, wipe rims, de-bubble, submerge & boil. Approved recipes." },
    ],
  },
  {
    id: "pressure",
    color: "#444",
    label: "Module 2",
    title: "Pressure Canning",
    intro: "Low-acid foods — meat, broth, vegetables, potatoes, fish. Botulism thrives in low-acid, low-oxygen environments. Only sustained high pressure eliminates it. September 20, 2022.",
    handouts: [
      { title: "Introduction & Safe Practices — Pressure", img: pressureIntroImg, desc: "Canner maintenance (check valve's clear, seal intact for Presto, rack on bottom). Elevation (use 15lb weight). Pressure canning process: know food timing, slowly cool down, boil coming out." },
      { title: "Pressure Canning Overview", img: pressureCanningImg, desc: "What to pressure can: meat & fish (beef, wild game, pork, chicken, walleye, jack fish, salmon, sucker fish), vegetables (potatoes, green beans, greens, corn, carrots, pumpkin chunks). DO NOT CAN: flour or dairy." },
      { title: "Process the Process — Pressure Canning", img: pressureProcessImg, desc: "Benefits, tips, remember. Role of pressure. Watch the gauge closely. Raw pack or hot pack is preference. Leave 1/2\"–1\" headspace. Use new lids. Reference: nchfp.uga.edu." },
      { title: "Times for Common Items", img: pressureTimesImg, desc: "Times start when stable 15lb pressure is achieved. Meat & poultry: 75/90 min. Fish: 100 min. Potatoes: 35/40. Green beans: 20/25. Carrots: 25/30. Corn: 55/85. Equipment list." },
      { title: "Process Diagram — Pressure Canning", img: pressureDiagramImg, desc: "Rinse jars → fill with hot food → release air bubbles → wipe rim → seal fingertip tight → add hot water to pot → boil without weight 10 min → add 15lb weight → watch pressure → cool naturally." },
      { title: "Pressure Canning Deeper Dive", img: pressureDeeperImg, desc: "Seeing liquid loss? Removed jars too quickly, or pressure fluctuated. Can I eat it from the jar? Checklist: USDA guidelines followed, gauge accurate, sealed lid, no leaks, no off odors, no mold." },
    ],
  },
  {
    id: "blanching",
    color: GOLD,
    label: "Module 3",
    title: "Blanching, Freezing & Dehydrating",
    intro: "The methods that happen before the jar — or instead of the jar. Blanching protects colour and nutrition. Freezing and dehydrating serve different purposes. Know which to use when.",
    handouts: [
      { title: "Now for the Fun — Freeze Dry & Dry Can", img: nowForTheFunImg, desc: "Roasting spaghetti squash to freeze dry. Dry canning french fries. Take home: a jar of freeze-dried spaghetti squash and a dry-canned jar of fries for the air fryer or oven." },
      { title: "Freezer Prep Ideas", img: freezerPrepImg, desc: "Crockpot & instant pot meals (casserole dishes, gallon bags). Double batch casseroles, frittatas & pizzas. Odds & ends in foil, silicone bags, or beeswax wraps. Wide-mouth jars (don't tighten lids)." },
    ],
  },
  {
    id: "cooking",
    color: FOREST,
    label: "Module 4",
    title: "Cooking With What You Store",
    intro: "The whole point. A pantry that feeds you — not a collection of jars you're afraid to open. These resources show how to use what you've preserved through all four seasons.",
    handouts: [
      { title: "Cooking With Preserves", img: cookingWithPreservesImg, desc: "Canned meat: soups, stews, creamy pasta, stir fry, lettuce wraps, quesadillas. Canned tomatoes: salsa, chili, pizza sauce. Canned potatoes: mashed, shepherd's pie, fried camp potatoes. Frozen beans & carrots: dilly veggies, stir fry, cheese sauce." },
      { title: "Local Go-To's", img: localGotosImg, desc: "Dill pickle potato salad (Thunder Oak garden herb Gouda). Bannock tacos (Brule Creek mix, zucchini instead of butter). Pan stew. Lettuce wraps. Steak & eggs. Skinny squash (pesto, cheese, tomatoes). Garden pizza. Seasonal soup." },
      { title: "Just Add H2O", img: justAddH2OImg, desc: "Make-ahead just-add-water meals: mushroom rice, beef taco rice, creamy pasta. Freeze-dried spaghetti squash instead of rice or pasta. Instant pot soups. Pre-measured baking and drink mixes. Convenience food to be proud of." },
      { title: "Fall Harvest Salad", img: fallHarvestImg, desc: "Pie pumpkin + lettuce + microgreens + apple + pomegranate seeds + feta + sweet seeds. Apple cider vinaigrette. Roast pumpkin at 400°F for 30 minutes. A full recipe from the seasonal collection." },
    ],
  },
];

function HandoutCard({
  handout,
  visited,
  onVisit,
  accentColor,
}: {
  handout: HandoutItem;
  visited: boolean;
  onVisit: () => void;
  accentColor: string;
}) {
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
    if (!visited) onVisit();
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: visited
          ? `0 0 0 2px ${accentColor}33, 0 1px 3px rgba(31,61,46,0.08)`
          : "0 1px 3px rgba(31,61,46,0.08)",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
        position: "relative",
      }}
      onClick={handleClick}
    >
      {/* Visited badge */}
      {visited && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: accentColor,
            color: "white",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            zIndex: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          }}
          title="Reviewed"
        >
          ✓
        </div>
      )}
      <div style={{ position: "relative", paddingBottom: "70%", overflow: "hidden", background: CREAM }}>
        <img
          src={handout.img}
          alt={handout.title}
          style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>
      <div style={{ padding: "0.9rem 1rem" }}>
        <h4
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "0.92rem",
            fontWeight: 800,
            color: visited ? accentColor : INK,
            marginBottom: open ? "0.5rem" : 0,
            lineHeight: 1.3,
          }}
        >
          {handout.title}
        </h4>
        {open && (
          <p style={{ fontSize: "0.76rem", color: MUTED, lineHeight: 1.6, margin: 0 }}>
            {handout.desc}
          </p>
        )}
        <p style={{ fontSize: "0.65rem", color: visited ? accentColor : "#bbb", margin: open ? "0.5rem 0 0" : "0.2rem 0 0", textTransform: "uppercase", letterSpacing: "0.08em", opacity: visited ? 0.75 : 1 }}>
          {visited ? (open ? "Reviewed · Tap to collapse" : "Reviewed · Tap to read more") : (open ? "Tap to collapse" : "Tap to read more")}
        </p>
      </div>
    </div>
  );
}

const PJ_SOLUTIONS_KIT_ID = "pj-solutions-kit";

function LockedWall({ reason }: { reason?: "expired" } = {}) {
  const isExpired = reason === "expired";
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#141414",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            display: "inline-flex",
            border: "2px solid #333",
            borderRadius: "50%",
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            flexDirection: "column",
          }}
        >
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "0.8rem", fontWeight: 700, color: "white", lineHeight: 1.1 }}>parr's</span>
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "0.8rem", fontWeight: 700, color: "white", lineHeight: 1.1 }}>jars</span>
        </div>
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          PJ Solutions Kit · Buyers Only
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "white",
            marginBottom: "0.75rem",
          }}
        >
          {isExpired
            ? "Your access link has expired."
            : "Your resource hub is one purchase away."}
        </h1>
        <p
          style={{
            color: "#aaa",
            lineHeight: 1.7,
            fontSize: "0.9rem",
            marginBottom: "2rem",
            maxWidth: 420,
            margin: "0 auto 2rem",
          }}
        >
          {isExpired
            ? "Your PJ Solutions Kit access link has expired. Re-send it to your email to get back in."
            : "The Principles to Preservation hub — all 5 modules and 20+ handouts — is available to PJ Solutions Kit buyers. Purchase the kit to get instant access."}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          {isExpired ? (
            <a
              href="/kits/resend"
              style={{
                display: "inline-block",
                background: RUST,
                color: "white",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.04em",
                padding: "0.85rem 2rem",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Re-send my access link →
            </a>
          ) : (
            <>
              <a
                href="/parrsjars/kit"
                style={{
                  display: "inline-block",
                  background: RUST,
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                  padding: "0.85rem 2rem",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Get the PJ Solutions Kit — $97 CAD →
              </a>
              <a
                href="/kits/resend"
                style={{ fontSize: "0.8rem", color: MUTED, textDecoration: "none" }}
              >
                Already purchased? Re-send your access link →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParrsJarsHubPage() {
  const { status, storedToken, serverProgress } = useKitAccess(PJ_SOLUTIONS_KIT_ID);
  const [activeModule, setActiveModule] = useState<string>("foundation");
  const [visitedHandouts, setVisitedHandouts] = useState<Set<string>>(new Set());
  const [visitedTitles, setVisitedTitles] = useState<Set<string>>(new Set());

  // Seed visited state from the union of localStorage and server-side progress.
  // Server progress arrives after the token validates, so this effect fires once
  // serverProgress is non-null.  Using the union means items seen on any device
  // or browser are always reflected here.
  useEffect(() => {
    if (!storedToken || serverProgress === null) return;
    const token = storedToken.token;

    // Handouts: union of localStorage + server
    const localHandouts = getVisitedHandouts(token);
    const merged = new Set([...localHandouts, ...serverProgress.visitedHandouts]);
    setVisitedHandouts(merged);
    // Write merged back to localStorage so the server data is persisted locally too
    merged.forEach((key) => markHandoutVisited(token, key));

    // Modules: union of localStorage + server
    const localModules = getVisitedModules(token);
    const mergedModules = new Set([...localModules, ...serverProgress.visitedModules]);
    setVisitedTitles(mergedModules);
    mergedModules.forEach((title) => markModuleVisited(token, title));
  }, [storedToken, serverProgress]);

  const handleModuleSwitch = useCallback(
    (moduleId: string) => {
      setActiveModule(moduleId);
      if (!storedToken) return;
      const mod = MODULES.find((m) => m.id === moduleId);
      if (!mod) return;
      markModuleVisited(storedToken.token, mod.title);
      setVisitedTitles((prev) => new Set([...prev, mod.title]));
      syncKitProgress(storedToken.token, { visitedModules: [mod.title] });
    },
    [storedToken]
  );

  // Mark the initial active module as visited on first load (handleModuleSwitch
  // is not called on mount, only on tab clicks)
  useEffect(() => {
    if (status !== "valid" || !storedToken) return;
    const mod = MODULES.find((m) => m.id === activeModule);
    if (!mod) return;
    markModuleVisited(storedToken.token, mod.title);
    setVisitedTitles((prev) => {
      if (prev.has(mod.title)) return prev;
      return new Set([...prev, mod.title]);
    });
    syncKitProgress(storedToken.token, { visitedModules: [mod.title] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, storedToken]); // intentionally only on mount/token-ready, not every switch

  const handleVisit = useCallback(
    (handoutKey: string) => {
      if (!storedToken) return;
      markHandoutVisited(storedToken.token, handoutKey);
      setVisitedHandouts((prev) => new Set([...prev, handoutKey]));
      syncKitProgress(storedToken.token, { visitedHandouts: [handoutKey] });
    },
    [storedToken]
  );

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          fontSize: "0.9rem",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
        }}
      >
        Checking access…
      </div>
    );
  }

  if (status === "expired") {
    return <LockedWall reason="expired" />;
  }

  if (status !== "valid") {
    return <LockedWall />;
  }

  const current = MODULES.find((m) => m.id === activeModule) ?? MODULES[0];

  const anyVisited = visitedTitles.size > 0;
  const allVisited = anyVisited && MODULES.every((m) => visitedTitles.has(m.title));
  const nextUnvisited = allVisited
    ? null
    : MODULES.find((m) => !visitedTitles.has(m.title)) ?? null;

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "var(--font-sans, Inter, sans-serif)" }}>

      {/* Header */}
      <div
        style={{
          background: INK,
          padding: "2rem 1.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            border: "2px solid #444",
            borderRadius: "50%",
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            flexDirection: "column",
          }}
        >
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "0.8rem", fontWeight: 700, color: "white", lineHeight: 1.1 }}>parr's</span>
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "0.8rem", fontWeight: 700, color: "white", lineHeight: 1.1 }}>jars</span>
        </div>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: "0.4rem" }}>
          Parr's Jars · Resource Hub
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.15,
            marginBottom: "0.5rem",
          }}
        >
          Principles to Preservation
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.82rem", maxWidth: 480, margin: "0 auto" }}>
          All your workshop handouts organized by module. Tap any card to read more about what's on it.
        </p>
      </div>

      {/* Jump back in banner */}
      {status === "valid" && anyVisited && (
        <div
          style={{
            background: allVisited ? FOREST : "#fff8ee",
            borderBottom: allVisited ? "none" : `1px solid #e8d8b8`,
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.95rem" }}>{allVisited ? "✓" : "↩"}</span>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: allVisited ? "#c4d9c8" : MUTED,
              }}
            >
              {allVisited
                ? "You've been through all 5 modules"
                : `Jump back in — continue with:`}
            </span>
            {!allVisited && nextUnvisited && (
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: nextUnvisited.color,
                }}
              >
                {nextUnvisited.title}
              </span>
            )}
          </div>
          {!allVisited && nextUnvisited && (
            <button
              onClick={() => handleModuleSwitch(nextUnvisited.id)}
              style={{
                flexShrink: 0,
                background: nextUnvisited.color,
                color: "white",
                border: "none",
                borderRadius: 5,
                padding: "0.4rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              Go →
            </button>
          )}
        </div>
      )}

      {/* Module nav */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e5ddd0",
          overflowX: "auto",
          display: "flex",
          gap: 0,
        }}
      >
        {MODULES.map((mod) => {
          const total = mod.handouts.length;
          const done = mod.handouts.filter((h) =>
            visitedHandouts.has(`${mod.id}:${h.title}`)
          ).length;
          const allDone = done === total;
          const moduleVisited = visitedTitles.has(mod.title);
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => handleModuleSwitch(mod.id)}
              style={{
                flexShrink: 0,
                padding: "0.85rem 1.25rem",
                background: moduleVisited && !isActive ? `${mod.color}08` : "none",
                border: "none",
                borderBottom: isActive ? `3px solid ${mod.color}` : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? mod.color : moduleVisited ? `${mod.color}cc` : MUTED,
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
                position: "relative",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.15rem", opacity: 0.7 }}>
                {mod.label}
                {moduleVisited && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: mod.color,
                      color: "white",
                      fontSize: "0.45rem",
                      fontWeight: 900,
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                    title="Visited"
                  >
                    ✓
                  </span>
                )}
              </span>
              {mod.title}
              <span
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  marginTop: "0.2rem",
                  color: allDone ? mod.color : "#bbb",
                  fontWeight: allDone ? 700 : 400,
                  letterSpacing: "0.04em",
                }}
              >
                {done} / {total} reviewed{allDone ? " ✓" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Module content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: current.color,
              fontWeight: 700,
              marginBottom: "0.3rem",
            }}
          >
            {current.label}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
              fontWeight: 800,
              color: INK,
              marginBottom: "0.5rem",
            }}
          >
            {current.title}
          </h2>
          <p style={{ color: MUTED, fontSize: "0.84rem", lineHeight: 1.65, maxWidth: 640 }}>
            {current.intro}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {current.handouts.map((h) => {
            const key = `${current.id}:${h.title}`;
            return (
              <HandoutCard
                key={h.title}
                handout={h}
                visited={visitedHandouts.has(key)}
                onVisit={() => handleVisit(key)}
                accentColor={current.color}
              />
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          background: FOREST,
          padding: "2rem 1.5rem",
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        <p style={{ color: "#c4d9c8", fontSize: "0.82rem", marginBottom: "1rem" }}>
          Don't have the kit yet? Get every handout plus the full PJ Solutions Kit.
        </p>
        <a
          href="/parrsjars/kit"
          style={{
            display: "inline-block",
            background: RUST,
            color: "white",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "0.7rem 1.75rem",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Get the PJ Solutions Kit — $97 →
        </a>
      </div>
    </div>
  );
}
