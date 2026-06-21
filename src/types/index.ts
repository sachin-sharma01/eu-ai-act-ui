export type RiskTier = 'unacceptable' | 'high' | 'limited' | 'minimal' | 'not_applicable'
export type ObligationType = 'prohibited' | 'high_risk' | 'transparency' | 'gpai' | 'governance' | 'general'
export type AppliesTo = 'provider' | 'deployer' | 'both' | 'member_state' | 'all'
export type BankingRelevance = 'high' | 'medium' | 'low' | 'not_applicable'

export interface ArticleHit {
  article_number: string
  title: string
  risk_tier: RiskTier
  similarity: number
  chapter?: string
  section?: string
}

export interface ArticleSource {
  index: number
  article_number: string
  title: string
  risk_tier: RiskTier
  similarity: number
  page_reference: string
  original_text: string
  chapter?: string
  section?: string
  obligation_type: ObligationType
  applies_to: AppliesTo
  banking_relevance: BankingRelevance
  source_url?: string
}

export type SearchStatus =
  | 'idle'
  | 'embedding'
  | 'searching'
  | 'synthesizing'
  | 'done'
  | 'no_results'
  | 'error'

export interface SearchState {
  status: SearchStatus
  question: string
  articles: ArticleHit[]
  answer: string
  sources: ArticleSource[]
  error: string | null
}

export interface SearchFilters {
  riskTierFilter: RiskTier | null
  bankingFilter: boolean
}

export type SseEvent =
  | { type: 'status'; stage: string }
  | { type: 'article'; data: ArticleHit }
  | { type: 'token'; data: string }
  | { type: 'sources'; data: ArticleSource[] }
  | { type: 'no_results' }
  | { type: 'error'; message: string }
  | { type: 'done' }
