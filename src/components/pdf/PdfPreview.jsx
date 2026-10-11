import React from 'react'
import { FileText, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatBytes, formatDate } from '../../utils/fileUtils.js'
import { getStatusColor } from '../../utils/pdfUtils.js'

// No delete endpoint exists on the backend, so this card is view-only.
export default function PdfPreview({ file }) {
  const id = file._id ?? file.id ?? file.docId
  const name = file.name ?? file.originalName ?? file.filename ?? 'Untitled document'

  return (
    <Link
      to={`/dashboard/files/${id}`}
      className="group flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-3.5 transition-shadow hover:shadow-soft"
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600 shrink-0">
          <FileText size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink-800">{name}</p>
          <p className="text-xs text-ink-400">
            {formatBytes(file.size)} · {formatDate(file.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(file.status)}`}>
          {file.status ?? 'uploaded'}
        </span>
        <span className="focus-ring rounded-lg p-2 text-ink-400 group-hover:bg-ink-100 group-hover:text-brand-600">
          <Eye size={16} />
        </span>
      </div>
    </Link>
  )
}
