import { useSearch } from '@/hooks/useSearch'
import { SearchInput } from '@/components/search/SearchInput'
import { RetrievalTrace } from '@/components/search/RetrievalTrace'
import { AnswerPanel } from '@/components/answer/AnswerPanel'
import type { SearchFilters } from '@/types'

export function SearchPage() {
  const { state, search, reset } = useSearch()
  const hasSearched = state.status !== 'idle'
  const isSearching =
    state.status === 'embedding' ||
    state.status === 'searching' ||
    state.status === 'synthesizing'

  const handleSearch = (question: string, filters: SearchFilters) => {
    search(question, filters)
  }

  return (
    <div className="flex flex-col">
      {/* ── Search hero ──────────────────────────────────── */}
      <section className="pt-12 pb-8">
        <p className="font-ui text-[11px] font-semibold tracking-[0.1em] uppercase text-accent mb-[14px]">
          EU AI Act · Regulation 2024/1689
        </p>
        <h1 className="font-display text-[36px] font-normal leading-[1.15] tracking-[-0.02em] text-content mb-4 max-w-[640px]">
          Ask the EU AI Act. Get cited, article-level answers.
        </h1>
        <p className="font-ui text-[14px] text-content-muted leading-relaxed max-w-[580px] mb-7">
          Answers draw exclusively from Regulation (EU) 2024/1689 — not from GDPR, NIS2,
          DORA, or any other framework.
        </p>

        <SearchInput
          onSearch={handleSearch}
          isSearching={isSearching}
          onReset={reset}
          hasResults={hasSearched}
        />
      </section>

      {/* ── Two-column workspace ─────────────────────────── */}
      {hasSearched && (
        <div className="animate-fade-in-up border border-edge rounded-[4px] overflow-hidden grid grid-cols-[320px_1fr] min-h-[520px]">
          <RetrievalTrace state={state} />
          <AnswerPanel state={state} />
        </div>
      )}
    </div>
  )
}
