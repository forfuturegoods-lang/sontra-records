/* ============================================================================
   SONTRA RECORDS — script.js
   ----------------------------------------------------------------------------
   ONE FILE TO EDIT for content. The RELEASES array below is the single source
   of truth: cards on the homepage AND the releases page are generated from it,
   so you only add a release once.

   ───────────────────────────────────────────────────────────────────────────
   HOW TO ADD / EDIT A RELEASE  (no coding experience needed)
   ───────────────────────────────────────────────────────────────────────────
   1. Copy one { ... } block inside the RELEASES array.
   2. Paste it at the TOP of the array (newest releases go first).
   3. Change the fields:
        catalog  – your catalog number, e.g. "SR-013"
        title    – release title
        artist   – artist name
        year     – release year (number) — used by the year filter
        genre    – one genre label   — used by the genre filter
        cover    – path to album art (drop images in assets/covers/)
        albumId  – the Bandcamp ALBUM ID  (see "FINDING YOUR BANDCAMP ID" below)
        buyUrl   – link to the Bandcamp release page
        donateUrl– link people land on to pay-what-you-want / donate
   4. Save. Done — it appears everywhere automatically.

   ───────────────────────────────────────────────────────────────────────────
   FINDING YOUR BANDCAMP ALBUM ID
   ───────────────────────────────────────────────────────────────────────────
   On your Bandcamp album page click "Share / Embed" → "Embed this album".
   The code Bandcamp gives you contains:  album=1234567890
   Copy that number into the `albumId` field below.
   <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> markers are placeholders.
   ========================================================================== */

const RELEASES = [
  {
    catalog: "STR001",
    title:   "Blue Friday",
    artist:  "Sontra Crew",
    year:    2026,
    genre:   "House",
    cover:   "assets/covers/str001-blue-friday.jpg",
    bpm:     124,               /* TODO: set Blue Friday's real BPM for an accurate beat grid */
    albumId: "123456789", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/nocturne-transmissions",
    donateUrl: "https://sontrarecords.bandcamp.com/album/nocturne-transmissions"
  },
  {
    catalog: "SR-011",
    title:   "Liquid Architecture",
    artist:  "Mara Voss",
    year:    2025,
    genre:   "Techno",
    cover:   "assets/covers/cover-02.svg",
    albumId: "123456788", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/liquid-architecture",
    donateUrl: "https://sontrarecords.bandcamp.com/album/liquid-architecture"
  },
  {
    catalog: "SR-010",
    title:   "Brass & Static",
    artist:  "The Halo Unit",
    year:    2025,
    genre:   "Experimental",
    cover:   "assets/covers/cover-03.svg",
    albumId: "123456787", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/brass-and-static",
    donateUrl: "https://sontrarecords.bandcamp.com/album/brass-and-static"
  },
  {
    catalog: "SR-009",
    title:   "Green Signal",
    artist:  "Koto Mireille",
    year:    2024,
    genre:   "House",
    cover:   "assets/covers/cover-04.svg",
    albumId: "123456786", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/green-signal",
    donateUrl: "https://sontrarecords.bandcamp.com/album/green-signal"
  },
  {
    catalog: "SR-008",
    title:   "Waveform Theory",
    artist:  "Null Pointer",
    year:    2024,
    genre:   "Techno",
    cover:   "assets/covers/cover-05.svg",
    albumId: "123456785", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/waveform-theory",
    donateUrl: "https://sontrarecords.bandcamp.com/album/waveform-theory"
  },
  {
    catalog: "SR-007",
    title:   "Eclipse Sessions",
    artist:  "Aria Demko",
    year:    2023,
    genre:   "Ambient",
    cover:   "assets/covers/cover-06.svg",
    albumId: "123456784", /* <!-- REPLACE WITH REAL BANDCAMP ALBUM ID --> */
    buyUrl:    "https://sontrarecords.bandcamp.com/album/eclipse-sessions",
    donateUrl: "https://sontrarecords.bandcamp.com/album/eclipse-sessions"
  }
];

