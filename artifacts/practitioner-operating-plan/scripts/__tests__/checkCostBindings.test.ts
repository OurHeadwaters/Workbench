import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";

import {
  parseDerivedIdsFromBudgetMath,
  findLiveCostReads,
  checkCostBindings,
} from "../checkCostBindings";

let cleanupRoots: string[] = [];

afterEach(() => {
  for (const root of cleanupRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  cleanupRoots = [];
});

function buildFixture(files: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), "check-cost-bindings-"));
  cleanupRoots.push(root);
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

describe("parseDerivedIdsFromBudgetMath", () => {
  it("extracts every case literal inside the getLiveCostValue function", () => {
    const src = `
      export function getLiveCostValue(state, id) {
        switch (id) {
          case "foo.bar":
            return 1;
          case "baz.qux": {
            return 2;
          }
          default:
            return null;
        }
      }
    `;
    const ids = parseDerivedIdsFromBudgetMath(src);
    expect([...ids].sort()).toEqual(["baz.qux", "foo.bar"]);
  });

  it("ignores case literals that live outside getLiveCostValue", () => {
    const src = `
      function unrelated(x) {
        switch (x) {
          case "should.not.count":
            return 1;
        }
      }
      export function getLiveCostValue(state, id) {
        switch (id) {
          case "real.id":
            return 1;
        }
      }
    `;
    const ids = parseDerivedIdsFromBudgetMath(src);
    expect(ids.has("real.id")).toBe(true);
    expect(ids.has("should.not.count")).toBe(false);
  });

  it("returns an empty set when getLiveCostValue is missing", () => {
    const src = `export function somethingElse() {}`;
    expect([...parseDerivedIdsFromBudgetMath(src)]).toEqual([]);
  });
});

describe("findLiveCostReads", () => {
  it("finds getLiveCostValue and liveDerived literal-id calls", () => {
    const root = buildFixture({
      "src/pages/Slide.tsx": [
        `import { getLiveCostValue } from "../lib/budgetMath";`,
        `function liveDerived(s, id) { return getLiveCostValue(s, id); }`,
        `export default function S(state) {`,
        `  const a = getLiveCostValue(state, "alpha.id");`,
        `  const b = liveDerived(state, "beta.id");`,
        `  return null;`,
        `}`,
      ].join("\n"),
    });
    const reads = findLiveCostReads([path.join(root, "src/pages/Slide.tsx")]);
    const summary = reads.map((r) => ({ fn: r.fn, id: r.id, line: r.lineNumber }));
    expect(summary).toContainEqual({ fn: "getLiveCostValue", id: "alpha.id", line: 4 });
    expect(summary).toContainEqual({ fn: "liveDerived", id: "beta.id", line: 5 });
  });

  it("ignores dynamic-id callsites where the second arg is a variable", () => {
    const root = buildFixture({
      "src/pages/Slide.tsx": [
        `function f(state, id) {`,
        `  return getLiveCostValue(state, id);`,
        `}`,
      ].join("\n"),
    });
    const reads = findLiveCostReads([path.join(root, "src/pages/Slide.tsx")]);
    expect(reads).toEqual([]);
  });

  it("respects the ignoreFiles set", () => {
    const root = buildFixture({
      "src/pages/Slide.tsx": `getLiveCostValue(s, "alpha.id");`,
    });
    const file = path.join(root, "src/pages/Slide.tsx");
    const reads = findLiveCostReads([file], { ignoreFiles: new Set([file]) });
    expect(reads).toEqual([]);
  });

  it("matches multi-line getLiveCostValue calls and reports the start line", () => {
    // This is exactly the formatting used in OnePager.tsx and other
    // page surfaces — `getLiveCostValue(state,\n  "id",\n)` split
    // across three lines, with optional trailing comma. A previous
    // per-line scan silently skipped this shape, which the deck-blanking
    // regression class can hide behind.
    const root = buildFixture({
      "src/pages/Slide.tsx": [
        `function S(state) {`,
        `  const a = getLiveCostValue(`,
        `    state,`,
        `    "alpha.id",`,
        `  );`,
        `  return a;`,
        `}`,
      ].join("\n"),
    });
    const reads = findLiveCostReads([path.join(root, "src/pages/Slide.tsx")]);
    expect(reads).toHaveLength(1);
    expect(reads[0].fn).toBe("getLiveCostValue");
    expect(reads[0].id).toBe("alpha.id");
    // The match starts on line 2 (the line with `getLiveCostValue(`),
    // not the line that holds the id literal. Reporting the start
    // line keeps the error message pointing at the call's syntactic
    // anchor.
    expect(reads[0].lineNumber).toBe(2);
  });

  it("matches multi-line liveDerived calls without a trailing comma", () => {
    // Same shape as ThreeRevenueLayers.tsx and FirstReserveThenTheNext.tsx
    // (no trailing comma after the id literal).
    const root = buildFixture({
      "src/pages/Slide.tsx": [
        `function liveDerived(s, id) { return null; }`,
        `function S(state) {`,
        `  const installPer = liveDerived(`,
        `    state,`,
        `    "crossReserve.installRevenue.perReserve"`,
        `  );`,
        `  return installPer;`,
        `}`,
      ].join("\n"),
    });
    const reads = findLiveCostReads([path.join(root, "src/pages/Slide.tsx")]);
    expect(reads).toHaveLength(1);
    expect(reads[0].fn).toBe("liveDerived");
    expect(reads[0].id).toBe("crossReserve.installRevenue.perReserve");
    expect(reads[0].lineNumber).toBe(3);
  });

  it("finds multiple multi-line callsites in the same file", () => {
    const root = buildFixture({
      "src/pages/Slide.tsx": [
        `function liveDerived(s, id) { return null; }`,
        `function S(state) {`,
        `  const a = liveDerived(`,
        `    state,`,
        `    "alpha.id",`,
        `  );`,
        `  const b = getLiveCostValue(state, "beta.id");`,
        `  const c = liveDerived(`,
        `    state,`,
        `    "gamma.id"`,
        `  );`,
        `  return [a, b, c];`,
        `}`,
      ].join("\n"),
    });
    const reads = findLiveCostReads([path.join(root, "src/pages/Slide.tsx")]);
    const summary = reads.map((r) => ({ id: r.id, fn: r.fn, line: r.lineNumber }));
    expect(summary).toEqual([
      { id: "alpha.id", fn: "liveDerived", line: 3 },
      { id: "beta.id", fn: "getLiveCostValue", line: 7 },
      { id: "gamma.id", fn: "liveDerived", line: 8 },
    ]);
  });
});

