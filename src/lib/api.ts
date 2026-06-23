import type { SearchFilters, SseEvent, ArticleSource } from '@/types'

export interface LexlyParams {
  question: string
  ragAnswer: string
  sources: Pick<ArticleSource, 'article_number' | 'title' | 'risk_tier'>[]
}

export type LexlyEvent =
  | { type: 'token'; data: string }
  | { type: 'error'; message: string }
  | { type: 'done' }

async function* parseSse<T>(response: Response): AsyncGenerator<T> {
  if (!response.ok || !response.body) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''
    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data: ')) continue
      try { yield JSON.parse(line.slice(6)) as T } catch { /* skip */ }
    }
  }
}

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
  yield* parseSse<SseEvent>(response)
}

export async function* streamLexly(
  params: LexlyParams,
  signal?: AbortSignal,
): AsyncGenerator<LexlyEvent> {
  const response = await fetch('/api/lexly', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  })
  yield* parseSse<LexlyEvent>(response)
}
