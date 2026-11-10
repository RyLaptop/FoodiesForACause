-- Run once in the Supabase SQL editor. Safe to re-run.
-- Adds the three FTV roles (handout / cook / screener) to signups_ftv and makes the counters role-aware.
-- Run this BEFORE the new site goes live, or the new forms' inserts will fail on the unknown columns.

alter table signups_ftv add column if not exists role text check (role in ('handout', 'cook', 'screener'));
alter table signups_ftv add column if not exists vitals_trained boolean;   -- screeners only: has vitals training/cert
alter table signups_ftv add column if not exists vitals_cert text check (char_length(vitals_cert) <= 160);

-- Counters on the sign-up pages. Rows from before roles existed (role is null) still count as before:
-- attending = handout, can_cook = cook, associate_screener = screener.
create or replace function ftv_signup_counts(p_date date) returns json
language sql security definer set search_path = public as
$$ select json_build_object(
     'volunteers', count(*) filter (where attending and coalesce(role, 'handout') = 'handout'),
     'cooks',      count(*) filter (where can_cook),
     'screeners',  count(*) filter (where associate_screener))
   from signups_ftv where event_date = p_date $$;
