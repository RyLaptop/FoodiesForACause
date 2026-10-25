-- Run once in the Supabase SQL editor.
create table if not exists event_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  form text not null check (form in ('service','fundraiser','social','ftv')),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  attending boolean not null,          -- on the ftv form this is "will you be volunteering"
  needs_ride boolean,
  can_give_rides boolean,
  can_bake boolean,                    -- fundraiser form only
  can_cook boolean,                    -- ftv form only
  associate_screener boolean           -- ftv form only
);

alter table event_signups enable row level security;

-- Public can insert only. No select/update/delete for anon, so signups stay private.
drop policy if exists "anon insert" on event_signups;
create policy "anon insert" on event_signups for insert to anon with check (true);

grant usage on schema public to anon;
grant insert on event_signups to anon;

-- Added later: tag responses with the event date and expose a public count for the FTV counters.
alter table event_signups add column if not exists event_date date;

create or replace function ftv_signup_counts(p_date date) returns json
language sql security definer set search_path = public as
$$ select json_build_object('volunteers', count(*) filter (where attending), 'cooks', count(*) filter (where can_cook))
   from event_signups where form = 'ftv' and event_date = p_date $$;
grant execute on function ftv_signup_counts(date) to anon;
