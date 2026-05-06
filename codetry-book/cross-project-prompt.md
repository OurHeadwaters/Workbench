# Cross-Project Content Sweep Prompt
*Copy-paste this prompt into any of the founder's other Replit projects to run the same archaeological sweep and return structured content for the Codetry book.*

---

## How to use this prompt

1. Open a Replit project you want to sweep.
2. Start a new agent conversation in that project.
3. Paste the entire block below as your first message.
4. The agent will sweep the codebase, conversation history, and git history, then return a structured markdown document.
5. Paste the returned document into `codetry-book/harvest.md` under the appropriate sections, preserving the source labels.

---

## THE PROMPT — copy everything below this line

---

You are conducting a **content archaeology sweep** on this Replit project on behalf of the founder. The goal is to recover original prose, narratives, metaphors, and voiced copy that was written during development — text that carries the founder's voice and might belong in a book about community economics, practitioner discipline, and building software for northern communities.

**The book has five sections plus a mandatory Unplaced Gems section. Every passage you recover must go under one of these headings — use the exact titles below:**

1. **The Headwaters** — origin stories, place, founding myth, why the work started, the founding voice before it was refined
2. **Watching the Beavers** — field observations, what community economics actually looks like on the ground, failure modes, things the practitioner sees that consultants don't
3. **The Dam Breaks** — the discipline arriving, the practice of naming, the moment work becomes a system, the founding examples
4. **Codetry as Architecture** — the named systems, the constellation, primitives, the Gate, the Standby, the deep grammar of the discipline, tokenization, literate programming
5. **Sons & Daughters of Thunder** — the pioneers, the launch, the voice of the work, the exit, the closing
6. **Unplaced Gems** — verified passages that are too good to drop but do not clearly belong in sections 1–5; do not use section 5 as a catch-all; anything uncertain goes here

**Section titles are a contract.** Use them verbatim so that output from multiple project sweeps can be merged by header without manual relabelling.

---

## What to sweep

Search **all of the following** before writing your response. Do not skip any layer.

### 1. The codebase — all files

Read every file that contains human prose. Focus especially on:

- **TypeScript/TSX data files** — `data/*.ts`, files named `copy.ts`, `content.ts`, `handbook.ts`, `narration*.ts`, any file with long string literals
- **React component files** — any component that renders prose directly (not fetched from an API), especially landing pages, about pages, marketing pages, walkthrough steps, onboarding flows, philosophy pages, bio pages
- **Markdown files** — `*.md`, `public/**/*.md`, `narration/**/*.md`, README files that contain voiced prose (not just setup instructions)
- **JSON data files** — `*.json` files that contain descriptive text, definitions, vocabulary, narrative fields
- **Print/marketing pages** — any page whose purpose is to be printed or read by a community member
- **Infographic HTML** — any `*.html` files in `public/infographics/` or similar

For each file, read the entire file, not just the first section.

### 2. Git history — deleted content

Run the following command and read the output carefully:

```
git log --all --diff-filter=D --name-only --pretty=format:"--- %h %s ---" -- "*.ts" "*.tsx" "*.md" "*.json" | head -200
```

Then, for any file that was deleted and whose name suggests it contained prose (narration, copy, handbook, content, philosophy, story, about, etc.), retrieve the file contents from git:

```
git show <commit-hash>:<filepath>
```

Read those deleted files in full and extract any prose that belongs in the book.

### 3. Conversation/chat history (if accessible)

If this project has a `.local/` directory or any stored conversation logs, read them. Conversations between the founder and the agent often contain the sharpest early versions of ideas — the version before it got polished into UI copy.

Look specifically for:
- Moments where the founder described the purpose of the project in one sentence
- Moments where the founder named something for the first time
- Moments where the founder said "that's not the right word" or "what I mean is..."
- Moments where the founder quoted something they had read or heard

---

## Rules for extraction

**Verbatim only.** Do not paraphrase, summarize, or synthesize. If the prose is good, quote it exactly. If the prose needs context, add a one-sentence bracketed note *after* the quote, not inside it.

**Source label every passage.** Every passage must end with a source label in this format:
> **Source:** `artifact-name/path/to/file.tsx` — brief description of where in the file

