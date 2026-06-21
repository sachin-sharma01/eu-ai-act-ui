import { useState } from 'react'
import { RiskBadge, LabelBadge } from '@/components/ui/Badge'
import { APPLIES_TO_LABELS, OBLIGATION_LABELS } from '@/constants'
import type { ArticleSource } from '@/types'

interface Props {
  source: ArticleSource
}

export function SourceItem({ source }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-surface border border-edge-light rounded-[3px] overflow-hidden transition-[border-color] duration-150 hover:border-accent/40 animate-fade-in"
    >
      <button
        className="w-full text-left p-[12px_14px] grid grid-cols-[22px_1fr_auto] gap-x-3 gap-y-0 items-start cursor-pointer"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className="font-mono text-[11px] font-bold text-accent pt-[1px]">
          [{source.index}]
        </span>

        <div className="flex flex-col gap-[3px]">
          <span className="font-mono text-[10px] text-content-muted font-medium">
            {source.article_number}
          </span>
          <span className="font-body text-[13px] text-content leading-[1.35]">
            {source.title}
          </span>
          <div className="flex items-center gap-2 mt-[4px] flex-wrap">
            <RiskBadge tier={source.risk_tier} />
            <LabelBadge>{OBLIGATION_LABELS[source.obligation_type]}</LabelBadge>
            <LabelBadge>{APPLIES_TO_LABELS[source.applies_to]}</LabelBadge>
            <span className="font-mono text-[10px] text-content-faint">{source.page_reference}</span>
          </div>
        </div>

        <span className="font-ui text-[11px] text-content-faint pt-[1px] transition-colors hover:text-accent whitespace-nowrap">
          {expanded ? 'Close ↑' : 'Read ↓'}
        </span>
      </button>

      {expanded && (
        <div className="mx-[14px] mb-[14px] px-[12px] py-[10px] bg-ground rounded-[2px] border border-edge-light max-h-[220px] overflow-y-auto animate-fade-in">
          {source.chapter && (
            <div className="font-ui text-[10px] font-semibold tracking-[0.06em] uppercase text-content-faint mb-2">
              {source.chapter}
              {source.section ? ` · ${source.section}` : ''}
            </div>
          )}
          <p className="font-body text-[12px] leading-[1.65] text-content-muted whitespace-pre-wrap">
            {source.original_text}
          </p>
          {source.source_url && (
            <a
              href={source.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-block mt-3 font-ui text-[11px] text-accent underline decoration-accent/40 hover:decoration-accent"
            >
              View source document ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}
