import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, ShoppingBag } from 'lucide-react'
import { fetchRecentBuyers } from '../lib/payment'

const rotateMs = 4200

export default function RecentBuyersPopup() {
  const [buyers, setBuyers] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await fetchRecentBuyers()
        if (mounted && Array.isArray(data) && data.length > 0) {
          setBuyers(data)
        }
      } catch {
        if (mounted) {
          setBuyers([])
        }
      }
    }

    load()
    const refresh = window.setInterval(load, 45000)

    return () => {
      mounted = false
      window.clearInterval(refresh)
    }
  }, [])

  useEffect(() => {
    if (buyers.length < 2) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % buyers.length)
    }, rotateMs)
    return () => window.clearInterval(timer)
  }, [buyers])

  if (buyers.length === 0) return null

  const buyer = buyers[index]

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-30 hidden sm:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${buyer.name}-${buyer.course}`}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel pointer-events-auto flex max-w-[320px] items-start gap-3 rounded-[22px] px-4 py-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <ShoppingBag size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
              <BadgeCheck size={12} />
              Recent verified buyer
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-950 dark:text-white">{buyer.name}</span>{' '}
              from {buyer.city} joined{' '}
              <span className="font-semibold text-slate-950 dark:text-white">{buyer.course}</span>.
            </p>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {buyer.relativeTime}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
