import React, { useEffect, useMemo, useState } from 'react'
import { BrainCircuit, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatWindow from '../../../components/ai/ChatWindow.jsx'
import ActivityFlow from '../../../components/ai/ActivityFlow.jsx'
import ToolsPanel from '../../../components/ai/ToolsPanel.jsx'
import ModelInfoCard from '../../../components/ai/ModelInfoCard.jsx'
import MetricsPanel from '../../../components/ai/MetricsPanel.jsx'
import Loader from '../../../components/common/Loader.jsx'
import { usePdfParser } from '../../../hooks/usePdfParser.js'
import mcpFinetunedService from '../../../services/mcpFinetunedService.js'
import { TOOLS, toolLabel } from '../../../utils/agentTools.js'

const FLOW = ['User Query', 'Fine-tuned LLM', 'Tool Selection', 'MCP', 'Tool Result', 'Final Answer']

export default function McpFinetunedDashboard() {
  
  const { documents, fetchDocuments } = usePdfParser()
  const [modelInfo, setModelInfo] = useState(null)
  const [modelInfoLoading, setModelInfoLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFlowIndex, setActiveFlowIndex] = useState(-1)
  const [hasRun, setHasRun] = useState(false)
  const [lastTool, setLastTool] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [selectedDocId, setSelectedDocId] = useState('')

  useEffect(() => {
    fetchDocuments().catch(() => toast.error('Could not load your documents'))
    mcpFinetunedService
      .getModelInfo()
      .then(setModelInfo)
      .catch(() => toast.error('Could not load model info'))
      .finally(() => setModelInfoLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedDoc = useMemo(
    () => documents.find((d) => (d._id ?? d.id ?? d.docId) === selectedDocId),
    [documents, selectedDocId]
  )

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), question: text, answer: null }])
    setLoading(true)
    setHasRun(true)
    setActiveFlowIndex(0)

    try {
      const result = await mcpFinetunedService.sendMessage(text, {
        docId: selectedDocId || undefined,
        documents,
      })
      setLastTool(result.tool)

      for (let i = 0; i < FLOW.length; i++) {
        setActiveFlowIndex(i)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 200))
      }
      setActiveFlowIndex(FLOW.length)
      setMetrics(result.metrics)

      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, answer: result.answer } : m))
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, answer: 'Sorry, the model request failed. Please try again.' } : m
        )
      )
      toast.error('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-ink-900">
          <BrainCircuit size={20} className="text-brand-600" />
          MCP + Fine-tuned LLM
        </h1>
        <p className="text-sm text-ink-500">
          Preview of the future architecture: a fine-tuned model driving tool use via MCP.
        </p>
      </div>

      {modelInfoLoading ? (
        <Loader label="Loading model info…" />
      ) : (
        modelInfo && <ModelInfoCard name={modelInfo.name} status={modelInfo.status} purpose={modelInfo.purpose} />
      )}

      {documents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3">
          <FileText size={15} className="text-ink-400" />
          <label htmlFor="ft-doc" className="text-xs font-medium text-ink-500">
            Focus on document:
          </label>
          <select
            id="ft-doc"
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
        <div className="lg:col-span-2 space-y-6">
          <ChatWindow
            title="Fine-tuned model chat"
            subtitle="Tool selection and reasoning are handled by the fine-tuned model, not Gemini."
            messages={messages}
            onSend={handleSend}
            onClear={() => setMessages([])}
            loading={loading}
            placeholder="Ask the fine-tuned model…"
          />
          <MetricsPanel metrics={hasRun ? metrics : null} />
        </div>

        <div className="space-y-6">
          <ActivityFlow
            title="Agent Activity"
            steps={FLOW}
            activeIndex={hasRun ? activeFlowIndex : -1}
            idleLabel="Send a message to see the fine-tuned model's flow."
          />
          <ToolsPanel title="MCP Tools" tools={TOOLS} selectedTool={lastTool} />
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
