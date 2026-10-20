-- 001_waitlist.sql — Alma Mater landing page waitlist (spec section 6).
-- Apply once, from the Supabase SQL editor or `supabase db push`.
-- All access is server-only through the service role key (held in env, never
-- committed). The waitlist is independent of any login allowlist.

create extension if not exists pgcrypto; -- gen_random_uuid()

create type public.waitlist_role as enum ('student', 'recent_grad', 'alum');

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.waitlist_role not null,
  college text not null,
  first_need text,
  source text,
  created_at timestamptz not null default now(),
  -- Defence in depth: the server lowercases before insert (lib/validation.ts).
  constraint waitlist_email_is_lowercase check (email = lower(email))
);

-- Case-insensitive uniqueness. Treat SQLSTATE 23505 on insert as
-- "You're already on the list", not an error.
create unique index waitlist_email_lower_key on public.waitlist (lower(email));

-- Rate limiting (option a: database check on a hashed IP, no extra dependency).
-- Stores only HMAC-SHA256 hashes of caller IPs; a raw IP never touches the DB.
-- The server action checks recent rows per hash (lib/validation.ts isRateLimited)
-- and inserts one row per attempt, allowed or not.
create table public.waitlist_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);
create index waitlist_attempts_ip_hash_attempted_at_idx
  on public.waitlist_attempts (ip_hash, attempted_at desc);

-- No anon/authenticated access. RLS with no policies denies every non-service
-- role; the service role key bypasses RLS and is the only way in.
alter table public.waitlist enable row level security;
alter table public.waitlist_attempts enable row level security;
