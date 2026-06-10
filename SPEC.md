# SPEC — Sontra Records Website

> **Source of truth.** Per the SPEC-First rule (see `CLAUDE.md`), this file is
> edited *before* code. Every change to the site must be specified here first,
> and committed together with its implementation.

- **Spec version:** 1.8.3
- **Status:** Live (first release STR001 published via Supabase; team workflow documented — see §11)
- **Last updated:** 2026-06-10

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
- Hosting: **GitHub Pages** (live) — <https://forfuturegoods-lang.github.io/sontra-records/>,
  built from `main` / root (`.nojekyll`, legacy build); every push redeploys.
  Any other static host also works.

## 4. Pages

| Page            | Sections                                                        |
|-----------------|----------------------------------------------------------------|
| `index.html`    | Hero · Latest Releases (3 newest) · All Releases · Subscribe    |
| `releases.html` | Page header · Year/Genre filters · Full catalog grid           |
| `about.html`    | Editorial manifesto · Label stats · CTAs                       |

Shared components: sticky navbar (hamburger ≤680px), release card, footer. The
navbar also carries **Admin** + **Log out** items (after About) that are hidden by
default and revealed only when a team member is signed in to Supabase — Admin
opens the CMS, Log out ends the session (hiding both again). These are the
counterpart to the admin page's exits back to the site (§11).

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
  sample-accurate, gapless) on **desktop**. **Mobile / low-memory devices stream**
  instead (`useStreaming()` → `setupStreamingPlayer`, a streamed `<audio>` element)
  so the whole track never sits in RAM; the grid + snapping still work but a seek
  is a quantized jump with a small gap (the gapless splice needs the full buffer).
  **Beat grid (Ableton-style):** each release has a `bpm`; the
  player draws a tempo grid on the waveform and seeking **snaps to it** (snap
  control cycles bar / beat / off) so jumps land in time. Seeks while playing
  are **phase-preserving beat-jumps** (Traktor-style): the jump *distance* is
  quantized to whole snap units relative to the playhead — whole **bars** in BAR
  mode (the kick/snare bar structure — snare on 2 & 4 — survives every jump) or
  whole **beats** in BEAT mode — and the splice executes sample-accurately on
  the **next beat boundary** (short wait ≤ 1 beat; a blinking cue marker shows
  the landing point) with a ~3 ms crossfade so there is no click. Arrow keys
  step from the queued target, so repeated presses accumulate. With snap off
  (or while paused) seeks are immediate and unquantized. **Audio preload:** the
  first player on the page (homepage hero = newest release) starts fetching +
  decoding its audio right after load, so first play is near-instant; every
  other player preloads on first hover/touch/focus (intent), not eagerly — a
  large catalog never bulk-downloads. All paths share the decode cache, so a
  play during preload waits on the same promise (no double fetch). *Optional:* Bandcamp
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
  running `supabase/schema.sql` — the `releases` table 404s until then.
- **2026-06-09 — Supabase backend verified live.** Schema run. Confirmed via the
  REST API with the publishable key: public read of `releases` returns `[]`
  (HTTP 200); an unauthenticated insert is rejected by RLS (HTTP 401). Backend is
  ready; next is adding the first release through `admin.html` (team login). Shown via CSS
  `mix-blend-mode: screen` so the JPEG's black background drops out on the dark
  navbar (no transparency / image editing needed). A broken all-black earlier
  upload (`sontra_logo.png`) was removed. To update the logo, replace the file in
  `assets/`.
- **2026-06-10 — First release live + team workflow documented (TEAM-GUIDE.md).**
  STR001 "Where is James (DOTT remix)" by Anton Rotof published to Supabase:
  audio `audio/str001.m4a` (256 kbps AAC — the 98 MB WAV master exceeds the
  free-tier **50 MB upload cap**, so web audio is transcoded; masters stay
  offline), artwork `covers/str001.jpg`, row in `releases`. Two operational
  lessons captured: (1) storage uploads must set `cache-control: max-age=3600`
  (the admin page's uploader does; a raw API upload without it stored `no-cache`,
  forcing a full ~10 MB re-download on every play — fixed by re-uploading), and
  (2) the shared team auth user (`sontrarecords@gmail.com`) is confirmed + working
  after a reset via the Auth admin API. Added **`TEAM-GUIDE.md`**: the team
  checklist for publishing releases via `admin.html` (login, file prep incl. the
  50 MB limit + `afconvert` transcode line, form fields, edit/delete), with the
  Supabase-dashboard manual flow as an owner-only fallback. BPM/`beat_offset` for
  STR001 still unset — beat grid inactive until filled in.
