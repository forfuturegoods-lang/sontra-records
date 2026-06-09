# Sontra Records — Admin / Supabase setup

The label is run from a web **admin page** (`admin.html`) where your team logs in
and uploads audio + artwork and edits releases. Content lives in **Supabase**
(a free hosted backend) — **not** in this GitHub repo — so the team never touches
code or git. The public site reads releases from Supabase automatically.

You only do this setup **once**. ~10 minutes.

---

## 1. Create the Supabase project
1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. Pick a name + a strong database password, choose a region near your listeners.
3. Wait ~2 min for it to provision.

## 2. Create the database + storage
1. In the project: **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy **all** of it, paste, **Run**.
   - This creates the `releases` table, the `covers` + `audio` storage buckets,
     and the security rules (public can read; only logged-in team can write).

## 3. Connect the site to your project
1. In Supabase: **Project Settings → API**. Copy:
   - **Project URL** (e.g. `https://abcd.supabase.co`)
   - **anon public** key (a long `eyJ…` string — safe to put in the page)
2. Open `supabase-config.js` and paste them in:
   ```js
   window.SUPABASE_URL      = "https://abcd.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJhbGciOi…";
   ```
   (Until both are set, the site shows the built-in demo catalog and the admin
   page shows a setup notice — nothing breaks.)

## 4. Create team logins
1. In Supabase: **Authentication → Users → Add user** — create an email +
   password for each teammate. Tell them their credentials.
2. Recommended: **Authentication → Providers → Email → turn OFF "Allow new users
   to sign up"** so only people you add can log in.

## 5. Use it
- Open **`/admin.html`** (e.g. `https://yoursite/admin.html`). Team signs in.
- **Add a release:** fill in catalog / title / artist / year / genre / BPM, choose
  an **artwork** image and an **audio** file (WAV 24-bit/44.1 kHz recommended),
  **Save**. It uploads the files and the release appears on the public site.
- **Edit / Delete** from the Catalog list on the right. (Leaving a file field
  empty on edit keeps the current file.)

---

## Notes
- **Ordering:** releases show newest-added first. Use the `position` field
  (lower = nearer the top) if you want manual control — set it in the Supabase
  table editor for now (a control can be added to the form later).
- **Audio format:** WAV 24-bit/44.1 kHz is the target; mp3/m4a/ogg also play.
  Keep web files reasonably short — the player loads the whole file to decode.
- **Audio + CORS:** Supabase public storage serves cross-origin by default, so the
  Web Audio player can fetch + decode it. If a track ever fails to load in the
  player, check **Storage → Policies** and that the bucket is **public**.
- **The admin page is `noindex`** and gated by login, but treat it as internal —
  share the URL only with your team.
- **Security:** the anon key is meant to be public; writes are blocked unless a
  user is logged in (enforced by the row-level security from `schema.sql`).
