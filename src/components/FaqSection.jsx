import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { faqs } from '../data/faqs'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip mx-auto">
          <HelpCircle size={12} className="text-amber-500" />
          <span>Frequently asked</span>
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Quick answers before{' '}
          <span className="text-gradient-brand">you enroll.</span>
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * index, duration: 0.45 }}
              className="glass-card overflow-hidden rounded-2xl"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-[15px]">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900/5 text-slate-600 dark:bg-white/5 dark:text-slate-300"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
