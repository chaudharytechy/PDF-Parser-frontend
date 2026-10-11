import React from 'react'
import { Outlet } from 'react-router-dom'
import { FileScan, ShieldCheck, Zap, ScanText } from 'lucide-react'

const features = [
  { icon: ScanText, text: 'Extract text, tables & metadata from any PDF' },
  { icon: Zap, text: 'Parse documents in seconds with instant previews' },
  { icon: ShieldCheck, text: 'Your files stay private and encrypted at rest' },
]

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-brand-600 p-2">
            <FileScan size={18} />
          </div>
          <span className="text-lg font-semibold">PDF Parser</span>
        </div>

        <div>
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            The intelligent assistant for reading, parsing & organizing your PDFs.
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-ink-300">
                <span className="rounded-lg bg-ink-900 p-2 text-brand-400">
                  <Icon size={16} />
                </span>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-500">© {new Date().getFullYear()} PDF Parser. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center bg-ink-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
