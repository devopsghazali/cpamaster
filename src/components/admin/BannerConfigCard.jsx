import { useEffect, useState } from 'react'
import { Loader2, Megaphone, Save } from 'lucide-react'
import { fetchBannerConfig, updateBannerConfig } from '../../lib/siteConfig'

export default function BannerConfigCard() {
  const [form, setForm] = useState({
    couponCode: '',
    slotsText: '',
    enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchBannerConfig()
      .then((banner) => {
        if (cancelled) return
        setForm({
          couponCode: banner.couponCode || '',
          slotsText: banner.slotsText || '',
          enabled: banner.enabled !== false,
        })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    if (saving) return
    setError('')
    setSaved(false)

    const code = form.couponCode.trim().toUpperCase()
    if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
      setError('Code must be 3-32 chars: uppercase letters, digits, _ or -.')
      return
    }
    const slotsText = form.slotsText.trim()
    if (!slotsText) {
      setError('Slots text is required.')
      return
    }

    setSaving(true)
    try {
      await updateBannerConfig({
        couponCode: code,
        slotsText,
        enabled: form.enabled,
      })
      setForm((current) => ({ ...current, couponCode: code, slotsText }))
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err?.message || 'Unable to save banner config.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 text-white">
          <Megaphone size={16} />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
            Exit-offer banner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shown when a visitor is about to leave /join-courses.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          Loading config...
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Coupon code
            </span>
            <input
              value={form.couponCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  couponCode: event.target.value.toUpperCase(),
                }))
              }
              maxLength={32}
              placeholder="FIRST10"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold tracking-[0.14em] text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(16,185,129,0.18)] dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Slots text
            </span>
            <input
              value={form.slotsText}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slotsText: event.target.value,
                }))
              }
              maxLength={120}
              placeholder="10 slots only"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(16,185,129,0.18)] dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
            />
          </label>

          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  enabled: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Banner enabled
            </span>
          </label>

          {error && (
            <p className="sm:col-span-2 text-sm text-rose-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save banner
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 dark:text-emerald-300">
                Saved
              </span>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
