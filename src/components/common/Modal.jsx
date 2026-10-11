import React from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-ink-600">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
