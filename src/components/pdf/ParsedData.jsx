import React, { useState } from 'react'
import { Send, Sparkles, User } from 'lucide-react'
import Button from '../common/Button.jsx'

// Repurposed as the "ask questions about this document" panel, backed by
// POST /pdf/ask { docId, question }. There's no text-extraction/export
// endpoint on the backend, so this is the primary way to get value out of
// a parsed document.
export default function ParsedData({ docId, onAsk }) {
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [thread, setThread] = useState([]) // [{ question, answer }]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const q = question.trim()
    if (!q || !docId) return

    setAsking(true)
    setQuestion('')
    setThread((prev) => [...prev, { question: q, answer: null }])

    try {
      const answer = await onAsk(q)
      setThread((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1 ? { ...item, answer } : item
        )
      )
    } catch (err) {
      setThread((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1
            ? { ...item, answer: "Sorry, I couldn't answer that. Please try again." }
            : item
        )
      )
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-ink-200 bg-white">
      <div className="border-b border-ink-200 px-5 py-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
          <Sparkles size={16} className="text-brand-600" />
          Ask this document
        </h4>
        <p className="mt-1 text-xs text-ink-400">
          Ask questions in plain language and get answers grounded in this file.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: '50vh' }}>
        {thread.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-400">
            No questions yet — ask something below to get started.
          </p>
        )}
        {thread.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 rounded-full bg-ink-100 p-1.5 text-ink-500">
                <User size={12} />
              </span>
              <p className="rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-800">{item.question}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 rounded-full bg-brand-50 p-1.5 text-brand-600">
                <Sparkles size={12} />
              </span>
              {item.answer === null ? (
                <p className="rounded-xl bg-brand-50/50 px-3 py-2 text-sm text-ink-400">Thinking…</p>
              ) : (
                <p className="rounded-xl bg-brand-50/50 px-3 py-2 text-sm text-ink-700 whitespace-pre-wrap">
                  {item.answer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink-200 p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this document…"
          className="focus-ring flex-1 rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm"
        />
        <Button type="submit" icon={Send} loading={asking} disabled={!question.trim()}>
          Ask
        </Button>
      </form>
    </div>
  )
}
