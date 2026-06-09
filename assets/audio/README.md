# Audio files

Drop your track files here to power the site's player — **no Bandcamp needed.**

## Format
- **WAV · 24-bit · 44.1 kHz** (PCM) is the target master format. The player
  decodes it natively via the Web Audio API.
- Other browser-decodable formats also work (`.wav`, `.mp3`, `.m4a`, `.ogg`) — set
  an `audio:` path on a release to override the default.

## Naming convention
- Name each file after its catalog number, lower-cased — e.g. `str001.wav` for
  release `STR001`. The player finds it automatically.
- Override: set an `audio:` field on the release in `../../script.js`, e.g.
  `audio: "assets/audio/blue-friday.wav"`.

## Turn it on
1. Put your files in this folder (named as above).
2. In `script.js`, set `AUDIO_ENABLED = true`.
3. Done — the waveform player plays your audio (press play → scrub to seek on the beat grid).

Heads-up: the engine decodes the whole file into memory (24-bit/44.1 kHz stereo is
~16 MB per minute on disk, more once decoded), so keep web previews reasonably
short (≈60–120 s). While `AUDIO_ENABLED` is `false`, the player runs as a silent demo.
