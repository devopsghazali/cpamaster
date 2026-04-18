import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LockKeyhole, ShieldCheck, Sparkles, X } from 'lucide-react'
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

export default function ApplyNowModal({ course, open, onClose }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [form, setForm] = useState(initialForm)
  const [busy, setBusy] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => validate(form) === '', [form])

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setForm(initialForm)
      setBusy(false)
      setCompleted(false)
      setError('')
    }
  }, [open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
    return `Pay ${course.priceLabel} & Get Access`
  })()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-t-[28px] bg-white shadow-[0_60px_120px_-30px_rgba(15,23,42,0.7)] dark:bg-slate-950 sm:rounded-[28px]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 text-slate-600 transition-colors hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="px-6 pb-2 pt-7 sm:px-8">
              <span className="chip">
                <Sparkles size={12} className="text-amber-500" />
                <span>Enrollment form</span>
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
                Apply for {course.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Fill in your details. After payment verification you get
                instant Google Drive access and mentorship support.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
              <label className="mt-1 flex flex-col gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">Full name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={busy || completed}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                />
              </label>

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
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                />
              </label>

              <label className="mt-3 flex flex-col gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">WhatsApp number</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={busy || completed}
                  placeholder="+91XXXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)] disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <span className="chip">
                  <LockKeyhole size={12} className="text-emerald-500" />
                  <span>Server-side order</span>
                </span>
                <span className="chip">
                  <ShieldCheck size={12} className="text-cyan-500" />
                  <span>Signature verified</span>
                </span>
                {isPlaceholderMode() && (
                  <span className="chip">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>Preview mode</span>
                  </span>
                )}
              </div>

              {error && (
                <p className="mt-3 text-sm text-rose-500" role="alert">
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                whileTap={reduce || busy || completed ? undefined : { scale: 0.97 }}
                disabled={busy || completed || !canSubmit}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-[0_24px_50px_-24px_rgba(37,99,235,0.75)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: course.fill }}
              >
                {buttonLabel}
              </motion.button>

              <p className="mt-3 text-[12px] leading-5 text-slate-500 dark:text-slate-500">
                {isPlaceholderMode()
                  ? 'Preview mode: purchase is simulated. No card is charged.'
                  : 'Payment is processed securely by Razorpay.'}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
