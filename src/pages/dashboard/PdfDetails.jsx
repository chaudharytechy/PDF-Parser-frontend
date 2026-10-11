import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import PdfViewer from '../../components/pdf/PdfViewer.jsx'
import ParsedData from '../../components/pdf/ParsedData.jsx'
import Loader from '../../components/common/Loader.jsx'
import { usePdfParser } from '../../hooks/usePdfParser.js'

export default function PdfDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeDocument, fetchDocumentById, askQuestion } = usePdfParser()
  const [loading, setLoading] = useState(true)
console.log(activeDocument,"iter")
  useEffect(() => {
    fetchDocumentById(id)
      .catch(() => toast.error('Could not load this document'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAsk = (question) => askQuestion(id, question)

  if (loading) return <Loader label="Loading document…" />

  const name =
    activeDocument?.name ?? activeDocument?.originalName ?? activeDocument?.filename ?? 'Untitled document'
  const fileUrl = activeDocument?.pdfUrl?.url ?? activeDocument?.url

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/dashboard/files')}
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft size={14} /> Back to files
      </button>

      <div>
        <h1 className="text-xl font-semibold text-ink-900">{name}</h1>
        <p className="text-sm text-ink-500">
          Status: <span className="font-medium capitalize">{activeDocument?.status ?? 'ready'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {fileUrl ? (
          <PdfViewer url={fileUrl} />
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-ink-200 bg-white py-16 text-sm text-ink-400">
            This document doesn't have a viewable file URL yet.
          </div>
        )}
        <ParsedData docId={id} onAsk={handleAsk} />
      </div>
    </div>
  )
}
