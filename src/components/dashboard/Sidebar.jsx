import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileStack,
  UploadCloud,
  Settings,
  FileScan,
  Bot,
  Network,
  BrainCircuit,
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/files', label: 'My Files', icon: FileStack },
  { to: '/dashboard/upload', label: 'Upload PDF', icon: UploadCloud },
  { to: '/dashboard/ai/agent', label: 'AI Agent', icon: Bot },
  { to: '/dashboard/ai/mcp', label: 'MCP Agent', icon: Network },
  { to: '/dashboard/ai/mcp-finetuned', label: 'MCP + Fine-tuned', icon: BrainCircuit },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-800/50 bg-ink-950 px-4 py-6 text-ink-200 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="rounded-lg bg-brand-600 p-2 text-white">
          <FileScan size={18} />
        </div>
        <span className="text-base font-semibold text-white">PDF Parser</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-300 hover:bg-ink-800/70 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl bg-ink-900 p-4 text-xs text-ink-400">
        Need more storage or team seats? Upgrade your plan from Settings.
      </div>
    </aside>
  )
}