/* ──────────────────────────────────────────────────────────────────────────
   BANDCAMP PLAYER LOOK
   These match the dark theme. Change once, applies to every embed.
   bg = 111111 (player background), link = ffffff (link/accent color).
   ────────────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────
   PLAYER MODE — pick how the players get their audio. NO Bandcamp required.

   1) SELF-HOSTED AUDIO (recommended — uses this site's own waveform player):
        • Drop each track in  assets/audio/  named  <catalog>.wav
          e.g.  assets/audio/str001.wav   (lower-case catalog number).
          Master target: WAV, 24-bit, 44.1 kHz (decoded natively by Web Audio).
          Any other browser-decodable format also works (.wav .mp3 .m4a .ogg) —
          or set an explicit `audio:` path on a release in RELEASES to override.
        • Then set  AUDIO_ENABLED = true  below.

   2) BANDCAMP EMBED (optional alternative): set BANDCAMP_ENABLED = true and give
      each release a real `albumId`.

   With both false, the custom player runs as a silent visual demo. */
const AUDIO_ENABLED    = false;   // ← flip to true once your audio files are in
const BANDCAMP_ENABLED = false;   // ← optional: use Bandcamp embeds instead

/* Resolve a release's audio file: explicit `audio:` path, else the convention
   assets/audio/<catalog>.wav (catalog lower-cased; WAV 24-bit / 44.1 kHz). */
function audioUrlFor(r) {
  return r.audio || ("assets/audio/" + String(r.catalog).toLowerCase() + ".wav");
}

/* ─────────────────────────────────────────────────────────────────────────
   BEAT GRID (Ableton-style). Seeking snaps to the tempo grid so a jump lands
   in time and the rhythm stays aligned. Each release can set `bpm` (and an
   optional `beatOffset` = seconds to the first downbeat); otherwise DEFAULT_BPM
   is used. 4/4 is assumed. The player's snap button cycles bar → beat → off. */
const DEFAULT_BPM   = 120;
const BEATS_PER_BAR = 4;

/* Player look (used once enabled). bg = player background, link = accent. */
const BANDCAMP_BG   = "111111";
const BANDCAMP_LINK = "ffffff";

/* Build the Bandcamp embed URL for a given album ID. */
function bandcampSrc(albumId) {
  return (
    "https://bandcamp.com/EmbeddedPlayer/" +
    "album=" + albumId +
    "/size=large" +
    "/bgcol=" + BANDCAMP_BG +
    "/linkcol=" + BANDCAMP_LINK +
    "/tracklist=false/artwork=small/transparent=true/"
  );
}

/* The real Bandcamp embed — rendered only when BANDCAMP_ENABLED is true. */
function bandcampEmbed(r) {
  return `
      <div class="bandcamp">
        <iframe
          title="${esc(r.title)} by ${esc(r.artist)} — Bandcamp player"
          src="${bandcampSrc(r.albumId)}"
          seamless loading="lazy">
        </iframe>
      </div>`;
}

/* The site's own player: a compact bar that, on play, drops a full-width
   waveform scrubber (click / arrow-keys to seek). Plays a real <audio> file
   when AUDIO_ENABLED; otherwise runs as a silent visual demo. setupPlayer()
   wires up the behavior. */
function customPlayer(r) {
  // base waveform heights, rotated per release so each track looks different
  const base = [8,14,10,18,12,22,16,24,14,20,12,26,18,14,22,16,12,20,10,16,
                24,14,18,12,20,16,22,12,18,10,14,20,16,24,12,18,14,22,16,12];
  const seed = String(r.catalog).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const big  = base.map((_, i) => base[(i + seed) % base.length]);
  const mini = big.slice(0, 16);
  const bars = arr => arr.map(h => `<span style="--h:${h}px"></span>`).join("");

  const bpm        = r.bpm || DEFAULT_BPM;
  const beatOffset = r.beatOffset || 0;

  // Web Audio fetches + decodes this URL (gapless). Prefer the release's own
  // audio URL (e.g. from Supabase); else the convention path when AUDIO_ENABLED.
  const audioSrc  = r.audio || (AUDIO_ENABLED ? audioUrlFor(r) : "");
  const audioAttr = audioSrc ? `data-audio="${esc(audioSrc)}"` : "";

  return `
      <div class="player" data-player ${audioAttr} data-bpm="${esc(bpm)}" data-beat-offset="${esc(beatOffset)}"
           aria-label="Player for ${esc(r.title)} by ${esc(r.artist)}">
        <div class="player__bar">
          <button class="player__btn" type="button" data-play aria-label="Play / pause">
            <span class="player__icon-play" aria-hidden="true">▶</span>
            <span class="player__icon-pause" aria-hidden="true">❚❚</span>
          </button>
          <span class="player__meta">
            <span class="player__title">${esc(r.title)}</span>
            <span class="player__sub">${esc(r.artist)}</span>
          </span>
          <span class="player__mini" aria-hidden="true">${bars(mini)}</span>
          <button class="player__snap" type="button" data-snap
                  title="Beat-grid snap (bar / beat / off)" aria-label="Beat-grid snap">
            <span aria-hidden="true">▦</span><span data-snap-label>BAR</span>
          </button>
          <span class="player__time" data-time>0:00</span>
        </div>
        <div class="player__scrub" data-scrub role="slider" tabindex="0"
             aria-label="Seek — snaps to the beat grid"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="player__wave">
            <div class="player__bars" aria-hidden="true">${bars(big)}</div>
            <div class="player__bars player__bars--fg" data-fg aria-hidden="true">${bars(big)}</div>
            <div class="player__grid" data-grid aria-hidden="true"></div>
          </div>
        </div>
      </div>`;
}

