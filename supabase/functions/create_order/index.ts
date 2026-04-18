import { corsHeaders, json } from '../_shared/cors.ts'
import { getCourse } from '../_shared/courses.ts'
import { createRazorpayOrder, getPublicRazorpayConfig } from '../_shared/razorpay.ts'
import { getServiceSupabase } from '../_shared/supabase.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const courseId = `${body?.courseId || ''}`.trim()
    const customerName = `${body?.customer?.name || ''}`.trim()
    const customerEmail = `${body?.customer?.email || ''}`.trim().toLowerCase()
    const customerPhone = `${body?.customer?.phone || ''}`.trim()

    if (!courseId || !customerName || !customerEmail || !customerPhone) {
      return json({ error: 'courseId, name, email, and phone are required.' }, 400)
    }

    const course = getCourse(courseId)
    if (!course) {
      return json({ error: 'Unknown course selected.' }, 400)
    }

    const supabase = getServiceSupabase()

    const purchaseInsert = {
      course_id: course.id,
      course_name: course.name,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      amount: course.amount,
      currency: 'INR',
      status: 'created',
      source: 'website',
      gateway_response: {},
      notes: 'Order created from website checkout.',
    }

    const { data: createdPurchase, error: insertError } = await supabase
      .from('course_purchases')
      .insert(purchaseInsert)
      .select('id')
      .single()

    if (insertError || !createdPurchase) {
      throw new Error(insertError?.message || 'Unable to create purchase record.')
    }

    const order = await createRazorpayOrder({
      amount: course.amount,
      receipt: createdPurchase.id,
      notes: {
        purchase_id: createdPurchase.id,
        course_id: course.id,
        customer_email: customerEmail,
      },
    })

    const { error: updateError } = await supabase
      .from('course_purchases')
      .update({
        razorpay_order_id: order.id,
        gateway_response: order,
      })
      .eq('id', createdPurchase.id)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return json({
      purchaseId: createdPurchase.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseId: course.id,
      courseName: course.name,
      ...getPublicRazorpayConfig(),
    })
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unable to create order.' },
      500,
    )
  }
})
