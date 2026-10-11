import api from './api.js'

// Matches pdfRoute.js exactly:
//   POST /pdf/upload            multipart field name "file"
//   POST /pdf/ask/:docId         { question }  — docId in the URL, userId from auth cookie
//   GET  /pdf/documents          list
//   GET  /pdf/documents/:docId   single document
// No delete, parse, export, or stats endpoints exist on the backend, so the
// frontend does not expose those actions.
const pdfService = {
  async uploadDocument(file, onUploadProgress) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    return data
  },

  async getDocuments() {
    const { data } = await api.get('/upload/documents')
    return data
  },

  async getDocumentById(docId) {
    const { data } = await api.get(`/upload/documents/${docId}`)
    return data
  },

  async askQuestion(docId, question) {
    // docId comes from the URL param, userId is derived server-side from the
    // auth cookie — only the question needs to go in the body.
    const { data } = await api.post(`/upload/ask/${docId}`, { question })
    return data
  },
}

export default pdfService
