import { corsHeaders, json } from '../_shared/cors.ts'
import { hmacSha256Hex, safeEqual } from '../_shared/crypto.ts'
import { getCourse } from '../_shared/courses.ts'
import { getServiceSupabase } from '../_shared/supabase.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Missing RAZORPAY_WEBHOOK_SECRET.')
    }

    const rawBody = await request.text()
    const receivedSignature = request.headers.get('x-razorpay-signature') || ''
    const expectedSignature = await hmacSha256Hex(rawBody, webhookSecret)

    if (!safeEqual(expectedSignature, receivedSignature)) {
      return json({ error: 'Webhook signature mismatch.' }, 400)
    }

    const event = JSON.parse(rawBody)
    const paymentEntity = event?.payload?.payment?.entity
    const orderEntity = event?.payload?.order?.entity
    const purchaseId = orderEntity?.receipt || paymentEntity?.notes?.purchase_id

    if (!purchaseId) {
      return json({ received: true, skipped: true })
    }

    const courseId = paymentEntity?.notes?.course_id
    const course = courseId ? getCourse(courseId) : undefined
    const status =
      event?.event === 'payment.failed'
        ? 'failed'
        : event?.event === 'payment.captured'
          ? 'captured'
          : 'processed'

    const supabase = getServiceSupabase()

    const updatePayload: Record<string, unknown> = {
      status,
      razorpay_order_id: paymentEntity?.order_id || orderEntity?.id,
      razorpay_payment_id: paymentEntity?.id || null,
      gateway_response: event,
    }

    if (status === 'captured') {
      updatePayload.purchased_at = new Date().toISOString()
      if (course?.driveLink) {
        updatePayload.drive_link = course.driveLink
      }
    }

    const { error } = await supabase
      .from('course_purchases')
      .update(updatePayload)
      .eq('id', purchaseId)

    if (error) {
      throw new Error(error.message)
    }

    return json({ received: true })
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed.' },
      500,
    )
  }
})
