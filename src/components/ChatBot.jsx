import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/918299745166'
const MAX_INPUT = 200
const HIDDEN_PATHS = ['/admin', '/dashboard']

const BLOCKED_KEYWORDS = [
  'admin', 'dashboard', 'supabase', 'api key', 'apikey', 'token',
  'database', 'password', 'razorpay key', 'backend', 'source code',
  'github', 'hack', 'crack', 'exploit', 'sql', 'bypass', 'leak',
  'secret', 'service role', 'jwt', '.env',
]

const PERSONAL_KEYWORDS = [
  'my purchase', 'mera payment', 'meri payment', 'mera order',
  'mera coupon', 'kya maine', 'check karo mera', 'verify karo mera',
  'mera account', 'my order', 'my account', 'my payment',
  'refund status', 'payment status', 'meri purchase',
]

const RULES = [
  {
    match: ['hi', 'hello', 'hey', 'namaste', 'salaam', 'hola', 'salam'],
    reply:
      "Namaste! Main CPA Master ka support bot hoon. Kya puchna chahoge — fees, course content, ya join process?",
  },
  {
    match: [
      'fees', 'fee', 'price', 'cost', 'kitna', 'kitne ka',
      'paisa', 'amount', 'charges', 'kharcha',
    ],
    reply:
      "CPA Master course ki fees ₹2399 hai. Coupon apply karo to aur kam ho sakti hai. Complete CPA marketing training step-by-step Hinglish mein milegi.",
  },
  {
    match: [
      'kya milega', 'content', 'syllabus', 'material', 'videos',
      'course detail', 'what will', 'milta hai', 'kya seekhne',
    ],
    reply:
      "Is course mein CPA marketing complete step-by-step sikhaaya jata hai — real earning methods + practical training. Recorded videos + 1-on-1 WhatsApp guidance included.",
  },
  {
    match: ['refund', 'wapas', 'paisa wapas', 'money back', 'return'],
    reply:
      "Refund policy limited hai. Full details Join Courses page pe 'Refund Policy' section mein hai. Koi issue ho to pehle WhatsApp pe baat karo.",
  },
  {
    match: [
      'join', 'kaise', 'how to buy', 'how to join', 'enroll',
      'purchase', 'buy karu', 'buy kare',
    ],
    reply:
      "Join process simple hai:\n1. 'Join Courses' button pe click karo\n2. Form fill karo (name, email, WhatsApp)\n3. Payment link milega — complete karo\n4. Video + material ka Drive link turant mil jaayega\n5. Video dekhne ke baad WhatsApp pe 1-on-1 guidance lo",
  },
  {
    match: ['coupon', 'discount', 'offer', 'promo code', 'voucher'],
    reply:
      "Apply Now form mein coupon box hai — code daal ke Apply pe click karo, price auto update ho jaayegi. Same email pe coupon sirf ek baar chalta hai, isliye fresh email use karo.",
  },
  {
    match: ['language', 'bhasha', 'english', 'hindi', 'medium'],
    reply:
      "Course Hinglish (Hindi + English mix) mein hai — samajhna bilkul easy, bhashaai dikkat nahi hogi.",
  },
  {
    match: [
      'duration', 'kitne din', 'kitne hour', 'length', 'lifetime',
      'validity',
    ],
    reply:
      "Videos recorded hain — aap apne pace pe kabhi bhi dekh sakte ho. Personal WhatsApp mentorship unlimited queries ke liye available hai.",
  },
  {
    match: [
      'access', 'after payment', 'payment ke baad', 'link kaise',
      'video kaise', 'kahan milega',
    ],
    reply:
      "Payment complete hone ke baad turant success page pe Google Drive link mil jaayega — complete video + material wahin hai.",
  },
  {
    match: [
      'whatsapp', 'contact', '1-on-1', 'one on one', 'mentor',
      'personal chat', 'doubts', 'baat kar', 'talk',
    ],
    reply:
      "Personal 1-on-1 guidance WhatsApp pe milti hai. Seedha +91 82997 45166 pe message karo — ya main page pe 'Clear Doubts With Me' button use karo.",
  },
  {
    match: ['certificate', 'certification', 'certify'],
    reply:
      "Main focus real earning skills pe hai, direct certificate nahi milta. Lekin practical training + personal mentor support full milti hai.",
  },
  {
    match: ['recording', 'recorded', 'live class', 'live session'],
    reply:
      "Course recorded hai — anytime access. Doubts ke liye WhatsApp pe 1-on-1 mentor support milti hai.",
  },
  {
    match: ['device', 'mobile', 'laptop', 'phone se', 'computer'],
    reply:
      "Course kisi bhi device pe chalegi — mobile, laptop, tablet. Bas internet + Drive access chahiye.",
  },
  {
    match: ['safe', 'secure', 'scam', 'trusted', 'fraud'],
    reply:
      "Payment Razorpay (India ka secure gateway) se hoti hai, aap card/UPI/netbanking use kar sakte ho. Receipt aur access dono automatic milte hain.",
  },
  {
    match: ['thanks', 'thank', 'dhanyawad', 'shukriya'],
    reply:
      "Welcome! Aur koi doubt ho to puchh lena. All the best for your CPA journey!",
  },
]

const QUICK_QUESTIONS = [
  'Fees kitni hai?',
  'Course me kya milega?',
  'Kaise join karun?',
  'Coupon kaise lagaun?',
]

const WELCOME = {
  role: 'bot',
  text: "Namaste! Main CPA Master ka support bot hoon. Neeche quick options se select karo ya apna question likho.",
}

function matchesAny(text, list) {
  return list.some((kw) => text.includes(kw))
}

function getReply(userText) {
  const norm = userText.toLowerCase().trim()
  if (!norm) return null

  if (matchesAny(norm, BLOCKED_KEYWORDS)) {
    return "Yeh technical/internal query hai — iska jawab main nahi de sakta. Course-related kuch puchho, help karoonga."
  }

  if (matchesAny(norm, PERSONAL_KEYWORDS)) {
    return "Personal purchase details main check nahi kar sakta (privacy). Apne registered email se +91 82997 45166 pe WhatsApp karo — turant verify ho jaayega."
  }

  for (const rule of RULES) {
    if (matchesAny(norm, rule.match)) return rule.reply
  }

  return "Samajh nahi aaya. Thoda clear puch sakte ho? Ya neeche quick options use karo — complex doubts ke liye WhatsApp pe baat karo."
}

export default function ChatBot() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const scrollerRef = useRef(null)

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
  }, [messages, open])

  if (HIDDEN_PATHS.includes(pathname)) return null

  const send = (raw) => {
    const clean = String(raw || '').trim().slice(0, MAX_INPUT)
    if (!clean) return
    const reply = getReply(clean)
    setMessages((m) => [
      ...m,
      { role: 'user', text: clean },
      { role: 'bot', text: reply },
    ])
    setInput('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    send(input)
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 text-white shadow-[0_18px_50px_-12px_rgba(59,130,246,0.6)] sm:h-16 sm:w-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Support chat"
            className="fixed bottom-24 right-5 z-[70] flex h-[70vh] max-h-[540px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold">CPA Master Assistant</div>
                  <div className="text-[11px] opacity-90">
                    Auto-reply · Hinglish
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full bg-white/15 p-1.5 transition-colors hover:bg-white/25"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-slate-100'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 px-3 py-2 dark:border-white/10">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {q}
                  </button>
                ))}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  WhatsApp support
                </a>
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={MAX_INPUT}
                  placeholder="Type your question..."
                  aria-label="Message"
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)] dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition-opacity disabled:opacity-50 dark:bg-white dark:text-slate-950"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
