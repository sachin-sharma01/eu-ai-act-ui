import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { RISK_TIER_LABELS, RISK_TIER_STYLES } from '@/constants'
import type { RiskTier } from '@/types'

interface RiskBadgeProps {
  tier: RiskTier
  className?: string
}

export function RiskBadge({ tier, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-ui text-[10px] font-semibold tracking-[0.05em] uppercase',
        'px-[7px] py-[2px] rounded-[2px] border whitespace-nowrap',
        className,
      )}
      style={RISK_TIER_STYLES[tier]}
    >
      {RISK_TIER_LABELS[tier]}
    </span>
  )
}

interface LabelBadgeProps {
  children: ReactNode
  className?: string
}

export function LabelBadge({ children, className }: LabelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-ui text-[10px] font-medium tracking-[0.04em]',
        'px-[7px] py-[2px] rounded-[2px] border',
        'text-content-muted bg-surface border-edge-light',
        className,
      )}
    >
      {children}
    </span>
  )
}
