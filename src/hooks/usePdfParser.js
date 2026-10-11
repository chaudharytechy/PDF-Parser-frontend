import { useContext } from 'react'
import { PdfContext } from '../context/PdfContext.jsx'

export function usePdfParser() {
  const ctx = useContext(PdfContext)
  if (!ctx) throw new Error('usePdfParser must be used within a PdfProvider')
  return ctx
}
