# CAPTURE — Raw Thought Intake

Use this file to drop any side-thought, half-formed idea, or sudden observation before it disappears. You don't need to know what it is yet — just get it on the page in the template below. The planning agent reads this file and turns each entry into a properly-scoped task with full constellation context, before it touches the task backlog.

One entry per block. Copy the template, fill it in, leave the rest blank if you're unsure. "Unsure" is a valid answer everywhere. Speed matters more than completeness — a half-filled entry beats a lost thought.

---

## Template (copy and fill in for each new thought)

```
---
## [Short name for the thought — a few words]

**Raw thought:** [Exactly as it hit you — messy, incomplete, first-person. Don't clean it up.]

**Constellation:** [Which constellation does this belong to? Options: Codetry / Pioneer Path / Word Walk / The Gate & The Standby / Headwaters Platform / 807 Benefits / Bright Side / Library / Print Marketing / Deer Lake / Agency Operations / Saltbox / Practitioner's Guide V2 / Unsure]

**Connects to:** [Any task numbers, artifact names, or other thoughts this links to. Leave blank if unknown.]

**Urgency:** [now / next / later]

**Notes:** [Anything else the planning agent needs to know — constraints, who's affected, what not to do.]
---
```

> **Required for new task files:** Every `.local/tasks/*.md` file created on or after 2026-05-15 must include a `constellation:` field in its YAML front-matter block. The `pnpm run check-constellations` linter enforces this and exits non-zero if the field is missing.
>
> When the planning agent files a CAPTURE entry as a task, it must add `constellation:` to the new task file's front-matter:
>
> ```yaml
> ---
> title: My task title
> constellation: Codetry
> ---
> ```
>
> Valid values: `Codetry` / `Pioneer Path` / `Word Walk` / `The Gate & The Standby` / `Headwaters Platform` / `807 Benefits` / `Bright Side` / `Library` / `Print Marketing` / `Deer Lake` / `Agency Operations` / `Saltbox` / `Practitioner's Guide V2`
>
> If the constellation is not yet clear, use `Unsure` — that is still a valid value and will pass the check.

Once the planning agent files this entry as a task, it will add the task number in square brackets next to the heading, like:
`## My thought [#1042]`
A bracketed number means it's filed — no action needed from you.

---

## How the planning agent uses this

At the start of every planning session, the planning agent checks this file for unfiled entries — any entry under `## Entries` that does not yet have a task number in square brackets next to its heading.

For each unfiled entry, the agent:
1. Reads the raw thought and identifies which constellation it belongs to (or flags "Unsure" to the founder)
2. Opens `.local/constellation-map.md` to confirm the constellation and surface related tasks and artifacts
3. Scopes it into a properly-formed task: one-sentence objective, done-looks-like checklist, ordered steps, relevant files, and which revenue layer it serves
4. Checks the existing task backlog for overlaps or dependencies — merges or links rather than duplicates
5. Proposes the scoped task to the founder before adding it to the queue — does not self-approve
6. Once the founder approves, notes the task number in square brackets next to the entry heading here (e.g. `## My thought [#1042]`)

Entries are never deleted — they accumulate as a log. Entries with a task number are already filed and are skipped in future sessions.

---

## Entries

_(Paste new entries below this line.)_
