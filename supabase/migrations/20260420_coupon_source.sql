-- Track which channel a coupon was distributed through (e.g., Instagram,
-- YouTube, Telegram). Lets the dashboard attribute redemptions back to
-- the marketing source.
alter table if exists public.coupons
  add column if not exists source text;

create index if not exists coupons_source_idx
  on public.coupons (source)
  where source is not null;
