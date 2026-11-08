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

-- Photo release consent, true when the RSVP box was checked. Null on RSVPs made before the box existed.
alter table ftv_rsvps add column if not exists photo_release boolean;

-- Public meals-left counter: exposes only the total of party_size, no names or contacts.
create or replace function ftv_rsvp_total() returns integer
language sql security definer set search_path = public as
$$ select coalesce(sum(party_size), 0)::int from ftv_rsvps $$;
grant execute on function ftv_rsvp_total() to anon;

-- Per-event RSVPs. Existing rows belong to the Nov 7 event; new rows default to the current event (Dec 5).
-- Change the default, and the date in feed-the-valley.html, for each new event.
alter table ftv_rsvps add column if not exists event_date date;
update ftv_rsvps set event_date = date '2026-11-07' where event_date is null;
alter table ftv_rsvps alter column event_date set default date '2026-12-05';
create or replace function ftv_rsvp_total(p_date date) returns integer
language sql security definer set search_path = public as
$$ select coalesce(sum(party_size), 0)::int from ftv_rsvps where event_date = p_date $$;
grant execute on function ftv_rsvp_total(date) to anon;
