import { motion } from 'motion/react'
import { FileText, Mail, ShieldAlert } from 'lucide-react'

const SUPPORT_EMAIL = 'kaif829974@gmail.com'

const clauses = [
  {
    title: 'No Refund (Basic Rule)',
    body:
      'Once a customer purchases the course or digital product, no refund will be provided. Since the content is digital (Google Drive access / course material) and access is provided instantly after successful payment, refunds are not applicable under normal circumstances.',
  },
  {
    title: 'Refund Allowed Only in Rare Cases',
    body:
      'Refund may only be considered in these 3 situations: (1) Duplicate payment (customer paid twice), (2) Payment was successful but course access was not provided, (3) Payment was successful but the order was not properly recorded in the system. In such cases, the customer must contact support within 24–48 hours of payment for resolution.',
  },
  {
    title: 'Support',
    body: 'For payment issues or access-related problems, contact support only via email. No other support method should be used for refund requests.',
  },
  {
    title: 'Policy Changes',
    body:
      'This policy may be updated in the future if required. CPA MASTER reserves the right to modify these terms without prior notice.',
  },
]

export default function RefundPolicySection() {
  return (
    <section id="refund-policy" className="mt-16 scroll-mt-20 sm:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="chip mx-auto">
          <ShieldAlert size={12} className="text-rose-500" />
          <span>Refund & Cancellation Policy</span>
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Transparent policy.{' '}
          <span className="text-gradient-brand">No hidden surprises.</span>
        </h2>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-10 max-w-3xl"
      >
        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-amber-200/30 via-rose-200/20 to-amber-200/30 blur-2xl dark:from-amber-400/10 dark:via-rose-400/10 dark:to-amber-400/10" />

        <div
          className="relative overflow-hidden rounded-[28px] bg-[#fdfaf3] p-7 shadow-[0_40px_100px_-30px_rgba(120,80,20,0.35)] ring-1 ring-amber-900/10 dark:bg-[#1a1812] dark:ring-amber-100/10 sm:p-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent 0 38px, rgba(120, 80, 20, 0.08) 38px 39px)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-500/70 to-amber-400/0" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-amber-300 dark:bg-amber-300 dark:text-slate-950">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-amber-200/80">
                Official Document
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-amber-50 sm:text-[28px]">
                CPA MASTER — Refund & Cancellation Policy
              </h3>
              <div className="mt-1 text-[12px] text-slate-500 dark:text-amber-100/60">
                Effective from the date of purchase. Governed by Indian law.
              </div>
            </div>
          </div>

          <ol className="relative mt-7 space-y-5 pl-2">
            {clauses.map((clause, index) => (
              <motion.li
                key={clause.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  delay: 0.05 * index,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 font-display text-sm font-bold text-slate-950 ring-1 ring-amber-800/20 dark:bg-amber-200/20 dark:text-amber-100">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-slate-900 dark:text-amber-100">
                    {clause.title}
                  </div>
                  <p className="mt-1 text-[14px] leading-7 text-slate-700 dark:text-amber-50/85">
                    {clause.body}
                  </p>
                  {clause.title === 'Support' && (
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-1.5 text-[12.5px] font-semibold text-amber-100 transition-transform duration-300 hover:-translate-y-0.5 dark:bg-amber-300 dark:text-slate-950"
                    >
                      <Mail size={13} />
                      {SUPPORT_EMAIL}
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="relative mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-amber-800/20 pt-6 text-[12px] text-slate-600 dark:border-amber-200/15 dark:text-amber-100/70">
            <div>
              <div className="font-display text-base font-bold text-slate-900 dark:text-amber-50">
                CPA MASTER
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <Mail size={11} />
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span
                className="text-[38px] leading-none text-slate-900 dark:text-amber-100 sm:text-[44px]"
                style={{
                  fontFamily:
                    '"Dancing Script","Brush Script MT","Segoe Script","Lucida Handwriting",cursive',
                  letterSpacing: '0.5px',
                  transform: 'rotate(-4deg)',
                  display: 'inline-block',
                }}
              >
                MkBhai
              </span>
              <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-amber-100/60">
                Authorised Signatory
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </section>
  )
}
