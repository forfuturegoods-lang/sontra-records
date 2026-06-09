# SPEC — Sontra Records Website

> **Source of truth.** Per the SPEC-First rule (see `CLAUDE.md`), this file is
> edited *before* code. Every change to the site must be specified here first,
> and committed together with its implementation.

- **Spec version:** 1.7.1
- **Status:** Implemented (Web Audio player + beat grid + Supabase admin/CMS — see §11)
- **Last updated:** 2026-06-09

---

## 1. Purpose

A fast, fully static marketing + catalog site for **Sontra Records**, an
independent electronic music label. No backend: audio is embedded via Bandcamp
iframes; email signups go through a free third-party service (Formspree/Mailchimp).

## 2. Non-goals

- No server, database, auth, or build step.
- No CMS — content is edited directly in `script.js`.

## 3. Tech stack

- HTML5, CSS3 (vanilla, no framework), vanilla JS.
- Typeface: JetBrains Mono (Google Fonts).
- Hosting: any static host (Netlify / Vercel / GitHub Pages / Cloudflare Pages).

## 4. Pages

| Page            | Sections                                                        |
|-----------------|----------------------------------------------------------------|
| `index.html`    | Hero · Latest Releases (3 newest) · All Releases · Subscribe    |
| `releases.html` | Page header · Year/Genre filters · Full catalog grid           |
| `about.html`    | Editorial manifesto · Label stats · CTAs                       |

Shared components: sticky navbar (hamburger ≤680px), release card, footer.

## 5. Data model — single source of truth

Releases load from **Supabase** when configured (the team manages them via
`admin.html`); otherwise the public site falls back to the built-in `RELEASES`
array in `script.js`. Both map to the same shape the homepage + releases page
render from. Each release:

```
catalog, title, artist, year, genre, bpm, beatOffset,
cover (image), audio (file/URL), buyUrl, donateUrl
```

- Homepage: `[0]` featured in the hero, `slice(1,4)` = Latest, `slice(4)` = All.
- Releases page: all releases; year + genre filter toggles are generated from
  the distinct values in the data.

## 6. Integrations

- **Player (self-hosted audio — no Bandcamp needed).** Each release uses the
  site's own player: an interactive **waveform scrubber** (press play → the
  waveform drops to full width; click / arrow-keys to seek). Power it by hosting
  your own audio — set `AUDIO_ENABLED = true` in `script.js` and drop each track
  in `assets/audio/` named `<catalog>.wav` (e.g. `str001.wav`, WAV 24-bit/44.1 kHz), or set an explicit
  `audio:` path per release (any browser format: mp3/m4a/ogg/wav). With audio off
  it runs as a silent visual demo. `customPlayer()` builds it; `setupPlayer()`
  wires playback via the **Web Audio API** (decode-once buffer playback —
  sample-accurate, gapless). **Beat grid (Ableton-style):** each release has a `bpm`; the
  player draws a tempo grid on the waveform and seeking **snaps to it** (snap
  control cycles bar / beat / off) so jumps land in time. *Optional:* Bandcamp
  embeds remain available via
  `BANDCAMP_ENABLED` + a real `albumId` (`bandcampSrc`, styled
  `bgcol=111111 / linkcol=ffffff`).
- **Email:** `<form class="subscribe__form">` posts to a provider. Placeholder
  `action="https://formspree.io/f/YOUR_FORM_ID"`; until a real action is set,
  JS shows a friendly confirmation. AJAX submit when a real action is present.

## 7. Design system (tokens in `style.css` `:root`)

Background `#0a0a0a` · Surface `#141414` · Card `#222222` · Border `#333333` ·
Text `#e0e0e0` / dim `#888888` · Button `#d0d0d0`→`#ffffff` · Accent `#c8c8c8`.
Headings uppercase + wide tracking; flat panels, no gradients; 3px radii;
Buy = solid fill, Donate = outlined, filter toggles = pills (white when active).

## 8. Responsiveness

Card grid 3 (desktop) → 2 (≤960px) → 1 (≤680px). Navbar collapses to hamburger
≤680px. Honors `prefers-reduced-motion`.

## 9. Open items / backlog

