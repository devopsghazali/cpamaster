import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import LandingPage from './pages/LandingPage'
import JoinCoursesPage from './pages/JoinCoursesPage'
import FreeGuidePage from './pages/FreeGuidePage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()

  const variants = reduce
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: -72, filter: 'blur(12px)' },
        animate: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
          opacity: 0,
          y: -32,
          filter: 'blur(6px)',
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/join-courses" element={<JoinCoursesPage />} />
          <Route path="/free-guide" element={<FreeGuidePage />} />
          <Route path="/success" element={<PaymentSuccessPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
    </>
  )
}
