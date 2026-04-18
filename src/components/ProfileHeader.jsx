import { motion } from 'motion/react'
import { Sparkles, MapPin } from 'lucide-react'

const stats = [
  { label: 'Learners', value: '12k+' },
  { label: 'Funnels tested', value: '85+' },
  { label: 'Focus', value: 'CPA' },
]

const itemVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ProfileHeader() {
  return (
    <section className="relative flex flex-col items-start text-left">
      <motion.span
        variants={itemVariants}
        className="chip mb-5"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="uppercase tracking-[0.16em]">Live support funnel</span>
      </motion.span>

      <motion.div variants={itemVariants} className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-brand-blue/35 via-brand-cyan/20 to-brand-purple/30 blur-2xl" />
        <div className="glass-card glass-card-lift relative flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[22px] ring-1 ring-black/5 dark:ring-white/10 sm:h-24 sm:w-24">
          <img
            src="/logo.svg"
            alt="cpamaster logo"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="font-display text-[2.2rem] font-bold uppercase leading-[1.02] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[2.7rem] lg:text-[3rem]"
      >
        cpa<span className="text-gradient-brand">master</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
      >
        <Sparkles size={14} className="text-amber-500" />
        <span>CPA Marketing, Funnels, and Performance Systems</span>
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400"
      >
        cpamaster is a modern CPA affiliate platform focused on growth, analytics,
        cleaner execution, and trust-first education for people who want serious
        digital marketing systems.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-4 flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-500"
      >
        <MapPin size={13} />
        <span>Built in India. Designed for global digital marketers.</span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-6 grid w-full max-w-sm grid-cols-3 gap-3"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-xl px-3 py-2.5"
          >
            <div className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              {s.value}
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
