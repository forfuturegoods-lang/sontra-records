/* ============================================================================
   SUPABASE CONNECTION
   ----------------------------------------------------------------------------
   Fill these two values in after creating your project
   (Supabase dashboard → Project Settings → API). The anon "public" key is
   designed to be shipped in client code — access is controlled by Row-Level
   Security, so it is safe here.

   Until BOTH are filled in, the public site falls back to the built-in demo
   catalog (script.js → RELEASES) and the admin page shows a setup notice.
   ========================================================================== */

window.SUPABASE_URL      = "https://oocuotdsijfmogleovum.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_8w2KBXiIX6hxKu552MXFIg_0wmf74nn";  // publishable (public) key — safe to ship

/* ---- helpers (don't edit below) ------------------------------------------ */
window.supabaseReady = function () {
  return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
};

window.supabaseClient = function () {
  if (!window.supabaseReady() || !window.supabase) return null;   // CDN lib or keys missing
  if (!window._sb) {
    window._sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return window._sb;
};

/* Public URL for a file in a storage bucket. */
window.storagePublicUrl = function (bucket, path) {
  const c = window.supabaseClient();
  if (!c || !path) return "";
  return c.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
