import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  LogOut,
  Megaphone,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Background from '../components/Background'
import ThemeToggle from '../components/ThemeToggle'
import AdminLogin from '../components/admin/AdminLogin'
import {
  adminRequest,
  clearAdminCredentials,
  getAdminToken,
} from '../lib/admin'
import { formatRupees } from '../lib/coupon'

const DASHBOARD_ENDPOINT = { endpoint: 'admin_dashboard' }

const statusStyles = {
  verified:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  created:
    'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  failed:
    'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
}

function statusChip(status) {
  const key = `${status || 'created'}`.toLowerCase()
  const cls =
    statusStyles[key] ||
    'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${cls}`}
    >
      {key}
    </span>
  )
}

function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(d)
  } catch {
    return iso
  }
}

function describeMethod(row) {
  if (!row.method) return '—'
  const m = row.method.toLowerCase()
  if (m === 'card') {
    const brand = row.cardNetwork ? row.cardNetwork.toUpperCase() : 'Card'
    const last4 = row.cardLast4 ? ` ••${row.cardLast4}` : ''
    return `${brand}${last4}`
  }
  if (m === 'upi') return row.vpa ? `UPI · ${row.vpa}` : 'UPI'
  if (m === 'netbanking') return row.bank ? `NB · ${row.bank}` : 'NetBanking'
  if (m === 'wallet') return row.wallet ? `Wallet · ${row.wallet}` : 'Wallet'
  return m
}

