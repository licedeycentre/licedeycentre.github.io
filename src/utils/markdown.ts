// Minimal utilities to extract a JSON block from markdown and convert basic markdown to HTML

export function extractJsonBlock(markdown: string): unknown {
  // Looks for first fenced code block tagged json and parses it
  const match = markdown.match(/```json[\r\n]+([\s\S]*?)[\r\n]+```/i)
  if (!match) return undefined
  try {
    return JSON.parse(match[1])
  } catch {
    return undefined
  }
}



