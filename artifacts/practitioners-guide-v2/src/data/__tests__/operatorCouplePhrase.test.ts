import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Operator-couple + software phrase drift guard.
 *
 * The shared load-bearing line —
 *   "Square at the till, QuickBooks on the books, Local Line for producers,
 *    the Headwaters cockpit tying them together"
 * — must appear verbatim on every surface that carries the operator-couple
 * framing. This test catches silent edits on any one surface before they
 * desync the docs.
 *
 * Source surfaces threaded by tasks #531 / #539 / #545:
 *   1. deer-lake-walkthrough  WhoWorks.tsx — ARCHIVED (artifact deleted in task #652;
 *      content moved to practitioners-guide-v2 communityStore with generic branding)
 *   2. deer-lake-store-plan   StaffingModel slide   (built artifact only — skipped until source lands)
 *   3. practitioner-operating-plan TheSixPeople/OnePager (built artifact only — skipped until source lands)
 *   4. practitioners-guide-v2 ContractsPage, ReplicationPage, ArchetypesPage (source in repo)
 *
 * Convention: paths whose source files do not yet exist in the repo are
 * skipped with a console.warn so the suite stays green while that work is
 * in progress. Once the source lands, remove the candidate path's skip
 * annotation and add it to REQUIRED_PATHS.
 */

const SHARED_PHRASE =
  "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together";

const REPO_ROOT = path.resolve(__dirname, "../../../../..");

function repoPath(...segments: string[]): string {
  return path.join(REPO_ROOT, ...segments);
}

function fileContainsPhrase(filePath: string): boolean {
  const src = fs.readFileSync(filePath, "utf-8");
  if (src.includes(SHARED_PHRASE)) return true;
  const collapsed = src.replace(/\s+/g, " ");
  return collapsed.includes(SHARED_PHRASE);
}

const REQUIRED_PATHS: Array<{ label: string; file: string }> = [
  {
    label: "practitioners-guide-v2 · ContractsPage.tsx",
    file: repoPath(
      "artifacts/practitioners-guide-v2/src/pages/ContractsPage.tsx",
    ),
  },
  {
    label: "practitioners-guide-v2 · ReplicationPage.tsx",
    file: repoPath(
      "artifacts/practitioners-guide-v2/src/pages/ReplicationPage.tsx",
    ),
  },
  {
    label: "practitioners-guide-v2 · ArchetypesPage.tsx",
    file: repoPath(
      "artifacts/practitioners-guide-v2/src/pages/ArchetypesPage.tsx",
    ),
  },
];

const CANDIDATE_PATHS: Array<{ label: string; glob: string }> = [
  {
    label: "deer-lake-store-plan · StaffingModel slide",
    glob: repoPath("artifacts/deer-lake-store-plan/src"),
  },
  {
    label: "practitioner-operating-plan · TheSixPeople / OnePager slides",
    glob: repoPath("artifacts/practitioner-operating-plan/src"),
  },
];

describe("Operator-couple + software phrase — drift guard", () => {
  it("shared phrase constant is the exact load-bearing string (edit this test if the phrase ever legitimately changes)", () => {
    expect(SHARED_PHRASE).toBe(
      "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together",
    );
  });

  for (const { label, file } of REQUIRED_PATHS) {
    it(`${label} carries the shared phrase verbatim`, () => {
      expect(
        fs.existsSync(file),
        `Source file not found: ${file}\nIf the file moved, update the path in this test.`,
      ).toBe(true);
      expect(
        fileContainsPhrase(file),
        `Shared phrase missing from ${label}.\nExpected to find:\n  "${SHARED_PHRASE}"\n\nFile: ${file}`,
      ).toBe(true);
    });
  }

  for (const { label, glob } of CANDIDATE_PATHS) {
    it(`${label} — skipped until source lands in the repo`, () => {
      const tsxFiles = fs.existsSync(glob)
        ? fs
            .readdirSync(glob, { recursive: true, encoding: "utf-8" })
            .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
            .map((f) => path.join(glob, f))
        : [];

      if (tsxFiles.length === 0) {
        console.warn(
          `[drift-guard] SKIP "${label}": no .ts/.tsx source files found under ${glob}. ` +
            `Add to REQUIRED_PATHS once the slide-deck source lands in the repo.`,
        );
        return;
      }

      const anyMatch = tsxFiles.some((f) => fileContainsPhrase(f));
      expect(
        anyMatch,
        `Shared phrase missing from ${label}.\nExpected ≥1 .ts/.tsx file under ${glob} to contain:\n  "${SHARED_PHRASE}"`,
      ).toBe(true);
    });
  }
});
