// Structural lock for the constellation snapshot bundled into Headwaters
// Books and its on-page consumer (Standby.tsx) — guards against the
// Standby-leaks-into-Gate bug class first found and fixed in
// artifacts/codetry-handbook (Task #473) and audited in
// artifacts/practitioner-operating-plan.
//
// In this artifact the manifest is mirrored from
// artifacts/practitioner-operating-plan/public/constellation.json into
// src/data/constellation.ts via scripts/sync-constellation.cjs, and the
// Standby pilot at /standby reads from that snapshot. The bug class is:
// a future contributor genericizes Standby.tsx into a primitive-loop
// renderer (e.g. takes the id from the route or from props and maps
// over constellationWidePrimitives), and The Gate inherits Standby's
// UI — its four-rung ladder (advisory/standby/active/standdown), its
// Common Pantry / Watch sub-shelves, its drawdown ledger, and its
// debrief shape — none of which describe The Gate.
//
// These tests do three things:
//   1. Lock the snapshot's structure: both primitives present, each
//      with its own load-bearing principle and non-empty curated arrays.
//   2. Lock that the two primitives' ladders and sub-shelves do not
//      overlap by name (so a primitive-loop renderer cannot silently
//      paint Gate vocabulary into Standby chrome or vice versa).
//   3. Lock that Standby.tsx picks its primitive by literal id and
//      does not template over constellationWidePrimitives.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { constellation } from "@/data/constellation";

const STANDBY_TSX_PATH = join(
  import.meta.dirname,
  "..",
  "pages",
  "Standby.tsx",
);

describe("constellation snapshot — structural lock", () => {
  it("registers both non-zone primitives in constellationWidePrimitives", () => {
    const ids = constellation.constellationWidePrimitives.map((p) => p.id);
    expect(ids).toContain("the-standby");
    expect(ids).toContain("the-gate");
  });

  it.each(["the-standby", "the-gate"])(
    "%s carries every required field with non-empty values",
    (id) => {
      const primitive = constellation.constellationWidePrimitives.find(
        (p) => p.id === id,
      );
      expect(primitive, `${id} present in snapshot`).toBeDefined();
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
    const standby = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    )!;
    const gate = constellation.constellationWidePrimitives.find(
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
    // Standby's, a primitive-loop renderer would silently paint the
    // wrong vocabulary. Lock the two against each other at the data
    // layer.
    const standby = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    )!;
    const gate = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-gate",
    )!;
    const standbyRungs = new Set(
      (standby.severityLadder ?? []).map((r) => r.rung),
    );
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

  it("z3 pointer carries the host-zone framing for The Standby", () => {
    // The /standby pilot's header reads constellation.z3 and degrades
    // gracefully if absent. Lock that the snapshot keeps the pointer
    // populated so the header doesn't silently fall back to a
    // placeholder name.
    expect(constellation.z3).not.toBeNull();
    expect(constellation.z3!.zone).toBe(3);
    expect((constellation.z3!.standby ?? "").length).toBeGreaterThan(0);
  });
});