- [ ] Add audio to `assets/audio/` (named `<catalog>.wav`, WAV 24-bit/44.1 kHz) + set `AUDIO_ENABLED = true` for real playback. _(self-hosted, no Bandcamp; silent demo until then — see §11. Bandcamp embeds remain an optional alternative.)_
- [ ] Replace placeholder cover art in `assets/covers/`.
- [ ] Set real Formspree/Mailchimp form action. _(deferred — `action` left as `YOUR_FORM_ID`; form shows a friendly confirmation until wired.)_
- [ ] Replace placeholder Bandcamp/social URLs in footers.
- [x] Connect GitHub remote for the sync bus — `origin` = forfuturegoods-lang/sontra-records (see `.sync/BUS.md`).

## 10. Change protocol

1. Edit this SPEC first (bump version, note the change under §9 or a changelog).
2. Implement to match.
3. Update `.sync/state.json`, then commit spec + code + state together.

---

## 11. Decision log

- **2026-06-09 — Defer real Bandcamp IDs + Formspree wiring.** The site ships in
  *placeholder mode*: Bandcamp embeds use placeholder `albumId`s (flagged
  `REPLACE WITH REAL…`) and the subscribe form keeps `action=…/YOUR_FORM_ID`,
  which makes `script.js` show a friendly confirmation instead of posting.
  Placeholder release titles/artists are kept. These placeholders are
  **intentional, not bugs.** To go live: supply the values, wire them in, and
  bump the spec accordingly. _(Note: the Formspree form still applies; Bandcamp
  is now optional — the site ships with its own self-hosted audio player, §11.)_
