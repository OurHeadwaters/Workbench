import manifest from "./data/slides-manifest.json";

const modules = import.meta.glob("./pages/slides/*.tsx", { eager: true }) as Record<
  string,
  { default: React.ComponentType }
>;

export function loadSlides() {
  const sorted = [...manifest].sort((a, b) => a.position - b.position);
  return sorted.map((entry) => {
    const key = `./${entry.filepath.replace("src/", "")}`;
    const mod = modules[key];
    if (!mod) {
      throw new Error(`Slide component not found for: ${entry.filepath}`);
    }
    return {
      id: entry.id,
      position: entry.position,
      title: entry.title,
      description: entry.description,
      speakerNotes: entry.speakerNotes,
      component: mod.default,
    };
  });
}
