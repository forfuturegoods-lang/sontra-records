# Audio files

Drop your track files here to power the site's player — **no Bandcamp needed.**

## How it works
- **Naming convention:** name each file after its catalog number, lower-cased —
  e.g. `sr-012.mp3` for release `SR-012`. The player finds it automatically.
- **Override:** to use a different name/path/format, set an `audio:` field on the
  release in `../../script.js`, e.g. `audio: "assets/audio/my-track.m4a"`.
- **Formats:** any browser-playable format works — `.mp3`, `.m4a`, `.ogg`, `.wav`.
  (MP3 is the safest cross-browser default.)

## Turn it on
1. Put your files in this folder (named as above).
2. In `script.js`, set `AUDIO_ENABLED = true`.
3. Done — the waveform player now plays your audio (press play → scrub to seek).

Tip: short, web-optimised files load fastest (e.g. a 60–90s preview, MP3 ~128–192 kbps).
While `AUDIO_ENABLED` is `false`, the player runs as a silent visual demo.
