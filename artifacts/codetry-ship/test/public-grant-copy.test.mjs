import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const PUBLIC_COPY_FILES = [
  "src/pages/OtfSectorGrantPage.tsx",
  "src/pages/QuotePage.tsx",
  "src/pages/HeadwatersPage.tsx",
  "src/pages/HomePage.tsx",
  "src/pages/ServicesPage.tsx",
  "public/sitemap.xml",
  "ANALYTICS.md",
];

const PROHIBITED_REFERENCES = [
  ["Ontario", "Trillium", "Foundation"].join(" "),
  ["O", "T", "F"].join(""),
  ["otf", "sector", "grant"].join("-"),
];

test("public grant offer source and metadata remain program-neutral", async () => {
  for (const path of PUBLIC_COPY_FILES) {
    const content = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    for (const prohibitedReference of PROHIBITED_REFERENCES) {
      assert.equal(
        content.toLowerCase().includes(prohibitedReference.toLowerCase()),
        false,
        `${path} contains prohibited grant-program reference: ${prohibitedReference}`,
      );
    }
  }
});