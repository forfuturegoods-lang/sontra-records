# Sontra Records — Static Website

A fast, fully static website for **Sontra Records**, an independent electronic
music label. Dark, precise, DJ-software–inspired UI (Traktor / Rekordbox vibe).
No backend, no build step — just open the files or drop them on any static host.

- **Audio** is embedded via Bandcamp iframes.
- **Email signups** go through a free service (Formspree or Mailchimp).
- **All content** (releases, links) lives in one place: `script.js`.

---

## Quick start

This is plain HTML/CSS/JS — no install required.

```bash
# Option A: just double-click index.html

# Option B: run a tiny local server (recommended, so fonts/iframes behave)
cd sontra-records
python3 -m http.server 8000
# then open http://localhost:8000
```

Deploy by uploading the folder to any static host — **Netlify, Vercel, GitHub
Pages, Cloudflare Pages**, or classic shared hosting. No configuration needed.

---

## File structure

```
sontra-records/
├── index.html        # Homepage: hero, latest releases, all releases, subscribe
├── releases.html     # Full catalog + year/genre filters
├── about.html        # Label manifesto / story
├── style.css         # Entire design system (colors at the very top)
├── script.js         # ⭐ RELEASE DATA + all interactivity
├── assets/
│   ├── logo.svg
│   └── covers/       # Placeholder album art (cover-01.svg … cover-06.svg)
└── README.md
```

---

## ⭐ Editing content (no coding needed)

**Everything you'll normally change lives in `script.js`**, in the `RELEASES`
array at the top. The homepage and the releases page are both generated from it,
so you add a release **once** and it shows up everywhere.

### Add a release

1. Open `script.js`.
2. Copy one `{ ... }` block and paste it at the **top** of the `RELEASES` array
   (newest first).
3. Fill in the fields:

   | Field       | What it is                                            |
   |-------------|-------------------------------------------------------|
   | `catalog`   | Catalog number, e.g. `"SR-013"`                       |
   | `title`     | Release title                                         |
   | `artist`    | Artist name                                           |
   | `year`      | Release year (number) — used by the **year** filter   |
   | `genre`     | One genre label — used by the **genre** filter        |
   | `cover`     | Path to album art (see below)                         |
   | `albumId`   | Your **Bandcamp album ID** (see below)                |
   | `buyUrl`    | Link to the Bandcamp release page                     |
   | `donateUrl` | Link for pay-what-you-want / donations                |

4. Save. Done.

### Swap album art

Drop a square (1:1) image into `assets/covers/` — e.g. `sr013.jpg` — and set
`cover: "assets/covers/sr013.jpg"`. JPG/PNG/WebP all work. The included
`cover-0X.svg` files are placeholders you can delete once you have real art.

---

## 🎵 Bandcamp player setup

Each release embeds a standard Bandcamp player. You only need the **album ID**.

1. Go to your album's page on Bandcamp.
2. Click **Share / Embed → Embed this album**.
3. In the code Bandcamp gives you, find `album=` followed by a number, e.g.:

   ```
   ...EmbeddedPlayer/album=1234567890/size=large/...
   ```

4. Copy that number into the release's `albumId` field in `script.js`.

Placeholders are marked in the code with
`<!-- REPLACE WITH REAL BANDCAMP ALBUM ID -->`.

**Player styling** (background + link color) is set once in `script.js`:

```js
const BANDCAMP_BG   = "111111"; // player background
const BANDCAMP_LINK = "ffffff"; // links / accents
```

The embed URL pattern used is:

```
https://bandcamp.com/EmbeddedPlayer/album=ALBUM_ID/size=large/bgcol=111111/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/
```

---

## ✉️ Email subscription setup

The subscribe form works out of the box in **placeholder mode** (it shows a
friendly confirmation message). To collect real emails, connect a free service:

### Option A — Formspree (simplest)

1. Create a free form at <https://formspree.io> and copy your form ID
   (looks like `xayzgqwe`).
2. In **`index.html`**, find the subscribe `<form>` and replace the action:

   ```html
   <form class="subscribe__form"
         action="https://formspree.io/f/YOUR_FORM_ID"
         method="POST">
   ```

   …putting your real ID in place of `YOUR_FORM_ID`.

That's it. `script.js` automatically detects the real action and submits via
AJAX (the visitor stays on the page and sees a success message).

### Option B — Mailchimp

Paste your Mailchimp **embedded form** markup in place of the `<form>` block,
then add `class="subscribe__form"` and `class="subscribe__input"` to its form
and email input so it inherits the dark styling.

---

## 🎨 Customizing the look

All brand colors and spacing are **CSS variables at the top of `style.css`**
(section 1, "Design tokens"). Change them in one place:

```css
:root {
  --bg:    #0a0a0a;   /* page background */
  --card:  #222222;   /* release cards   */
  --text:  #e0e0e0;   /* primary text    */
  --btn:   #d0d0d0;   /* button fill     */
  /* …etc */
}
```

The site uses **JetBrains Mono** (loaded from Google Fonts). To change the
typeface, swap the `<link>` in each HTML `<head>` and update `--font` in
`style.css`.

---

## Design system reference

| Token            | Value       | Used for                         |
|------------------|-------------|----------------------------------|
| Background       | `#0a0a0a`   | Page                             |
| Surface          | `#141414`   | Navbar, footer panels            |
| Card             | `#222222`   | Release cards                    |
| Border           | `#333333`   | Dividers / outlines              |
| Primary text     | `#e0e0e0`   | Headings & body                  |
| Secondary text   | `#888888`   | Muted labels                     |
| Button fill      | `#d0d0d0`→`#fff` | Buy buttons / primary CTAs  |

- **Buy** buttons: solid white/grey fill, dark text.
- **Donate** buttons: outlined (transparent bg, white border).
- **Filter toggles**: pill-shaped — white when active, grey when inactive.
- **Responsive grid**: 3 columns (desktop) → 2 (tablet) → 1 (mobile);
  navbar collapses to a hamburger on mobile.

---

## Notes

- 100% static. No server, database, or API keys required.
- Album art and Bandcamp IDs in this repo are **placeholders** — search the code
  for `REPLACE WITH REAL` to find everything you need to swap.
- Built to be edited by non-developers: content in `script.js`, colors in
  `style.css`, nothing hidden in a build pipeline.

© Sontra Records.
