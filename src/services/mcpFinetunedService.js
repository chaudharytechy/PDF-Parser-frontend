import api from './api.js'
import { decideTool, mockAnswer, mockMetrics } from '../utils/agentTools.js'

// V4 — MCP + Fine-tuned LLM dashboard.
//
// This represents the future architecture where a fine-tuned PDF-MIND model
// replaces Gemini as the reasoning/tool-selection engine, still talking to
// tools through MCP. None of that exists yet — this is UI-only.
//
// TODO(backend): wire up once available, e.g.:
//   GET  /ai/finetuned/status   → { name, status, purpose }
//   POST /ai/finetuned/message  { message, docId? } → { tool, flow, answer, metrics }

const MODEL_STATUS_ENDPOINT = '/ai/finetuned/status'
const MODEL_MESSAGE_ENDPOINT = '/agent/fine'

const mcpFinetunedService = {
  async getModelInfo() {
    try {
      const { data } = await api.get(MODEL_STATUS_ENDPOINT)
      return data
    } catch {
      await new Promise((r) => setTimeout(r, 400))
      return {
        name: 'PDF-MIND Fine-tuned Model',
        status: 'online',
        purpose: 'Specialized document Q&A and tool selection',
        mocked: true,
      }
    }
  },

  async sendMessage(message, { docId, documents = [] } = {}) {
    try {
      const { data } = await api.post(MODEL_MESSAGE_ENDPOINT, { message, docId })
      return data
    } catch {
      const tool = decideTool(message)
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))
      return {
        tool,
        answer: mockAnswer(tool, message, documents),
        metrics: mockMetrics(Date.now()),
        mocked: true,
      }
    }
  },
}

export default mcpFinetunedService
