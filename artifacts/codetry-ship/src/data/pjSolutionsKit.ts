import cheatSheetsImg from "@assets/IMG_1198_1780775510410.PNG";
import pressureCanningImg from "@assets/IMG_2161_1780775510408.PNG";
import waterbathImg from "@assets/IMG-1948_1780775540402.PNG";
import cookingImg from "@assets/IMG_3081_1780775510405.PNG";
import getStartedImg from "@assets/IMG_1184_1780775510410.PNG";

const FOREST = "#1f3d2e";
const RUST = "#b85a3e";
const GOLD = "#c89a2e";

export type KitItem = {
  label: string;
  /** Stable slug — passed as `key` to GET /api/kits/handout?token=xxx&key=yyy */
  key: string;
};

export const KIT_MODULES = [
  {
    title: "Water-Bath Canning",
    desc: "Pickles, salsa, jams, tomato sauce — the high-acid world. Equipment, process diagram, approved recipe guidance, and a canning cheat sheet (waterbath vs pressure).",
    items: [
      { label: "Process diagram",                           key: "wb-process-diagram" },
      { label: "Introduction & safe practices",             key: "wb-intro-safe-practices" },
      { label: "Waterbath recipes (pickles, salsa, tomatoes)", key: "wb-recipes" },
      { label: "Stages & stations worksheet",               key: "wb-stages-stations" },
      { label: "Canning cheat sheet (PH guide)",            key: "wb-canning-cheat-sheet" },
    ] as KitItem[],
    img: waterbathImg,
    color: FOREST,
  },
  {
    title: "Pressure Canning",
    desc: "Meat, broth, beans, potatoes — the low-acid world. Times table for common items, deeper dive on liquid loss and safety, and the 'can I eat it?' decision guide.",
    items: [
      { label: "Process diagram",                           key: "pc-process-diagram" },
      { label: "Introduction & safe practices",             key: "pc-intro-safe-practices" },
      { label: "Times for common items (pints & quarts)",   key: "pc-times-table" },
      { label: "Pressure canning deeper dive",              key: "pc-deeper-dive" },
      { label: "Process the Process — benefits, tips, remember", key: "pc-process-the-process" },
    ] as KitItem[],
    img: pressureCanningImg,
    color: RUST,
  },
  {
    title: "Blanching, Freezing & Dehydrating",
    desc: "Everything before the jar — prep methods that protect nutrition and texture. Cheat sheets for each method plus the freezing vs dehydrating decision guide.",
    items: [
      { label: "Blanching cheat sheet (vegetable timing)",  key: "bfd-blanching-cheat-sheet" },
      { label: "Freezing vs dehydrating cheat sheet",       key: "bfd-freezing-vs-dehydrating" },
      { label: "Process the Process — enzymic activity, humidity, oxygen", key: "bfd-process-the-process" },
      { label: "Dehydrating process diagram",               key: "bfd-dehydrating-diagram" },
      { label: "Freezer prep ideas",                        key: "bfd-freezer-prep" },
    ] as KitItem[],
    img: cheatSheetsImg,
    color: GOLD,
  },
  {
    title: "Cooking With What You Store",
    desc: "The part most kits skip. How to actually use your pantry — canned meat, frozen veg, potatoes, local ingredients — through all four seasons.",
    items: [
      { label: "Cooking with preserves (canned meat, tomatoes, potatoes, beans)", key: "cook-preserves" },
      { label: "Local go-to's (8 signature meals)",         key: "cook-local-gotos" },
      { label: "Just add H2O — shelf-stable meal planning", key: "cook-just-add-h2o" },
      { label: "Value-added meals overview",                key: "cook-value-added-meals" },
      { label: "Fall harvest salad recipe",                 key: "cook-harvest-salad" },
    ] as KitItem[],
    img: cookingImg,
    color: FOREST,
  },
  {
    title: "The System",
    desc: "How to build a pantry that's actually a food system. Get started, track what you eat, audit your store, and know your method.",
    items: [
      { label: "Get started — start where you are",         key: "sys-get-started" },
      { label: "Eat what you store & store what you eat (food audit)", key: "sys-food-audit" },
      { label: "In-person checklist",                       key: "sys-inperson-checklist" },
      { label: "Ratios cheat sheet",                        key: "sys-ratios-cheat-sheet" },
      { label: "Best methods + fermenting cheat sheet overview", key: "sys-best-methods" },
    ] as KitItem[],
    img: getStartedImg,
    color: RUST,
  },
];

export type KitHandout = {
  label: string;
  /** Stable slug — passed as `key` to GET /api/kits/handout?token=xxx&key=yyy */
  key: string;
};

export const KIT_HANDOUTS: KitHandout[] = [
  { label: "Waterbath vs pressure cheat sheet",                    key: "h-waterbath-vs-pressure" },
  { label: "Ratios cheat sheet (pickles, ferments, canning pot water)", key: "h-ratios-cheat-sheet" },
  { label: "Local go-to recipes (8 dishes)",                       key: "h-local-gotos" },
  { label: "Just add H2O shelf-stable meals",                      key: "h-just-add-h2o" },
  { label: "Freezer prep ideas",                                   key: "h-freezer-prep" },
  { label: "In-person checklist",                                  key: "h-inperson-checklist" },
  { label: "Food audit worksheet",                                 key: "h-food-audit-worksheet" },
  { label: "Tips & FAQ",                                           key: "h-tips-faq" },
  { label: "Feedback & reflection worksheet",                      key: "h-feedback-worksheet" },
  { label: "Seasonal recipe collection (when populated)",          key: "h-seasonal-recipes" },
];
