import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";

import {
  checkCostRegistrySlideRefs,
  defaultPaths,
  parseEyebrowFromFile,
  runCheck,
  type CheckRunPaths,
} from "../check-slide-refs";
import type { CostEntry } from "../../src/data/costRegistry";
import type { SlideEntry } from "../../src/data/slidesManifestSchema";

function eyebrowDiv(text: string): string {
  return [
    `        <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">`,
    `          ${text}`,
    `        </div>`,
  ].join("\n");
}

function slideComponent(name: string, eyebrowText: string, body = ""): string {
  return [
    `export default function ${name}() {`,
    `  return (`,
    `    <div>`,
    eyebrowDiv(eyebrowText),
    body,
    `    </div>`,
    `  );`,
    `}`,
  ].join("\n");
}

type FixtureSlide = {
  filename: string;
  componentName: string;
  position: number;
  title: string;
  eyebrow: string;
  body?: string;
};

function buildFixtureProject(slides: FixtureSlide[]): CheckRunPaths {
  const root = mkdtempSync(path.join(tmpdir(), "slide-refs-"));
  const slidesDir = path.join(root, "src/pages/slides");
  const dataDir = path.join(root, "src/data");
  mkdirSync(slidesDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  const manifest = slides.map((slide, idx) => ({
    id: `00000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`,
    position: slide.position,
    filepath: `src/pages/slides/${slide.filename}`,
    title: slide.title,
    description: slide.title,
    speakerNotes: "",
    phase: "idea" as const,
  }));

  writeFileSync(
    path.join(dataDir, "slides-manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  for (const slide of slides) {
    writeFileSync(
      path.join(slidesDir, slide.filename),
      slideComponent(slide.componentName, slide.eyebrow, slide.body ?? ""),
    );
  }

  return {
    projectRoot: root,
    slidesDir,
    manifestPath: path.join(dataDir, "slides-manifest.json"),
  };
}

let cleanupRoots: string[] = [];

function track(paths: CheckRunPaths): CheckRunPaths {
  cleanupRoots.push(paths.projectRoot);
  return paths;
}

afterEach(() => {
  for (const root of cleanupRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  cleanupRoots = [];
});

describe("parseEyebrowFromFile", () => {
  it("parses a numbered eyebrow with em dash", () => {
    const lines = slideComponent("Demo", "VIII · 02 — Salt runbook").split("\n");
    const eyebrow = parseEyebrowFromFile(lines);
    expect(eyebrow).not.toBeNull();
    expect(eyebrow!.part).toBe("VIII");
    expect(eyebrow!.subKey).toBe("02");
    expect(eyebrow!.numericIndex).toBe(2);
    expect(eyebrow!.isDivider).toBe(false);
  });

  it("parses a divider eyebrow", () => {
    const lines = slideComponent("Divider", "Part V · Hiring runbook").split("\n");
    const eyebrow = parseEyebrowFromFile(lines);
    expect(eyebrow).not.toBeNull();
    expect(eyebrow!.part).toBe("V");
    expect(eyebrow!.isDivider).toBe(true);
    expect(eyebrow!.subKey).toBeNull();
  });

  it("parses a non-numeric subkey", () => {
    const lines = slideComponent("Acc", "V · Net-positive accountability").split("\n");
    const eyebrow = parseEyebrowFromFile(lines);
    expect(eyebrow).not.toBeNull();
    expect(eyebrow!.part).toBe("V");
    expect(eyebrow!.subKey).toBe("Net-positive accountability");
    expect(eyebrow!.numericIndex).toBeNull();
  });

  it("parses a compound subkey like Hiring 03", () => {
    const lines = slideComponent("HiringIT", "V · Hiring 03 — IT/Tech").split("\n");
    const eyebrow = parseEyebrowFromFile(lines);
    expect(eyebrow!.part).toBe("V");
    expect(eyebrow!.subKey).toBe("Hiring 03");
  });

  it("parses the prologue eyebrow", () => {
    const lines = slideComponent("Why", "00 · Why this matters").split("\n");
    const eyebrow = parseEyebrowFromFile(lines);
    expect(eyebrow!.part).toBe("00");
  });

  it("returns null when no eyebrow div exists", () => {
    const lines = [
      `export default function Cover() {`,
      `  return <div>cover</div>;`,
      `}`,
    ];
    expect(parseEyebrowFromFile(lines)).toBeNull();
  });
});

describe("runCheck on synthetic fixtures", () => {
  it("passes a clean deck", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 01 — Alpha" },
        { filename: "B.tsx", componentName: "B", position: 2, title: "B", eyebrow: "I · 02 — Beta" },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors).toEqual([]);
    expect(result.slideCount).toBe(2);
  });

  it("flags a stale (Part X · NN) reference", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 01 — Alpha" },
        {
          filename: "B.tsx",
          componentName: "B",
          position: 2,
          title: "B",
          eyebrow: "I · 02 — Beta",
          body: `      <p>see (VIII · 06 — depot bench).</p>`,
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.length).toBeGreaterThan(0);
    const msg = result.errors.map((e) => e.message).join("\n");
    expect(msg).toContain("VIII · 06");
  });

  it("flags a stale Part X reference when the part doesn't exist", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 01 — Alpha" },
        {
          filename: "B.tsx",
          componentName: "B",
          position: 2,
          title: "B",
          eyebrow: "I · 02 — Beta",
          body: `      <p>see Part VIII for the depot.</p>`,
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.message.includes("Part VIII"))).toBe(true);
  });

  it("flags a stale Parts X–Y range when an endpoint doesn't exist", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 01 — Alpha" },
        {
          filename: "B.tsx",
          componentName: "B",
          position: 2,
          title: "B",
          eyebrow: "I · 02 — Beta",
          body: `      <p>The plan in Parts I–V is the structure.</p>`,
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.some((e) => e.message.includes("Parts I–V"))).toBe(true);
  });

  it("flags out-of-order numeric eyebrows after a reorder", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 02 — Beta-was-here" },
        { filename: "B.tsx", componentName: "B", position: 2, title: "B", eyebrow: "I · 01 — Alpha-was-there" },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.some((e) => e.message.includes("eyebrow numbering out of order"))).toBe(true);
  });

  it("flags overlapping parts (a Part X slide leaked between Part Y slides)", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "A", eyebrow: "I · 01 — Alpha" },
        { filename: "Stale.tsx", componentName: "Stale", position: 2, title: "Stale", eyebrow: "VIII · 01 — Leaked" },
        { filename: "B.tsx", componentName: "B", position: 3, title: "B", eyebrow: "I · 02 — Beta" },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.some((e) => e.message.includes("overlap in the manifest"))).toBe(true);
  });

  it("surfaces (next slide) / (previous slide) hits as a review list", () => {
    const paths = track(
      buildFixtureProject([
        {
          filename: "A.tsx",
          componentName: "A",
          position: 1,
          title: "Alpha",
          eyebrow: "I · 01 — Alpha",
          body: `      <p>Beta is up next (next slide).</p>`,
        },
        {
          filename: "B.tsx",
          componentName: "B",
          position: 2,
          title: "Beta",
          eyebrow: "I · 02 — Beta",
          body: `      <p>Alpha was on the previous slide.</p>`,
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors).toEqual([]);
    expect(result.reviews.length).toBe(2);
    expect(result.reviews[0].message).toContain("Beta");
    expect(result.reviews[1].message).toContain("Alpha");
  });

  it("hard-fails when (next slide) appears on the last slide", () => {
    const paths = track(
      buildFixtureProject([
        { filename: "A.tsx", componentName: "A", position: 1, title: "Alpha", eyebrow: "I · 01 — Alpha" },
        {
          filename: "B.tsx",
          componentName: "B",
          position: 2,
          title: "Beta",
          eyebrow: "I · 02 — Beta",
          body: `      <p>see next slide.</p>`,
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors.some((e) => /last slide/.test(e.message))).toBe(true);
  });

  it("ignores Part X tokens that appear in the slide's own eyebrow", () => {
    const paths = track(
      buildFixtureProject([
        {
          filename: "Divider.tsx",
          componentName: "Divider",
          position: 1,
          title: "Section",
          eyebrow: "Part V · Hiring runbook",
        },
        {
          filename: "A.tsx",
          componentName: "A",
          position: 2,
          title: "A",
          eyebrow: "V · 01 — Alpha",
        },
      ]),
    );
    const result = runCheck(paths);
    expect(result.errors).toEqual([]);
  });
});

describe("runCheck against the real deck", () => {
  it("reports zero errors for the current manifest", () => {
    const paths = defaultPaths();
    const result = runCheck(paths);
    if (result.errors.length > 0) {
      console.error(result.errors);
    }
    expect(result.errors).toEqual([]);
    expect(result.slideCount).toBeGreaterThan(50);
  });
});

describe("checkCostRegistrySlideRefs", () => {
  function manifestEntry(
    position: number,
    filepath: string,
    title: string,
  ): SlideEntry {
    return {
      id: `00000000-0000-0000-0000-${String(position).padStart(12, "0")}`,
      position,
      filepath,
      title,
      description: title,
      speakerNotes: "",
      phase: "idea",
    };
  }

  function registryEntry(
    id: string,
    href: string,
    label: string,
    manifestFile?: string,
  ): CostEntry {
    return {
      id,
      category: "Headline ask",
      label: id,
      defaultValue: 0,
      unit: "$/mo",
      context: "fixture",
      slides: [{ href, label, ...(manifestFile ? { manifestFile } : {}) }],
    };
  }

  it("passes when every registry href matches the manifest position", () => {
    const manifest = [
      manifestEntry(46, "src/pages/slides/Budget.tsx", "Budget"),
      manifestEntry(52, "src/pages/slides/CaseForRate.tsx", "Case for rate"),
    ];
    const registry = [
      registryEntry("ask", "/slide46", "Budget", "src/pages/slides/Budget.tsx"),
      registryEntry(
        "rate",
        "/slide52",
        "Case for rate",
        "src/pages/slides/CaseForRate.tsx",
      ),
    ];
    expect(checkCostRegistrySlideRefs(registry, manifest)).toEqual([]);
  });

  it("flags a stale slide(N, ...) constant after a manifest reorder", () => {
    const manifest = [
      manifestEntry(46, "src/pages/slides/Budget.tsx", "Budget"),
    ];
    // Registry still says /slide23 — this is exactly the drift the task
    // calls out (Budget moved from 23 to 46).
    const registry = [
      registryEntry("ask", "/slide23", "Budget", "src/pages/slides/Budget.tsx"),
    ];
    const errors = checkCostRegistrySlideRefs(registry, manifest);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/Stale cost-registry slide link/);
    expect(errors[0].message).toMatch(/position 46/);
    expect(errors[0].filepath).toBe("src/data/costRegistry.ts");
  });

  it("flags a manifestFile that no longer exists in the manifest", () => {
    const manifest = [manifestEntry(46, "src/pages/slides/Budget.tsx", "Budget")];
    const registry = [
      registryEntry(
        "rate",
        "/slide52",
        "Case for rate",
        "src/pages/slides/CaseForRate.tsx",
      ),
    ];
    const errors = checkCostRegistrySlideRefs(registry, manifest);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/no manifest entry has that filepath/);
  });

  it("ignores non-slide pages (manifestFile unset)", () => {
    const manifest = [manifestEntry(46, "src/pages/slides/Budget.tsx", "Budget")];
    const registry = [
      registryEntry("memo", "/payback-memo", "Payback memorandum"),
    ];
    expect(checkCostRegistrySlideRefs(registry, manifest)).toEqual([]);
  });
});
