import React from 'react'
import { BrainCircuit } from 'lucide-react'
import StatusIndicator from './StatusIndicator.jsx'

export default function ModelInfoCard({ name, status, purpose }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
            <BrainCircuit size={18} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Model</p>
            <p className="text-sm font-semibold text-ink-900">{name}</p>
          </div>
        </div>
        <StatusIndicator status={status} label={status === 'online' ? 'Online' : status} />
      </div>
      <p className="mt-3 text-xs text-ink-500">{purpose}</p>
    </div>
  )
}
