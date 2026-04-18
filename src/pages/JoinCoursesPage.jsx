import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  BadgeCheck,
  Headset,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import RecentBuyersPopup from '../components/RecentBuyersPopup'
import CoursePurchaseCard from '../components/CoursePurchaseCard'
import Footer from '../components/Footer'
import { courses } from '../data/courses'
import { supportPhoneDisplay } from '../lib/config'

const legalCards = [
  {
    icon: ShieldCheck,
    title: 'Secure payment policy',
    body:
      'Every checkout is created on the server, signed by Razorpay, and verified again through Supabase Edge Functions before access is delivered.',
  },
  {
    icon: ReceiptText,
    title: 'Refund policy',
    body:
      'Because digital material is delivered instantly, refunds are only reviewed for duplicate charges or failed delivery. Payment disputes are handled with transaction proof.',
  },
  {
    icon: Headset,
    title: 'Support and next steps',
    body:
      'After purchase, finish the material first. Then use the support number for the next stage of guidance, upgrades, or campaign review.',
  },
]

export default function JoinCoursesPage() {
  return (
    <>
      <Background />
      <ThemeToggle />
      <RecentBuyersPopup />

      <main className="relative mx-auto w-full max-w-[1220px] px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-[32px] p-6 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/"
                className="chip transition-transform duration-300 hover:-translate-y-0.5"
              >
                <ArrowLeft size={12} />
                <span>Back to home</span>
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                <BadgeCheck size={14} />
                Secure enrollment
              </div>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">
                Join Courses
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                One focused program built for{' '}
                <span className="text-gradient-brand">real CPA execution.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                Checkout opens in a secure Razorpay window, verification happens on
                the backend, and Google Drive access is released only after the
                payment signature is validated.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-[12px] text-slate-500 dark:text-slate-400">
              <span className="chip">
                <ShieldCheck size={12} className="text-cyan-500" />
                <span>Razorpay protected checkout</span>
              </span>
              <span className="chip">
                <BadgeCheck size={12} className="text-emerald-500" />
                <span>Instant delivery after verification</span>
              </span>
              <span className="chip">
                <Headset size={12} className="text-violet-500" />
                <span>Support: {supportPhoneDisplay}</span>
              </span>
            </div>
          </motion.div>

          <section className="mt-8 flex justify-center">
            <div className="w-full max-w-3xl">
              {courses.map((course, index) => (
                <CoursePurchaseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            {legalCards.map(({ icon: Icon, title, body }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + index * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass-card rounded-[26px] p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_14px_40px_-18px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950">
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {body}
                </p>
              </motion.article>
            ))}
          </section>

          <Footer />
        </div>
      </main>
    </>
  )
}
