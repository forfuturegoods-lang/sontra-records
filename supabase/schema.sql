-- ============================================================================
-- Sontra Records — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- Creates the releases table, the storage buckets for audio + artwork, and the
-- security rules: anyone can READ (public site), only logged-in team can WRITE.
-- ============================================================================

-- ── Releases table ─────────────────────────────────────────────────────────
create table if not exists public.releases (
  id          uuid primary key default gen_random_uuid(),
  catalog     text not null,
  title       text not null,
  artist      text not null,
  year        int,
  genre       text,
  bpm         numeric,
  beat_offset numeric default 0,        -- seconds to the first downbeat (beat grid)
  cover_path  text,                     -- object path in the 'covers' bucket
  audio_path  text,                     -- object path in the 'audio' bucket
  buy_url     text,
  donate_url  text,
  position    int default 0,            -- manual order: lower = nearer the top
  created_at  timestamptz default now()
);

alter table public.releases enable row level security;

-- public read; only authenticated team members can change anything
create policy "releases_public_read" on public.releases
  for select using (true);
create policy "releases_auth_insert" on public.releases
  for insert to authenticated with check (true);
create policy "releases_auth_update" on public.releases
  for update to authenticated using (true) with check (true);
create policy "releases_auth_delete" on public.releases
  for delete to authenticated using (true);

-- ── Storage buckets (public read) ──────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('covers', 'covers', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audio', 'audio', true)
  on conflict (id) do nothing;

-- public can read objects in these buckets; team (authenticated) can write
create policy "covers_public_read" on storage.objects
  for select using (bucket_id = 'covers');
create policy "covers_auth_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'covers');
create policy "covers_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'covers');
create policy "covers_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'covers');

create policy "audio_public_read" on storage.objects
  for select using (bucket_id = 'audio');
create policy "audio_auth_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'audio');
create policy "audio_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'audio');
create policy "audio_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'audio');

-- ── (optional) seed the current catalog ────────────────────────────────────
-- insert into public.releases (catalog,title,artist,year,genre,bpm,position) values
--   ('STR001','Blue Friday','Sontra Crew',2026,'House',124,0);