- **2026-06-10 — STR001 beat grid set (bpm 130, beat_offset 1.37 s).** Values
  detected from the WAV master via spectral-flux onset analysis (autocorrelation
  tempogram → 130.0 BPM unambiguous; strongest of the 4 beat positions → first
  downbeat at 1.370 s). Written to the Supabase row via the team login. The bar
  anchor is an energy estimate — if bar snaps feel one beat off, the other
  candidates are 0.447 / 0.909 / 1.832 s.
- **2026-06-10 — Launch-quantized seeking (Ableton/Traktor-feel fix).** Snapped
  seeks previously executed *immediately*: the destination was on the grid but
  the splice happened mid-beat, so jumps broke the groove ("jumps a bit").
  Now, while playing with snap on, `seekTo` **queues** the jump: the new source
  is scheduled to start exactly at the **next grid boundary** (AudioContext
  clock, sample-accurate) at the quantized target, and the old source fades out
  across ~3 ms at the splice (per-source GainNodes) — beat phase is continuous
  and click-free, like Ableton's launch quantization. A `player__cue` marker
  blinks at the queued target (`is-queued`) until the splice lands; re-clicking
  before the boundary re-aims the same boundary. Snap-off and paused seeks stay
  immediate.
- **2026-06-10 — Phase-preserving beat-jumps (kick/snare structure fix).**
  Launch-quantized seeking kept *beat* phase but snapped the landing point to an
  absolute grid position, so a jump could land on a different beat-of-bar than
  the splice point (e.g. beat 1 → beat 3): the snare-on-2-and-4 structure
  flipped, which is audible when fast-forwarding. Reworked to Traktor-style
  beat-jumps: the jump **distance** is quantized to whole snap units *relative
  to the playhead* (`delta = round((click − splicePos)/unit) · unit`, clamped to
  the track by whole units) — BAR mode therefore always moves whole bars and the
  bar structure survives by construction; BEAT mode moves whole beats (a
  deliberate 1-beat nudge is possible — that's what BEAT means). The splice now
  always executes on the **next beat boundary** regardless of snap mode (max
  wait 1 beat, was up to a bar), and arrow keys step from the queued target so
  holding them accumulates whole bars/beats.
- **2026-06-10 — Team navigator one-pager (`team-navigator.html`).** A
  self-contained, brand-styled cheat sheet sized to one MacBook screen
  (1280×800, verified headless): login → file prep (50 MB cap + `afconvert`
  line) → form fields → save/verify → edit → delete, in 6 numbered cards. For
  screenshotting/pinning in the team chat; `noindex`, not linked from the public
  nav. Credentials are not embedded (repo is public-ish) — it says to ask the
  owner. Condensed from `TEAM-GUIDE.md`, which remains the full reference.
- **2026-06-10 — Deployed to GitHub Pages.** Site live at
  <https://forfuturegoods-lang.github.io/sontra-records/> (repo is public; Pages
  source = `main` / root, legacy build, `.nojekyll` added so files serve as-is,
  HTTPS enforced). Every push to `main` redeploys automatically. The admin page
  is now reachable for the team at `/sontra-records/admin.html`; real URLs wired
  into `TEAM-GUIDE.md` + `team-navigator.html` (placeholders removed).
- **2026-06-10 — Empty-genre render guard.** Live verification caught the hero
  printing a literal "NULL" when a release's `genre` was null (STR001 before the
  data fix). Card + hero meta lines now render via `metaLine()` — joins
  `genre · year` skipping missing parts — card `data-genre`/`data-year` attrs
  fall back to empty strings, and the releases-page filter pills exclude
  null/empty values (no more "null" toggle). A release without genre/year now
  just shows less, never "null".
