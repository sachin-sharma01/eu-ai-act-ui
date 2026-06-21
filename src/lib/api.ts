import type { SearchFilters, SseEvent } from '@/types'

export async function* streamSearch(
  question: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      riskTierFilter: filters.riskTierFilter,
      bankingFilter: filters.bankingFilter,
    }),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Search request failed: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // SSE events are separated by double newline
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data: ')) continue
      try {
        yield JSON.parse(line.slice(6)) as SseEvent
      } catch {
        // skip malformed events
      }
    }
  }
}
