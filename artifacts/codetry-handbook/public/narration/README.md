# Pioneer Path narration

Drop the recorded narration MP3 for each station here. The Path's audio
player picks them up automatically the next time the page loads — no
code change required. The Listen block on the station screen plays the
file with a scrubber, 15-second skip buttons, speed pill, sleep timer,
and OS-level media-session controls; position is auto-saved every five
seconds and resumes on the next visit.

The files are served from `<base>/narration/<slug>.mp3`, where `<base>`
is the artifact's web base URL (currently `/codetry-handbook/`).

## What ships in this folder

For each station there is one `.md` script (the words being read) and one
`.mp3` audio (the recording). Filenames must match `narrationSlug` from
`data/pioneerPath.ts`:

| Station          | Script               | Audio                |
| ---------------- | -------------------- | -------------------- |
| The Saltbox      | `the-saltbox.md`     | `the-saltbox.mp3`    |
| Both-States      | `both-states.md`     | `both-states.mp3`    |
| Both-Sides       | `both-sides.md`      | `both-sides.mp3`     |
| The Standby      | `the-standby.md`     | `the-standby.mp3`    |
| The Gate         | `the-gate.md`        | `the-gate.mp3`       |

If a `.mp3` is missing, the station shows a "narration hasn't been
recorded yet" placeholder and the reader can still walk the rest of the
station. If a `.md` is missing, the next narrator has to compress the
chapter from scratch — please don't let that happen.

## Recording recipe

Aim for a single, named voice across the whole Path. The current bake
is a `gpt-audio` voice ("ash") generated from the scripts in this folder
(see `.local/scripts/generate-narration.mjs` for the exact pipeline).
The founder has approved this voice as the default. A real human re-record
is welcome at any time — overwrite the `.mp3` and the player picks it up
on the next page load. Mix human and TTS voices only as a last resort;
the Path is a walked edition, and a consistent narrator is part of the
walk.

### Length

- **Per station:** 60–180 seconds. The current set runs 1:42, 2:17, 2:21,
  2:16, 2:25 (Saltbox → Gate). Stay inside that window so the station
  feels like a held breath, not a chapter.
- **Words:** about 200–320, the length of the `.md` script in this folder.

### Source

- The script lives next to the audio in this folder. Edit the `.md`,
  re-run the generator (or re-record), and the file at the same path
  takes over. **Don't write a script from scratch** — every script is a
  tightening of an existing handbook chapter, and the Path inherits the
  book's voice that way.

### File format

- **Container:** `.mp3` only. The player resolves `<base>/narration/<slug>.mp3`
  and a missing file is treated as a 404 (graceful placeholder).
- **Bit rate:** 96–128 kbps mono is plenty for a single voice. The current
  set is ≈64 kbps mono and weighs in at 0.9–1.3 MB per clip.
- **Sample rate:** 24 kHz or 44.1 kHz. The OS media-session shows the
  scrubber correctly either way.

### Loudness and tone

- **Target loudness:** roughly −16 LUFS integrated, −1 dBTP true peak.
  Loud enough to ride over a walking-around environment; quiet enough
  not to clip on phone speakers.
- **Tone:** warm, considered, unhurried. Pause around blank lines in the
  script. Land each em-dash. Italics are a gentle lean, not a theatrical
  push. The handbook is a friend reading to you across a kitchen table.
- **Tail silence:** leave at least one full second of room tone after the
  last word. The player's resume logic clamps to `duration − 1`, and a
  hard cut feels abrupt under the OS notification chrome.

### If you record with a microphone

- A condenser or large-diaphragm dynamic on a stand, 6–8 inches off-axis,
  pop filter, recorded direct into a quiet room. No phone speakers.
- Capture at 24-bit / 48 kHz; high-pass at 80 Hz; light de-essing if your
  voice is sibilant; export down to mono 96 kbps MP3.
- Keep the room consistent across all five clips. The Path is one walk
  — five rooms breaks the spell.

### If you regenerate from TTS

- The script `.local/scripts/generate-narration.mjs` reads each `.md`,
  strips the front-matter and markdown emphasis, and asks `gpt-audio`
  (voice `ash`) to read it back as MP3 via the Replit AI Integrations
  proxy. Run with `node .local/scripts/generate-narration.mjs` — env
  vars are auto-set if the OpenAI integration is provisioned.
- One station at a time can be re-baked with `node .local/scripts/generate-one.mjs <slug>`.
- The model is non-deterministic; re-running re-generates the audio.
  Re-bake all five together when you change the voice or the system
  prompt, so the set stays of-a-piece.

## Adding a new station

1. Add the station to `data/pioneerPath.ts` with a unique `narrationSlug`.
2. Drop a `<slug>.md` script in this folder, tightened from the source
   chapter. Keep it inside the 60–180-second budget above.
3. Either record the `.mp3` by hand, or add the slug to the `SLUGS` array
   in `.local/scripts/generate-narration.mjs` and re-run.
4. The player picks the file up on the next page load — no code change
   required.
