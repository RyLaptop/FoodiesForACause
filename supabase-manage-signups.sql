-- Run once in the Supabase SQL editor. Safe to re-run. Run AFTER supabase-signups-split.sql and supabase-ftv-roles.sql.
-- Lets a volunteer find, edit or delete their own sign-ups from manage-signup.html.
-- The public key still cannot read or change the tables. These three functions are the only way in, and each one
-- requires the full name, phone number and email of the sign-up to match before it returns or touches anything.
-- Sign-ups for events that already happened are read-only, so attendance history stays accurate.

create or replace function _same_person(a_name text, a_phone text, a_email text, b_name text, b_phone text, b_email text)
returns boolean language sql immutable as
$$ select regexp_replace(lower(btrim(coalesce(a_name, ''))), '\s+', ' ', 'g') = regexp_replace(lower(btrim(coalesce(b_name, ''))), '\s+', ' ', 'g')
      and right(regexp_replace(coalesce(a_phone, ''), '\D', '', 'g'), 10) <> ''
      and right(regexp_replace(coalesce(a_phone, ''), '\D', '', 'g'), 10) = right(regexp_replace(coalesce(b_phone, ''), '\D', '', 'g'), 10)
      and left(lower(split_part(btrim(coalesce(a_email, '')), '@', 1)), 5) <> ''
      and left(lower(split_part(btrim(coalesce(a_email, '')), '@', 1)), 5) = left(lower(split_part(btrim(coalesce(b_email, '')), '@', 1)), 5) $$;
-- Forgiving on purpose, so typos don't lock people out: name ignores case and extra spaces, phone compares digits only
-- (last 10), email compares only the first 5 characters before the @, ignoring case.

-- Find: every sign-up that matches all three of name, phone and email.
create or replace function my_signups(p_name text, p_phone text, p_email text) returns jsonb
language plpgsql security definer set search_path = public as
$$
declare r jsonb; today date := (now() at time zone 'America/Chicago')::date;
begin
  if char_length(btrim(coalesce(p_name, ''))) < 2
     or char_length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) < 7
     or char_length(btrim(coalesce(p_email, ''))) < 3 then
    return '[]'::jsonb;
  end if;
  select coalesce(jsonb_agg(x order by x->>'event_date' desc nulls last), '[]'::jsonb) into r from (
    select jsonb_build_object('tbl', 'signups_ftv', 'id', id, 'event_date', event_date, 'attending', attending,
        'needs_ride', needs_ride, 'can_give_rides', can_give_rides, 'vitals_trained', vitals_trained, 'vitals_cert', vitals_cert,
        'role', coalesce(role, case when associate_screener then 'screener' when can_cook then 'cook' else 'handout' end),
        'locked', event_date is not null and event_date < today) x
      from signups_ftv where _same_person(name, phone, email, p_name, p_phone, p_email)
    union all
    select jsonb_build_object('tbl', 'signups_service', 'id', id, 'event_date', event_date, 'attending', attending,
        'needs_ride', needs_ride, 'can_give_rides', can_give_rides, 'locked', event_date is not null and event_date < today)
      from signups_service where _same_person(name, phone, email, p_name, p_phone, p_email)
    union all
    select jsonb_build_object('tbl', 'signups_social', 'id', id, 'event_date', event_date, 'attending', attending,
        'needs_ride', needs_ride, 'can_give_rides', can_give_rides, 'locked', event_date is not null and event_date < today)
      from signups_social where _same_person(name, phone, email, p_name, p_phone, p_email)
    union all
    select jsonb_build_object('tbl', 'signups_fundraiser', 'id', id, 'event_date', event_date, 'attending', attending,
        'can_bake', can_bake, 'needs_ride', needs_ride, 'can_give_rides', can_give_rides, 'locked', event_date is not null and event_date < today)
      from signups_fundraiser where _same_person(name, phone, email, p_name, p_phone, p_email)
  ) s;
  if r = '[]'::jsonb then perform pg_sleep(0.5); end if;  -- slows down guessing
  return r;
