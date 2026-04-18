import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

const orbs = [
  { size: 520, startX: -140, startY: -160, color: 'rgba(139, 92, 246, 0.42)', dur: 28, dir: 1 },
  { size: 420, startX: null, startY: 60, right: -160, color: 'rgba(59, 130, 246, 0.32)', dur: 34, dir: -1 },
  { size: 360, startX: 120, startY: null, bottom: -120, color: 'rgba(6, 182, 212, 0.28)', dur: 38, dir: 1 },
  { size: 300, startX: null, startY: null, right: -80, bottom: -60, color: 'rgba(236, 72, 153, 0.22)', dur: 42, dir: -1 },
]

const floaters = [
  { size: 8, left: '12%', top: '18%', color: '#a78bfa', dur: 7 },
  { size: 5, left: '78%', top: '22%', color: '#60a5fa', dur: 9 },
  { size: 6, left: '22%', top: '68%', color: '#22d3ee', dur: 8 },
  { size: 4, left: '68%', top: '74%', color: '#f472b6', dur: 11 },
  { size: 7, left: '48%', top: '38%', color: '#34d399', dur: 10 },
  { size: 5, left: '88%', top: '52%', color: '#fbbf24', dur: 12 },
]

export default function Background() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1200], [0, -120])
  const y2 = useTransform(scrollY, [0, 1200], [0, 180])

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      el.style.setProperty('--px', x.toFixed(3))
      el.style.setProperty('--py', y.toFixed(3))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ '--px': 0, '--py': 0 }}
    >
      <div className="absolute inset-0 bg-grid-light mask-fade dark:hidden" />
      <div className="absolute inset-0 hidden bg-grid-dark mask-fade dark:block" />

      <motion.div
        className="absolute inset-0"
        style={{ y: y1 }}
      >
        {orbs.slice(0, 2).map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: o.size,
              height: o.size,
              left: o.startX !== null ? o.startX : undefined,
              right: o.right,
              top: o.startY !== null ? o.startY : undefined,
              bottom: o.bottom,
              background: `radial-gradient(circle at center, ${o.color}, transparent 65%)`,
              translate: `calc(var(--px) * ${20 * o.dir}px) calc(var(--py) * ${14 * o.dir}px)`,
            }}
            animate={
              reduce
                ? undefined
                : {
                    x: [0, 40 * o.dir, -20 * o.dir, 0],
                    y: [0, -28, 20, 0],
                    scale: [1, 1.08, 0.95, 1],
                  }
            }
            transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: y2 }}>
        {orbs.slice(2).map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: o.size,
              height: o.size,
              left: o.startX !== null ? o.startX : undefined,
              right: o.right,
              top: o.startY !== null ? o.startY : undefined,
              bottom: o.bottom,
              background: `radial-gradient(circle at center, ${o.color}, transparent 65%)`,
              translate: `calc(var(--px) * ${16 * o.dir}px) calc(var(--py) * ${10 * o.dir}px)`,
            }}
            animate={
              reduce
                ? undefined
                : {
                    x: [0, -30 * o.dir, 18 * o.dir, 0],
                    y: [0, 22, -16, 0],
                    scale: [1, 1.06, 0.96, 1],
                  }
            }
            transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {!reduce &&
        floaters.map((f, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: f.size,
              height: f.size,
              left: f.left,
              top: f.top,
              background: f.color,
              boxShadow: `0 0 ${f.size * 3}px ${f.size / 2}px ${f.color}`,
              opacity: 0.55,
            }}
            animate={{
              y: [0, -18, 0, 18, 0],
              x: [0, 8, -6, 4, 0],
              opacity: [0.35, 0.7, 0.5, 0.75, 0.35],
            }}
            transition={{ duration: f.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/60 to-transparent dark:from-ink-950/80" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white/70 to-transparent dark:from-ink-950/90" />

      <div className="noise absolute inset-0" />
    </div>
  )
}
