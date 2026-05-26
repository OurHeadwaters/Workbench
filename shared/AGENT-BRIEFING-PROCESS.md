# Agent Briefing Process
_How we hand context to every named agent in this project._

---

## The problem this solves

Every agent starts cold. Without a proper brief, the first chunk of every session is re-sculpting context that already exists somewhere in the repo. That's tax, not work. Bobbie named this as the biggest point of friction in the project.

## The rule

Every named agent in this project gets at least one brief in `shared/`.

A brief is self-contained. The agent reads it and is ready. No other files required.

## What a brief contains

1. **What the agent is** — identity, register, what they hold
2. **What they need to know to not miss the point** — the domain content, inline, in full, in the agent's voice
3. **Where the edges are** — what exists, what's still raw, what hasn't been written yet
4. **The founding words** — Bobbie's verbatim language when it matters

## What a brief is NOT

- Not a cross-reference document (no "see also," no file paths)
- Not an archive (no full audit tables)
- Not written for a reader who knows the repo
- Not a summary of work done — it is the material itself, ready to be spoken from

The last line of every brief: "This brief is self-contained. Nothing else is required to speak from it."

## File naming convention

```
shared/
  arc-system-prompt.txt       ← Arc's identity (existing)
  arc-hempcrete-brief.md      ← Arc's hempcrete domain brief (existing)
  [agent]-[domain]-brief.md   ← pattern for all future briefs
```

When a domain of knowledge expands significantly (new audit, new framework, major new content), a new brief gets written or the existing one gets updated.

## Who maintains the briefs

The main agent maintains these as the project evolves. When a significant body of work is completed in a domain — an audit, a new framework, a set of session docs — a brief gets written or updated before the session closes.

## The test for a good brief

Read it cold. If the agent can speak accurately from it without opening anything else, it passes. If they would miss the point, it doesn't pass yet.

---

## Current briefs in this project

| Agent | Brief file | Domain | Status |
|---|---|---|---|
| Arc | `arc-system-prompt.txt` | Identity, kits, stomping path | Live |
| Arc | `arc-hempcrete-brief.md` | Hempcrete — all 9 uses, the gap, the founding prompt | Live |

_Add a row every time a new brief is written._