describe("Standby.tsx — picks the primitive by literal id, not by loop", () => {
  // The Standby pilot is intentionally Standby-only. The audit-note
  // comment in Standby.tsx explains the rule; these tests enforce it
  // mechanically so a future genericization is caught at test time
  // rather than after a Gate-shaped UI has already shipped.
  const source = readFileSync(STANDBY_TSX_PATH, "utf8");
  // Strip both line and block comments so the audit-note prose
  // doesn't trip the structural assertions below — that prose
  // intentionally talks about the loop shape we're forbidding.
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*\n/g, "\n");

  it("selects the-standby by literal id", () => {
    // The snapshot is read by id, not by index or by mapping over the
    // array. If this assertion fails, someone has either renamed the
    // primitive id (in which case update the snapshot first) or has
    // started picking the primitive a different way.
    expect(stripped).toMatch(
      /constellationWidePrimitives\.find\(([\s\S]*?)p\.id\s*===\s*"the-standby"/,
    );
  });

  it("does not template over constellationWidePrimitives", () => {
    // A primitive-loop renderer would call .map / .forEach /
    // .flatMap / .filter on the array and render UI per entry. None
    // of those iteration shapes belong on this page — Standby.tsx is
    // a single-primitive surface. (`.find(...)` is the *one* allowed
    // shape; the assertion above already locks it.)
    const forbiddenIterations = [
      /constellationWidePrimitives\.map\b/,
      /constellationWidePrimitives\.forEach\b/,
      /constellationWidePrimitives\.flatMap\b/,
      /constellationWidePrimitives\.filter\b/,
    ];
    for (const pattern of forbiddenIterations) {
      expect(
        stripped,
        `Standby.tsx must not iterate constellationWidePrimitives with ${pattern}`,
      ).not.toMatch(pattern);
    }
  });

  it("does not pick the primitive id from a route param or prop", () => {
    // The audit-note comment specifically forbids taking the
    // primitive id from the route or from props. Walk every
    // `constellationWidePrimitives.find(` occurrence, extract the
    // arguments via balanced-paren matching, and assert the body
    // compares p.id to the literal "the-standby". Anything else
    // (e.g. `p.id === id` where `id` is a route param or prop) is
    // the bug class.
    const marker = "constellationWidePrimitives.find(";
    let idx = 0;
    let count = 0;
    while ((idx = stripped.indexOf(marker, idx)) !== -1) {
      count += 1;
      // Walk forward, balancing parens, to capture the full body of
      // the .find(...) call.
      let depth = 1;
      let cursor = idx + marker.length;
      while (cursor < stripped.length && depth > 0) {
        const ch = stripped[cursor];
        if (ch === "(") depth += 1;
        else if (ch === ")") depth -= 1;
        cursor += 1;
      }
      const body = stripped.slice(idx + marker.length, cursor - 1);
      expect(
        body,
        `Standby.tsx find call "${marker}${body})" must compare p.id to the literal "the-standby"`,
      ).toMatch(/p\.id\s*===\s*"the-standby"/);
      idx = cursor;
    }
    expect(count, "expected at least one .find call").toBeGreaterThan(0);
  });

  it("carries the audit-note comment so the next contributor sees the rule", () => {
    // The comment in Standby.tsx is the only signpost telling the
    // next contributor not to genericize this page. If the comment
    // goes missing, the rule has effectively been deleted.
    expect(source).toMatch(/Standby-leaks-into-Gate/);
    expect(source).toMatch(/Task #473/);
  });
});

describe("Standby-only phrases stay attached to The Standby", () => {
  // Phrase-leak guard: these phrases describe Standby-specific
  // vocabulary and would be wrong on any other primitive's surface
  // (in particular, on a future Gate page). The bug class is a
  // contributor copying Standby chrome into a sibling page and
  // forgetting to swap the prose.
  //
  // This artifact's Standby surface is a *single-primitive* file
  // (Standby.tsx is intentionally Standby-only end-to-end), so the
  // load-bearing assertion is cross-file: the phrase must NOT appear
  // in any other src/pages/*.tsx file. If a future contributor
  // builds a Gate page (or a Home redesign) and lifts Standby
  // vocabulary onto it, this test fails.
  //
  // We additionally lock that, inside Standby.tsx itself, "The
  // Standby" actually appears (so the Standby framing is present)
  // and "The Gate" / "the Gate" never does (so Gate vocabulary has
  // not leaked the other direction).
  const STANDBY_ONLY_PHRASES = [
    "standby stock",
    "Common Pantry",
    "four-rung ladder",
    "Centralized disruption",
  ] as const;

  const PAGES_DIR = join(import.meta.dirname, "..", "pages");
  const standbySource = readFileSync(STANDBY_TSX_PATH, "utf8");
  // Strip comments so audit-note prose (which legitimately discusses
  // these phrases and even names "The Gate") doesn't trigger the
  // assertions below.
  const standbyStripped = standbySource
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*\n/g, "\n");

  it("Standby.tsx names The Standby and never names The Gate in code/JSX", () => {
    expect(
      standbyStripped,
      "Standby.tsx must contain the phrase 'The Standby' in its code/JSX",
    ).toContain("The Standby");
    // The Gate is a sibling primitive with its own surface (not yet
    // built). It must not be named here in code/JSX — only in the
    // audit-note comment, which we stripped above.
    expect(
      standbyStripped,
      "Standby.tsx code/JSX must not name The Gate (Gate vocabulary belongs on its own page)",
    ).not.toMatch(/the[ -]Gate|The Gate/);
  });

  it.each(STANDBY_ONLY_PHRASES)(
    "phrase '%s' actually appears in Standby.tsx",
    (phrase) => {
      // Sanity: each Standby-only phrase exists in the Standby file.
      // If a phrase silently drops out, the cross-file lock below
      // becomes vacuous.
      expect(
        standbyStripped,
        `phrase "${phrase}" must appear in Standby.tsx`,
      ).toContain(phrase);
    },
  );

  it("Standby-only phrases do not appear in any other src/pages/*.tsx file", () => {
    // Walk every .tsx file in src/pages (skipping Standby.tsx and
    // not-found.tsx) and assert no Standby-only phrase has leaked
    // onto a sibling page. The legitimate place for a sibling
    // primitive's UI is its own file — and that file gets its own
    // vocabulary, not Standby's.
    const entries = readdirSync(PAGES_DIR);
    const otherPages = entries.filter(
      (name) =>
        name.endsWith(".tsx") &&
        name !== "Standby.tsx" &&
        name !== "not-found.tsx",
    );
    expect(
      otherPages.length,
      "expected at least one sibling page in src/pages/",
    ).toBeGreaterThan(0);
    for (const name of otherPages) {
      const filePath = join(PAGES_DIR, name);
      const fileSource = readFileSync(filePath, "utf8");
      // Strip comments so audit-note prose on a sibling page wouldn't
      // trigger the assertion. The rule is about user-visible copy.
      const stripped = fileSource
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*\n/g, "\n");
      for (const phrase of STANDBY_ONLY_PHRASES) {
        expect(
          stripped,
          `${name} must not contain Standby-only phrase: "${phrase}"`,
        ).not.toContain(phrase);
      }
    }
  });
});
