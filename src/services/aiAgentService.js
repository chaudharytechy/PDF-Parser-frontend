import api from './api.js'
import { decideTool, mockAnswer } from '../utils/agentTools.js'

// V2 — AI Agent dashboard.
//
// TODO(backend): this dashboard is frontend-only for now. Wire these up to
// real endpoints once they exist, e.g.:
//   POST /ai/agent/message   { message, docId? }  → { tool, steps, answer }
//   GET  /ai/agent/history                        → { messages }
// Until then, every call below tries the (not-yet-existing) endpoint first
// and silently falls back to a local mock so the UI keeps working.

const AGENT_ENDPOINT = '/agent/chat'

const aiAgentService = {
  async sendMessage(message, { docId, documents = [] } = {}) {
    try {
     
      const { data } = await api.post(AGENT_ENDPOINT, { message, docId })
      return data
    } catch {
      // Mock path — no backend endpoint yet.
      const tool = decideTool(message)
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500))
      return {
        tool,
        answer: mockAnswer(tool, message, documents),
        mocked: true,
      }
    }
  },
}

export default aiAgentService
