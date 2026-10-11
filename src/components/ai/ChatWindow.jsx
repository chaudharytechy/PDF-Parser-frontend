import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User, Trash2 } from 'lucide-react'
import Button from '../common/Button.jsx'

// Shared chat UI for the Agent / MCP / MCP+Fine-tuned dashboards. Mirrors the
// visual language of ParsedData.jsx (the RAG "Ask this document" panel) so
// all AI surfaces feel like the same product.
export default function ChatWindow({
  title,
  subtitle,
  messages,
  onSend,
  onClear,
  loading = false,
  placeholder = 'Ask something…',
  headerAccessory,
}) {
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = input.trim()
    if (!value || loading) return
    setInput('')
    onSend(value)
  }

  return (
    <div className="flex h-full min-h-[520px] flex-col rounded-xl border border-ink-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
            <Sparkles size={16} className="text-brand-600" />
            {title}
          </h4>
          {subtitle && <p className="mt-1 text-xs text-ink-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerAccessory}
          {onClear && messages.length > 0 && (
            <button
              onClick={onClear}
              className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100 hover:text-rose-600"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: '55vh' }}>
        {messages.length === 0 && !loading && (
          <p className="py-10 text-center text-sm text-ink-400">
            No messages yet — ask something below to get started.
          </p>
        )}

        {messages.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded-full bg-ink-100 p-1.5 text-ink-500">
                <User size={12} />
              </span>
              <p className="rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-800">{item.question}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded-full bg-brand-50 p-1.5 text-brand-600">
                <Sparkles size={12} />
              </span>
              {item.answer === null ? (
                <p className="rounded-xl bg-brand-50/50 px-3 py-2 text-sm text-ink-400">Thinking…</p>
              ) : (
                <p className="whitespace-pre-wrap rounded-xl bg-brand-50/50 px-3 py-2 text-sm text-ink-700">
                  {item.answer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink-200 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="focus-ring flex-1 rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm"
        />
        <Button type="submit" icon={Send} loading={loading} disabled={!input.trim()}>
          Send
        </Button>
      </form>
    </div>
  )
}
