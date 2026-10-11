import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
      <div className="rounded-full bg-brand-50 p-4 text-brand-600">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-3xl font-semibold text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="focus-ring rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  )
}