- **2026-06-10 — Audio preload (slow first-play fix).** Live verification
  measured the 10.7 MB first-play fetch at 6–77 s depending on network, all
  spent after the user pressed play. Now `preloadAudio()` (called from
  `initSite` after `initPlayers`) warms the existing `loadBuffer` cache: the
  first `[data-player][data-audio]` on the page immediately, the rest on first
  `pointerenter`/`touchstart`/`focusin`. Decode runs on the (suspended-ok)
  shared AudioContext; `play()` already awaits the same cached promise, so
  pressing play mid-preload just joins the in-flight load. No UI change.
- **2026-06-10 — Beat-jump splice on the bar line + engine timing fixes.** Jumps
  still felt like jumps when fast-forwarding. Root cause was *not* the grid —
  a whole-track comb search confirmed BPM = **130.000** exactly and the downbeat
  at **1.363 s** (DB's 1.37 is within 7 ms, correct). Three engine fixes:
  (1) the splice now executes on the next boundary of the **snap unit** (the next
  downbeat in BAR mode) instead of the next beat, so the cut lands on a musical
  line rather than mid-bar — the actual cause of the leftover "jump"; (2)
  `startSource` schedules ~20 ms ahead and anchors `startedAt` to the true start
  time, removing the output-latency drift that skewed every later splice
  boundary; (3) the splice crossfade is now equal-power (sin/cos, 8 ms) and the
  no-op guard (click ≈ playhead) runs **before** any fade/stop is scheduled,
  fixing a latent dropout where the old source was silenced with no replacement.
  Trade-off: BAR-mode jumps again wait up to one bar (the musically-correct
  behavior); BEAT mode stays ≤1 beat for snappier moves.
- **2026-06-10 — Mobile streaming fallback (memory-safe playback).** The Web
  Audio buffer engine decodes the whole track into RAM (~130 MB for a 5-min
  48 kHz file) — fine on desktop, risky on phones. Added `useStreaming()` (mobile
  UA / `navigator.userAgentData.mobile` / `deviceMemory ≤ 4`; test override
  `?stream` / `?buffer`) and a `setupPlayer` dispatcher: desktop →
  `setupBufferPlayer` (gapless beat-jump); mobile/low-mem → `setupStreamingPlayer`,
  which plays a streamed `<audio>` element (near-zero RAM). The beat grid +
  bar/beat/off snapping work in both; a streamed seek is a quantized jump with a
  small gap (the sample-accurate splice needs the full buffer). `preloadAudio()`
  skips buffer pre-decode when streaming. Both paths verified to render; live
  mobile playback still to be listen-tested.
- **2026-06-10 — Admin: exits to the main site.** The admin page was a dead-end
  (no way back). Two exits now both link to `index.html`: the top-left **"Sontra
  Records" title** (now an `<a>`) and a **release's artwork thumbnail** in the
  catalog list (wrapped in a link with a ↗ hover hint). Edit/Delete buttons are
  unaffected.
- **2026-06-10 — Admin link in the main nav (signed-in only).** The reverse trip:
  every page's navbar gets an **Admin** item (`<li class="nav__admin">` → `admin.html`)
  placed after About. It is `display:none` by default; `script.js` checks the
  shared Supabase session on load (`auth.getSession()`, plus `onAuthStateChange`)
  and adds `.is-visible` only when a team member is signed in — so the public
  never sees it, but logged-in staff get a one-click hop back to the CMS from any
  page. Session is shared via Supabase's localStorage, so signing in once on
  `admin.html` lights the link up across the whole site.
- **2026-06-10 — Log out button in the main nav (signed-in only).** Alongside the
  Admin link, every page's navbar now carries a **Log out** button
  (`<li class="nav__admin"><button class="nav__logout">`), revealed by the same
  session check (the former `initAdminLink` is generalized to `initSessionNav`,
  which also wires the button to `auth.signOut()`). Signing out anywhere fires
  `onAuthStateChange(null)` → both the Admin link and Log out button hide again,
  and the user stays on the current page (no redirect). Styled to match the nav
  links with a red-tinted hover to signal the sign-out action.
