import type { CSSProperties } from 'react'
import type { RiskTier, ObligationType, AppliesTo, BankingRelevance } from '@/types'

export const RISK_TIER_LABELS: Record<RiskTier, string> = {
  unacceptable: 'Unacceptable',
  high: 'High risk',
  limited: 'Limited',
  minimal: 'Minimal',
  not_applicable: 'N/A',
}

export const RISK_TIER_STYLES: Record<RiskTier, CSSProperties> = {
  unacceptable: { color: '#5C1414', background: '#F5EDEC', borderColor: '#C4A0A0' },
  high:         { color: '#7A3A00', background: '#F7F0E8', borderColor: '#C4A888' },
  limited:      { color: '#3A4A5C', background: '#EEF0F5', borderColor: '#A8B4C4' },
  minimal:      { color: '#3A5040', background: '#EDF0EC', borderColor: '#A4B4A0' },
  not_applicable: { color: '#7A7670', background: '#F0EFED', borderColor: '#C4C0B8' },
}

export const OBLIGATION_LABELS: Record<ObligationType, string> = {
  prohibited: 'Prohibited',
  high_risk: 'High-risk system',
  transparency: 'Transparency',
  gpai: 'General-purpose AI',
  governance: 'Governance',
  general: 'General',
}

export const APPLIES_TO_LABELS: Record<AppliesTo, string> = {
  provider: 'Provider',
  deployer: 'Deployer',
  both: 'Provider & Deployer',
  member_state: 'Member State',
  all: 'All parties',
}

export const BANKING_RELEVANCE_LABELS: Record<BankingRelevance, string> = {
  high: 'High banking relevance',
  medium: 'Medium banking relevance',
  low: 'Low banking relevance',
  not_applicable: 'Not applicable',
}

export const RISK_TIER_FILTER_OPTIONS: Array<{ value: RiskTier; label: string }> = [
  { value: 'unacceptable', label: 'Unacceptable' },
  { value: 'high', label: 'High risk' },
  { value: 'limited', label: 'Limited' },
  { value: 'minimal', label: 'Minimal' },
]

// Ordered trace stages for the retrieval panel
export const TRACE_STAGES = ['embedding', 'searching', 'synthesizing'] as const
export type TraceStage = typeof TRACE_STAGES[number]

export const TRACE_STAGE_LABELS: Record<TraceStage, { active: string; done: string; meta: string }> = {
  embedding: {
    active: 'Generating query embedding…',
    done: 'Query embedding generated',
    meta: 'text-embedding-3-small · 1536 dims',
  },
  searching: {
    active: 'Searching 126 EU AI Act provisions…',
    done: 'Similarity search complete',
    meta: 'match_eu_ai_act · threshold 0.50',
  },
  synthesizing: {
    active: 'Synthesising answer from retrieved articles…',
    done: 'Answer synthesised',
    meta: 'claude-sonnet-4-6',
  },
}