/* Choose the optional Bandcamp embed vs the site's own audio player. */
function bandcampPlayer(r) {
  return BANDCAMP_ENABLED ? bandcampEmbed(r) : customPlayer(r);
}

/* Small helper: escape text so titles/artists can safely contain &, <, > etc. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ──────────────────────────────────────────────────────────────────────────
   RELEASE CARD TEMPLATE
   Returns the HTML for one card. Reused on every page for consistency.
   ────────────────────────────────────────────────────────────────────────── */
function releaseCard(r) {
  return `
  <article class="release-card" data-year="${esc(r.year)}" data-genre="${esc(r.genre)}">
    <div class="release-card__art">
      <img src="${esc(r.cover)}" alt="${esc(r.title)} — cover art" loading="lazy" />
      <span class="release-card__catalog">${esc(r.catalog)}</span>
    </div>

    <div class="release-card__body">
      <div>
        <h3 class="release-card__title">${esc(r.title)}</h3>
        <p class="release-card__artist">${esc(r.artist)}</p>
        <p class="release-card__sub">${esc(r.genre)} · ${esc(r.year)}</p>
      </div>

      <!-- Bandcamp player slot. Shows a styled placeholder until BANDCAMP_ENABLED
           is set to true. Real album IDs live in the RELEASES array, not here. -->
      ${bandcampPlayer(r)}

      <div class="release-card__actions">
        <a class="btn btn--solid"  href="${esc(r.buyUrl)}"    target="_blank" rel="noopener">Buy on Bandcamp</a>
        <a class="btn btn--outline" href="${esc(r.donateUrl)}" target="_blank" rel="noopener">Donate</a>
      </div>
    </div>
  </article>`;
}

/* Horizontal "featured release" layout for the homepage hero (cover left,
   meta + player + actions right). Uses the same interactive player. */
function heroFeatureCard(r) {
  return `
  <article class="feature">
    <div class="feature__art">
      <img src="${esc(r.cover)}" alt="${esc(r.title)} — cover art" />
      <span class="feature__catalog">${esc(r.catalog)}</span>
    </div>
    <div class="feature__body">
      <span class="eyebrow">Newest release</span>
      <h2 class="feature__title">${esc(r.title)}</h2>
      <p class="feature__artist">${esc(r.artist)}</p>
      <p class="feature__sub">${esc(r.genre)} · ${esc(r.year)}</p>
      ${bandcampPlayer(r)}
      <div class="feature__actions">
        <a class="btn btn--solid"  href="${esc(r.buyUrl)}"    target="_blank" rel="noopener">Buy on Bandcamp</a>
        <a class="btn btn--outline" href="${esc(r.donateUrl)}" target="_blank" rel="noopener">Donate</a>
      </div>
    </div>
  </article>`;
}

/* Render an array of releases into a container element (by id). */
function renderInto(containerId, releases) {
  const el = document.getElementById(containerId);
  if (!el) return;                       // page doesn't have this section
  el.innerHTML = releases.map(releaseCard).join("");
}

/* ──────────────────────────────────────────────────────────────────────────
   NAVBAR — mobile hamburger toggle
   ────────────────────────────────────────────────────────────────────────── */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links  = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // close the menu after tapping a link (mobile)
  links.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FILTERS (releases page) — build year + genre toggle buttons from the data,
   then show/hide cards. Pure CSS/JS, no backend.
   ────────────────────────────────────────────────────────────────────────── */
