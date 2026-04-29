# Partnership intel — private outreach folder

This folder is the practitioner's private dump for outreach intel: notes,
contact lists, scraped pages, advisor emails, and other raw material that
informs **Plan B** (`/plan-b` in the Practitioner Operating Plan app) when
the Deer Lake engagement stalls or doesn't sign.

## What this folder is for

- Storing whatever raw partnership material the practitioner has on hand —
  PDFs, emails copied to text, screenshots of org charts, contact lists,
  Notion exports, etc.
- Acting as a holding area the **Plan B** page can be re-seeded from on
  any future pass (the page renders from typed data in
  `artifacts/practitioner-operating-plan/src/data/planB.ts` and
  `…/planBFunders.ts`; this folder is the source material someone walks
  in with before editing those files).

## What this folder is NOT for

- **Not** the Northern Food Systems Research Library. Anything that should
  be public, deduped, and curator-reviewed belongs in the library
  (`artifacts/library/`), not here. Promoting an item from this folder
  into the library is a separate, intentional curation pass — never
  automatic.
- **Not** committed-public reference material. Treat the contents as
  private intel: real names, draft pitches, candid notes about which orgs
  are warm vs. cold. The folder lives in the repo because it is
  small-team-shared, not because it is publishable.
- **Not** a CRM. There is no contact tracker, no "last touched" field, no
  status workflow. If you need that, use a tool that does it; this folder
  is a holding place for raw inputs.

## Suggested structure

The Plan B page does not require any specific layout — it reads from the
typed data files, not from this folder directly. The structure below is
what the Plan B authoring pass expects to find when re-seeding:

```
docs/partnerships/
├── README.md                 (this file)
├── ifna.md                   (one file per target org / cluster)
├── shibogama.md
├── windigo.md
├── keewaytinook-okimakanak.md
├── nan-economic-development.md
├── slfnha.md
├── treaty-3.md
└── dump/                     (free-form raw downloads)
    ├── ifna-2025-board.pdf
    ├── nan-edcorp-strategy-deck.pdf
    └── …
```

One file per target org with a short header (org name, who it serves,
key contact if known, why-them rationale, what-to-lead-with angle) makes
the Plan B re-seed pass mechanical: read the per-org file, transcribe
the rationale into `outreachTargets[]`, mark `confidence: "confirmed"`
if the file represents real intel and `"seed"` if it's still placeholder.

The `dump/` subfolder is where raw downloads live before they've been
distilled — the practitioner drops things here, and the next authoring
pass walks the dump and either promotes items into a per-org file or
leaves them alone.

## Confidence flags in the data files

Every line in `planB.ts` and `planBFunders.ts` carries a
`confidence: "seed" | "confirmed"` flag. Items marked `"seed"` are
placeholders the executor wrote from existing project context — they
are usable on day one but the practitioner should expect to sharpen
them. Items marked `"confirmed"` reflect actual intel from this folder.
The Plan B page surfaces the seed/confirmed split visibly so the
practitioner can see at a glance which lines need a second pass.
