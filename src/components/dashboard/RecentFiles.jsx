import React from 'react'
import { Link } from 'react-router-dom'
import PdfPreview from '../pdf/PdfPreview.jsx'
import { FileX2 } from 'lucide-react'

export default function RecentFiles({ files = [] }) {
  if (!files.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-white py-12 text-ink-400">
        <FileX2 size={24} />
        <p className="text-sm">No documents uploaded yet</p>
        <Link to="/dashboard/upload" className="text-sm font-medium text-brand-600 hover:underline">
          Upload your first PDF
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <PdfPreview key={file._id ?? file.id ?? file.docId} file={file} />
      ))}
    </div>
  )
}