function initFilters(releases) {
  const yearBar  = document.getElementById("filter-years");
  const genreBar = document.getElementById("filter-genres");
  const grid     = document.getElementById("releases-grid");
  const empty    = document.getElementById("releases-empty");
  if (!grid) return;                     // not on the releases page

  // current selection ("all" means no filter)
  const state = { year: "all", genre: "all" };

  // unique, sorted values pulled straight from the loaded releases
  const years  = [...new Set(releases.map(r => r.year))].sort((a, b) => b - a);
  const genres = [...new Set(releases.map(r => r.genre))].sort();

  // build a row of pill toggles into `bar`; clicking sets state[key]
  function buildToggles(bar, key, values) {
    if (!bar) return;
    const all = `<button class="toggle is-active" data-value="all">All</button>`;
    const rest = values
      .map(v => `<button class="toggle" data-value="${esc(v)}">${esc(v)}</button>`)
      .join("");
    bar.innerHTML = all + rest;

    bar.addEventListener("click", e => {
      const btn = e.target.closest(".toggle");
      if (!btn) return;
      bar.querySelectorAll(".toggle").forEach(t => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      state[key] = btn.dataset.value;
      applyFilters();
    });
  }

  function applyFilters() {
    let visible = 0;
    grid.querySelectorAll(".release-card").forEach(card => {
      const okYear  = state.year  === "all" || card.dataset.year  === state.year;
      const okGenre = state.genre === "all" || card.dataset.genre === state.genre;
      const show = okYear && okGenre;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });
    if (empty) empty.style.display = visible === 0 ? "block" : "none";
  }

  buildToggles(yearBar,  "year",  years);
  buildToggles(genreBar, "genre", genres);
}

/* ──────────────────────────────────────────────────────────────────────────
   SUBSCRIBE FORM
   Works two ways:
   • If the <form> has a real action URL (Formspree/Mailchimp), it submits there.
   • Otherwise we intercept and show a friendly message so the page never errors
     before you've connected a provider. See README for setup.
   ────────────────────────────────────────────────────────────────────────── */
function initSubscribe() {
  document.querySelectorAll(".subscribe__form").forEach(form => {
    const msg = form.parentElement.querySelector(".form-msg");
    const action = form.getAttribute("action") || "";
    const notConnected = action === "" || action.includes("YOUR_FORM_ID");

    form.addEventListener("submit", async e => {
      // If a real provider is connected, let the browser submit normally.
      if (!notConnected && !form.dataset.ajax) return;

      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();

      if (!notConnected) {
        // AJAX submit (keeps the user on-page). Formspree supports this.
        try {
          const res = await fetch(action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" }
          });
          showMsg(msg, res.ok, res.ok
            ? "Subscribed — watch your inbox for new releases."
            : "Something went wrong. Please try again.");
          if (res.ok) form.reset();
        } catch {
          showMsg(msg, false, "Network error. Please try again.");
        }
        return;
      }

      // No provider connected yet — friendly placeholder behavior.
      showMsg(msg, true,
        `Thanks — "${email}" noted. Connect Formspree/Mailchimp to go live (see README).`);
      form.reset();
    });
  });
}

function showMsg(el, ok, text) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("is-ok", ok);
  el.classList.toggle("is-error", !ok);
}

/* ──────────────────────────────────────────────────────────────────────────
   INTERACTIVE PLAYER (placeholder)
   Pressing play expands the waveform into a full-width scrubber and animates a
   mock progress; click or arrow-keys to seek (fast-forward). Only one player
   runs at a time. This is a UI demo until BANDCAMP_ENABLED swaps in the real
   embed (real iframes have no [data-player], so they're skipped).
   ────────────────────────────────────────────────────────────────────────── */
let _activePlayer = null;

/* Shared Web Audio context (created on first user gesture) + a decode cache so
   each track is fetched/decoded once. Powers gapless, sample-accurate playback. */
let _audioCtx = null;
function audioCtx() {
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) _audioCtx = new AC();
  }
  return _audioCtx;
}
const _bufferCache = new Map();
function loadBuffer(url) {
  if (_bufferCache.has(url)) return _bufferCache.get(url);
  const ctx = audioCtx();
  const p = !ctx ? Promise.resolve(null) : fetch(url)
    .then(res => { if (!res.ok) throw new Error("audio " + res.status); return res.arrayBuffer(); })
    .then(buf => ctx.decodeAudioData(buf))
    .catch(() => null);                 // missing / unsupported → null → silent demo
  _bufferCache.set(url, p);
  return p;
}

