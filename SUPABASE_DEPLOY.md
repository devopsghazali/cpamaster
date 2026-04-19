# CPAMaster — Live Razorpay + Supabase deployment

Existing Supabase project: `orrozpaelhogpqemngfj`.
Frontend is already configured to talk to it.

Flow (what happens when user clicks **Join Now – ₹2399**):

1. Modal form (name / email / phone) submit
2. Frontend `createOrder` → Supabase edge fn `create_order`
3. Edge fn inserts `course_purchases` row + creates Razorpay order
4. Razorpay Checkout opens in browser with order_id
5. User pays ₹2399 via Razorpay
6. Frontend `verifyPayment` → edge fn `verify_payment`
7. Edge fn verifies HMAC signature + updates row status=`verified`
8. User redirects to `/success` → sees Google Drive link + support number
9. Razorpay webhook (`razorpay_webhook`) double-confirms `payment.captured`
   server-side (safety net for dropped verify calls).

---

## Step 1 — Rotate Razorpay secret (IMPORTANT)

The secret posted in chat is compromised. Go to:
Razorpay Dashboard → Settings → API Keys → **Regenerate Live Keys**.

Note the **new** `key_id` and `key_secret`. Use those below.

---

## Step 2 — Align `course_purchases` table

In Supabase SQL Editor, run the migration:
`supabase/migrations/20260418_align_course_purchases.sql`

Adds missing production columns + indexes on the existing table
(no data loss, idempotent `if not exists`).

---

## Step 3 — Set edge function secrets

```bash
supabase login
supabase link --project-ref orrozpaelhogpqemngfj

supabase secrets set \
  RAZORPAY_KEY_ID=<new_key_id> \
  RAZORPAY_KEY_SECRET=<new_key_secret> \
  RAZORPAY_WEBHOOK_SECRET=<pick_any_strong_string> \
  CPA_MASTERY_DRIVE_URL=https://drive.google.com/drive/folders/1FYD-fUr22h8gsHdiWbLPLLZNQMxvlx-9 \
  SUPPORT_PHONE=<your_whatsapp_number>
```

Supabase auto-injects `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
into every function — you don't set those.

---

## Step 4 — Deploy edge functions

```bash
supabase functions deploy create_order     --no-verify-jwt
supabase functions deploy verify_payment   --no-verify-jwt
supabase functions deploy razorpay_webhook --no-verify-jwt
supabase functions deploy recent_buyers    --no-verify-jwt
```

---

## Step 5 — Razorpay webhook

Razorpay Dashboard → Settings → Webhooks → **Add webhook**.

- URL: `https://orrozpaelhogpqemngfj.functions.supabase.co/razorpay_webhook`
- Secret: the same `RAZORPAY_WEBHOOK_SECRET` you set in step 3
- Events: `payment.captured`, `payment.failed`
- Active mode: **Live**

---

## Step 6 — Frontend env

Local dev (`.env.local` — gitignored):

```ini
VITE_PAYMENT_MODE=live
VITE_SUPPORT_PHONE=<your_whatsapp_number>
```

Production (Vercel → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `VITE_PAYMENT_MODE` | `live` |
| `VITE_SUPPORT_PHONE` | your support number |
| `VITE_SUPABASE_URL` | `https://orrozpaelhogpqemngfj.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_mrF_DYjjMfEYP6aPK-IfUg_4bjYkGlV` |

Redeploy Vercel after setting.

---

## Step 7 — Test end-to-end

1. Open site → Join Courses → Apply → fill form
2. Pay ₹1 test order (create a throwaway course first, OR)
   use Razorpay test mode first (swap in `rzp_test_*` keys temporarily)
3. Verify in Supabase table editor:
   `course_purchases` row has `status = verified`, `razorpay_payment_id`,
   `drive_link` populated
4. Success page shows Drive link + support phone

---

## Secret hygiene

- Never commit `.env`, `.env.local`, or any file with real secrets.
- `key_id` is safe to expose (starts with `rzp_live_*`) — it's
  fetched server-side and returned to the browser for Checkout.
- `key_secret` NEVER leaves Supabase edge function env.
- Rotate if ever leaked.
