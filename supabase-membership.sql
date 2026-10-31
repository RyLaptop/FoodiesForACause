-- Run once in the Supabase SQL editor.
create table if not exists members (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 10 and 20),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  uin text not null check (uin ~ '^[0-9]{9}$'),
  class_year text not null check (class_year in ('Freshman','Sophomore','Junior','Senior','Graduate'))
);

alter table members enable row level security;

drop policy if exists "anon insert" on members;
create policy "anon insert" on members for insert to anon with check (true);

grant usage on schema public to anon;
grant insert on members to anon;
