import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { LEXLY_SYSTEM } from '../prompts'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  const emit = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    const { question, ragAnswer, sources } = req.body as {
      question: string
      ragAnswer: string
      sources: Array<{ article_number: string; title: string; risk_tier: string }>
    }

    if (!question?.trim() || !ragAnswer?.trim()) {
      emit({ type: 'error', message: 'Question and RAG answer are required.' })
      return res.end()
    }

    const sourceSummary = (sources ?? [])
      .map(s => `- ${s.article_number} (risk: ${s.risk_tier}): ${s.title}`)
      .join('\n')

    const userMessage = `Original question from the user:
"${question}"

Factual, cited answer already shown to the user (from the EU AI Act):
${ragAnswer}

Articles cited in that answer:
${sourceSummary}

Please provide a practical interpretation for a team building AI features, following your rules above.`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      stream: true,
      system: LEXLY_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        emit({ type: 'token', data: event.delta.text })
      }
    }

    emit({ type: 'done' })
    res.end()
  } catch (err) {
    let message = 'An unexpected error occurred. Please try again.'
    if (err instanceof Error) {
      try {
        const parsed = JSON.parse(err.message)
        message = parsed?.error?.message ?? parsed?.message ?? err.message
      } catch {
        message = err.message
      }
    }
    emit({ type: 'error', message })
    res.end()
  }
}
