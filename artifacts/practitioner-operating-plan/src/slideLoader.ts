import type { ComponentType } from "react";

import manifestJson from "@/data/slides-manifest.json";
import { parseSlidesManifest, type SlideEntry } from "@/data/slidesManifestSchema";
import { PHASES, type Phase } from "@/lib/phases";

export interface LoadedSlide extends SlideEntry {
  Component: ComponentType;
}

const slideModules: Record<string, { default: ComponentType }> = import.meta.glob(
  "./pages/slides/*.tsx",
  { eager: true },
);

function loadManifestSlides(): SlideEntry[] {
  try {
    return parseSlidesManifest(manifestJson);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new Error(
      `Invalid slide manifest. Run "pnpm run validate-slides" for details. ${reason}`,
    );
  }
}

const manifestSlides = loadManifestSlides();

// `slides` keeps every entry in manifest-position order. This is the
// canonical lookup the `/slide{N}` URL scheme reads from, and what the
// workspace slides preview pane iterates. The two ordered views below
// (lifestyle + operating) project from this same set.
export const slides: LoadedSlide[] = [...manifestSlides]
  .sort((a, b) => a.position - b.position)
  .map((entry) => {
    const filename = entry.filepath.split("/").pop();
    if (!filename) {
      throw new Error(`Slide "${entry.title}" has an invalid filepath.`);
    }

    const key = `./pages/slides/${filename}`;
    const mod = slideModules[key];

    if (!mod) {
      const available = Object.keys(slideModules).join(", ");
      throw new Error(
        `Slide "${entry.title}" references missing file: ${entry.filepath}. ` +
          `Available modules: ${available}`,
      );
    }

    return {
      ...entry,
      Component: mod.default,
    };
  });

// Lifestyle Design Philosophy view: the deck in manifest order. Filters
// any operatingOnly slides out — currently there are none (the original
// phase-opener stubs were removed when the deck was re-narrated into the
// 8-part arc), but the field is kept in the schema in case a future
// view needs to add view-specific slides again.
export const lifestyleSlides: LoadedSlide[] = slides.filter(
  (s) => !s.operatingOnly,
);

// Operating plan view: groups slides by phase (Idea → Pitch → Contract
// → Fulfillment → Impact) for any UI that wants a phase-grouped read.
// If a phase has an operatingOnly opener it comes first; otherwise the
// phase's slides appear in manifest order.
export const operatingSlides: LoadedSlide[] = PHASES.flatMap((phase) => {
  const inPhase = slides.filter((s) => s.phase === phase);
  const opener = inPhase.find((s) => s.operatingOnly);
  const rest = inPhase
    .filter((s) => !s.operatingOnly)
    .sort((a, b) => a.position - b.position);
  return opener ? [opener, ...rest] : rest;
});

export function getOperatingSlidesForPhase(phase: Phase): LoadedSlide[] {
  return operatingSlides.filter((s) => s.phase === phase);
}

export function getOperatingPhaseOpener(phase: Phase): LoadedSlide | undefined {
  return operatingSlides.find((s) => s.phase === phase && s.operatingOnly);
}

export function getSlideByPosition(position: number): LoadedSlide | undefined {
  return slides.find((s) => s.position === position);
}
