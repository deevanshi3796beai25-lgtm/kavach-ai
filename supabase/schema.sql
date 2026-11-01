-- KAVACH AI: simplified 3-table schema (run in Supabase SQL Editor)
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  language text default 'hi',
  created_at timestamptz default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  client_id text,                                   -- anonymous device id (used when not logged in)
  input_type text not null check (input_type in ('link','qr','voice','media')),
  input_preview text,
  score int check (score between 0 and 100),
  verdict text check (verdict in ('SAFE','SUSPICIOUS','FAKE')),
  reasons jsonb default '[]',
  mode text default 'rules',                        -- 'rules' or 'demo'
  created_at timestamptz default now()
);
create index if not exists idx_scans_user on public.scans(user_id, created_at desc);

create table if not exists public.threat_indicators (
  id bigint generated always as identity primary key,
  indicator_type text check (indicator_type in ('domain','upi','phone')),
  indicator_value text unique not null,
  note text
);

alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.threat_indicators enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own scans" on public.scans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "threats readable" on public.threat_indicators for select using (true);

insert into public.threat_indicators (indicator_type, indicator_value, note) values
 ('domain','sbi-kyc-update.xyz','[DEMO] fake bank KYC page'),
 ('domain','paytm-reward-claim.top','[DEMO] reward phishing'),
 ('upi','refund.helpdesk@oksbi','[DEMO] reverse-debit refund scam'),
 ('upi','lucky.winner@ybl','[DEMO] lottery collect request'),
 ('phone','+919999900000','[DEMO] digital arrest scam caller')
on conflict (indicator_value) do nothing;
