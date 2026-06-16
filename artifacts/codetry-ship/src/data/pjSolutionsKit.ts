import cheatSheetsImg from "@assets/IMG_1198_1780775510410.PNG";
import pressureCanningImg from "@assets/IMG_2161_1780775510408.PNG";
import waterbathImg from "@assets/IMG-1948_1780775540402.PNG";
import cookingImg from "@assets/IMG_3081_1780775510405.PNG";
import getStartedImg from "@assets/IMG_1184_1780775510410.PNG";

const FOREST = "#1f3d2e";
const RUST = "#b85a3e";
const GOLD = "#c89a2e";

export const KIT_MODULES = [
  {
    title: "Water-Bath Canning",
    desc: "Pickles, salsa, jams, tomato sauce — the high-acid world. Equipment, process diagram, approved recipe guidance, and a canning cheat sheet (waterbath vs pressure).",
    items: ["Process diagram", "Introduction & safe practices", "Waterbath recipes (pickles, salsa, tomatoes)", "Stages & stations worksheet", "Canning cheat sheet (PH guide)"],
    img: waterbathImg,
    color: FOREST,
  },
  {
    title: "Pressure Canning",
    desc: "Meat, broth, beans, potatoes — the low-acid world. Times table for common items, deeper dive on liquid loss and safety, and the 'can I eat it?' decision guide.",
    items: ["Process diagram", "Introduction & safe practices", "Times for common items (pints & quarts)", "Pressure canning deeper dive", "Process the Process — benefits, tips, remember"],
    img: pressureCanningImg,
    color: RUST,
  },
  {
    title: "Blanching, Freezing & Dehydrating",
    desc: "Everything before the jar — prep methods that protect nutrition and texture. Cheat sheets for each method plus the freezing vs dehydrating decision guide.",
    items: ["Blanching cheat sheet (vegetable timing)", "Freezing vs dehydrating cheat sheet", "Process the Process — enzymic activity, humidity, oxygen", "Dehydrating process diagram", "Freezer prep ideas"],
    img: cheatSheetsImg,
    color: GOLD,
  },
  {
    title: "Cooking With What You Store",
    desc: "The part most kits skip. How to actually use your pantry — canned meat, frozen veg, potatoes, local ingredients — through all four seasons.",
    items: ["Cooking with preserves (canned meat, tomatoes, potatoes, beans)", "Local go-to's (8 signature meals)", "Just add H2O — shelf-stable meal planning", "Value-added meals overview", "Fall harvest salad recipe"],
    img: cookingImg,
    color: FOREST,
  },
  {
    title: "The System",
    desc: "How to build a pantry that's actually a food system. Get started, track what you eat, audit your store, and know your method.",
    items: ["Get started — start where you are", "Eat what you store & store what you eat (food audit)", "In-person checklist", "Ratios cheat sheet", "Best methods + fermenting cheat sheet overview"],
    img: getStartedImg,
    color: RUST,
  },
];

export const KIT_HANDOUTS = [
  "Waterbath vs pressure cheat sheet",
  "Ratios cheat sheet (pickles, ferments, canning pot water)",
  "Local go-to recipes (8 dishes)",
  "Just add H2O shelf-stable meals",
  "Freezer prep ideas",
  "In-person checklist",
  "Food audit worksheet",
  "Tips & FAQ",
  "Feedback & reflection worksheet",
  "Seasonal recipe collection (when populated)",
];
