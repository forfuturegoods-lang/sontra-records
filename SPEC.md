# SPEC — Sontra Records Website

> **Source of truth.** Per the SPEC-First rule (see `CLAUDE.md`), this file is
> edited *before* code. Every change to the site must be specified here first,
> and committed together with its implementation.

- **Spec version:** 1.2.1
- **Status:** Implemented (interface-first; player placeholder — see §11)
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

Releases live in the `RELEASES` array in `script.js`. Both the homepage and
releases page render from it. Each release:

```
catalog, title, artist, year (number), genre (string),
cover (path), albumId (Bandcamp), buyUrl, donateUrl
```

- Homepage: `slice(0,3)` = Latest, `slice(3)` = All.
- Releases page: all releases; year + genre filter toggles are generated from
  the distinct values in the data.

## 6. Integrations

- **Bandcamp:** *interface-first.* Each release card renders a styled **player
  placeholder** until the `sontra-bandcamp` account + real album IDs are ready.
  A single flag in `script.js` — `BANDCAMP_ENABLED` (default `false`) — swaps
  every placeholder for the real embed (`bandcampSrc(albumId)`, styled
  `bgcol=111111 / linkcol=ffffff`). Placeholder IDs flagged
  `REPLACE WITH REAL BANDCAMP ALBUM ID`.
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

- [ ] Add real Bandcamp album IDs + set `BANDCAMP_ENABLED = true` to enable players. _(deferred until sontra-bandcamp credentials ready; cards show a player placeholder meanwhile — see §11.)_
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
  bump the spec to `1.3.0`.
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
  text wordmark/logotype was removed. Shown via CSS
  `mix-blend-mode: screen` so the JPEG's black background drops out on the dark
  navbar (no transparency / image editing needed). A broken all-black earlier
  upload (`sontra_logo.png`) was removed. To update the logo, replace the file in
  `assets/`.
