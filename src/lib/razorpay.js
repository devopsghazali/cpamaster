function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay)
      return
    }

    const existing = document.querySelector('script[data-razorpay-checkout="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay))
      existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'))
    document.body.appendChild(script)
  })
}

export async function launchRazorpayCheckout({ order, customer, onSuccess, onDismiss }) {
  const Razorpay = await loadScript()

  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'cpamaster',
      description: order.courseName,
      order_id: order.orderId,
      image: '/logo.svg',
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: () => {
          onDismiss?.()
          reject(new Error('Checkout closed before payment completion.'))
        },
      },
      handler: async (response) => {
        try {
          await onSuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          resolve(response)
        } catch (error) {
          reject(error)
        }
      },
    })

    checkout.open()
  })
}
