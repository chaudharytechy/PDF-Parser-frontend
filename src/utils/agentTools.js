// Shared metadata + mock decision logic for the Agent / MCP / MCP+Fine-tuned
// dashboards. All three dashboards select from the same tool surface, so the
// keyword → tool matching and mock responses live here once instead of being
// duplicated across pages.
//
// TODO(backend): replace `decideTool` + `mockToolResult` with a real call to
// the agent orchestration endpoint once it exists (e.g. POST /ai/agent/query),
// which should return { tool, steps, result } itself.

export const TOOLS = [
  {
    id: 'search_pdf',
    name: 'search_pdf',
    label: 'Search PDF',
    description: 'Semantic search over your uploaded documents to answer questions.',
  },
  {
    id: 'list_files',
    name: 'list_files',
    label: 'List Files',
    description: 'Lists the documents currently in your account.',
  },
  {
    id: 'get_file',
    name: 'get_file',
    label: 'Get File',
    description: 'Fetches details/metadata for a single document.',
  },
  {
    id: 'get_chat_history',
    name: 'get_chat_history',
    label: 'Get Chat History',
    description: 'Retrieves previous questions and answers for context.',
  },
]

// Very small keyword heuristic so the mock UI has something believable to
// show while there's no real backend to make the decision. This is NOT meant
// to be a production intent classifier.
export function decideTool(message) {
  const text = message.toLowerCase()

  if (/(list|show|see|view).*(files|documents|uploads)/.test(text) || text.includes('my files')) {
    return 'list_files'
  }
  if (/history|previous question|earlier|last time|what did i ask/.test(text)) {
    return 'get_chat_history'
  }
  if (/^(get|open|show)\b.*\b(file|document)\b/.test(text) && /pdf-?\d+|\.pdf/.test(text)) {
    return 'get_file'
  }
  return 'search_pdf'
}

export function toolLabel(toolId) {
  return TOOLS.find((t) => t.id === toolId)?.label ?? toolId
}

// Deterministic-ish mock metrics so the fine-tuned dashboard doesn't look
// static between messages, without needing a real model to measure.
export function mockMetrics(seed = Date.now()) {
  const rand = (min, max) => Math.round(min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min))
  return {
    latencyMs: rand(180, 620),
    tokensUsed: rand(120, 480),
    toolCalls: rand(1, 3),
    retrievedDocs: rand(0, 4),
    confidence: `${rand(72, 97)}%`,
  }
}

export function mockAnswer(tool, message, documents = []) {
  switch (tool) {
    case 'list_files': {
      if (!documents.length) {
        return "You don't have any uploaded documents yet — upload a PDF first and I can list it here."
      }
      const names = documents
        .slice(0, 5)
        .map((d) => d.name ?? d.originalName ?? d.filename ?? 'Untitled document')
      return `Here are your most recent files:\n${names.map((n) => `• ${n}`).join('\n')}`
    }
    case 'get_chat_history':
      return "This is a mock response — once wired up, I'll pull your recent Q&A turns from get_chat_history()."
    case 'get_file':
      return "This is a mock response — once wired up, I'll fetch that document's metadata via get_file()."
    case 'search_pdf':
    default:
      return `This is a mock answer for "${message}". Once the backend endpoint exists, this will be a real answer grounded in your document via search_pdf().`
  }
}
