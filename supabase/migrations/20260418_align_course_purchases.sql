alter table if exists public.course_purchases
  add column if not exists course_id text,
  add column if not exists course_name text,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists amount integer,
  add column if not exists currency text default 'INR',
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text,
  add column if not exists status text default 'created',
  add column if not exists source text default 'website',
  add column if not exists drive_link text,
  add column if not exists gateway_response jsonb default '{}'::jsonb,
  add column if not exists notes text,
  add column if not exists purchased_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists created_at timestamptz default timezone('utc', now()),
  add column if not exists updated_at timestamptz default timezone('utc', now());

create unique index if not exists course_purchases_razorpay_order_id_key
  on public.course_purchases (razorpay_order_id)
  where razorpay_order_id is not null;

create unique index if not exists course_purchases_razorpay_payment_id_key
  on public.course_purchases (razorpay_payment_id)
  where razorpay_payment_id is not null;

create index if not exists course_purchases_status_idx
  on public.course_purchases (status);

create index if not exists course_purchases_purchased_at_idx
  on public.course_purchases (purchased_at desc nulls last);

create or replace function public.set_course_purchases_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_course_purchases_updated_at on public.course_purchases;

create trigger set_course_purchases_updated_at
before update on public.course_purchases
for each row
execute function public.set_course_purchases_updated_at();
