import { motion } from 'motion/react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import ProfileHeader from '../components/ProfileHeader'
import TrustBar from '../components/TrustBar'
import VideoSection from '../components/VideoSection'
import LinksSection from '../components/LinksSection'
import Footer from '../components/Footer'
import RecentBuyersPopup from '../components/RecentBuyersPopup'
import WhyChooseSection from '../components/WhyChooseSection'
import NetworksSection from '../components/NetworksSection'
import ProofGallery from '../components/ProofGallery'
import FaqSection from '../components/FaqSection'

const leftVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
}

export default function LandingPage() {
  return (
    <>
      <Background />
      <ThemeToggle />
      <RecentBuyersPopup />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <motion.section
            variants={leftVariants}
            initial="hidden"
            animate="show"
            className="relative lg:sticky lg:top-14 lg:h-fit lg:self-start"
          >
            <ProfileHeader />
            <TrustBar />
            <VideoSection />
          </motion.section>

          <div className="relative pt-2 lg:pt-6">
            <LinksSection />
          </div>
        </div>

        <WhyChooseSection />
        <NetworksSection />
        <ProofGallery />
        <FaqSection />

        <Footer />
      </div>
    </>
  )
}