describe("checkCostBindings", () => {
  it("passes when every literal id has a switch case in budgetMath", () => {
    const root = buildFixture({
      "src/lib/budgetMath.ts": [
        `export function getLiveCostValue(state, id) {`,
        `  switch (id) {`,
        `    case "alpha.id": return 1;`,
        `    case "beta.id": return 2;`,
        `    default: return null;`,
        `  }`,
        `}`,
      ].join("\n"),
      "src/pages/Slide.tsx": [
        `function liveDerived(s, id) { return getLiveCostValue(s, id); }`,
        `function S(state) {`,
        `  const a = getLiveCostValue(state, "alpha.id");`,
        `  const b = liveDerived(state, "beta.id");`,
        `  return null;`,
        `}`,
      ].join("\n"),
    });
    const issues = checkCostBindings({
      projectRoot: root,
      budgetMathPath: path.join(root, "src/lib/budgetMath.ts"),
      scanDirs: [path.join(root, "src/pages")],
    });
    expect(issues).toEqual([]);
  });

  it("flags the exact id and slide path with a clear message", () => {
    const root = buildFixture({
      "src/lib/budgetMath.ts": [
        `export function getLiveCostValue(state, id) {`,
        `  switch (id) {`,
        `    case "alpha.id": return 1;`,
        `    default: return null;`,
        `  }`,
        `}`,
      ].join("\n"),
      "src/pages/slides/Slide.tsx": [
        `function liveDerived(s, id) { return getLiveCostValue(s, id); }`,
        `function S(state) {`,
        `  const ghost = liveDerived(state, "ghost.id");`,
        `  return null;`,
        `}`,
      ].join("\n"),
    });
    const issues = checkCostBindings({
      projectRoot: root,
      budgetMathPath: path.join(root, "src/lib/budgetMath.ts"),
      scanDirs: [path.join(root, "src/pages")],
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain(`id "ghost.id"`);
    expect(issues[0].message).toContain("src/pages/slides/Slide.tsx:3");
    expect(issues[0].message).toContain("liveDerived()");
    expect(issues[0].message).toContain(
      "no derivation case in budgetMath.ts:getLiveCostValue",
    );
  });

  it("ignores callsites inside __tests__ directories", () => {
    const root = buildFixture({
      "src/lib/budgetMath.ts": [
        `export function getLiveCostValue(state, id) {`,
        `  switch (id) { default: return null; }`,
        `}`,
      ].join("\n"),
      "src/pages/__tests__/Slide.test.ts": [
        `getLiveCostValue(state, "test.only.id");`,
      ].join("\n"),
    });
    const issues = checkCostBindings({
      projectRoot: root,
      budgetMathPath: path.join(root, "src/lib/budgetMath.ts"),
      scanDirs: [path.join(root, "src/pages")],
    });
    expect(issues).toEqual([]);
  });

  it("does not flag the budgetMath source's own internal getLiveCostValue calls", () => {
    const root = buildFixture({
      "src/lib/budgetMath.ts": [
        `export function getLiveCostValue(state, id) {`,
        `  switch (id) {`,
        `    case "alpha.id": {`,
        `      const inner = getLiveCostValue(state, "beta.id");`,
        `      return inner ?? 0;`,
        `    }`,
        `    case "beta.id": return 7;`,
        `    default: return null;`,
        `  }`,
        `}`,
      ].join("\n"),
      "src/pages/Slide.tsx": [
        `function S(state) {`,
        `  return getLiveCostValue(state, "alpha.id");`,
        `}`,
      ].join("\n"),
    });
    // budgetMath itself is automatically ignored even if scanDirs
    // accidentally points at the lib directory.
    const issues = checkCostBindings({
      projectRoot: root,
      budgetMathPath: path.join(root, "src/lib/budgetMath.ts"),
      scanDirs: [path.join(root, "src/lib"), path.join(root, "src/pages")],
    });
    expect(issues).toEqual([]);
  });
});
