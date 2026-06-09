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
    year:    2026,                /* TODO: confirm real release year */
    genre:   "Electronic",       /* TODO: confirm real genre */
    cover:   "assets/covers/str001-blue-friday.jpg",
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
        • Drop each track in  assets/audio/  named  <catalog>.mp3
          e.g.  assets/audio/sr-012.mp3   (lower-case catalog number)
          — or set an explicit `audio:` path on a release in RELEASES to override.
          Any browser-playable format works: .mp3 .m4a .ogg .wav
        • Then set  AUDIO_ENABLED = true  below.

   2) BANDCAMP EMBED (optional alternative): set BANDCAMP_ENABLED = true and give
      each release a real `albumId`.

   With both false, the custom player runs as a silent visual demo. */
const AUDIO_ENABLED    = false;   // ← flip to true once your audio files are in
const BANDCAMP_ENABLED = false;   // ← optional: use Bandcamp embeds instead

/* Resolve a release's audio file: explicit `audio:` path, else the convention
   assets/audio/<catalog>.mp3 (catalog lower-cased). */
function audioUrlFor(r) {
  return r.audio || ("assets/audio/" + String(r.catalog).toLowerCase() + ".mp3");
}

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

  // Real audio element — only rendered when self-hosted audio is enabled.
  const audioEl = AUDIO_ENABLED
    ? `<audio preload="metadata" src="${esc(audioUrlFor(r))}"></audio>` : "";

  return `
      <div class="player" data-player aria-label="Player for ${esc(r.title)} by ${esc(r.artist)}">
        ${audioEl}
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
          <span class="player__time" data-time>0:00</span>
        </div>
        <div class="player__scrub" data-scrub role="slider" tabindex="0"
             aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="player__wave">
            <div class="player__bars" aria-hidden="true">${bars(big)}</div>
            <div class="player__bars player__bars--fg" data-fg aria-hidden="true">${bars(big)}</div>
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
function initFilters() {
  const yearBar  = document.getElementById("filter-years");
  const genreBar = document.getElementById("filter-genres");
  const grid     = document.getElementById("releases-grid");
  const empty    = document.getElementById("releases-empty");
  if (!grid) return;                     // not on the releases page

  // current selection ("all" means no filter)
  const state = { year: "all", genre: "all" };

  // unique, sorted values pulled straight from RELEASES
  const years  = [...new Set(RELEASES.map(r => r.year))].sort((a, b) => b - a);
  const genres = [...new Set(RELEASES.map(r => r.genre))].sort();

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

function initPlayers() {
  document.querySelectorAll("[data-player]").forEach(setupPlayer);
}

function setupPlayer(player) {
  const btn    = player.querySelector("[data-play]");
  const scrub  = player.querySelector("[data-scrub]");
  const fg     = player.querySelector("[data-fg]");
  const timeEl = player.querySelector("[data-time]");
  const audio  = player.querySelector("audio");   // present only when AUDIO_ENABLED
  if (!btn || !scrub || !fg) return;

  const DEMO_DURATION = 32;        // seconds, used only for the silent demo
  let pct = 0;                     // 0..100 played
  let playing = false;
  let raf = null, last = 0;

  const fmt = sec => {
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  };
  // total seconds: real audio duration when known, else the demo length
  const total = () =>
    (audio && audio.duration && isFinite(audio.duration)) ? audio.duration : DEMO_DURATION;

  function render() {
    fg.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";   // reveal played bars
    scrub.setAttribute("aria-valuenow", Math.round(pct));
    if (timeEl) timeEl.textContent = fmt(total() * pct / 100);
  }
  function stop() {
    playing = false;
    player.classList.remove("is-playing");
    if (audio) audio.pause();
    if (raf) cancelAnimationFrame(raf);
    raf = null; last = 0;
    if (_activePlayer === api) _activePlayer = null;
  }
  // per-frame progress: from the audio element if real, else a timed ramp
  function frame(now) {
    if (audio) {
      if (audio.duration) pct = (audio.currentTime / audio.duration) * 100;
    } else {
      if (!last) last = now;
      pct += ((now - last) / 1000 / DEMO_DURATION) * 100;
      last = now;
      if (pct >= 100) { pct = 100; render(); stop(); pct = 0; return; }
    }
    render();
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (_activePlayer && _activePlayer !== api) _activePlayer.stop();  // one at a time
    playing = true; last = 0;
    _activePlayer = api;
    player.classList.add("is-playing");
    if (audio) audio.play().catch(() => {});      // user-gesture, so allowed
    raf = requestAnimationFrame(frame);
  }
  const api = { stop };

  if (audio) {
    audio.addEventListener("ended", () => { stop(); pct = 0; render(); });
    audio.addEventListener("loadedmetadata", render);   // refresh the time once known
  }

  btn.addEventListener("click", () => { playing ? stop() : play(); });

  function seekTo(p) {
    pct = Math.max(0, Math.min(100, p));
    if (audio && audio.duration) audio.currentTime = (pct / 100) * audio.duration;
    render();
  }
  scrub.addEventListener("click", e => {
    const r = scrub.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * 100);
  });
  scrub.addEventListener("keydown", e => {
    if (e.key === "ArrowRight")     { seekTo(pct + 5); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { seekTo(pct - 5); e.preventDefault(); }
  });

  render();
}

/* ──────────────────────────────────────────────────────────────────────────
   BOOT — runs after the DOM is ready
   ────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNav();

  // Homepage hero: feature the newest release (with its interactive player).
  const heroEl = document.getElementById("hero-feature");
  if (heroEl && RELEASES.length) heroEl.innerHTML = heroFeatureCard(RELEASES[0]);

  // Homepage grids: the newest is featured above, so show the rest here.
  renderInto("latest-grid", RELEASES.slice(1, 4));
  renderInto("all-grid",    RELEASES.slice(4));

  // Releases page: render the full catalog, then wire up the filters.
  renderInto("releases-grid", RELEASES);
  initFilters();

  initSubscribe();
  initPlayers();          // wire up the interactive placeholder players

  // Footer year + release count, if those elements exist.
  const y = document.getElementById("copyright-year");
  if (y) y.textContent = "2024–2026"; // static range; update as needed
  document.querySelectorAll("[data-release-count]").forEach(el => {
    el.textContent = RELEASES.length;
  });
});
