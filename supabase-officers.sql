-- Officer login: officers sign in on officer-login.html (Supabase Auth, email + password, email confirmed).
-- Only emails listed in `officers` can read the form tables. Nobody gets write access this way.
-- To add an officer: insert into officers (email) values ('name@tamu.edu');
-- To remove one:     delete from officers where email = 'name@tamu.edu';

create table if not exists officers (email text primary key);
alter table officers enable row level security;  -- no policies: only is_officer() and the service role can see it
insert into officers (email) values ('rylanlat@tamu.edu') on conflict do nothing;

create or replace function is_officer() returns boolean
language sql security definer stable set search_path = public as
$$ select exists (select 1 from officers where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))) $$;
revoke execute on function is_officer() from public, anon;
grant execute on function is_officer() to authenticated;

drop policy if exists "officers read" on contact_messages;
create policy "officers read" on contact_messages for select to authenticated using (is_officer());
drop policy if exists "officers read" on event_signups;
create policy "officers read" on event_signups for select to authenticated using (is_officer());
drop policy if exists "officers read" on ftv_rsvps;
create policy "officers read" on ftv_rsvps for select to authenticated using (is_officer());
drop policy if exists "officers read" on members;
create policy "officers read" on members for select to authenticated using (is_officer());

grant select on contact_messages, event_signups, ftv_rsvps, members to authenticated;
