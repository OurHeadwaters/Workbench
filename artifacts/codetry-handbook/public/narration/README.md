# Pioneer Path narration

Drop the recorded narration MP3 for each station here. The Path's
audio player picks them up automatically the next time the page loads
— no code change required.

Filenames must match `narrationSlug` from `data/pioneerPath.ts`:

- `the-saltbox.mp3`
- `both-states.mp3`
- `both-sides.mp3`
- `the-standby.mp3`
- `the-gate.mp3`

If a file is missing, the station shows a "narration hasn't been
recorded yet" placeholder and the reader can still walk the rest of
the station.

The files are served from `<base>/narration/<slug>.mp3` where `<base>`
is the artifact's web base URL (currently `/codetry-handbook/`).
