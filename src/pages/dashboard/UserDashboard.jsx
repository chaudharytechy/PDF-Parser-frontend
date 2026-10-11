import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, CheckCircle2, Clock, UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'
import StatsCard from '../../components/dashboard/StatsCard.jsx'
import RecentFiles from '../../components/dashboard/RecentFiles.jsx'
import Loader from '../../components/common/Loader.jsx'
import Button from '../../components/common/Button.jsx'
import { usePdfParser } from '../../hooks/usePdfParser.js'

export default function UserDashboard() {
  const { documents, fetchDocuments, loading } = usePdfParser()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    fetchDocuments()
      .catch(() => toast.error('Could not load your dashboard data'))
      .finally(() => setInitializing(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // There's no /pdf/stats endpoint on the backend, so stats are derived
  // client-side from the documents list itself.
  const stats = useMemo(() => {
    const total = documents.length
    const ready = documents.filter((d) => (d.status ?? 'ready') === 'ready').length
    const pending = total - ready
    return { total, ready, pending }
  }, [documents])

  if (initializing) return <Loader label="Loading your dashboard…" />

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Overview</h1>
          <p className="text-sm text-ink-500">A snapshot of your document activity.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button icon={UploadCloud}>Upload PDF</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total documents" value={stats.total} icon={FileStack} accent="brand" />
        <StatsCard label="Ready to query" value={stats.ready} icon={CheckCircle2} accent="emerald" />
        <StatsCard label="Processing" value={stats.pending} icon={Clock} accent="amber" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">Recent documents</h2>
          <Link to="/dashboard/files" className="text-sm font-medium text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {loading ? <Loader /> : <RecentFiles files={documents.slice(0, 5)} />}
      </div>
    </div>
  )
}