function StatCard({ icon: Icon, label, value, sub, tone = 'slate' }) {
  const toneMap = {
    emerald: 'from-emerald-500/15 to-cyan-500/10 text-emerald-500',
    blue: 'from-blue-500/15 to-indigo-500/10 text-blue-500',
    amber: 'from-amber-500/15 to-rose-500/10 text-amber-500',
    slate: 'from-slate-500/10 to-slate-500/5 text-slate-500',
  }
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${toneMap[tone]} p-5 dark:border-white/10`}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
          {sub}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()))
  const [summary, setSummary] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = useCallback(
    async (filters) => {
      setLoading(true)
      setError('')
      try {
        const [summaryRes, listRes] = await Promise.all([
          adminRequest('summary', {}, DASHBOARD_ENDPOINT),
          adminRequest(
            'list_purchases',
            {
              limit: 200,
              status: filters?.status ?? 'all',
              search: filters?.search ?? '',
            },
            DASHBOARD_ENDPOINT,
          ),
        ])
        setSummary(summaryRes)
        setPurchases(listRes?.purchases || [])
      } catch (err) {
        if (err?.code === 'UNAUTHENTICATED') {
          clearAdminCredentials()
          setAuthed(false)
          return
        }
        setError(err?.message || 'Unable to load dashboard.')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (authed) {
      load({ status: statusFilter, search })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const handleSignOut = () => {
    clearAdminCredentials()
    setAuthed(false)
    setSummary(null)
    setPurchases([])
  }

  const handleRefresh = () => load({ status: statusFilter, search })

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    load({ status: statusFilter, search })
  }

  const methodEntries = useMemo(() => {
    const map = summary?.methodBreakdown || {}
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [summary])

  if (!authed) {
    return (
      <>
        <Background />
        <ThemeToggle />
        <main className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12">
          <Link
            to="/"
            className="chip transition-transform duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft size={12} />
            <span>Back to home</span>
          </Link>
          <AdminLogin onAuthenticated={() => setAuthed(true)} />
        </main>
      </>
    )
  }

  return (
    <>
      <Background />
      <ThemeToggle />
      <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Admin console
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Sales Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Coupons →
            </Link>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <p
            className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300"
            role="alert"
          >
            {error}
          </p>
        )}

        {summary && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={IndianRupee}
                label="Total Revenue"
                value={formatRupees(summary.totals?.revenuePaise || 0)}
                sub={`${summary.totals?.verified || 0} verified sales`}
                tone="emerald"
              />
              <StatCard
                icon={CheckCircle2}
                label="Last 24 hours"
                value={`${summary.windows?.last24h?.count || 0} sales`}
                sub={formatRupees(summary.windows?.last24h?.revenuePaise || 0)}
                tone="blue"
              />
              <StatCard
                icon={BarChart3}
                label="Last 7 days"
                value={`${summary.windows?.last7d?.count || 0} sales`}
                sub={formatRupees(summary.windows?.last7d?.revenuePaise || 0)}
                tone="slate"
              />
              <StatCard
                icon={Users}
                label="Conversion"
                value={`${summary.totals?.conversionPercent || 0}%`}
                sub={`${summary.totals?.verified || 0} of ${summary.totals?.attempts || 0} attempts`}
                tone="amber"
              />
            </div>

            {((summary.sourceAttribution || []).length > 0 ||
              (summary.topCoupons || []).length > 0) && (
              <div className="mt-4 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5 dark:border-cyan-400/20">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                  <Megaphone size={14} />
                  <span>Coupon attribution — kahan se bike?</span>
                </div>
                {(summary.sourceAttribution || []).length === 0 ? (
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    No coupons redeemed yet. Tag coupons with a source when
                    you create them to track marketing channels here.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {summary.sourceAttribution.map((s) => (
                      <div
                        key={s.source}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60"
                      >
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                            {s.source}
                          </div>
                          <div className="mt-0.5 text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                            {s.count} {s.count === 1 ? 'sale' : 'sales'}
                          </div>
                        </div>
                        <div className="text-right text-[12px] font-semibold text-emerald-600 dark:text-emerald-300">
                          {formatRupees(s.revenuePaise || 0)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(summary.topCoupons || []).length > 0 && (
                  <div className="mt-4 border-t border-slate-200/60 pt-4 dark:border-white/10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Top coupons
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {summary.topCoupons.map((c) => (
                        <li
                          key={c.code}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-700 dark:text-emerald-300"
                        >
                          {c.code}
                          {c.source ? ` (${c.source})` : ''} · {c.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {methodEntries.length > 0 && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
                  <CreditCard size={14} />
                  <span>Payment methods</span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {methodEntries.map(([method, count]) => (
                    <li
                      key={method}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      {method.toUpperCase()} · {count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <form
          onSubmit={handleSearchSubmit}
          className="mt-6 flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950"
        >
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone, or payment id..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-900 outline-none focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)] dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
          >
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="created">Created</option>
            <option value="failed">Failed</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"
          >
            Apply
          </button>
        </form>

        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Coupon</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No purchases found.
                    </td>
                  </tr>
                )}
                {purchases.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-3 align-top text-[12px] text-slate-600 dark:text-slate-400">
                      {formatDateTime(row.purchasedAt || row.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {row.customerName || '—'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {row.courseName}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-[12px] text-slate-700 dark:text-slate-300">
                      <div className="break-all">
                        {row.customerEmail || '—'}
                      </div>
                      <div className="text-slate-500">
                        {row.customerPhone || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatRupees(row.amount || 0)}
                      </div>
                      {Number(row.discountAmount) > 0 && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-300">
                          -{formatRupees(row.discountAmount)} off
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-[12px] text-slate-700 dark:text-slate-300">
                      {describeMethod(row)}
                    </td>
                    <td className="px-4 py-3 align-top text-[12px] text-slate-700 dark:text-slate-300">
                      {row.couponCode ? (
                        <div>
                          <div className="font-semibold">{row.couponCode}</div>
                          {row.couponSource && (
                            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-600 dark:text-cyan-300">
                              via {row.couponSource}
                            </div>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="break-all">
                        {row.razorpayPaymentId || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {statusChip(row.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-slate-500 dark:text-slate-400">
          Showing latest {purchases.length} records. Data served from Supabase
          via service-role key (RLS bypassed) — never exposed to non-admin
          visitors.
        </p>
      </main>
    </>
  )
}
