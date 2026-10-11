// Small helpers around parsed PDF data used across dashboard pages.

export function getStatusColor(status) {
  switch (status) {
    case 'parsed':
      return 'bg-emerald-100 text-emerald-700'
    case 'processing':
      return 'bg-amber-100 text-amber-700'
    case 'failed':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-ink-100 text-ink-600'
  }
}

export function summarizeParsedText(text = '', maxLength = 220) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export function countWords(text = '') {
  return text.trim().length ? text.trim().split(/\s+/).length : 0
}

export function toCSV(rows = []) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
  })
  return lines.join('\n')
}
