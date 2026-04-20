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

const HI_WORDS = new Set([
  'kaise', 'kya', 'kitna', 'kitni', 'kitne', 'hai', 'hoga', 'karo',
  'karu', 'karun', 'milega', 'milta', 'milti', 'lagega', 'lagana',
  'lagaun', 'mera', 'meri', 'mein', 'namaste', 'salaam', 'salam',
  'hota', 'hoti', 'bhai', 'aap', 'tum', 'hain', 'wapas', 'padha',
  'samajh', 'kaun', 'kab', 'kahan', 'kyun', 'kyon', 'haan', 'nahi',
  'accha', 'acha', 'theek', 'thik', 'chahiye', 'sakte', 'sakta',
  'sakti', 'kitna', 'dena', 'deni', 'hoga', 'hogi', 'shuru',
])

function detectLang(text) {
  const tokens = text.toLowerCase().split(/[\s,.?!;:]+/)
  return tokens.some((t) => HI_WORDS.has(t)) ? 'hi' : 'en'
}

const RULES = [
  {
    match: ['hi', 'hello', 'hey', 'namaste', 'salaam', 'hola', 'salam', 'good morning', 'good evening'],
    replyHi:
      "Namaste! Main CPA Master ka support bot hoon. Kya puchna chahoge — fees, course content, ya join process?",
    replyEn:
      "Hi! I'm the CPA Master support bot. You can ask me about fees, course content, or how to join.",
  },
  {
    match: [
      'fees', 'fee', 'price', 'cost', 'kitna', 'kitne ka',
      'paisa', 'amount', 'charges', 'kharcha', 'how much', 'pricing',
    ],
    replyHi:
      "CPA Master course ki fees ₹2399 hai. Coupon apply karo to aur kam ho sakti hai. Complete CPA marketing training step-by-step Hinglish mein milegi.",
    replyEn:
      "The CPA Master course fee is ₹2399. You can apply a coupon to reduce the price further. You'll get complete step-by-step CPA marketing training.",
  },
  {
    match: [
      'kya milega', 'content', 'syllabus', 'material', 'videos',
      'course detail', 'what will', 'milta hai', 'kya seekhne',
      'what is included', 'whats included', 'what do i learn',
      'course include',
    ],
    replyHi:
      "Is course mein CPA marketing complete step-by-step sikhaaya jata hai — real earning methods + practical training. Recorded videos + 1-on-1 WhatsApp guidance included.",
    replyEn:
      "The course teaches CPA marketing step-by-step — real earning methods + practical training. Recorded videos and 1-on-1 WhatsApp guidance are included.",
  },
  {
    match: [
      'earning', 'earnings', 'income', 'kab se', 'kab milega',
      'kab start', 'kab shuru', 'kab se earning', 'paisa kab',
      'kamayi', 'kamai', 'start earning', 'how soon',
      'when will i earn', 'when earnings', 'result kab',
    ],
    replyHi:
      "Earnings first day se hi start ho sakti hai — lekin tabhi jab aap mehnat karoge aur course mein sikhai cheez apply karoge. Course strategies deta hai; effort aapka decide karega kitni jaldi result aayega.",
    replyEn:
      "Earnings can start from day 1 — but only if you work hard and apply what you learn. The course gives you proven strategies; your effort decides how fast the results come.",
  },
  {
    match: ['coupon', 'discount', 'offer', 'promo code', 'voucher', 'promo', 'code apply'],
    replyHi:
      "Coupon lagana simple hai:\n1. 'Join Courses' pe jao, course ke 'Apply Now' button pe click karo\n2. Form mein neeche coupon box dikhega — apna code type ya paste karo\n3. 'Apply' pe click karo — discounted price turant update ho jaayegi\n4. Payment complete karo\nNote: same email pe coupon sirf ek baar chalta hai, isliye fresh email use karo.",
    replyEn:
      "Applying a coupon is simple:\n1. Go to 'Join Courses' and click 'Apply Now' on the course\n2. In the form you'll see a coupon box — type or paste your code\n3. Click 'Apply' — the discounted price updates instantly\n4. Complete the payment\nNote: a coupon works only once per email, so use a fresh email if it was used before.",
  },
  {
    match: ['refund', 'wapas', 'paisa wapas', 'money back', 'return'],
    replyHi:
      "Refund policy limited hai:\n1. Payment ke 24 ghante andar refund claim kar sakte ho, sirf tab jab video access nahi liya ho\n2. Ek baar Drive link kholne ke baad refund nahi milta (course consumed)\n3. Technical issue ya wrong payment ke case mein pehle WhatsApp pe baat karo — wo verify karke resolve karte hain\nFull policy Join Courses page pe 'Refund Policy' section mein hai.",
    replyEn:
      "The refund policy is limited:\n1. You can claim a refund within 24 hours of payment, only if you haven't opened the video access\n2. Once the Drive link is opened, no refund (course is considered consumed)\n3. For technical or wrong-payment issues, message WhatsApp first — we verify and resolve\nFull policy is in the 'Refund Policy' section on the Join Courses page.",
  },
  {
    match: [
      'join', 'enroll', 'purchase', 'sign up', 'register',
      'how to buy', 'how to join', 'how do i join', 'buy karu',
      'buy kare', 'buy the course',
    ],
    replyHi:
      "Join process simple hai:\n1. 'Join Courses' button pe click karo\n2. Form fill karo (name, email, WhatsApp)\n3. Coupon hai to coupon box mein code paste karke Apply karo\n4. Secure Razorpay checkout se payment complete karo\n5. Video + material ka Drive link turant mil jaayega\n6. Video dekhne ke baad WhatsApp pe 1-on-1 guidance lo",
    replyEn:
      "Joining is simple:\n1. Click the 'Join Courses' button\n2. Fill the form (name, email, WhatsApp)\n3. If you have a coupon, paste the code in the coupon box and click Apply\n4. Complete the payment via secure Razorpay checkout\n5. You'll get the Drive link for videos + material instantly\n6. After watching, message on WhatsApp for 1-on-1 guidance",
  },
  {
    match: [
      'access', 'after payment', 'payment ke baad', 'link kaise',
      'video kaise', 'kahan milega', 'where do i get', 'how do i access',
    ],
    replyHi:
      "Payment complete hone ke baad turant success page pe Google Drive link mil jaayega — complete video + material wahin hai.",
    replyEn:
      "Once payment is complete, you'll instantly see the Google Drive link on the success page — full video and material are there.",
  },
  {
    match: ['language', 'bhasha', 'english', 'hindi', 'medium'],
    replyHi:
      "Course Hinglish (Hindi + English mix) mein hai — samajhna bilkul easy, bhashaai dikkat nahi hogi.",
    replyEn:
      "The course is in Hinglish (mix of Hindi + English) — very easy to understand, no language barrier.",
  },
  {
    match: [
      'duration', 'kitne din', 'kitne hour', 'length', 'lifetime',
      'validity', 'how long',
    ],
    replyHi:
      "Videos recorded hain — aap apne pace pe kabhi bhi dekh sakte ho. Personal WhatsApp mentorship unlimited queries ke liye available hai.",
    replyEn:
      "The videos are recorded — you can watch them at your own pace, anytime. Personal WhatsApp mentorship is available for unlimited queries.",
  },
  {
    match: [
      'whatsapp', 'contact', '1-on-1', 'one on one', 'mentor',
      'personal chat', 'doubts', 'baat kar', 'talk', 'message you',
    ],
    replyHi:
      "Personal 1-on-1 guidance WhatsApp pe milti hai. Seedha +91 82997 45166 pe message karo — ya main page pe 'Clear Doubts With Me' button use karo.",
    replyEn:
      "Personal 1-on-1 guidance is on WhatsApp. Message directly on +91 82997 45166 — or use the 'Clear Doubts With Me' button on the main page.",
  },
  {
    match: ['certificate', 'certification', 'certify'],
    replyHi:
      "Main focus real earning skills pe hai, direct certificate nahi milta. Lekin practical training + personal mentor support full milti hai.",
    replyEn:
      "The main focus is on real earning skills, so a certificate isn't provided. However, you get full practical training + personal mentor support.",
  },
  {
    match: ['recording', 'recorded', 'live class', 'live session'],
    replyHi:
      "Course recorded hai — anytime access. Doubts ke liye WhatsApp pe 1-on-1 mentor support milti hai.",
    replyEn:
      "The course is recorded — anytime access. For doubts, you get 1-on-1 mentor support on WhatsApp.",
  },
  {
    match: ['device', 'mobile', 'laptop', 'phone se', 'computer'],
    replyHi:
      "Course kisi bhi device pe chalegi — mobile, laptop, tablet. Bas internet + Drive access chahiye.",
    replyEn:
      "The course works on any device — mobile, laptop, tablet. You just need internet + Drive access.",
  },
  {
    match: ['safe', 'secure', 'scam', 'trusted', 'fraud', 'genuine', 'legit'],
    replyHi:
      "Payment Razorpay (India ka secure gateway) se hoti hai, aap card/UPI/netbanking use kar sakte ho. Receipt aur access dono automatic milte hain.",
    replyEn:
      "Payment is processed securely by Razorpay (India's trusted payment gateway). You can pay via card / UPI / netbanking. Receipt and access are both delivered automatically.",
  },
  {
    match: ['thanks', 'thank', 'dhanyawad', 'shukriya', 'thx'],
    replyHi:
      "Welcome! Aur koi doubt ho to puchh lena. All the best for your CPA journey!",
    replyEn:
      "You're welcome! Ping me for any other doubts. All the best for your CPA journey!",
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
  const lang = detectLang(norm)

  if (matchesAny(norm, BLOCKED_KEYWORDS)) {
    return lang === 'en'
      ? "This looks like a technical/internal query — I can't answer it. Ask me anything about the course and I'll help."
      : "Yeh technical/internal query hai — iska jawab main nahi de sakta. Course-related kuch puchho, help karoonga."
  }

  if (matchesAny(norm, PERSONAL_KEYWORDS)) {
    return lang === 'en'
      ? "I can't check personal purchase details (privacy). Please WhatsApp +91 82997 45166 from your registered email — we'll verify instantly."
      : "Personal purchase details main check nahi kar sakta (privacy). Apne registered email se +91 82997 45166 pe WhatsApp karo — turant verify ho jaayega."
  }

  for (const rule of RULES) {
    if (matchesAny(norm, rule.match)) {
      return lang === 'en' ? rule.replyEn : rule.replyHi
    }
  }

  return lang === 'en'
    ? "I didn't quite catch that. Could you rephrase? You can also tap a quick option below, or message WhatsApp for complex doubts."
    : "Samajh nahi aaya. Thoda clear puch sakte ho? Ya neeche quick options use karo — complex doubts ke liye WhatsApp pe baat karo."
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