function initPlayers() {
  document.querySelectorAll("[data-player]").forEach(setupPlayer);
}

function setupPlayer(player) {
  const btn       = player.querySelector("[data-play]");
  const scrub     = player.querySelector("[data-scrub]");
  const fg        = player.querySelector("[data-fg]");
  const timeEl    = player.querySelector("[data-time]");
  const grid      = player.querySelector("[data-grid]");
  const snapBtn   = player.querySelector("[data-snap]");
  const snapLabel = player.querySelector("[data-snap-label]");
  if (!btn || !scrub || !fg) return;

  const audioUrl   = player.dataset.audio || "";    // set only when AUDIO_ENABLED
  const bpm        = parseFloat(player.dataset.bpm) || DEFAULT_BPM;
  const beatOffset = parseFloat(player.dataset.beatOffset) || 0;
  const beatDur    = 60 / bpm;
  const barDur     = beatDur * BEATS_PER_BAR;
  let   snap       = "bar";          // bar | beat | off  (Ableton-style quantize)

  const DEMO_DURATION = 32;          // silent-demo length when there's no audio file

  // ── engine state ──
  let buffer = null, source = null;  // decoded AudioBuffer + current source node
  let loadTried = false, loading = false;
  let playing = false;
  let startedAt = 0, offsetAt = 0;   // ctx-time the source started + its buffer offset
  let head = 0;                      // position (sec) while paused / for the demo ramp
  let pct = 0, raf = null, last = 0;

  const fmt = sec => {
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  };
  const total = () => buffer ? buffer.duration : DEMO_DURATION;
  // live playback position in seconds
  function position() {
    if (buffer && playing) return Math.min(buffer.duration, offsetAt + (audioCtx().currentTime - startedAt));
    return head;
  }

  function updateGrid() {
    if (!grid) return;
    const t = total(); if (!t) return;
    grid.style.setProperty("--beat-pct", (beatDur / t * 100) + "%");
    grid.style.setProperty("--bar-pct",  (barDur  / t * 100) + "%");
  }
  // snap a time (seconds) to the nearest grid unit → jumps stay in rhythm
  function quantize(sec) {
    if (snap === "off") return sec;
    const unit = snap === "bar" ? barDur : beatDur;
    const q = beatOffset + Math.round((sec - beatOffset) / unit) * unit;
    return Math.max(0, Math.min(total(), q));
  }
  function render() {
    pct = total() ? Math.max(0, Math.min(100, position() / total() * 100)) : 0;
    fg.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";   // reveal played bars
    scrub.setAttribute("aria-valuenow", Math.round(pct));
    if (timeEl) timeEl.textContent = fmt(total() * pct / 100);
  }

  // ── Web Audio source control (start/stop are sample-accurate → gapless) ──
  function startSource(offset) {
    const ctx = audioCtx();
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = onNaturalEnd;
    offsetAt  = Math.max(0, Math.min(buffer.duration, offset));
    startedAt = ctx.currentTime;
    source.start(0, offsetAt);
  }
  function stopSource() {
    if (!source) return;
    source.onended = null;             // don't fire end-handler on a manual stop/seek
    try { source.stop(); } catch (e) {}
    source.disconnect();
    source = null;
  }
  function onNaturalEnd() {
    stopSource();
    playing = false; head = 0;
    player.classList.remove("is-playing");
    cancelRaf();
    if (_activePlayer === api) _activePlayer = null;
    render();
  }

  function cancelRaf() { if (raf) cancelAnimationFrame(raf); raf = null; last = 0; }
  function frame(now) {
    if (!buffer) {                     // silent-demo ramp (no audio file)
      if (!last) last = now;
      head += (now - last) / 1000; last = now;
      if (head >= DEMO_DURATION) { head = 0; stop(); render(); return; }
    }
    render();
    raf = requestAnimationFrame(frame);
  }

  function stop() {                    // pause, keeping the current position
    if (buffer) { head = position(); stopSource(); }
    playing = false;
    player.classList.remove("is-playing");
    cancelRaf();
    if (_activePlayer === api) _activePlayer = null;
  }
  async function play() {
    if (loading) return;
    if (_activePlayer && _activePlayer !== api) _activePlayer.stop();  // one at a time

    if (audioUrl && !buffer && !loadTried) {   // fetch + decode once, on first play
      loading = true; loadTried = true;
      player.classList.add("is-loading");
      const ctx = audioCtx();
      if (ctx && ctx.state === "suspended") { try { await ctx.resume(); } catch (e) {} }
      buffer = await loadBuffer(audioUrl);     // null → graceful silent demo
      player.classList.remove("is-loading");
      loading = false;
      updateGrid();
    }

    playing = true; last = 0;
    _activePlayer = api;
    player.classList.add("is-playing");
    if (buffer) {
      const ctx = audioCtx();
      if (ctx.state === "suspended") { try { await ctx.resume(); } catch (e) {} }
      startSource(head >= buffer.duration ? 0 : head);
    }
    raf = requestAnimationFrame(frame);
  }
  const api = { stop };

  btn.addEventListener("click", () => { playing ? stop() : play(); });

  // seek, QUANTIZED to the grid. In Web Audio mode the source restarts at the
  // snapped offset — sample-accurate + gapless, so playback stays in time.
  function seekTo(p) {
    const sec = quantize((Math.max(0, Math.min(100, p)) / 100) * total());
    head = sec;
    if (buffer && playing) { stopSource(); startSource(sec); }
    render();
  }
  scrub.addEventListener("click", e => {
    const r = scrub.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * 100);
  });
  scrub.addEventListener("keydown", e => {
    // arrows jump exactly one grid unit (or 5% when snap is off)
    const stepPct = snap === "off" ? 5 : ((snap === "beat" ? beatDur : barDur) / total()) * 100;
    if (e.key === "ArrowRight")     { seekTo(pct + stepPct); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { seekTo(pct - stepPct); e.preventDefault(); }
  });

  // beat-grid snap control: cycle bar → beat → off
  if (snapBtn) {
    const MODES = ["bar", "beat", "off"];
    snapBtn.addEventListener("click", () => {
      snap = MODES[(MODES.indexOf(snap) + 1) % MODES.length];
      if (snapLabel) snapLabel.textContent = snap.toUpperCase();
      player.classList.toggle("snap-off", snap === "off");
    });
  }

  updateGrid();
  render();
}

