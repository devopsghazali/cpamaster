import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  createOrder,
  simulatePlaceholderPurchase,
  verifyPayment,
} from '../lib/payment'
import { launchRazorpayCheckout } from '../lib/razorpay'
import { isPlaceholderMode } from '../lib/config'

const initialForm = { name: '', email: '', phone: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+]?\d[\d\s-]{7,15}$/

function encodePurchasePayload(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return window.btoa(binary)
}

function validate(form) {
  if (!form.name.trim() || form.name.trim().length < 2) {
    return 'Please enter your full name.'
  }
  if (!emailPattern.test(form.email.trim())) {
    return 'Please enter a valid email address.'
  }
  if (!phonePattern.test(form.phone.trim())) {
    return 'Please enter a valid phone number (8 to 15 digits, optional +).'
  }
  return ''
}

function persistAndNavigate(purchase, navigate) {
  localStorage.setItem('cpamaster-last-purchase', JSON.stringify(purchase))
  const encoded = encodePurchasePayload(purchase)
  navigate(`/success?data=${encodeURIComponent(encoded)}`)
}

export default function CoursePurchaseCard({ course, index }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [form, setForm] = useState(initialForm)
  const [busy, setBusy] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => validate(form) === '', [form])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const handlePurchase = async () => {
    if (busy || completed) return

    const validation = validate(form)
    if (validation) {
      setError(validation)
      return
    }

    setBusy(true)
    setError('')

    const customer = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }

    if (isPlaceholderMode()) {
      try {
        const purchase = simulatePlaceholderPurchase({
          courseId: course.id,
          customer,
        })
        setCompleted(true)
        persistAndNavigate(purchase, navigate)
      } catch (mockError) {
        setError(mockError.message || 'Unable to simulate checkout right now.')
        setBusy(false)
      }
      return
    }

    try {
      const order = await createOrder({ courseId: course.id, customer })

      await launchRazorpayCheckout({
        order,
        customer,
        onSuccess: async (paymentResponse) => {
          const verified = await verifyPayment({
            purchaseId: order.purchaseId,
            courseId: course.id,
            customer,
            ...paymentResponse,
          })
          setCompleted(true)
          persistAndNavigate(verified.purchase, navigate)
        },
        onDismiss: () => setBusy(false),
      })
    } catch (checkoutError) {
      setError(checkoutError.message || 'Unable to start secure checkout right now.')
      setBusy(false)
    }
  }

  const buttonLabel = (() => {
    if (completed) return 'Opening success page...'
    if (busy) {
      return isPlaceholderMode()
        ? 'Preparing preview access...'
        : 'Starting secure checkout...'
    }
    return 'Buy Now'
  })()

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        delay: 0.08 + index * 0.08,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduce ? undefined : { y: -5 }}
      className="group glass-panel relative overflow-hidden rounded-[30px] p-6 sm:p-7"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-75 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${course.glow} 0%, transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.75)]"
            style={{ background: course.iconBg }}
          >
            <BadgeCheck size={14} />
            {course.badge}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {course.name}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Price
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {course.priceLabel}
          </div>
        </div>
      </div>

      {course.highlight && (
        <div className="relative mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
          <Sparkles size={16} className="mt-0.5 shrink-0" />
          <span className="leading-6">{course.highlight}</span>
        </div>
      )}

      <p className="relative mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {course.summary}
      </p>

      <div className="relative mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            What you learn
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            {course.learningPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Included benefits
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            {course.benefits.map((point) => (
              <li key={point} className="flex gap-2">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-6 rounded-[24px] border border-white/10 bg-white/50 p-4 dark:bg-white/5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="chip">
            <LockKeyhole size={12} className="text-emerald-500" />
            <span>Server-side order creation</span>
          </span>
          <span className="chip">
            <CreditCard size={12} className="text-violet-500" />
            <span>Signature verification</span>
          </span>
          {isPlaceholderMode() && (
            <span className="chip">
              <Sparkles size={12} className="text-amber-500" />
              <span>Placeholder mode</span>
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Full name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={busy || completed}
              placeholder="Your full name"
              autoComplete="name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={busy || completed}
              placeholder="WhatsApp number"
              inputMode="tel"
              autoComplete="tel"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
            />
          </label>
        </div>

        <label className="mt-3 flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={busy || completed}
            placeholder="you@example.com"
            autoComplete="email"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-sm text-[12px] leading-5 text-slate-500 dark:text-slate-400">
            {isPlaceholderMode()
              ? 'Placeholder mode: purchase is simulated for UI testing. No card is charged. Switch VITE_PAYMENT_MODE=live once the edge functions are deployed.'
              : 'Trusted by committed learners who want a real system. Access is delivered only after payment verification succeeds.'}
          </div>

          <motion.button
            type="button"
            whileTap={reduce || busy || completed ? undefined : { scale: 0.97 }}
            onClick={handlePurchase}
            disabled={busy || completed || !canSubmit}
            className="inline-flex min-w-[172px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_50px_-24px_rgba(15,23,42,0.75)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: course.fill }}
          >
            {buttonLabel}
          </motion.button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-rose-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </motion.article>
  )
}
