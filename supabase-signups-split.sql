-- Splits event_signups into one table per sign-up type: signups_ftv, signups_service, signups_social, signups_fundraiser.
-- Safe to re-run: rows copy over once (legacy_id). The old event_signups table is kept as an archive and closed to the public.

create table if not exists signups_ftv (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_date date,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  attending boolean not null,            -- "will you be volunteering"
  needs_ride boolean,
  can_give_rides boolean,
  can_cook boolean,
  associate_screener boolean,
  legacy_id bigint unique
);
create table if not exists signups_service (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_date date,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  attending boolean not null,
  needs_ride boolean,
  can_give_rides boolean,
  legacy_id bigint unique
);
create table if not exists signups_social (like signups_service including all);
create table if not exists signups_fundraiser (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_date date,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  attending boolean not null,
  can_bake boolean,
  needs_ride boolean,
  can_give_rides boolean,
  legacy_id bigint unique
);

-- Public can insert only, same as before.
alter table signups_ftv enable row level security;
alter table signups_service enable row level security;
alter table signups_social enable row level security;
alter table signups_fundraiser enable row level security;
drop policy if exists "anon insert" on signups_ftv;        create policy "anon insert" on signups_ftv for insert to anon with check (true);
drop policy if exists "anon insert" on signups_service;    create policy "anon insert" on signups_service for insert to anon with check (true);
drop policy if exists "anon insert" on signups_social;     create policy "anon insert" on signups_social for insert to anon with check (true);
drop policy if exists "anon insert" on signups_fundraiser; create policy "anon insert" on signups_fundraiser for insert to anon with check (true);
grant insert on signups_ftv, signups_service, signups_social, signups_fundraiser to anon;

-- Copy existing rows (re-runnable).
insert into signups_ftv (created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, can_cook, associate_screener, legacy_id)
  select created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, can_cook, associate_screener, id from event_signups where form = 'ftv' on conflict (legacy_id) do nothing;
insert into signups_service (created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, legacy_id)
  select created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, id from event_signups where form = 'service' on conflict (legacy_id) do nothing;
insert into signups_social (created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, legacy_id)
  select created_at, event_date, name, phone, email, attending, needs_ride, can_give_rides, id from event_signups where form = 'social' on conflict (legacy_id) do nothing;
insert into signups_fundraiser (created_at, event_date, name, phone, email, attending, can_bake, needs_ride, can_give_rides, legacy_id)
  select created_at, event_date, name, phone, email, attending, can_bake, needs_ride, can_give_rides, id from event_signups where form = 'fundraiser' on conflict (legacy_id) do nothing;

-- FTV counters now read the FTV table.
create or replace function ftv_signup_counts(p_date date) returns json
language sql security definer set search_path = public as
$$ select json_build_object('volunteers', count(*) filter (where attending), 'cooks', count(*) filter (where can_cook))
   from signups_ftv where event_date = p_date $$;

-- Officer portal reads any of these tables (see supabase-officers.sql for the login check).
create or replace function officer_data(p_email text, p_code text, p_table text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare ok boolean; r jsonb;
begin
  select exists (select 1 from officers
    where lower(email) = lower(coalesce(p_email, '')) and code_hash is not null and code_hash = crypt(coalesce(p_code, ''), code_hash)) into ok;
  if not ok then perform pg_sleep(1); raise exception 'denied' using errcode = '28000'; end if;
  if p_table <> all (array['ftv_rsvps','signups_ftv','signups_service','signups_social','signups_fundraiser','members','contact_messages']) then
    raise exception 'unknown table';
  end if;
  execute format('select coalesce(jsonb_agg(t), ''[]''::jsonb) from (select * from %I order by created_at desc limit 1000) t', p_table) into r;
  return r;
end $$;

-- Final step, run AFTER the new site code is live: close the old table to the public.
--   revoke insert on event_signups from anon;
