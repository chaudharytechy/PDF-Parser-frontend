import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PdfUploader from '../../components/pdf/PdfUploader.jsx'
import { usePdfParser } from '../../hooks/usePdfParser.js'

export default function UploadPdf() {
  const { uploadDocument } = usePdfParser()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const handleUpload = async (file) => {
    setUploading(true)
    setProgress(0)
    try {
      const doc = await uploadDocument(file, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded * 100) / evt.total))
        }
      })
      toast.success('Document uploaded successfully')
      const id = doc._id ?? doc.id ?? doc.docId
      if (id) navigate(`/dashboard/files/${id}`)
      else navigate('/dashboard/files')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Upload a PDF</h1>
        <p className="text-sm text-ink-500">
          Upload a document (PDF, DOCX, or TXT — up to 10MB) so you can ask questions about it.
        </p>
      </div>
      <PdfUploader onUpload={handleUpload} uploading={uploading} progress={progress} />
    </div>
  )
}
