import React from 'react'
import { Info, Mail, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

// The backend doesn't currently expose a "update profile" endpoint, so this
// page shows account info read-only. Wire up a PUT /user/me (or similar)
// route on the backend and this page can grow an editable form again.
export default function Settings() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500">Your account information.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-ink-800">Profile</h2>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
            <UserIcon size={16} />
          </span>
          <div>
            <p className="text-xs text-ink-400">Full name</p>
            <p className="text-sm font-medium text-ink-800">{user?.name ?? '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
            <Mail size={16} />
          </span>
          <div>
            <p className="text-xs text-ink-400">Email address</p>
            <p className="text-sm font-medium text-ink-800">{user?.email ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-6 text-sm text-ink-500">
        <Info className="mt-0.5 shrink-0 text-brand-600" size={18} />
        <p>
          Editing your profile isn't available yet — the backend doesn't expose an update-profile
          endpoint. Add one (e.g. <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">PUT /user/me</code>)
          and this page can support it.
        </p>
      </div>
    </div>
  )
}
