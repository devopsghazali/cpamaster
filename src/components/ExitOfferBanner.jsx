import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Sparkles, Tag, X } from 'lucide-react'

const COUPON_CODE = 'FIRST10'
const DISCOUNT_LABEL = '₹199 OFF'
const SLOTS_LABEL = 'Only 10 slots · Pehle aao pehle paao'
const SESSION_KEY = 'cpa-exit-offer-shown'
const TRIGGER_EVENT = 'cpa-exit-offer-trigger'
const AUTO_DISMISS_MS = 20_000

export default function ExitOfferBanner() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const firedRef = useRef(false)
  const dismissTimerRef = useRef(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        firedRef.current = true
      }
    } catch {
      // sessionStorage blocked — allow once per mount
    }

    const trigger = () => {
      if (firedRef.current) return
      firedRef.current = true
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // ignore
      }
      setVisible(true)
    }

    const handleMouseLeave = (event) => {
      if (event.clientY <= 0) trigger()
    }

    const handleCustomEvent = () => trigger()

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener(TRIGGER_EVENT, handleCustomEvent)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener(TRIGGER_EVENT, handleCustomEvent)
    }
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    dismissTimerRef.current = window.setTimeout(
      () => setVisible(false),
      AUTO_DISMISS_MS,
    )
    return () => {
      if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current)
    }
  }, [visible])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked — no-op
    }
  }

  const handleApply = () => {
    setVisible(false)
    const target = document.getElementById('courses')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 z-[65] w-[92vw] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-3xl border border-emerald-400/40 bg-white shadow-[0_30px_80px_-20px_rgba(16,185,129,0.5)] dark:border-emerald-400/30 dark:bg-slate-950 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <div className="relative bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
              <Sparkles size={16} />
              <span>Ruk ja! Ek offer hai tere liye</span>
            </div>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Dismiss offer"
              className="absolute right-2 top-2 rounded-full bg-white/15 p-1 text-white transition-colors hover:bg-white/25"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-4 py-4">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Coupon{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                {COUPON_CODE}
              </span>{' '}
              use karke seedha <strong>{DISCOUNT_LABEL}</strong> paao.
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-500/5 px-3 py-2.5 dark:bg-emerald-500/10">
              <Tag size={14} className="text-emerald-500" />
              <span className="flex-1 text-sm font-bold tracking-[0.14em] text-slate-900 dark:text-white">
                {COUPON_CODE}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>
            </div>

            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-300">
              {SLOTS_LABEL}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(16,185,129,0.6)] transition-transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Later
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
