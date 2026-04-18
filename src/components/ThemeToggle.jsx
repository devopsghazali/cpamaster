import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('dw-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <motion.button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setIsDark((v) => !v)}
      whileTap={{ scale: 0.92 }}
      className="glass-card fixed right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/90 dark:hover:bg-white/10 sm:right-6 sm:top-6"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-slate-100"
          >
            <Moon size={18} strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-slate-700"
          >
            <Sun size={18} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
