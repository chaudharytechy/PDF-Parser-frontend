import React, { useEffect, useMemo, useState } from 'react'
import { Bot, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatWindow from '../../../components/ai/ChatWindow.jsx'
import ActivityFlow from '../../../components/ai/ActivityFlow.jsx'
import ToolsPanel from '../../../components/ai/ToolsPanel.jsx'
import { usePdfParser } from '../../../hooks/usePdfParser.js'
import aiAgentService from '../../../services/aiAgentService.js'
import { TOOLS, toolLabel } from '../../../utils/agentTools.js'

const STEP_TEMPLATES = {
  search_pdf: ['Understanding request', 'Tool selected: search_pdf', 'Searching document', 'Generating answer'],
  list_files: ['Understanding request', 'Tool selected: list_files', 'Fetching your files', 'Generating answer'],
  get_file: ['Understanding request', 'Tool selected: get_file', 'Fetching document details', 'Generating answer'],
  get_chat_history: [
    'Understanding request',
    'Tool selected: get_chat_history',
    'Retrieving past turns',
    'Generating answer',
  ],
}

export default function AgentDashboard() {
  const { documents, fetchDocuments } = usePdfParser()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeSteps, setActiveSteps] = useState(null)
  const [activeStepIndex, setActiveStepIndex] = useState(-1)
  const [lastTool, setLastTool] = useState(null)
  const [selectedDocId, setSelectedDocId] = useState('')

  useEffect(() => {
    fetchDocuments().catch(() => toast.error('Could not load your documents'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedDoc = useMemo(
    () => documents.find((d) => (d._id ?? d.id ?? d.docId) === selectedDocId),
    [documents, selectedDocId]
  )

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), question: text, answer: null }])
    setLoading(true)
    setActiveSteps(null)
    setActiveStepIndex(0)

    try {
      const result = await aiAgentService.sendMessage(text, {
        docId: selectedDocId || undefined,
        documents,
      })
      const steps = STEP_TEMPLATES[result.tool] ?? STEP_TEMPLATES.search_pdf
      setActiveSteps(steps)
      setLastTool(result.tool)

      // Animate through the step list briefly so the activity panel reads
      // as a real trace rather than an instant jump.
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIndex(i)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 220))
      }
      setActiveStepIndex(steps.length)

      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, answer: result.answer } : m))
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, answer: "Sorry, I couldn't process that. Please try again." } : m
        )
      )
      toast.error('The agent ran into a problem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-ink-900">
          <Bot size={20} className="text-brand-600" />
          AI Agent
        </h1>
        <p className="text-sm text-ink-500">
          The agent reads your request and decides which tool to use — no fixed workflow.
        </p>
      </div>

      {documents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3">
          <FileText size={15} className="text-ink-400" />
          <label htmlFor="agent-doc" className="text-xs font-medium text-ink-500">
            Focus on document:
          </label>
          <select
            id="agent-doc"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="focus-ring rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-700"
          >
            <option value="">All documents</option>
            {documents.map((d) => {
              const id = d._id ?? d.id ?? d.docId
              return (
                <option key={id} value={id}>
                  {d.name ?? d.originalName ?? d.filename ?? id}
                </option>
              )
            })}
          </select>
          {selectedDoc && (
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              Selected: {selectedDoc.name ?? selectedDoc.originalName ?? selectedDoc.filename}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatWindow
            title="Agent chat"
            subtitle='Try: "What does PDF-1 say about refund policy?" or "Show me my uploaded files."'
            messages={messages}
            onSend={handleSend}
            onClear={() => setMessages([])}
            loading={loading}
            placeholder="Ask the agent anything…"
          />
        </div>

        <div className="space-y-6">
          <ActivityFlow
            title="Agent Activity"
            steps={activeSteps ?? []}
            activeIndex={activeSteps ? activeStepIndex : -1}
            idleLabel="Send a message to see which tool the agent picks."
          />
          <ToolsPanel tools={TOOLS} selectedTool={lastTool} />
          {lastTool && (
            <div className="rounded-xl border border-ink-200 bg-white p-4 text-xs text-ink-500">
              Last tool used: <span className="font-medium text-ink-800">{toolLabel(lastTool)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
