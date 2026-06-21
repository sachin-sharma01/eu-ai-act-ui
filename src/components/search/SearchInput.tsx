import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { RISK_TIER_FILTER_OPTIONS } from '@/constants'
import type { SearchFilters, RiskTier } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  onSearch: (question: string, filters: SearchFilters) => void
  isSearching: boolean
  onReset?: () => void
  hasResults: boolean
}

export function SearchInput({ onSearch, isSearching, onReset, hasResults }: Props) {
  const [question, setQuestion] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    riskTierFilter: null,
    bankingFilter: false,
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !isSearching) {
      onSearch(question.trim(), filters)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRiskTier = (tier: RiskTier) => {
    setFilters(f => ({
      ...f,
      riskTierFilter: f.riskTierFilter === tier ? null : tier,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div
        className={cn(
          'flex bg-white border-[1.5px] border-edge rounded-[4px] overflow-hidden max-w-[760px]',
          'transition-[border-color,box-shadow] duration-150',
          'focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(45,90,61,0.08)]',
        )}
      >
        <textarea
          ref={textareaRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. What are the requirements for a risk management system under the EU AI Act?"
          rows={2}
          disabled={isSearching}
          className={cn(
            'flex-1 resize-none border-none outline-none bg-transparent',
            'font-body text-[15px] leading-[1.55] text-content',
            'px-5 py-4 placeholder:text-content-faint',
            'disabled:opacity-60',
          )}
        />
        <div className="flex items-end p-[10px] gap-2">
          {hasResults && onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-content-faint"
            >
              Clear
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!question.trim() || isSearching}
          >
            {isSearching ? 'Searching…' : 'Ask'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-[10px] flex-wrap max-w-[760px]">
        <span className="font-ui text-[11px] font-semibold tracking-[0.07em] uppercase text-content-faint mr-1">
          Filter:
        </span>
        {RISK_TIER_FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleRiskTier(opt.value)}
            className={cn(
              'px-[10px] py-1 border rounded-[2px] font-ui text-[12px] cursor-pointer',
              'transition-all duration-100',
              filters.riskTierFilter === opt.value
                ? 'border-accent text-accent bg-accent-bg'
                : 'border-edge text-content-muted bg-white hover:border-accent hover:text-accent hover:bg-accent-bg',
            )}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFilters(f => ({ ...f, bankingFilter: !f.bankingFilter }))}
          className={cn(
            'px-[10px] py-1 border rounded-[2px] font-ui text-[12px] cursor-pointer',
            'transition-all duration-100',
            filters.bankingFilter
              ? 'border-accent text-accent bg-accent-bg'
              : 'border-edge text-content-muted bg-white hover:border-accent hover:text-accent hover:bg-accent-bg',
          )}
        >
          Banking relevance
        </button>
      </div>
    </form>
  )
}
