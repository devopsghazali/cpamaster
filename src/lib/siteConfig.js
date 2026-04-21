import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './config'
import { adminRequest } from './admin'

const DEFAULT_BANNER = {
  couponCode: 'FIRST10',
  slotsText: '10 slots only',
  enabled: true,
}

export async function fetchBannerConfig() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/site_config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ action: 'get' }),
    })
    if (!response.ok) throw new Error('bad status')
    const data = await response.json()
    return data?.banner || DEFAULT_BANNER
  } catch {
    return DEFAULT_BANNER
  }
}

export async function updateBannerConfig({ couponCode, slotsText, enabled }) {
  const data = await adminRequest(
    'set_banner',
    { couponCode, slotsText, enabled },
    { endpoint: 'site_config' },
  )
  return data?.banner || null
}

export { DEFAULT_BANNER }
