import React from 'react'
import { Wrench } from 'lucide-react'

// Reused by the Agent, MCP, and Fine-tuned dashboards to list the tool
// surface the agent can call. `selectedTool` (a tool id) is highlighted.
export default function ToolsPanel({ title = 'Available Tools', tools, selectedTool }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
        <Wrench size={15} className="text-brand-600" />
        {title}
      </h4>
      <ul className="mt-4 space-y-2">
        {tools.map((tool) => {
          const active = tool.id === selectedTool
          return (
            <li
              key={tool.id}
              className={`rounded-lg border px-3 py-2.5 transition-colors ${
                active ? 'border-brand-600 bg-brand-50' : 'border-ink-200 bg-white'
              }`}
            >
              <p
                className={`font-mono text-xs font-semibold ${
                  active ? 'text-brand-700' : 'text-ink-700'
                }`}
              >
                {tool.name}()
              </p>
              <p className="mt-0.5 text-xs text-ink-400">{tool.description}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
