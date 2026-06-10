# Sontra Records — Team Guide: Adding a Release

How the team publishes music to the site. No git, no code — everything happens
in the browser through the site's **admin page**. (One-time backend setup is in
`ADMIN-SETUP.md`; this guide is the day-to-day workflow.)

**Team login (shared):** `sontrarecords@gmail.com` — ask the label owner for the
password. Everyone uses the same account for now.

---

## Part 1 — The normal way: the site's Admin page

### 1. Open the admin page

Go to **`https://<your-site>/admin.html`** (wherever the site is deployed).

Testing locally instead: run `python3 -m http.server 8000` in the project
folder, then open <http://localhost:8000/admin.html>.

### 2. Sign in

Use the team email + password above. You land on the dashboard:
**"New release"** form on the left, **Catalog** list on the right.

### 3. Prepare your two files *before* filling the form

- 🎨 **Artwork** — JPG/PNG, square, ideally 1400×1400 or larger.
- 🎵 **Audio** — **must be under 50 MB** (Supabase free-tier hard limit).
  A full-length WAV won't fit — convert to AAC/m4a (or mp3) first.
  On a Mac, one Terminal line does it:

  ```sh
  afconvert -f m4af -d aac -b 256000 "track.wav" "track.m4a"
  ```

  Keep the WAV master in the label archive; upload the m4a.

### 4. Fill the form

| Field         | What to put                                                        |
|---------------|--------------------------------------------------------------------|
| Catalog       | The release number, e.g. `STR002` — this names the files in storage |
| Title / Artist / Year / Genre | As on the release                                  |
| BPM           | The track's tempo — **needed for the beat-grid / quantized seeking** |
| Beat offset   | Seconds until the first downbeat (`0` if the track starts on the beat) |
| Buy / Donate URL | Optional links                                                  |
| Artwork / Audio  | Choose your two prepared files                                  |

### 5. Save

Click **Save**. You'll see *"Uploading artwork… Uploading audio… Saved ✓"*.
The release appears in the Catalog list and is **immediately live on the public
site** — no deploy, no git.

### 6. Verify

Open the public site, find the release, press play.

### Editing & deleting

- **Edit:** click *Edit* next to a release → change fields → *Save*.
  Leave the file pickers **empty** to keep the current audio/artwork.
- **Delete:** removes the release from the site (asks for confirmation).

> ⚠️ Everyone shares one login, so agree in chat before editing the same
> release — last save wins.

---

## Part 2 — Fallback: Supabase dashboard (owner only)

Only for emergencies (e.g. the admin page is down). This needs the
**supabase.com account that owns the project** — the team login above does
**not** open the dashboard.

1. Open the project: <https://supabase.com/dashboard> → the project with
   reference `oocuotdsijfmogleovum`.
2. **Storage → `audio` bucket → Upload file** — the file must be named
   `<catalog lowercase>.<ext>`, e.g. `str002.m4a`.
3. **Storage → `covers` bucket → Upload file** — e.g. `str002.jpg`.
4. **Table Editor → `releases` → Insert row**: fill `catalog`, `title`,
   `artist`, `year`, and set `audio_path` = `str002.m4a`,
   `cover_path` = `str002.jpg` *exactly* (these are paths inside the buckets).
5. Refresh the public site to verify.

Note: the admin page sets audio/artwork **cache headers** automatically; manual
dashboard uploads should set *Cache control* to `3600` if the option is offered,
otherwise tracks re-download on every play.
