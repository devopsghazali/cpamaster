import { motion } from 'motion/react'
import { ShieldCheck, Flame, LockKeyhole } from 'lucide-react'

const items = [
  { icon: ShieldCheck, label: 'Verified course delivery' },
  { icon: Flame, label: 'Active buyer activity' },
  { icon: LockKeyhole, label: 'Server-side payment checks' },
]

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function TrustBar() {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-6 flex flex-wrap items-center gap-2"
      aria-label="Trust signals"
    >
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="chip"
        >
          <Icon size={12} strokeWidth={2.2} className="text-emerald-500" />
          <span>{label}</span>
        </span>
      ))}
    </motion.div>
  )
}
