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
    catalog: "SR-012",
    title:   "Nocturne Transmissions",
    artist:  "Vesper Lane",
    year:    2026,
    genre:   "Ambient",
    cover:   "assets/covers/cover-01.svg",
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
/* INTERFACE-FIRST TOGGLE.
   Until the `sontra-bandcamp` credentials + real album IDs are ready, each
   release shows a styled PLACEHOLDER where the player will go — so the layout
   looks finished instead of loading a broken embed with fake IDs.

   ► TO ENABLE REAL PLAYERS LATER: set this to true (after putting real album
     IDs into the RELEASES array). Nothing else needs to change. */
const BANDCAMP_ENABLED = false;

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

/* Styled placeholder — looks like a disabled player bar so cards read as
   finished while we wait for sontra-bandcamp credentials. */
function bandcampPlaceholder(r) {
  const wave = [8,16,11,22,14,26,12,20,9,24,15,18,10,21,13,19]; // static faux waveform
  const bars = wave.map(h => `<span style="height:${h}px"></span>`).join("");
  return `
      <div class="bandcamp bandcamp--placeholder"
           role="img" aria-label="Bandcamp player for ${esc(r.title)} — coming soon">
        <span class="bandcamp__ph-btn" aria-hidden="true">▶</span>
        <span class="bandcamp__ph-meta">
          <span class="bandcamp__ph-title">Player coming soon</span>
          <span class="bandcamp__ph-sub">Streaming via sontra-bandcamp</span>
        </span>
        <span class="bandcamp__ph-wave" aria-hidden="true">${bars}</span>
      </div>`;
}

/* Choose embed vs placeholder based on the flag. */
function bandcampPlayer(r) {
  return BANDCAMP_ENABLED ? bandcampEmbed(r) : bandcampPlaceholder(r);
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
   BOOT — runs after the DOM is ready
   ────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNav();

  // Homepage: first 3 = latest, the rest = back catalog.
  renderInto("latest-grid", RELEASES.slice(0, 3));
  renderInto("all-grid",    RELEASES.slice(3));

  // Releases page: render everything, then wire up the filters.
  renderInto("releases-grid", RELEASES);
  initFilters();

  initSubscribe();

  // Footer year + release count, if those elements exist.
  const y = document.getElementById("copyright-year");
  if (y) y.textContent = "2024–2026"; // static range; update as needed
  document.querySelectorAll("[data-release-count]").forEach(el => {
    el.textContent = RELEASES.length;
  });
});
