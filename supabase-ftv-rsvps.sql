-- Run once in the Supabase SQL editor.
create table if not exists ftv_rsvps (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  party_size smallint not null check (party_size between 1 and 20),
  contact text check (char_length(contact) <= 254),
  note text check (char_length(note) <= 500)
);

alter table ftv_rsvps enable row level security;

-- Public can insert only. No select/update/delete for anon, so RSVPs stay private.
drop policy if exists "anon insert" on ftv_rsvps;
create policy "anon insert" on ftv_rsvps for insert to anon with check (true);

grant usage on schema public to anon;
grant insert on ftv_rsvps to anon;
