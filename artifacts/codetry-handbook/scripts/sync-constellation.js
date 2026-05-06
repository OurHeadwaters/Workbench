const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error("Could not find workspace root (no pnpm-workspace.yaml found)");
}

const workspaceRoot = findWorkspaceRoot(projectRoot);
// SOURCE-OF-TRUTH NOTE (Task #562): the constellation manifest now lives
// inside the codetry-handbook artifact alongside handbook.ts,
// foundingExamples.ts, standby.ts, and pioneerPath.ts. The codetry-handbook
// artifact is canonical for all four shared data files; every other
// artifact reads them from here (via workspace package imports or, in the
// case of the JSON manifest, a build-time copy step).
const SOURCE = path.join(projectRoot, "data/constellation.json");
const DEST = path.join(projectRoot, "data/constellation.ts");

// ---------------------------------------------------------------------------
// ZONE_FIELD_SCHEMA — single source of truth for the bundled ConstellationZone
// snapshot. Drives both pickZone() (what gets copied from JSON) and the emitted
// TypeScript type (what ConstellationZone looks like for consumers).
//
// To add a new field to the snapshot:
//   1. Add an entry here. Prefix the key with '!' to mark it as required.
//   2. Run `pnpm --filter @workspace/codetry-handbook run sync-constellation`
//
// No other changes are needed — pickZone and the TypeScript type update
// automatically on the next sync run.
// ---------------------------------------------------------------------------
const ZONE_FIELD_SCHEMA = {
  "!zone":            "number",
  "slot":             "string",
  "!name":            "string",
  "!domain":          "string",
  "!url":             "string | null",
  "!status":          "string",
  "formerNames":      "string[]",
  "formerNamesNote":  "string",
  "tagline":          "string",
  "memberFacingBrand":"string",
  "workedExamples":   "WorkedExample[]",
  "context":          "string",
  "standby":          "string",
  "opening":          "string",
  "inlinePrompt":     "string",
  "reflections":      "string[]",
};

// Fields intentionally excluded from the snapshot. These are complex nested
// objects or zone-specific metadata the handbook and other consumers do not
// use. Adding a key here silences the "unhandled field" warning without
// pulling it into the snapshot.
const ZONE_EXCLUDED_FIELDS = new Set([
  // Structural / cross-zone coordination objects
  "sibling",
  "coordinationHandles",
  "coordinationHooks",
  "interfaces",
  "crossZoneSeams",
  "crossZoneTouchpoints",
  "offersToConstellation",
  "requestsToZone2",
  "willFlagToZone2Unprompted",
  "readableByZone2WithoutAsking",
  "claimedRequests",
  "pingProtocol",
  "latentThreads",
  "z1Z5InterfaceStatus",
  "z4Z5InterfaceStatus",
  "z1Z3InterfaceStatus",
  "z3Z4InterfaceStatus",
  // Zone-specific descriptive metadata
  "aliases",
  "audience",
  "cadence",
  "namingWeight",
  "agentCharter",
  "anchorArtifact",
  "centralizedNote",
  "chokepointThesis",
  "codetryObservations",
  "constraints",
  "currentSector",
  "dataPosture",
  "discoveryNotes",
  "failureMode",
  "fourTeachers",
  "geography",
  "inFlight",
  "nonNegotiables",
  "position",
  "qa",
  "revenueModel",
  "role",
  "scopeBound",
  "statusLine",
  "surfaces",
  "tenancy",
  "zoneShorthand",
  // Miscellaneous
  "addOns",
  "alsoAt",
  "namingNote",
  "pointers",
  "proposedInterfaces",
  "proposedSeeds",
  "solutionShape",
  "knownGaps",
]);

