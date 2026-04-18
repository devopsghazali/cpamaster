import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
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
          className="mt-10 text-center sm:mt-14"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[56px]">
            Learn CPA Marketing.{' '}
            <span className="text-gradient-brand">Start Earning Online.</span>
          </h1>
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
