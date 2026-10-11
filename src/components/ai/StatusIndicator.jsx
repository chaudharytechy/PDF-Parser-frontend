import React from 'react'

const styles = {
  connected: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  online: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  connecting: { dot: 'bg-amber-500', text: 'text-amber-600' },
  error: { dot: 'bg-rose-500', text: 'text-rose-600' },
}

export default function StatusIndicator({ status = 'connecting', label }) {
  const s = styles[status] ?? styles.connecting
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {label}
    </span>
  )
}