// ---------------------------------------------------------------------------
// pickZone — driven by ZONE_FIELD_SCHEMA. Adding a field to ZONE_FIELD_SCHEMA
// automatically causes it to be picked here; no manual wiring needed.
// ---------------------------------------------------------------------------
function pickZone(z, { defaultZone } = {}) {
  const out = {};
  for (const rawKey of Object.keys(ZONE_FIELD_SCHEMA)) {
    const key = rawKey.startsWith("!") ? rawKey.slice(1) : rawKey;

    // Required fields with special coercion
    if (key === "zone") {
      out.zone = typeof z.zone === "number" ? z.zone : defaultZone;
      continue;
    }
    if (key === "url") {
      out.url = z.url ?? null;
      continue;
    }

    // Array fields that need shape normalisation or safe copy
    if (key === "workedExamples") {
      if (Array.isArray(z.workedExamples)) {
        out.workedExamples = z.workedExamples.map((w) => ({
          name: w.name,
          rule: w.rule,
        }));
      }
      continue;
    }
    if (key === "reflections") {
      if (Array.isArray(z.reflections)) out.reflections = z.reflections.slice();
      continue;
    }
    if (key === "formerNames") {
      if (Array.isArray(z.formerNames)) out.formerNames = z.formerNames.slice();
      continue;
    }

    // All other schema fields: copy as-is when present
    if (z[key] !== undefined) out[key] = z[key];
  }
  return out;
}

