import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  Headset,
  PlayCircle,
  ShieldCheck,
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
  const courseName = purchase?.courseName || primaryCourse.name
  const supportPhone = purchase?.supportPhone || supportPhoneDisplay
  const placeholder = !purchase || purchase.status === 'placeholder' || isPlaceholderMode()

  return (
    <>
      <Background />
      <ThemeToggle />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-14 sm:px-8 lg:px-12">
        <div className="w-full">
          <motion.section
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-[34px] p-6 sm:p-8 md:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link to="/" className="chip transition-transform duration-300 hover:-translate-y-0.5">
                <ArrowLeft size={12} />
                <span>Back to home</span>
              </Link>
              <span className="chip">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Verification complete</span>
              </span>
            </div>

            <div className="mt-8 flex h-18 w-18 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_24px_60px_-24px_rgba(16,185,129,0.65)]">
              <BadgeCheck size={34} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Payment successful. Your access is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              Please complete the material first and then contact support for next
              steps.
            </p>

            {placeholder && (
              <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-700 dark:text-amber-200">
                Placeholder mode: payment was not actually charged. Real Razorpay
                verification activates once edge functions are deployed and
                VITE_PAYMENT_MODE=live.
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-card rounded-[26px] p-5 sm:p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Course access
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {courseName}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Your payment has been verified and saved. Use the button below to
                  open the Google Drive material instantly.
                </p>

                <a
                  href={driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                >
                  <PlayCircle size={18} />
                  Open Google Drive access
                  <ExternalLink size={15} />
                </a>
              </div>

              {purchase && (
                <div className="glass-card rounded-[26px] p-5 sm:p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Purchase details
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-slate-500 dark:text-slate-400">Customer</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-white">
                        {purchase.customerName}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-white">
                        {purchase.customerEmail}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-slate-500 dark:text-slate-400">Order ID</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-white break-all">
                        {purchase.razorpayOrderId}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-slate-500 dark:text-slate-400">Payment ID</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-white break-all">
                        {purchase.razorpayPaymentId}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass-card rounded-[24px] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <Headset size={16} className="text-cyan-500" />
                  Support number
                </div>
                <p className="mt-3 text-lg font-semibold tracking-wide text-slate-950 dark:text-white">
                  {supportPhone}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Share your payment email and order ID if you need help after
                  completing the course material.
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-5">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Instructions
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  1. Open the drive folder.
                  <br />
                  2. Complete the course material in order.
                  <br />
                  3. Contact support only after completion for next steps.
                </p>
              </div>
            </div>
          </motion.section>

          <Footer />
        </div>
      </main>
    </>
  )
}
