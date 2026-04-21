-- Singleton-style key/value store for public-facing site config
-- (exit-offer banner coupon code + slots text, etc.).
create table if not exists public.site_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.site_config enable row level security;

-- Public read: the banner needs to fetch the active coupon/slots text
-- for every visitor. No PII here; safe to expose via anon.
drop policy if exists "site_config anon read" on public.site_config;
create policy "site_config anon read"
  on public.site_config
  for select
  to anon
  using (true);

drop policy if exists "site_config auth read" on public.site_config;
create policy "site_config auth read"
  on public.site_config
  for select
  to authenticated
  using (true);

-- Writes are only done through the edge function (service role), which
-- runs its own admin-token check. No anon/authenticated write policy.

insert into public.site_config (key, value)
values (
  'exit_offer_banner',
  jsonb_build_object(
    'couponCode', 'FIRST10',
    'slotsText', '10 slots only',
    'enabled', true
  )
)
on conflict (key) do nothing;