// ---------------------------------------------------------------------------
// deriveZoneType — generates the ConstellationZone TypeScript type block
// directly from ZONE_FIELD_SCHEMA. No manual type editing needed.
// ---------------------------------------------------------------------------
function deriveZoneType() {
  const lines = ["export type ConstellationZone = {"];
  for (const [rawKey, tsType] of Object.entries(ZONE_FIELD_SCHEMA)) {
    const required = rawKey.startsWith("!");
    const key = required ? rawKey.slice(1) : rawKey;
    lines.push(`  ${key}${required ? "" : "?"}:${tsType === "WorkedExample[]" ? " WorkedExample[]" : ` ${tsType}`};`);
  }
  lines.push("};");
  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// findUnhandledZoneFields — returns the set of keys present in the JSON zone
// entries that are neither in ZONE_FIELD_SCHEMA nor in ZONE_EXCLUDED_FIELDS.
// An empty set means the schema is complete.
// ---------------------------------------------------------------------------
function findUnhandledZoneFields(allZones) {
  const knownKeys = new Set(
    Object.keys(ZONE_FIELD_SCHEMA).map((k) =>
      k.startsWith("!") ? k.slice(1) : k,
    ),
  );
  const unhandled = new Set();
  for (const z of allZones) {
    for (const key of Object.keys(z)) {
      if (!knownKeys.has(key) && !ZONE_EXCLUDED_FIELDS.has(key)) {
        unhandled.add(key);
      }
    }
  }
  return unhandled;
}

// Derive a top-level pointer to the Zone 3 row that hosts The Standby
// (it carries both `standby` framing and the `memberFacingBrand` the
// books site shows in its header eyebrow). Returns null if no zone
// fits — the consumers all `?.` through this field, so a null is
// rendered as a graceful default rather than a crash.
function pickZ3(zones) {
  const z3 = (Array.isArray(zones) ? zones : []).find(
    (z) => z.zone === 3 && typeof z.standby === "string",
  );
  if (!z3) return null;
  return {
    zone: z3.zone,
    name: z3.name,
    memberFacingBrand: z3.memberFacingBrand ?? null,
    standby: z3.standby,
  };
}

function pickPrinciple(p) {
  return {
    id: p.id,
    name: p.name,
    statement: p.statement,
    ...(p.workedExample !== undefined ? { workedExample: p.workedExample } : {}),
  };
}

function pickPrimitive(p) {
  const out = {
    id: p.id,
    name: p.name,
    kind: p.kind,
    summary: p.summary,
  };
  if (p.hostZone !== undefined) out.hostZone = p.hostZone;
  if (p.hostZoneRationale !== undefined) out.hostZoneRationale = p.hostZoneRationale;
  if (Array.isArray(p.vocabulary)) {
    out.vocabulary = p.vocabulary.map((v) => ({ term: v.term, role: v.role }));
  }
  if (Array.isArray(p.severityLadder)) {
    out.severityLadder = p.severityLadder.map((r) => ({
      rung: r.rung,
      meaning: r.meaning,
    }));
  }
  if (Array.isArray(p.subShelves)) {
    out.subShelves = p.subShelves.map((s) => ({ name: s.name, role: s.role }));
  }
  if (Array.isArray(p.rejectedAlternatives)) {
    out.rejectedAlternatives = p.rejectedAlternatives.map((r) => ({
      name: r.name,
      reason: r.reason,
    }));
  }
  if (p.principle !== undefined) out.principle = p.principle;
  if (p.scope !== undefined) out.scope = p.scope;
  return out;
}

function buildSnapshot(json) {
  if (!json.grammar || !Array.isArray(json.teachers) || !Array.isArray(json.zones)) {
    throw new Error(
      "constellation.json is missing required fields (grammar, teachers, zones).",
    );
  }
  return {
    version: json.version,
    lastUpdated: json.lastUpdated,
    grammar: {
      practice: json.grammar.practice,
      zoneSystem: json.grammar.zoneSystem,
      axiom: json.grammar.axiom,
    },
    principles: (Array.isArray(json.principles) ? json.principles : []).map(
      pickPrinciple,
    ),
    constellationWidePrimitives: (Array.isArray(json.constellationWidePrimitives)
      ? json.constellationWidePrimitives
      : []
    ).map(pickPrimitive),
    teachers: json.teachers.map((t) => ({
      name: t.name,
      channel: t.channel ?? null,
      tagline: t.tagline,
    })),
    zones: json.zones.map((z) => pickZone(z)),
    preZone: (Array.isArray(json.preZone) ? json.preZone : []).map((z) =>
      pickZone(z, { defaultZone: -1 }),
    ),
    z3: pickZ3(json.zones),
  };
}

function render(snapshot) {
  const banner =
    `// AUTO-GENERATED by scripts/sync-constellation.js — do not edit by hand.\n` +
    `// Source: artifacts/codetry-handbook/data/constellation.json (canonical, in-tree)\n` +
    `// Refresh:  pnpm --filter @workspace/codetry-handbook run sync-constellation\n` +
    `// Verify:   pnpm --filter @workspace/codetry-handbook run check-constellation\n` +
    `//\n` +
    `// This is a *bundled snapshot* of the canonical constellation manifest, which\n` +
    `// now lives inside the codetry-handbook artifact (Task #562). The handbook\n` +
    `// reads from it for Part III; the books site, the mobile Pioneer Path, and the\n` +
    `// Practitioner Operating Plan all read the same JSON via package exports or a\n` +
    `// build-time copy step.\n` +
    `//\n` +
    `// ConstellationZone type is derived automatically from ZONE_FIELD_SCHEMA in\n` +
    `// scripts/sync-constellation.js. To add a new zone field, edit that schema\n` +
    `// and re-run this script — the type and pickZone() update together.\n` +
    `\n`;

  const types =
    `export type WorkedExample = { name: string; rule: string };\n` +
    `\n` +
    deriveZoneType() +
    `\n` +
    `export type ConstellationZ3Pointer = {\n` +
    `  zone: number;\n` +
    `  name: string;\n` +
    `  memberFacingBrand: string | null;\n` +
    `  standby: string;\n` +
    `};\n` +
    `\n` +
    `export type Teacher = {\n` +
    `  name: string;\n` +
    `  channel: string | null;\n` +
    `  tagline: string;\n` +
    `};\n` +
    `\n` +
    `export type ConstellationPrinciple = {\n` +
    `  id: string;\n` +
    `  name: string;\n` +
    `  statement: string;\n` +
    `  workedExample?: string;\n` +
    `};\n` +
    `\n` +
    `export type StandbyVocabularyEntry = { term: string; role: string };\n` +
    `export type StandbyLadderRung = { rung: string; meaning: string };\n` +
    `export type StandbySubShelf = { name: string; role: string };\n` +
    `export type StandbyRejectedAlternative = { name: string; reason: string };\n` +
    `\n` +
    `export type ConstellationWidePrimitive = {\n` +
    `  id: string;\n` +
    `  name: string;\n` +
    `  kind: string;\n` +
    `  summary: string;\n` +
    `  hostZone?: number;\n` +
    `  hostZoneRationale?: string;\n` +
    `  vocabulary?: StandbyVocabularyEntry[];\n` +
    `  severityLadder?: StandbyLadderRung[];\n` +
    `  subShelves?: StandbySubShelf[];\n` +
    `  rejectedAlternatives?: StandbyRejectedAlternative[];\n` +
    `  principle?: string;\n` +
    `  scope?: string;\n` +
    `};\n` +
    `\n` +
    `export type ConstellationSnapshot = {\n` +
    `  version: string;\n` +
    `  lastUpdated: string;\n` +
    `  grammar: {\n` +
    `    practice: string;\n` +
    `    zoneSystem: string;\n` +
    `    axiom: string;\n` +
    `  };\n` +
    `  principles: ConstellationPrinciple[];\n` +
    `  constellationWidePrimitives: ConstellationWidePrimitive[];\n` +
    `  teachers: Teacher[];\n` +
    `  zones: ConstellationZone[];\n` +
    `  preZone: ConstellationZone[];\n` +
    `  z3: ConstellationZ3Pointer | null;\n` +
    `};\n` +
    `\n`;

  const body =
    `export const constellation: ConstellationSnapshot = ${JSON.stringify(
      snapshot,
      null,
      2,
    )};\n`;

  return banner + types + body;
}

function readVersionFields(text) {
  const versionMatch = text.match(/"version":\s*"([^"]+)"/);
  const lastMatch = text.match(/"lastUpdated":\s*"([^"]+)"/);
  return {
    version: versionMatch?.[1] ?? "(unknown)",
    lastUpdated: lastMatch?.[1] ?? "(unknown)",
  };
}