**Minimum quality bar.** Only include a passage if at least one of the following is true:
- It contains a metaphor or image that could not be generic
- It names something precisely that others leave vague
- It sounds like the founder's voice, not a consultant's voice
- It would make a reader stop and re-read the sentence
- It says something true that is rarely said in this field

**Do not include:**
- Boilerplate UI copy ("Click here to learn more")
- Navigation labels or button text (unless the label itself is unusually precise)
- Code comments that are purely technical
- Error messages, loading states, placeholder text
- Text that is clearly a template from a library or framework

---

## Output format

Return a single markdown document structured as follows. Every passage goes under one of the six section headings (five book sections plus Unplaced Gems). Within each section, number the passages sequentially (e.g. [1.1], [1.2], [2.1], etc.). Use the same format as this example:

```markdown
## Section 1 — The Headwaters
*Origin, place, founding myth, why the work started.*

---

### [1.1] Brief title for this passage

> The verbatim prose goes here, exactly as found in the source.
> Multi-paragraph quotes are fine — use a `>` on every line.

**Source:** `artifact-name/path/to/file.tsx, lines N–N` — description of context

---

### [1.2] Next passage title

> ...

**Source:** ...

---

## Section 2 — Watching the Beavers
...

## Section 3 — The Dam Breaks
...

## Section 4 — Codetry as Architecture
...

## Section 5 — Sons & Daughters of Thunder
...

## Unplaced Gems
*Verified passages that do not clearly belong in sections 1–5. Hold for placement.*

---

### [UG-1] Brief title

> ...

**Source:** ...
```

**The `## Unplaced Gems` section is required.** If you have no unplaced passages, write:

```markdown
## Unplaced Gems
*No unplaced passages from this project.*
```

---

## Specific things to look for across all projects

The book is about a specific set of ideas. If you find prose that touches any of these, it almost certainly belongs in the harvest:

- **The headwaters / dam / river / water metaphor** used to describe where decisions are made
- **The eagle story** — the founder asking an eagle for direction, the eagle circling and flying north
- **The constellation** — the full set of economic systems a community runs, distinct but gravitationally related
- **Primitives** — named systems inside the constellation that do specific, irreducible jobs
- **The Gate** — the membrane between the community's own dialect (bright side) and institutional language (massity)
- **The Standby** — emergency preparedness as a living system, resting state / activated state, one infrastructure / two states
- **Bright side** — the community's own words in its own kitchens and meetings
- **Massity** — the language regulators, bankers, and lawyers will accept; neither dialect wrong in its own context
- **Refused** — a first-class Gate outcome, not a failure
- **The rename test** — if you renamed this thing to something generic, what would you lose?
- **One word → one referent** — the field rule from the codetry ledger
- **Type / Token / Name** — name as the layer between compiler and model, the only layer the human author still owns
- **Sons and daughters of thunder** — the pioneer cohort, those who kept the headwaters while the world slept
- **The icon is a ship** — not a fortress, not a temple, a vessel ready to leave the known shore
- **Base first, then cohort, then visitors** — the phasing rule for who gets invited when
- **Inspector standing** — the right that cannot be negotiated away
- **Additive only** — the rule that the binder spec can grow but cannot quietly shrink
- **Skill is the root of sovereignty** — the embodied competence argument
- **Trust is a protocol** — not a feeling; when the protocol fails, control fills the space
- **The calm before the storm** — the pioneer chapter's opening line
- **The Jarista** — the household preservation practice, the Jar Kitchen, Parr's Jars
- **Salt of the Earth** — the product line, but also the ethos
- **Working with what you have** — the 1930 framing, worn with pride
- **The codetry book** — any passage that describes what the practice is for

If you find prose related to any of these, include it even if it seems minor. The harvest is meant to recover everything — editorial selection happens later.

---

## What to return

Return only the structured markdown document. No preamble, no explanation of what you found, no summary of what you skipped. Just the passages, labelled, in the five-section format.

If you find nothing in a section, write:

```markdown
## Section N — [Section Title]
*No passages recovered from this project.*
```

At the end of the document, add a brief metadata block:

```markdown
---
**Project swept:** [project name or Replit URL]
**Sweep date:** [date]
**Files read:** [list of files that contained recoverable prose]
**Git history:** [note whether deleted files were checked and whether any were recovered]
**Conversation history:** [note whether chat logs were accessible and whether anything was recovered]
**Total passages harvested:** [count]
```

---

*End of prompt.*
