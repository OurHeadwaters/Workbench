// Structural lock for the constellation manifest and its on-page
// consumers — guards against the Standby-leaks-into-Gate bug class
// (Task #473) showing up here.
//
// The bug was first found and fixed in artifacts/codetry-handbook:
// a chapter generator authored when only The Standby existed kept
// Standby-specific copy hardcoded into the template, so when The Gate
// was registered as a sibling primitive both chapters inherited
// Standby's title suffix and closing prose.
//
// In this artifact, neither Codetry.tsx nor codetryTest.ts loops over
// `constellationWidePrimitives` — both render *curated* per-primitive
// content (see audit-note comments in those files). This test verifies
// the manifest itself is healthy AND that the curated surfaces guard
// the Standby-only phrases the way the codetry-handbook test does.
//
// SOURCE-OF-TRUTH NOTE (Task #562): the canonical constellation manifest
// lives in the codetry-handbook artifact at
// `artifacts/codetry-handbook/data/constellation.json`. This test reads
// the canonical file directly, *not* the local `public/constellation.json`
// copy that scripts/publish-constellation.cjs writes at build time. That
// way the test fails the moment the canonical file drifts, regardless of
// whether the publish step has been run yet in this environment.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { codetryTest } from "@/data/codetryTest";

const MANIFEST_PATH = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "codetry-handbook",
  "data",
  "constellation.json",
);

const CODETRY_TSX_PATH = join(
  import.meta.dirname,
  "..",
  "pages",
  "Codetry.tsx",
);

const CODETRY_TEST_TS_PATH = join(
  import.meta.dirname,
  "..",
  "data",
  "codetryTest.ts",
);

type Primitive = {
  id: string;
  name: string;
  kind: string;
  summary: string;
  hostZone?: number;
  hostZoneRationale?: string;
  principle?: string;
  vocabulary?: { term: string; role: string }[];
  severityLadder?: { rung: string; meaning: string }[];
  subShelves?: { name: string; role: string }[];
  rejectedAlternatives?: { name: string; reason: string }[];
};

type Manifest = {
  constellationWidePrimitives: Primitive[];
};

function readManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

describe("constellation manifest — structural lock", () => {
  it("registers both non-zone primitives in constellationWidePrimitives", () => {
    const manifest = readManifest();
    const ids = manifest.constellationWidePrimitives.map((p) => p.id);
    expect(ids).toContain("the-standby");
    expect(ids).toContain("the-gate");
  });

  it.each(["the-standby", "the-gate"])(
    "%s carries every required field with non-empty values",
    (id) => {
      const manifest = readManifest();
      const primitive = manifest.constellationWidePrimitives.find(
        (p) => p.id === id,
      );
      expect(primitive, `${id} present in manifest`).toBeDefined();
      expect(primitive!.name.length).toBeGreaterThan(0);
      expect(primitive!.summary.length).toBeGreaterThan(0);
      expect(primitive!.hostZone, `${id} hostZone`).toBe(3);
      expect(primitive!.hostZoneRationale?.length ?? 0).toBeGreaterThan(0);
      for (const arr of [
        "vocabulary",
        "severityLadder",
        "subShelves",
        "rejectedAlternatives",
      ] as const) {
        const value = primitive![arr];
        expect(Array.isArray(value), `${id}.${arr} is an array`).toBe(true);
        expect((value ?? []).length, `${id}.${arr} non-empty`).toBeGreaterThan(
          0,
        );
      }
    },
  );

  it("each non-zone primitive declares its own load-bearing principle", () => {
    const manifest = readManifest();
    const standby = manifest.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    )!;
    const gate = manifest.constellationWidePrimitives.find(
      (p) => p.id === "the-gate",
    )!;
    // The two principles must be distinct — the bug class is exactly
    // when one primitive silently inherits the other's principle.
    expect(standby.principle).toBe("both-states");
    expect(gate.principle).toBe("both-sides");
    expect(standby.principle).not.toBe(gate.principle);
  });

  it("Standby and Gate ladders/sub-shelves do not overlap by name", () => {
    // A different shape of the same bug class: if the Gate's ladder
    // rungs or sub-shelves accidentally got re-pointed at the
    // Standby's, a primitive-loop renderer would silently render the
    // wrong vocabulary. Lock the two against each other at the data
    // layer.
    const manifest = readManifest();
    const standby = manifest.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    )!;
    const gate = manifest.constellationWidePrimitives.find(
      (p) => p.id === "the-gate",
    )!;
    const standbyRungs = new Set((standby.severityLadder ?? []).map((r) => r.rung));
    const gateRungs = new Set((gate.severityLadder ?? []).map((r) => r.rung));
    for (const r of gateRungs) {
      expect(
        standbyRungs.has(r),
        `Gate rung "${r}" must not appear on Standby's ladder`,
      ).toBe(false);
    }
    const standbyShelves = new Set(
      (standby.subShelves ?? []).map((s) => s.name),
    );
    const gateShelves = new Set((gate.subShelves ?? []).map((s) => s.name));
    for (const s of gateShelves) {
      expect(
        standbyShelves.has(s),
        `Gate sub-shelf "${s}" must not appear on Standby's shelf list`,
      ).toBe(false);
    }
  });
});

