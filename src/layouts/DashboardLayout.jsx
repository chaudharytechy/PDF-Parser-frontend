import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  X,
  LayoutDashboard,
  FileStack,
  UploadCloud,
  Settings,
  FileScan,
  Bot,
  Network,
  BrainCircuit,
} from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar.jsx'
import Navbar from '../components/dashboard/Navbar.jsx'

const mobileLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/files', label: 'My Files', icon: FileStack },
  { to: '/dashboard/upload', label: 'Upload PDF', icon: UploadCloud },
  { to: '/dashboard/ai/agent', label: 'AI Agent', icon: Bot },
  { to: '/dashboard/ai/mcp', label: 'MCP Agent', icon: Network },
  { to: '/dashboard/ai/mcp-finetuned', label: 'MCP + Fine-tuned', icon: BrainCircuit },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-64 flex-col bg-ink-950 px-4 py-6 text-white">
            <div className="mb-8 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-brand-600 p-2">
                  <FileScan size={16} />
                </div>
                <span className="font-semibold">PDF Parser</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-ink-300">
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {mobileLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-brand-600 text-white' : 'text-ink-300 hover:bg-ink-800/70'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
