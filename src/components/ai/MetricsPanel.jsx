import React from 'react'
import { Timer, Coins, Wrench, FileSearch, Gauge } from 'lucide-react'

const fields = [
  { key: 'latencyMs', label: 'Response latency', icon: Timer, suffix: ' ms' },
  { key: 'tokensUsed', label: 'Tokens used', icon: Coins },
  { key: 'toolCalls', label: 'Tool calls', icon: Wrench },
  { key: 'retrievedDocs', label: 'Retrieved documents', icon: FileSearch },
  { key: 'confidence', label: 'Confidence', icon: Gauge },
]

// Placeholder metrics for the fine-tuned model dashboard — values come from
// mockMetrics() in utils/agentTools.js until a real model reports them.
export default function MetricsPanel({ metrics }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-ink-800">Model Metrics</h4>
      {!metrics ? (
        <p className="mt-3 text-sm text-ink-400">Send a message to see per-response metrics.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {fields.map(({ key, label, icon: Icon, suffix = '' }) => (
            <div key={key} className="rounded-lg bg-ink-50 p-3">
              <div className="flex items-center gap-1.5 text-ink-400">
                <Icon size={13} />
                <span className="text-xs">{label}</span>
              </div>
              <p className="mt-1 text-base font-semibold text-ink-900">
                {metrics[key]}
                {typeof metrics[key] === 'number' ? suffix : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
