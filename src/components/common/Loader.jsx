import React from 'react'
import { Loader2 } from 'lucide-react'

export default function Loader({ label = 'Loading…', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-ink-500">
      <Loader2 className="animate-spin text-brand-600" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-ink-50">
        {content}
      </div>
    )
  }

  return <div className="flex w-full items-center justify-center py-12">{content}</div>
}
