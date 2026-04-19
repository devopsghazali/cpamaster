import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { BadgeCheck, ExternalLink, Mail, MessageCircle, PlayCircle } from 'lucide-react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'

const SUPPORT_EMAIL = 'kaif85725@gmail.com'
const SUPPORT_WHATSAPP = 'https://chat.whatsapp.com/IWyGJtc47U997DONukzHEO'
const storageKey = 'cpamaster-last-purchase'

function decodePurchasePayload(value) {
  try {
    const binary = window.atob(value)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function readVerifiedPurchase(searchParams) {
  const encoded = searchParams.get('data')
  if (encoded) {
    const decoded = decodePurchasePayload(encoded)
    if (decoded && decoded.status === 'verified' && decoded.razorpayPaymentId) {
      return decoded
    }
  }
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.status === 'verified' && parsed?.razorpayPaymentId) {
      const createdAt = Date.parse(parsed.createdAt || '')
      if (Number.isFinite(createdAt) && Date.now() - createdAt < 1000 * 60 * 60 * 24) {
        return parsed
      }
    }
  } catch {
    /* noop */
  }
  return null
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const purchase = useMemo(() => readVerifiedPurchase(searchParams), [searchParams])

  if (!purchase) {
    return <Navigate to="/join-courses" replace />
  }

  const driveLink = purchase.driveLink

  return (
    <>
      <Background />
      <ThemeToggle />

      <main className="relative mx-auto flex min-h-screen w-full max-w-xl items-center px-5 py-14 sm:px-8">
        <div className="w-full">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-[28px] p-7 sm:p-9"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_24px_60px_-24px_rgba(16,185,129,0.65)]"
            >
              <BadgeCheck size={28} />
            </motion.div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[34px]">
              Payment Successful
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300">
              Your access is ready.
            </p>

            <p className="mt-4 text-[14px] leading-7 text-slate-600 dark:text-slate-400">
              Open your Google Drive access and complete the material.
              <br />
              For mentorship or support, contact us via WhatsApp or Email.
            </p>

            <motion.a
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              href={driveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-[15px] font-semibold text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.8)] transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 dark:shadow-[0_24px_60px_-24px_rgba(255,255,255,0.25)]"
            >
              <PlayCircle size={18} />
              Open Google Drive Access
              <ExternalLink size={14} />
            </motion.a>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={SUPPORT_WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 transition-transform duration-300 hover:-translate-y-0.5 dark:text-emerald-300"
              >
                <MessageCircle size={16} />
                WhatsApp Support
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-700 transition-transform duration-300 hover:-translate-y-0.5 dark:text-cyan-300"
              >
                <Mail size={16} />
                Email Support
              </a>
            </div>
          </motion.section>

          <Footer />
        </div>
      </main>
    </>
  )
}
