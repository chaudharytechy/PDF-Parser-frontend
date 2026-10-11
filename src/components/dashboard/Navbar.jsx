import React, { useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function Navbar({ onMenuClick }) {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-medium text-ink-500">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="focus-ring relative rounded-lg p-2 text-ink-500 hover:bg-ink-100">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="focus-ring flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <ChevronDown size={16} className="text-ink-400" />
          </button>

          {open && (
            <div
              className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-ink-200 bg-white p-1.5 shadow-card"
              onMouseLeave={() => setOpen(false)}
            >
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50"
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