function main() {
  const args = new Set(process.argv.slice(2));
  const check = args.has("--check");

  if (!fs.existsSync(SOURCE)) {
    console.error(`canonical constellation manifest not found: ${SOURCE}`);
    process.exit(1);
  }

  const json = JSON.parse(fs.readFileSync(SOURCE, "utf-8"));

  // --- Unhandled-field check: detect new JSON keys not yet in the schema ---
  const allZones = [
    ...(Array.isArray(json.zones) ? json.zones : []),
    ...(Array.isArray(json.preZone) ? json.preZone : []),
  ];
  const unhandled = findUnhandledZoneFields(allZones);
  if (unhandled.size > 0) {
    const fieldList = [...unhandled].sort().map((f) => `    - ${f}`).join("\n");
    const msg = [
      "",
      "  constellation.json has zone fields not registered in ZONE_FIELD_SCHEMA",
      "  or ZONE_EXCLUDED_FIELDS (scripts/sync-constellation.js):",
      "",
      fieldList,
      "",
      "  To include a field in the bundled snapshot and TypeScript type:",
      "    Add it to ZONE_FIELD_SCHEMA in scripts/sync-constellation.js,",
      "    then re-run:  pnpm --filter @workspace/codetry-handbook run sync-constellation",
      "",
      "  To intentionally exclude a field from the snapshot:",
      "    Add it to ZONE_EXCLUDED_FIELDS in scripts/sync-constellation.js.",
      "",
    ].join("\n");
    if (check) {
      console.error("constellation snapshot is OUT OF SYNC — unhandled zone fields:" + msg);
      process.exit(1);
    } else {
      console.warn("WARNING — unhandled zone fields will be skipped in the snapshot:" + msg);
    }
  }

  const snapshot = buildSnapshot(json);
  const next = render(snapshot);

  if (check) {
    const existing = fs.existsSync(DEST) ? fs.readFileSync(DEST, "utf-8") : "";
    if (existing === next) {
      console.log(
        `constellation snapshot is in sync (version=${snapshot.version}, lastUpdated=${snapshot.lastUpdated}).`,
      );
      return;
    }

    const onDisk = readVersionFields(existing);
    const versionDrifted =
      onDisk.version !== snapshot.version ||
      onDisk.lastUpdated !== snapshot.lastUpdated;

    const lines = [
      "constellation snapshot is OUT OF SYNC with the canonical manifest.",
      `  on disk:   version=${onDisk.version} lastUpdated=${onDisk.lastUpdated}`,
      `  canonical: version=${snapshot.version} lastUpdated=${snapshot.lastUpdated}`,
      `  source:    artifacts/codetry-handbook/data/constellation.json`,
      `  snapshot:  artifacts/codetry-handbook/data/constellation.ts`,
      "",
      versionDrifted
        ? "  → version / lastUpdated have drifted; refresh the snapshot."
        : "  → version matches but content drifted; refresh the snapshot.",
      "",
      "  refresh with:",
      "    pnpm --filter @workspace/codetry-handbook run sync-constellation",
    ];
    console.error(lines.join("\n"));
    process.exit(1);
  }

  fs.writeFileSync(DEST, next);
  console.log(
    `wrote ${path.relative(workspaceRoot, DEST)} (version=${snapshot.version}, lastUpdated=${snapshot.lastUpdated}).`,
  );
}

main();
