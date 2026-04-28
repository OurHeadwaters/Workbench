// Renders the final brief in the Replit Agent task format. This is the
// only file that produces user-facing markdown; both the on-screen
// preview and the copy/download actions read from here.

import { activeGlossary, deriveSpec, generatePlainSummary, resolveTemplate, sessionLabel } from "./spec";
import type { SharedVisionSession } from "./types";

function ensureSentence(s: string): string {
  const trimmed = s.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : trimmed + ".";
}

function listOrEmpty(items: string[], emptyMsg: string): string {
  if (items.length === 0) return `_${emptyMsg}_`;
  return items.map((i) => `- ${i}`).join("\n");
}

export function generateBrief(session: SharedVisionSession): string {
  const template = resolveTemplate(session);
  const title = sessionLabel(session);
  const summary = ensureSentence(generatePlainSummary(session));
  const spec = deriveSpec(session);
  const glossary = activeGlossary(session);

  const metaphorLine = template
    ? `Described as ${template.article} **${template.noun}**.`
    : "_No metaphor chosen yet._";

  const glossaryBody =
    glossary.length === 0
      ? "_No shared terms yet._"
      : glossary
          .map((g) => `- **${g.metaphor}** → ${g.spec} _(${g.category})_`)
          .join("\n");

  return [
    `# ${title}`,
    "",
    "## What & Why",
    metaphorLine,
    "",
    summary || "_Not described yet._",
    "",
    "## Done looks like",
    "- The agent can build something where:",
    spec.entities.length
      ? `  - the ${
          template?.noun ?? "thing"
        } holds: ${spec.entities.join(", ")}`
      : `  - the items it holds are still to be defined`,
    spec.actors.length
      ? `  - the people involved are: ${spec.actors.join(", ")}`
      : `  - the people involved are still to be defined`,
    spec.actions.length
      ? `  - the things that happen to it are: ${spec.actions.join(", ")}`
      : `  - the things that happen to it are still to be defined`,
    spec.triggers.length
      ? `  - it changes when: ${spec.triggers.join("; ")}`
      : `  - what triggers a change is still to be defined`,
    "",
    "## Out of scope",
    "- Anything not described above. If a feature isn't named here, the agent should ask before building it.",
    "- Replacing the practitioner's own words with technical names. Keep the glossary's metaphor terms in any user-facing copy.",
    "",
    "## Glossary",
    "The practitioner's words on the left, the spec equivalent on the right. Reuse the left-hand words in any copy you write back to them.",
    "",
    glossaryBody,
    "",
    "## Spec",
    "### Entities (what's collected/held)",
    listOrEmpty(spec.entities, "none yet"),
    "",
    "### Actors (who interacts)",
    listOrEmpty(spec.actors, "none yet"),
    "",
    "### Actions (what gets done)",
    listOrEmpty(spec.actions, "none yet"),
    "",
    "### Triggers (when things happen)",
    listOrEmpty(spec.triggers, "none yet"),
    "",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
