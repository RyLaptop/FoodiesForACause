-- Run once in the Supabase SQL editor.
create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  message text not null check (char_length(message) between 2 and 2000)
);

alter table contact_messages enable row level security;

drop policy if exists "anon insert" on contact_messages;
create policy "anon insert" on contact_messages for insert to anon with check (true);

grant usage on schema public to anon;
grant insert on contact_messages to anon;