end $$;

-- Edit: only the answer fields, only on a matching sign-up for an upcoming event. Returns {"updated": n}.
create or replace function update_signup(p_table text, p_id bigint, p_name text, p_phone text, p_email text, p_changes jsonb) returns jsonb
language plpgsql security definer set search_path = public as
$$
declare n int := 0; today date := (now() at time zone 'America/Chicago')::date;
begin
  if p_table = 'signups_ftv' then
    -- A cook's or screener's role flag mirrors "will you be volunteering", as the sign-up forms do.
    update signups_ftv set
      attending = coalesce((p_changes->>'attending')::boolean, attending),
      needs_ride = coalesce((p_changes->>'needs_ride')::boolean, needs_ride),
      can_give_rides = coalesce((p_changes->>'can_give_rides')::boolean, can_give_rides),
      can_cook = case when role = 'cook' and p_changes ? 'attending' then (p_changes->>'attending')::boolean else can_cook end,
      associate_screener = case when role = 'screener' and p_changes ? 'attending' then (p_changes->>'attending')::boolean else associate_screener end,
      vitals_trained = case when role = 'screener' and p_changes ? 'vitals_trained' then (p_changes->>'vitals_trained')::boolean else vitals_trained end,
      vitals_cert = case when role = 'screener' and p_changes ? 'vitals_trained'
        then case when (p_changes->>'vitals_trained')::boolean then nullif(left(btrim(coalesce(p_changes->>'vitals_cert', '')), 160), '') else null end
        else vitals_cert end
    where id = p_id and (event_date is null or event_date >= today) and _same_person(name, phone, email, p_name, p_phone, p_email);
  elsif p_table = 'signups_service' or p_table = 'signups_social' then
    execute format($f$ update %I set
        attending = coalesce(($1->>'attending')::boolean, attending),
        needs_ride = coalesce(($1->>'needs_ride')::boolean, needs_ride),
        can_give_rides = coalesce(($1->>'can_give_rides')::boolean, can_give_rides)
      where id = $2 and (event_date is null or event_date >= $3) and _same_person(name, phone, email, $4, $5, $6) $f$, p_table)
      using p_changes, p_id, today, p_name, p_phone, p_email;
  elsif p_table = 'signups_fundraiser' then
    update signups_fundraiser set
      attending = coalesce((p_changes->>'attending')::boolean, attending),
      can_bake = coalesce((p_changes->>'can_bake')::boolean, can_bake),
      needs_ride = coalesce((p_changes->>'needs_ride')::boolean, needs_ride),
      can_give_rides = coalesce((p_changes->>'can_give_rides')::boolean, can_give_rides)
    where id = p_id and (event_date is null or event_date >= today) and _same_person(name, phone, email, p_name, p_phone, p_email);
  else
    raise exception 'unknown table';
  end if;
  get diagnostics n = row_count;
  return jsonb_build_object('updated', n);
end $$;

-- Delete: a matching sign-up for an upcoming event. Returns {"deleted": n}.
create or replace function delete_signup(p_table text, p_id bigint, p_name text, p_phone text, p_email text) returns jsonb
language plpgsql security definer set search_path = public as
$$
declare n int; today date := (now() at time zone 'America/Chicago')::date;
begin
  if p_table <> all (array['signups_ftv', 'signups_service', 'signups_social', 'signups_fundraiser']) then
    raise exception 'unknown table';
  end if;
  execute format($f$ delete from %I where id = $1 and (event_date is null or event_date >= $2) and _same_person(name, phone, email, $3, $4, $5) $f$, p_table)
    using p_id, today, p_name, p_phone, p_email;
  get diagnostics n = row_count;
  return jsonb_build_object('deleted', n);
end $$;

grant execute on function my_signups(text, text, text) to anon;
grant execute on function update_signup(text, bigint, text, text, text, jsonb) to anon;
grant execute on function delete_signup(text, bigint, text, text, text) to anon;
