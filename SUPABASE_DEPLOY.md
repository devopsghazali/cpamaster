# Existing project continuation

This repo is already pointed at the existing Supabase project `orrozpaelhogpqemngfj`.
No new Supabase project or database needs to be created.

## 1. Align the existing `course_purchases` table

Run the SQL in [supabase/migrations/20260418_align_course_purchases.sql](/c:/Users/mohammad%20hasnain/today%201%20aug/website_react/supabase/migrations/20260418_align_course_purchases.sql:1) inside the existing project SQL editor.

It does not recreate the database or table. It only adds the missing production columns/indexes needed by the new backend flow.

## 2. Set Edge Function secrets

Set these secrets in the same Supabase project:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `COURSE_A_DRIVE_URL`
- `COURSE_B_DRIVE_URL`
- `SUPPORT_PHONE`

## 3. Deploy Edge Functions to the existing project

If Supabase CLI is installed locally, use the existing project ref:

```bash
supabase login
supabase link --project-ref orrozpaelhogpqemngfj
supabase functions deploy create_order --no-verify-jwt
supabase functions deploy verify_payment --no-verify-jwt
supabase functions deploy razorpay_webhook --no-verify-jwt
supabase functions deploy recent_buyers --no-verify-jwt
```

## 4. Frontend env

Create a local `.env` from `.env.example` and set:

- `VITE_SUPPORT_PHONE`

`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` already match the existing project.

## 5. Razorpay webhook

Point Razorpay webhook URL to the deployed Supabase function:

```text
https://orrozpaelhogpqemngfj.functions.supabase.co/razorpay_webhook
```

Recommended events:

- `payment.captured`
- `payment.failed`
