const baseUrl = 'https://api.razorpay.com/v1'

function getAuthHeader() {
  const keyId = Deno.env.get('RAZORPAY_KEY_ID')
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

  if (!keyId || !keySecret) {
    throw new Error('Missing Razorpay credentials.')
  }

  const encoded = btoa(`${keyId}:${keySecret}`)
  return { keyId, authorization: `Basic ${encoded}` }
}

async function razorpayFetch(path: string, init?: RequestInit) {
  const { authorization } = getAuthHeader()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.error?.description || 'Razorpay request failed.')
  }

  return json
}

export async function createRazorpayOrder({
  amount,
  receipt,
  notes,
}: {
  amount: number
  receipt: string
  notes: Record<string, string>
}) {
  return razorpayFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt,
      notes,
    }),
  })
}

export async function fetchRazorpayPayment(paymentId: string) {
  return razorpayFetch(`/payments/${paymentId}`, {
    method: 'GET',
  })
}

export function getPublicRazorpayConfig() {
  const { keyId } = getAuthHeader()
  return { keyId }
}