/* ──────────────────────────────────────────────────────────────────────────
   BOOT — runs after the DOM is ready
   ────────────────────────────────────────────────────────────────────────── */
/* Load releases from Supabase when configured, else the built-in RELEASES. */
async function loadReleasesData() {
  if (window.supabaseReady && window.supabaseReady()) {
    const c = window.supabaseClient && window.supabaseClient();
    if (c) {
      try {
        const { data, error } = await c.from("releases").select("*")
          .order("position", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length) return data.map(mapReleaseRow);
      } catch (e) {
        console.warn("Supabase load failed — using built-in catalog.", e);
      }
    }
  }
  return RELEASES;
}

/* Map a Supabase row to the shape the renderers expect. */
function mapReleaseRow(row) {
  return {
    catalog: row.catalog, title: row.title, artist: row.artist,
    year: row.year, genre: row.genre, bpm: row.bpm, beatOffset: row.beat_offset || 0,
    cover: window.storagePublicUrl("covers", row.cover_path) || "assets/covers/cover-01.svg",
    audio: window.storagePublicUrl("audio", row.audio_path) || "",
    buyUrl: row.buy_url || "#", donateUrl: row.donate_url || "#"
  };
}

document.addEventListener("DOMContentLoaded", initSite);

async function initSite() {
  initNav();
  initSubscribe();

  const y = document.getElementById("copyright-year");
  if (y) y.textContent = "2024–2026"; // static range; update as needed

  const releases = await loadReleasesData();   // Supabase or built-in fallback

  // Homepage hero: feature the newest release (with its interactive player).
  const heroEl = document.getElementById("hero-feature");
  if (heroEl && releases.length) heroEl.innerHTML = heroFeatureCard(releases[0]);

  // Homepage grids: the newest is featured above, so show the rest here.
  renderInto("latest-grid", releases.slice(1, 4));
  renderInto("all-grid",    releases.slice(4));

  // Releases page: render the full catalog, then wire up the filters.
  renderInto("releases-grid", releases);
  initFilters(releases);

  initPlayers();          // wire up the interactive players

  // Footer release count, if present.
  document.querySelectorAll("[data-release-count]").forEach(el => {
    el.textContent = releases.length;
  });
}
