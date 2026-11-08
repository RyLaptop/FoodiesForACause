-- Officer login (officer-login.html). No Supabase accounts and no email: each officer has a private access code.
-- Codes are stored hashed in `officers`; officer_data() checks email + code and returns one table as JSON.
-- The form tables stay closed to the public key; only this function reads them.

create extension if not exists pgcrypto with schema extensions;
create table if not exists officers (email text primary key, code_hash text);
alter table officers enable row level security;  -- no policies: only the service role and officer_data() can see it

create or replace function officer_data(p_email text, p_code text, p_table text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare ok boolean; r jsonb;
begin
  select exists (select 1 from officers
    where lower(email) = lower(coalesce(p_email, '')) and code_hash is not null and code_hash = crypt(coalesce(p_code, ''), code_hash)) into ok;
  if not ok then perform pg_sleep(1); raise exception 'denied' using errcode = '28000'; end if;
  if p_table = 'ftv_rsvps' then select coalesce(jsonb_agg(t), '[]'::jsonb) into r from (select * from ftv_rsvps order by created_at desc limit 1000) t;
  elsif p_table = 'event_signups' then select coalesce(jsonb_agg(t), '[]'::jsonb) into r from (select * from event_signups order by created_at desc limit 1000) t;
  elsif p_table = 'members' then select coalesce(jsonb_agg(t), '[]'::jsonb) into r from (select * from members order by created_at desc limit 1000) t;
  elsif p_table = 'contact_messages' then select coalesce(jsonb_agg(t), '[]'::jsonb) into r from (select * from contact_messages order by created_at desc limit 1000) t;
  else raise exception 'unknown table';
  end if;
  return r;
end $$;
revoke execute on function officer_data(text, text, text) from public;
grant execute on function officer_data(text, text, text) to anon, authenticated;

-- Add an officer, or issue a new code (run in the Supabase SQL editor, copy the code it returns, send it privately):
--   insert into officers (email) values ('name@tamu.edu') on conflict do nothing;
--   with c as (select encode(extensions.gen_random_bytes(10), 'hex') as code)
--   update officers set code_hash = extensions.crypt((select code from c), extensions.gen_salt('bf'))
--   where lower(email) = 'name@tamu.edu' returning email, (select code from c) as access_code;
-- Remove an officer: delete from officers where email = 'name@tamu.edu';
