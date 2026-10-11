import React, { createContext, useCallback, useState } from 'react'
import pdfService from '../services/pdfService.js'

export const PdfContext = createContext(null)

export function PdfProvider({ children }) {
  const [documents, setDocuments] = useState([])
  const [activeDocument, setActiveDocument] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await pdfService.getDocuments()
      // console.log(data,"fef")
      const list = data.document ?? data.files ?? (Array.isArray(data) ? data : [])
      setDocuments(list)
      return list
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDocumentById = useCallback(async (docId) => {
    const data = await pdfService.getDocumentById(docId)
   
    const doc = data.document ?? data.file ?? data
    //  console.log(doc,"pp")
    setActiveDocument(doc)
    return doc
  }, [])

  const uploadDocument = useCallback(async (file, onUploadProgress) => {
    const data = await pdfService.uploadDocument(file, onUploadProgress)
    const doc = data.document ?? data.file ?? data
    setDocuments((prev) => [doc, ...prev])
    return doc
  }, [])

  const askQuestion = useCallback(async (docId, question) => {
    const data = await pdfService.askQuestion(docId, question)
    return data.answer ?? data.message ?? data
  }, [])

  const value = {
    documents,
    activeDocument,
    loading,
    fetchDocuments,
    fetchDocumentById,
    uploadDocument,
    askQuestion,
    setActiveDocument,
  }

  return <PdfContext.Provider value={value}>{children}</PdfContext.Provider>
}
