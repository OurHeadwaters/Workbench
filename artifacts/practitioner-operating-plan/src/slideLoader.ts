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

// Lifestyle Design Philosophy view: the original 38-slide ordering. The
// five operating-plan phase openers are excluded so this view stays the
// stable, unchanged reference the practitioner can come back to for the
// inner-world read.
export const lifestyleSlides: LoadedSlide[] = slides.filter(
  (s) => !s.operatingOnly,
);

// Operating plan view: re-spined around Idea → Pitch → Contract →
// Fulfillment → Impact. Within each phase, the phase opener comes first
// (operatingOnly=true), then the original slides in their manifest
// position order.
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
