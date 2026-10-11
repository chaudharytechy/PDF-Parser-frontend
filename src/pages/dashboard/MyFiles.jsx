import React, { useEffect, useState } from 'react'
import { Search, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import RecentFiles from '../../components/dashboard/RecentFiles.jsx'
import Loader from '../../components/common/Loader.jsx'
import Button from '../../components/common/Button.jsx'
import { usePdfParser } from '../../hooks/usePdfParser.js'

export default function MyFiles() {
  const { documents, fetchDocuments, loading } = usePdfParser()
  const [query, setQuery] = useState('')
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    fetchDocuments()
      .catch(() => toast.error('Could not load your documents'))
      .finally(() => setInitializing(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = documents.filter((f) =>
    (f.name ?? f.originalName ?? f.filename ?? '').toLowerCase().includes(query.toLowerCase())
  )

  if (initializing) return <Loader label="Loading your documents…" />
// console.log(documents,"oo")
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">My Files</h1>
          <p className="text-sm text-ink-500">All the documents you've uploaded.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button icon={UploadCloud}>Upload PDF</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="focus-ring w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm"
        />
      </div>

      {loading ? <Loader /> : <RecentFiles files={filtered} />}
    </div>
  )
}
