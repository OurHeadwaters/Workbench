// Canonical comparison copy for the Codetry vs. Literate Programming square sheet.
// Codetry-side phrasings are pulled verbatim where possible from
// src/pages/Codetry.tsx and from public/constellation.json's
// `grammar.practice` line so the square sheet cannot drift from the
// canonical coining. Literate-programming side is kept in the same
// quiet, declarative voice; Knuth's discipline is named with the same
// respect already shown to code poetry on the Codetry page.

export type ComparisonRow = {
  /** Mono-caps label that appears on the left edge of each column row. */
  label: string;
  /** Literate-programming-side prose. */
  literate: string;
  /** Codetry-side prose. */
  codetry: string;
};

export type WorkedExample = {
  name: string;
  body: string;
};

export type Discipline = {
  name: string;
  /** Single-line definition that opens the column. */
  definition: string;
  /** Unit of care — short noun phrase. */
  unitOfCare: string;
  /** Where the truth lives. */
  truthLives: string;
  /** What gets generated from what. */
  generates: string;
  /** Lineage in one tight line. */
  lineage: string;
  /** One concrete worked example, named. */
  workedExample: WorkedExample;
};

export const literate: Discipline = {
  name: "Literate Programming",
  definition:
    "A programming discipline in which the document is the source. Prose explains the reasoning; the code is extracted from the prose by a tangle step.",
  unitOfCare: "The explanation.",
  truthLives:
    "In the prose. The exposition is what gets read first; the compiled program is the artifact pulled out of it.",
  generates:
    "Code is generated from prose. The author writes a literate document; tangle extracts the source the compiler runs, weave extracts the typeset reading.",
  lineage:
    "Donald Knuth, 1984 — WEB, then CWEB. Modern descendants: Org-mode Babel, Jupyter notebooks, R Markdown, Quarto.",
  workedExample: {
    name: "TeX",
    body:
      "Knuth wrote TeX as a literate program. The TeX source you read is the literate document; the typesetter you run is what tangle pulls out of it.",
  },
};

export const codetry: Discipline = {
  name: "Codetry",
  // Definition pulled near-verbatim from src/pages/Codetry.tsx so the
  // standalone sheet quotes the canonical doc rather than restating it.
  definition:
    "The practice of building software whose primary load-bearing material is metaphor. The naming is the architecture; the code is the medium that makes the metaphor real, clickable, and runnable.",
  unitOfCare: "The name.",
  truthLives:
    "In the metaphor. The chosen noun carries the constraint; the schema, the UI, and the verbs of the app follow from it.",
  generates:
    "Code is generated from named structure. Rename a primitive — Buckets to Categories, Practitioner to Founder — and the structure quietly changes shape underneath the name.",
  // Lineage line lists the constellation's worked examples in the order
  // the task specified.
  lineage:
    "Coined in this constellation. Worked examples: Saltbox Zone 0, Headwaters / Watershed, Family Buckets, Practitioner Operating Plan, Community Knowledge Hub / 807 Benefits, Regen Revolution, Dam Days & Shallows.",
  workedExample: {
    name: "Buckets",
    // Phrasing drawn from the Headwaters worked-examples entry in
    // constellation.json so the canonical Codetry move is quoted, not
    // paraphrased.
    body:
      "Envelope categories. You can only pour from one to another, never summon water from nothing. Rename to 'Categories' and the UI starts quietly suggesting balances can grow by clicking.",
  },
};

export const comparisonRows: ComparisonRow[] = [
  {
    label: "Definition",
    literate: literate.definition,
    codetry: codetry.definition,
  },
  {
    label: "Unit of care",
    literate: literate.unitOfCare,
    codetry: codetry.unitOfCare,
  },
  {
    label: "Where the truth lives",
    literate: literate.truthLives,
    codetry: codetry.truthLives,
  },
  {
    label: "What gets generated",
    literate: literate.generates,
    codetry: codetry.generates,
  },
  {
    label: "Lineage",
    literate: literate.lineage,
    codetry: codetry.lineage,
  },
];

// Header thesis — the one line the square hangs on.
export const thesis =
  "Literate programming makes the reasoning the source. Codetry makes the metaphor the source.";

// Footer strip copy.
export const ethos =
  "Both are don't-trust-verify moves — show the work where the work actually does the work.";

export const lineageAttribution =
  "Codetry is a discipline named in this constellation. Literate programming is Donald Knuth's, 1984.";

export const canonicalLinks = {
  codetryDoc: "/practitioner-operating-plan/codetry",
  manifest: "/practitioner-operating-plan/constellation.json",
};
