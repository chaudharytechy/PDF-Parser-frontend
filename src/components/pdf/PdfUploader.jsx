import React, { useCallback, useRef, useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { isAcceptedFile, isFileTooLarge, formatBytes, MAX_FILE_SIZE_MB } from '../../utils/fileUtils.js'
import Button from '../common/Button.jsx'

export default function PdfUploader({ onUpload, uploading = false, progress = 0 }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const validateAndSet = useCallback((file) => {
    if (!file) return
    if (!isAcceptedFile(file)) {
      toast.error('Only PDF, DOCX, and TXT files are supported')
      return
    }
    if (isFileTooLarge(file)) {
      toast.error(`File exceeds the ${MAX_FILE_SIZE_MB}MB limit`)
      return
    }
    setSelectedFile(file)
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    validateAndSet(e.dataTransfer.files?.[0])
  }

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-white hover:border-brand-300'
        }`}
      >
        <div className="rounded-full bg-brand-50 p-3 text-brand-600">
          <UploadCloud size={26} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-800">
            Drag & drop a PDF, DOCX, or TXT here, or click to browse
          </p>
          <p className="mt-1 text-xs text-ink-400">Max file size {MAX_FILE_SIZE_MB}MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" size={20} />
            <div>
              <p className="text-sm font-medium text-ink-800">{selectedFile.name}</p>
              <p className="text-xs text-ink-400">{formatBytes(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            size="sm"
            loading={uploading}
            onClick={() => onUpload(selectedFile)}
          >
            {uploading ? `Uploading ${progress}%` : 'Upload'}
          </Button>
        </div>
      )}
    </div>
  )
}
