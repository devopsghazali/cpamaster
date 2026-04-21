import { corsHeaders, json } from '../_shared/cors.ts'
import { getServiceSupabase } from '../_shared/supabase.ts'
import { AdminAuthError, assertAdmin } from '../_shared/admin.ts'
import { checkRateLimit, clientIpFromRequest } from '../_shared/rateLimit.ts'

// Public GET — returns banner config for exit-offer popup etc.
// Admin POST — updates a config row; requires x-admin-token header.
//
// Anyone can read site_config via anon RLS; this function exists so the
// admin write path is gated by the admin token instead of the service role
// key being exposed to the browser, and so the public response shape is
// stable regardless of the underlying schema.

const BANNER_KEY = 'exit_offer_banner'

const DEFAULT_BANNER = {
  couponCode: 'FIRST10',
  slotsText: '10 slots only',
  enabled: true,
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const ip = clientIpFromRequest(request)
  const rate = checkRateLimit(`site_config:${ip}`, 120, 60_000)
  if (!rate.allowed) {
    return json({ error: 'Too many requests, slow down.' }, 429)
  }

  const supabase = getServiceSupabase()

  if (request.method === 'GET') {
    return await handleGet(supabase)
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405)
  }

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const action = `${payload?.action || ''}`.trim()

  // Public actions (no auth)
  if (action === 'get') {
    return await handleGet(supabase)
  }

  // Admin actions
  let actor: string
  try {
    actor = assertAdmin(request)
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return json({ error: error.message }, error.status)
    }
    return json({ error: 'Unauthorized.' }, 401)
  }

  try {
    switch (action) {
      case 'set_banner':
        return await handleSetBanner(supabase, payload, actor)
      default:
        return json({ error: `Unknown action: ${action}` }, 400)
    }
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'site_config failed.' },
      500,
    )
  }
})

async function handleGet(supabase: ReturnType<typeof getServiceSupabase>) {
  const { data, error } = await supabase
    .from('site_config')
    .select('key, value')
    .eq('key', BANNER_KEY)
    .maybeSingle()

  if (error) {
    return json({ ok: true, banner: DEFAULT_BANNER })
  }

  const stored = (data?.value || {}) as Record<string, unknown>
  const banner = {
    couponCode: sanitizeCode(stored.couponCode) || DEFAULT_BANNER.couponCode,
    slotsText:
      sanitizeText(stored.slotsText, 120) || DEFAULT_BANNER.slotsText,
    enabled: stored.enabled === false ? false : true,
  }

  return json({ ok: true, banner })
}

async function handleSetBanner(
  supabase: ReturnType<typeof getServiceSupabase>,
  payload: Record<string, unknown>,
  actor: string,
) {
  const code = sanitizeCode(payload?.couponCode)
  if (!code || !/^[A-Z0-9_-]{3,32}$/.test(code)) {
    return json(
      { error: 'couponCode must be 3-32 chars, uppercase letters, digits, _ or -.' },
      400,
    )
  }

  const slotsText = sanitizeText(payload?.slotsText, 120)
  if (!slotsText) {
    return json({ error: 'slotsText is required.' }, 400)
  }

  const enabled = payload?.enabled === false ? false : true

  const value = { couponCode: code, slotsText, enabled }

  const { error } = await supabase
    .from('site_config')
    .upsert(
      {
        key: BANNER_KEY,
        value,
        updated_at: new Date().toISOString(),
        updated_by: actor,
      },
      { onConflict: 'key' },
    )

  if (error) throw new Error(error.message)

  return json({ ok: true, banner: value })
}

function sanitizeCode(raw: unknown): string {
  return `${raw || ''}`.trim().toUpperCase().slice(0, 32)
}

function sanitizeText(raw: unknown, max: number): string {
  return `${raw || ''}`.trim().slice(0, max)
}
