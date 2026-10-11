import React from 'react'
import { CheckCircle2, Circle, Loader2, ArrowDown } from 'lucide-react'

// Generic vertical step flow. `steps` is an array of strings; `activeIndex`
// is the index currently in progress (its previous steps render as done),
// or -1/undefined when idle. Reused by the Agent, MCP, and Fine-tuned
// dashboards, each passing a different step list to represent their own
// architecture.
export default function ActivityFlow({ title = 'Agent Activity', steps, activeIndex = -1, idleLabel }) {
  const isIdle = activeIndex < 0

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-ink-800">{title}</h4>

      {isIdle ? (
        <p className="mt-3 text-sm text-ink-400">
          {idleLabel ?? 'Send a message to see how the agent works through it.'}
        </p>
      ) : (
        <ol className="mt-4 space-y-1">
          {steps.map((step, i) => {
            const done = i < activeIndex
            const active = i === activeIndex
            return (
              <li key={step}>
                <div className="flex items-center gap-2.5">
                  {done && <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />}
                  {active && <Loader2 size={16} className="shrink-0 animate-spin text-brand-600" />}
                  {!done && !active && <Circle size={16} className="shrink-0 text-ink-300" />}
                  <span
                    className={`text-sm ${
                      done ? 'text-ink-500' : active ? 'font-medium text-ink-900' : 'text-ink-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="pl-2">
                    <ArrowDown size={13} className="my-0.5 text-ink-300" />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