describe("Codetry.tsx — Standby-only framing stays attached to The Standby", () => {
  // Codetry.tsx narrates The Standby as the first non-zone primitive
  // and as the worked example of the both-states principle. That
  // framing is correct for The Standby and would leak onto The Gate if
  // the surface were ever genericized into a primitive-loop renderer.
  // This test does not stop the page from naming The Standby — it
  // stops the page from *also* using the Standby-only phrase to
  // describe a different primitive.
  it("the literal phrase 'first non-zone primitive' only appears in the Standby block", () => {
    const source = readFileSync(CODETRY_TSX_PATH, "utf8");
    // Strip audit-note comments so they don't interfere — they are
    // documentation, not user-visible copy.
    const stripped = source.replace(/\/\/[^\n]*\n/g, "");
    const phrase = "first non-zone primitive";
    let idx = 0;
    let found = 0;
    while ((idx = stripped.indexOf(phrase, idx)) !== -1) {
      found += 1;
      // Take a 400-char window around the hit and verify "Standby"
      // appears nearby — the phrase must always co-occur with the
      // primitive it actually describes.
      const start = Math.max(0, idx - 200);
      const end = Math.min(stripped.length, idx + phrase.length + 200);
      const window = stripped.slice(start, end);
      expect(
        window,
        `phrase "${phrase}" at offset ${idx} must mention "Standby" within 200 chars`,
      ).toMatch(/Standby/);
      // And it must NOT also mention The Gate inside the same narrow
      // window — that would be the leak shape.
      expect(
        window,
        `phrase "${phrase}" at offset ${idx} must not be applied to The Gate`,
      ).not.toMatch(/the[ -]Gate|The Gate/);
      idx += phrase.length;
    }
    // Sanity: the phrase is expected to appear (Standby is described
    // this way on purpose). Lock the count so a future genericization
    // can't add a second occurrence on a Gate-shaped block.
    expect(found, "the phrase appears on the Standby block").toBeGreaterThan(0);
  });
});

describe("codetryTest.ts — Standby-only audit prose stays attached to The Standby", () => {
  // The "Constellation-wide primitives" group's prose was written
  // when only The Standby existed. This test asserts that any future
  // entry added to that group does not silently inherit the Standby
  // framing — and that the Standby-only phrases below do not appear
  // in any entry whose name is not "The Standby".
  const STANDBY_ONLY_PHRASES = [
    "exemplar of the both-states principle",
    "the slow side (always-on preparation, standby stock",
  ];

  it("group framing intentionally narrates The Standby as the exemplar", () => {
    const group = codetryTest.find(
      (g) => g.artifact === "Constellation-wide primitives",
    );
    expect(group, "Constellation-wide primitives group present").toBeDefined();
    expect(group!.framing).toMatch(/Standby/);
    expect(group!.framing).toMatch(/both-states/);
  });

  it("each Standby-only phrase only appears on entries named 'The Standby'", () => {
    const group = codetryTest.find(
      (g) => g.artifact === "Constellation-wide primitives",
    )!;
    for (const entry of group.entries) {
      const blob = [
        entry.livesAt,
        entry.renameCandidate,
        entry.whatWouldChange,
        entry.typeCheckNote,
        entry.bothStatesNote,
        entry.followUp ?? "",
      ].join("\n");
      for (const phrase of STANDBY_ONLY_PHRASES) {
        if (entry.name === "The Standby") continue;
        expect(
          blob,
          `entry "${entry.name}" must not carry Standby-only phrase: "${phrase}"`,
        ).not.toContain(phrase);
      }
    }
  });

  it("source comment block records the audit-note discipline", () => {
    // The data file carries a header comment explaining that this
    // surface is curated (not a primitive-loop renderer), and that
    // any new primitive entry needs its own per-primitive prose. If
    // that comment goes missing, the next contributor loses the only
    // signpost telling them not to template Standby's prose onto The
    // Gate.
    const source = readFileSync(CODETRY_TEST_TS_PATH, "utf8");
    expect(source).toMatch(/Standby-leaks-into-Gate/);
    expect(source).toMatch(/Task #473/);
  });
});
