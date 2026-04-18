import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, BadgeCheck, Rocket, ShieldCheck, Users } from 'lucide-react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import RecentBuyersPopup from '../components/RecentBuyersPopup'
import CoursePurchaseCard from '../components/CoursePurchaseCard'
import WhyChooseSection from '../components/WhyChooseSection'
import NetworksSection from '../components/NetworksSection'
import HorizontalProofStrip from '../components/HorizontalProofStrip'
import FaqSection from '../components/FaqSection'
import CommunityCta from '../components/CommunityCta'
import Footer from '../components/Footer'
import { courses } from '../data/courses'

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function JoinCoursesPage() {
  return (
    <>
      <Background />
      <ThemeToggle />
      <RecentBuyersPopup />

      <main className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="chip transition-transform duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft size={12} />
            <span>Back to home</span>
          </Link>
          <span className="chip">
            <BadgeCheck size={12} className="text-emerald-500" />
            <span>Secure enrollment</span>
          </span>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-center"
        >
          <span className="chip mx-auto">
            <Rocket size={12} className="text-cyan-500" />
            <span>All-in-one CPA marketing</span>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[56px]">
            Start Your CPA Marketing{' '}
            <span className="text-gradient-brand">Journey Today</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
            Learn CPA marketing with step-by-step mentorship and proven
            strategies. No ad spend. Organic traffic focus. Real earning system.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToId('courses')}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_50px_-24px_rgba(15,23,42,0.85)] transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Join Now
            </button>
            <button
              type="button"
              onClick={() => scrollToId('courses')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
            >
              Explore Courses
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
            <span className="chip">
              <Users size={12} className="text-violet-500" />
              <span>Trusted by 1000+ students</span>
            </span>
            <span className="chip">
              <ShieldCheck size={12} className="text-cyan-500" />
              <span>Razorpay protected checkout</span>
            </span>
          </div>
        </motion.section>

        <section id="courses" className="mt-14 scroll-mt-20 sm:mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto">
              <BadgeCheck size={12} className="text-emerald-500" />
              <span>The program</span>
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              One focused course.{' '}
              <span className="text-gradient-brand">Built for real execution.</span>
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-6">
            {courses.map((course, index) => (
              <CoursePurchaseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </section>

        <WhyChooseSection />
        <NetworksSection />
        <HorizontalProofStrip />
        <FaqSection />
        <CommunityCta />

        <Footer />
      </main>
    </>
  )
}
