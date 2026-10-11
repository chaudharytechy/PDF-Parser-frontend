import React, { useEffect, useMemo, useState } from 'react'
import { Network, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatWindow from '../../../components/ai/ChatWindow.jsx'
import ActivityFlow from '../../../components/ai/ActivityFlow.jsx'
import ToolsPanel from '../../../components/ai/ToolsPanel.jsx'
import StatusIndicator from '../../../components/ai/StatusIndicator.jsx'
import { usePdfParser } from '../../../hooks/usePdfParser.js'
import mcpAgentService from '../../../services/mcpAgentService.js'
import { TOOLS, toolLabel } from '../../../utils/agentTools.js'

// Each tool's request/response hops through the MCP client → server, and
// search_pdf additionally goes on to the vector store. This is what makes
// this dashboard visually distinct from the plain Agent dashboard.
const FLOW_TEMPLATES = {
  search_pdf: ['User Query', 'AI Agent', 'MCP Client', 'MCP Server', 'search_pdf', 'Pinecone', 'Result', 'AI Response'],
  list_files: ['User Query', 'AI Agent', 'MCP Client', 'MCP Server', 'list_files', 'Result', 'AI Response'],
  get_file: ['User Query', 'AI Agent', 'MCP Client', 'MCP Server', 'get_file', 'Result', 'AI Response'],
  get_chat_history: [
    'User Query',
    'AI Agent',
    'MCP Client',
    'MCP Server',
    'get_chat_history',
    'Result',
    'AI Response',
  ],
}

export default function McpDashboard() {
  const { documents, fetchDocuments } = usePdfParser()
  const [mcpStatus, setMcpStatus] = useState('connecting')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFlow, setActiveFlow] = useState(null)
  const [activeFlowIndex, setActiveFlowIndex] = useState(-1)
  const [lastTool, setLastTool] = useState(null)
  const [selectedDocId, setSelectedDocId] = useState('')

  useEffect(() => {
    fetchDocuments().catch(() => toast.error('Could not load your documents'))
    mcpAgentService
      .getStatus()
      .then((data) => setMcpStatus(data.connected ? 'connected' : 'error'))
      .catch(() => setMcpStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedDoc = useMemo(
    () => documents.find((d) => (d._id ?? d.id ?? d.docId) === selectedDocId),
    [documents, selectedDocId]
  )

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), question: text, answer: null }])
    setLoading(true)
    setActiveFlow(null)
    setActiveFlowIndex(0)

    try {
      const result = await mcpAgentService.sendMessage(text, {
        docId: selectedDocId || undefined,
        documents,
      })
      const flow = FLOW_TEMPLATES[result.tool] ?? FLOW_TEMPLATES.search_pdf
      setActiveFlow(flow)
      setLastTool(result.tool)

      for (let i = 0; i < flow.length; i++) {
        setActiveFlowIndex(i)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 180))
      }
      setActiveFlowIndex(flow.length)

      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, answer: result.answer } : m))
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, answer: "Sorry, the MCP request failed. Please try again." } : m
        )
      )
      toast.error('MCP request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-ink-900">
            <Network size={20} className="text-brand-600" />
            MCP Agent
          </h1>
          <p className="text-sm text-ink-500">
            Same tools, routed through a Model Context Protocol client and server.
          </p>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white px-4 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">MCP Status</p>
          <StatusIndicator
            status={mcpStatus}
            label={mcpStatus === 'connected' ? 'Connected' : mcpStatus === 'error' ? 'Disconnected' : 'Connecting…'}
          />
        </div>
      </div>

      {documents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3">
          <FileText size={15} className="text-ink-400" />
          <label htmlFor="mcp-doc" className="text-xs font-medium text-ink-500">
            Focus on document:
          </label>
          <select
            id="mcp-doc"
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
            title="MCP chat"
            subtitle="Requests are routed through the MCP client/server before reaching a tool."
            messages={messages}
            onSend={handleSend}
            onClear={() => setMessages([])}
            loading={loading}
            placeholder="Ask something via MCP…"
          />
        </div>

        <div className="space-y-6">
          <ActivityFlow
            title="MCP Request Flow"
            steps={activeFlow ?? []}
            activeIndex={activeFlow ? activeFlowIndex : -1}
            idleLabel="Send a message to see the request travel through MCP."
          />
          <ToolsPanel title="Available MCP Tools" tools={TOOLS} selectedTool={lastTool} />
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
