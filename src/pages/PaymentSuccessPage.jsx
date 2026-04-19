import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  Headset,
  PlayCircle,
} from 'lucide-react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'
import { GOOGLE_DRIVE_LINK, isPlaceholderMode, supportPhoneDisplay } from '../lib/config'
import { primaryCourse } from '../data/courses'

const storageKey = 'cpamaster-last-purchase'

function decodePurchasePayload(value) {
  const binary = window.atob(value)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

function readPurchase(searchParams) {
  const encoded = searchParams.get('data')
  if (encoded) {
    try {
      return decodePurchasePayload(encoded)
    } catch {
      return null
    }
  }
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const purchase = readPurchase(searchParams)
  const driveLink = purchase?.driveLink || GOOGLE_DRIVE_LINK
  const supportPhone = purchase?.supportPhone || supportPhoneDisplay
  const courseName = purchase?.courseName || primaryCourse.name
  const placeholder = !purchase || purchase.status === 'placeholder' || isPlaceholderMode()

  return (
    <>
      <Background />
      <ThemeToggle />

      <main className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-14 sm:px-8">
        <div className="w-full">
          <motion.section
            initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-[30px] p-6 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="chip transition-transform duration-300 hover:-translate-y-0.5">
                <ArrowLeft size={12} />
                <span>Back to home</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_24px_60px_-24px_rgba(16,185,129,0.65)]"
            >
              <BadgeCheck size={28} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl"
            >
              Payment successful. Your access is ready.
            </motion.h1>

            {placeholder && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] leading-5 text-amber-700 dark:text-amber-200">
                Preview mode — no card charged. Live payment activates with Razorpay + edge functions.
              </div>
            )}

            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              href={driveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              <PlayCircle size={18} />
              Open Google Drive access
              <ExternalLink size={14} />
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 grid gap-3 text-sm sm:grid-cols-2"
            >
              <div className="rounded-xl bg-white/50 p-4 dark:bg-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Course
                </div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {courseName}
                </p>
              </div>
              <div className="rounded-xl bg-white/50 p-4 dark:bg-white/5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <Headset size={12} className="text-cyan-500" />
                  Support
                </div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {supportPhone}
                </p>
              </div>
            </motion.div>

            <p className="mt-5 text-[12.5px] leading-6 text-slate-600 dark:text-slate-400">
              Drive folder open karo, material complete karo, phir support number par contact karo for mentorship next steps.
            </p>
          </motion.section>

          <Footer />
        </div>
      </main>
    </>
  )
}