- **2026-06-09 — Interface-first: Bandcamp player placeholder.** Release cards
  render a styled disabled-player placeholder ("Player coming soon · streaming
  via sontra-bandcamp") instead of a live embed with fake IDs. Controlled by
  `BANDCAMP_ENABLED` (`false`) in `script.js`; flip to `true` once real album IDs
  are in. Lets the layout ship finished while waiting on sontra-bandcamp creds.
- **2026-06-09 — GitHub remote connected; bus online.** `origin` →
  `https://github.com/forfuturegoods-lang/sontra-records.git`, `main` pushed.
  `claude-remote` can now join by opening this repo. Note: commits so far are
  authored `pansan4o@gmail.com`; repo owner is a different GitHub identity
  (`forfuturegoods-lang`) — attribution fixed (see next entry).
- **2026-06-09 — Attribution fixed.** Set `git user.email` to the GitHub
  no-reply `287163746+forfuturegoods-lang@users.noreply.github.com` (and name to
  `forfuturegoods-lang`), rewrote all existing commits' author + committer to
  that identity, then force-pushed. Auth unchanged (stored token). The
  `Co-Authored-By: Claude` trailer is preserved on every commit.
- **2026-06-09 — Brand logo added.** Sontra Records logo
  (`assets/sontra-logo.jpg`, white-on-black) placed top-left in the navbar on all
  pages, featured large in the homepage hero, and set as favicon; the redundant
  text wordmark/logotype was removed.
- **2026-06-09 — Hero layout + logo sizing.** Hero is now two columns: brand
  (logo + tagline + status) on the left, the "Get notified about new releases"
  subscribe card moved to the **top-right** (compact variant). Hero logo enlarged
  ~25% (`clamp(275–450px)`); the navbar/header logo reduced ~50% (40→20px). The
  separate mid-page subscribe section was removed; `#subscribe` now resolves to
  the hero card. Stacks to one column ≤820px.
- **2026-06-09 — Hero features the newest release + interactive player.** The
  hero's big logo was replaced by the newest release (`RELEASES[0]`) shown as a
  horizontal feature (cover + meta + player + buy/donate). The placeholder player
  is now interactive: pressing play hides the mini wave and **drops a full-width
  waveform scrubber** (click / arrow-keys to seek), with mock progress + a running
  time; only one plays at a time. Homepage grids now render `slice(1,4)` /
  `slice(4)` so the featured release isn't duplicated. The logo remains in the
  navbar + favicon.
- **2026-06-09 — Self-hosted audio player (no Bandcamp).** The custom waveform
  player now plays a real `<audio>` element when `AUDIO_ENABLED = true`: progress
  and seek are driven by the audio's `currentTime`/`duration`; one track plays at
  a time. Audio resolves from `assets/audio/<catalog>.wav` (or a release's
  explicit `audio:` path). With it off, the player stays a silent demo. Player
  meta now shows the track title/artist (was "coming soon / bandcamp"); each
  release's waveform is rotated by a catalog seed so they look different. Bandcamp
  embeds remain optional via `BANDCAMP_ENABLED`.
- **2026-06-09 — Newest release = real release (Blue Friday).** Replaced the
  placeholder newest release: `RELEASES[0]` → catalog `STR001`, "Blue Friday" by
  "Sontra Crew", cover `assets/covers/str001-blue-friday.jpg` (user-supplied;
  portrait, cropped square in cards). Genre = House, year = 2026 (confirmed by
  label). Audio (when enabled) resolves to `assets/audio/str001.wav`.
  Buy/Donate still point to placeholder Bandcamp URLs — revisit since the site is
  now no-Bandcamp.
- **2026-06-09 — Beat grid (Ableton-style quantized seeking).** The player draws
  a tempo grid on the waveform (bold bar lines + faint beat lines, from a
  release's `bpm`, 4/4) and **snaps seeking to the grid**, so a jump lands in time
  and the groove stays aligned. A snap control cycles bar → beat → off; arrows
  step one grid unit. Works in the silent demo and on real audio (snaps
  `audio.currentTime`). `bpm` is per-release (`DEFAULT_BPM` otherwise) with an
  optional `beatOffset` for the first downbeat; Blue Friday's `bpm` (124) is a
  placeholder pending the real value.
- **2026-06-09 — Web Audio engine (gapless quantized seeking).** Real playback
  now uses the Web Audio API: each track is fetched + `decodeAudioData`'d once
  (cached) and played via an `AudioBufferSourceNode`; position comes from the
  AudioContext clock. A quantized seek stops the source and restarts it at the
  snapped offset — sample-accurate and click-free, so jumps are gapless and stay
  on the grid. Falls back to the silent demo if a file is missing/unsupported;
  shows a brief `is-loading` state while decoding. Replaces the HTML5 `<audio>`
  path (the player now reads a `data-audio` URL). Note: decoding loads the whole
  file into memory — keep web previews reasonably short. _(Not yet runtime-tested
  with a real file — verify once audio is added.)_
- **2026-06-09 — Audio format: WAV 24-bit / 44.1 kHz.** Default file convention
  changed from `.mp3` to `assets/audio/<catalog>.wav`; the Web Audio engine
  decodes 24-bit PCM WAV natively (other formats still work via an explicit
  `audio:` path). `audioUrlFor()` + the audio README updated.
- **2026-06-09 — Supabase admin/CMS (team-run, off personal GitHub).** Added a
  team content backend on Supabase so the label is run by non-technical staff
  without touching git. New files: `admin.html` / `admin.js` / `admin.css`
  (login via Supabase Auth, then create/edit/delete releases + upload artwork &
  audio to Storage), `supabase/schema.sql` (releases table + `covers`/`audio`
  buckets + RLS: public read, authenticated write), `supabase-config.js` (URL +
  anon key — blank until set), and `ADMIN-SETUP.md` (one-time setup guide). The
  public site now loads releases from Supabase when configured (`loadReleasesData`
  / `mapReleaseRow`, async boot `initSite`), falling back to the built-in
  `RELEASES` array otherwise; the player uses each release's own `audio` URL when
  present. Not yet runtime-tested against a live project (needs the user's
  Supabase URL + key) — verify after setup.
- **2026-06-09 — Supabase connected.** Project URL + publishable key wired into
  `supabase-config.js`; the admin page now shows the team login (was the setup
  notice). Verified the keys/project are reachable. Still pending the user
  running `supabase/schema.sql` — the `releases` table 404s until then. Shown via CSS
  `mix-blend-mode: screen` so the JPEG's black background drops out on the dark
  navbar (no transparency / image editing needed). A broken all-black earlier
  upload (`sontra_logo.png`) was removed. To update the logo, replace the file in
  `assets/`.
