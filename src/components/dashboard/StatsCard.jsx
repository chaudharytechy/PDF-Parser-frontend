import React from 'react'

export default function StatsCard({ label, value, icon: Icon, trend, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        <span className={`rounded-lg p-2 ${accents[accent]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-emerald-600">{trend}</p>}
    </div>
  )
}
