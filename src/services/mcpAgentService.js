import api from './api.js'
import { decideTool, mockAnswer } from '../utils/agentTools.js'

// V3 — MCP Agent dashboard.
//
// TODO(backend): this dashboard is frontend-only for now. Wire these up once
// the MCP server exists, e.g.:
//   GET  /ai/mcp/status      → { connected, tools: [...] }
//   POST /ai/mcp/message     { message, docId? } → { tool, flow, answer }
// Until then, calls try the real endpoint first and fall back to a mock.

const MCP_STATUS_ENDPOINT = '/mcp/status'
const MCP_MESSAGE_ENDPOINT = '/agent/mcp/chat'

const mcpAgentService = {
  async getStatus() {
    try {
      const { data } = await api.get(MCP_STATUS_ENDPOINT)
      return data
    } catch {
      // Mock path — assume a healthy MCP connection until the real server exists.
      await new Promise((r) => setTimeout(r, 400))
      return { connected: true, mocked: true }
    }
  },

  async sendMessage(message, { docId, documents = [] } = {}) {
    try {
      console.log(message)
      const { data } = await api.post(MCP_MESSAGE_ENDPOINT, { message, docId })
      console.log(data)
      return data
    } catch {
      const tool = decideTool(message)
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))
      return {
        tool,
        answer: mockAnswer(tool, message, documents),
        mocked: true,
      }
    }
  },
}

export default mcpAgentService
