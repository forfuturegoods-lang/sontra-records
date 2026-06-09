/* ============================================================================
   Sontra Records — Admin (team CMS)
   Auth + audio/artwork uploads + release create/edit/delete, all via Supabase.
   No server: the browser talks to Supabase directly (RLS enforces who can write).
   ========================================================================== */

const $ = id => document.getElementById(id);
const show = (el, on) => el.classList.toggle("hidden", !on);

let sb = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // Not configured yet → show the setup notice and stop.
  if (!window.supabaseReady || !window.supabaseReady()) {
    show($("setup-notice"), true);
    return;
  }
  sb = window.supabaseClient();
  if (!sb) { show($("setup-notice"), true); return; }

  wireAuth();
  wireForm();

  // route based on current session, and react to login/logout
  const { data } = await sb.auth.getSession();
  route(data.session);
  sb.auth.onAuthStateChange((_e, session) => route(session));
}

function route(session) {
  const loggedIn = !!session;
  show($("login"), !loggedIn);
  show($("dashboard"), loggedIn);
  show($("userbox"), loggedIn);
  if (loggedIn) {
    $("user-email").textContent = session.user.email || "";
    loadList();
  }
}

/* ── auth ─────────────────────────────────────────────────────────────────*/
function wireAuth() {
  $("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $("login-msg"); msg.textContent = "Signing in…"; msg.className = "msg";
    const { error } = await sb.auth.signInWithPassword({
      email: $("email").value.trim(),
      password: $("password").value
    });
    if (error) { msg.textContent = error.message; msg.className = "msg err"; }
    else { msg.textContent = ""; }
  });
  $("logout-btn").addEventListener("click", () => sb.auth.signOut());
}

/* ── helpers ──────────────────────────────────────────────────────────────*/
const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ext  = f => { const m = /\.([a-z0-9]+)$/i.exec(f.name || ""); return m ? m[1].toLowerCase() : "bin"; };

// upload a file to a bucket under <catalog-slug>.<ext>, overwriting; return its path
async function uploadFile(bucket, catalog, file) {
  const path = slug(catalog) + "." + ext(file);
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    upsert: true, contentType: file.type || undefined
  });
  if (error) throw error;
  return path;
}

/* ── create / edit form ───────────────────────────────────────────────────*/
function wireForm() {
  $("release-form").addEventListener("submit", onSave);
  $("cancel-btn").addEventListener("click", resetForm);
}

function resetForm() {
  $("release-form").reset();
  $("rel-id").value = "";
  $("form-title").textContent = "New release";
  show($("cancel-btn"), false);
  $("form-msg").textContent = "";
}

async function onSave(e) {
  e.preventDefault();
  const msg = $("form-msg"); const saveBtn = $("save-btn");
  msg.className = "msg"; msg.textContent = "Saving…"; saveBtn.disabled = true;

  try {
    const catalog = $("rel-catalog").value.trim();
    const row = {
      catalog,
      title:  $("rel-title").value.trim(),
      artist: $("rel-artist").value.trim(),
      year:   $("rel-year").value   ? parseInt($("rel-year").value, 10)   : null,
      genre:  $("rel-genre").value.trim() || null,
      bpm:    $("rel-bpm").value    ? parseFloat($("rel-bpm").value)       : null,
      beat_offset: $("rel-offset").value ? parseFloat($("rel-offset").value) : 0,
      buy_url:    $("rel-buy").value.trim() || null,
      donate_url: $("rel-donate").value.trim() || null
    };

    // upload files if provided (otherwise keep existing paths on edit)
    const coverFile = $("rel-cover").files[0];
    const audioFile = $("rel-audio").files[0];
    if (coverFile) { msg.textContent = "Uploading artwork…"; row.cover_path = await uploadFile("covers", catalog, coverFile); }
    if (audioFile) { msg.textContent = "Uploading audio…";   row.audio_path = await uploadFile("audio",  catalog, audioFile); }

    msg.textContent = "Saving release…";
    const id = $("rel-id").value;
    let error;
    if (id) ({ error } = await sb.from("releases").update(row).eq("id", id));
    else    ({ error } = await sb.from("releases").insert(row));
    if (error) throw error;

    msg.className = "msg ok"; msg.textContent = "Saved ✓";
    resetForm();
    loadList();
  } catch (err) {
    msg.className = "msg err"; msg.textContent = err.message || "Something went wrong.";
  } finally {
    saveBtn.disabled = false;
  }
}

/* ── list / edit / delete ─────────────────────────────────────────────────*/
async function loadList() {
  const list = $("rel-list");
  const { data, error } = await sb.from("releases").select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) { list.innerHTML = `<p class="msg err">${error.message}</p>`; return; }
  if (!data.length) { list.innerHTML = `<p class="muted">No releases yet — add one on the left.</p>`; return; }

  list.innerHTML = data.map(r => {
    const cover = window.storagePublicUrl("covers", r.cover_path) || "assets/covers/cover-01.svg";
    const hasAudio = r.audio_path ? "· audio ✓" : "· no audio";
    return `
      <div class="rel-item">
        <img src="${cover}" alt="" />
        <div class="rel-item__meta">
          <div class="rel-item__title">${esc(r.title)} — ${esc(r.artist)}</div>
          <div class="rel-item__sub">${esc(r.catalog)} · ${esc(r.genre || "—")} · ${esc(r.year || "—")} ${hasAudio}</div>
        </div>
        <div class="rel-item__btns">
          <button data-edit="${r.id}">Edit</button>
          <button class="danger" data-del="${r.id}" data-cat="${esc(r.catalog)}">Delete</button>
        </div>
      </div>`;
  }).join("");

  list.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editRelease(b.dataset.edit, data)));
  list.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => delRelease(b.dataset.del, b.dataset.cat, data)));
}

function editRelease(id, data) {
  const r = data.find(x => x.id === id); if (!r) return;
  $("rel-id").value = r.id;
  $("rel-catalog").value = r.catalog || "";
  $("rel-title").value   = r.title || "";
  $("rel-artist").value  = r.artist || "";
  $("rel-year").value    = r.year ?? "";
  $("rel-genre").value   = r.genre || "";
  $("rel-bpm").value     = r.bpm ?? "";
  $("rel-offset").value  = r.beat_offset ?? "";
  $("rel-buy").value     = r.buy_url || "";
  $("rel-donate").value  = r.donate_url || "";
  $("rel-cover").value = ""; $("rel-audio").value = "";   // only upload if a new file is chosen
  $("form-title").textContent = "Edit " + r.catalog;
  show($("cancel-btn"), true);
  $("form-msg").textContent = "Editing — leave a file empty to keep the current one.";
  $("form-msg").className = "msg";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function delRelease(id, catalog, data) {
  if (!confirm(`Delete "${catalog}"? This removes the release (its files stay in storage).`)) return;
  const r = data.find(x => x.id === id);
  const { error } = await sb.from("releases").delete().eq("id", id);
  if (error) { alert(error.message); return; }
  // best-effort: also remove its files
  if (r) {
    if (r.cover_path) sb.storage.from("covers").remove([r.cover_path]);
    if (r.audio_path) sb.storage.from("audio").remove([r.audio_path]);
  }
  loadList();
}

/* tiny HTML escaper (shared with the public site's esc) */
function esc(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
