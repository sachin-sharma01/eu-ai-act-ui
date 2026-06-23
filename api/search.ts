import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { SYSTEM_PROMPT } from './prompts.js'

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
    const { question, riskTierFilter, bankingFilter } = req.body as {
      question: string
      riskTierFilter?: string | null
      bankingFilter?: boolean
    }

    if (!question?.trim()) {
      emit({ type: 'error', message: 'A question is required.' })
      return res.end()
    }

    // ── Step 1: Generate query embedding ────────────────────
    emit({ type: 'status', stage: 'embedding' })

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question.trim(),
    })
    const embedding = embeddingResponse.data[0].embedding

    // ── Step 2: Similarity search via Supabase RPC ───────────
    emit({ type: 'status', stage: 'searching' })

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    )

    const { data: articles, error: supabaseError } = await supabase.rpc('match_eu_ai_act', {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5,
      filter_risk_tier: riskTierFilter ?? null,
      filter_banking: bankingFilter || null,
    })

    if (supabaseError) throw new Error(supabaseError.message)

    if (!articles || articles.length === 0) {
      emit({ type: 'no_results' })
      emit({ type: 'done' })
      return res.end()
    }

    // ── Step 3: Stream each article hit ─────────────────────
    for (const article of articles) {
      emit({
        type: 'article',
        data: {
          article_number: article.article_number,
          title: article.title,
          risk_tier: article.risk_tier,
          similarity: article.similarity,
          chapter: article.chapter ?? null,
          section: article.section ?? null,
        },
      })
    }

    // ── Step 4: Synthesise with Claude ───────────────────────
    emit({ type: 'status', stage: 'synthesizing' })

    const context = (articles as Record<string, unknown>[])
      .map((a, i) => `[${i + 1}] ${a.article_number}: ${a.title}\n\n${a.original_text}`)
      .join('\n\n---\n\n')

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Retrieved articles from the EU AI Act (Regulation 2024/1689):\n\n${context}\n\nQuestion: ${question}`,
        },
      ],
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        emit({ type: 'token', data: event.delta.text })
      }
    }

    // ── Step 5: Send structured sources ─────────────────────
    emit({
      type: 'sources',
      data: (articles as Record<string, unknown>[]).map((a, i) => ({
        index: i + 1,
        article_number: a.article_number,
        title: a.title,
        risk_tier: a.risk_tier,
        similarity: a.similarity,
        page_reference: a.page_reference,
        original_text: a.original_text,
        chapter: a.chapter ?? null,
        section: a.section ?? null,
        obligation_type: a.obligation_type,
        applies_to: a.applies_to,
        banking_relevance: a.banking_relevance,
        source_url: a.source_url ?? null,
      })),
    })

    emit({ type: 'done' })
    res.end()
  } catch (err) {
    let message = 'An unexpected error occurred. Please try again.'
    if (err instanceof Error) {
      // Extract clean message from Anthropic/OpenAI JSON error bodies
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
