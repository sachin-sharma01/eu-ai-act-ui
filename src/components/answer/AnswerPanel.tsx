import { AnswerText } from './AnswerText'
import { SourcesList } from './SourcesList'
import type { SearchState } from '@/types'

interface Props {
  state: SearchState
}

export function AnswerPanel({ state }: Props) {
  const { status, question, answer, sources } = state
  const isSearching = status === 'embedding' || status === 'searching'
  const isSynthesizing = status === 'synthesizing'
  const isDone = status === 'done'
  const hasAnswer = answer.length > 0

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-edge-light flex-shrink-0">
        <span className="font-ui text-[10px] font-bold tracking-[0.12em] uppercase text-content-muted">
          Answer
        </span>
        {question && (
          <span className="font-body text-[12px] text-content-faint italic max-w-[400px] truncate">
            {question}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {status === 'idle' ? (
          <div className="text-center px-6 pt-12 pb-6">
            <div className="font-display text-[40px] opacity-20 leading-none mb-3">§</div>
            <p className="font-ui text-[13px] text-content-faint leading-relaxed max-w-[320px] mx-auto">
              Your answer will draw exclusively from the EU AI Act (Regulation 2024/1689).
              No other regulations or legal frameworks are referenced.
            </p>
          </div>
        ) : isSearching ? (
          <div className="px-7 pt-10 pb-6 animate-fade-in">
            <p className="font-body italic text-[14px] text-content-faint leading-relaxed">
              Searching the EU AI Act for:{' '}
              <span className="text-content not-italic">"{question}"</span>
            </p>
          </div>
        ) : (
          <div className="px-7 pt-6 pb-6">
            {(isSynthesizing || hasAnswer) && (
              <AnswerText
                text={answer}
                isStreaming={isSynthesizing}
              />
            )}
            {isSynthesizing && !hasAnswer && (
              <div className="flex items-center gap-2 mt-2 animate-fade-in">
                <span
                  className="w-[5px] h-[5px] rounded-full bg-accent animate-dot-bounce inline-block"
                />
                <span
                  className="w-[5px] h-[5px] rounded-full bg-accent animate-dot-bounce inline-block"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-[5px] h-[5px] rounded-full bg-accent animate-dot-bounce inline-block"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="font-ui text-[12px] text-content-muted italic ml-1">
                  Synthesising answer from EU AI Act articles…
                </span>
              </div>
            )}
            {status === 'no_results' && (
              <div className="animate-fade-in">
                <p className="font-body text-[15px] text-content-muted leading-[1.7]">
                  No provisions in the EU AI Act matched your question above the relevance threshold.
                  Try rephrasing, or broaden your query.
                </p>
              </div>
            )}
            {status === 'error' && state.error && (
              <div className="p-[12px_14px] bg-[#F5EDEC] border border-[#C4A0A0] rounded-[3px] animate-fade-in">
                <p className="font-ui text-[13px] text-[#5C1414]">{state.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sources */}
      {isDone && sources.length > 0 && <SourcesList sources={sources} />}
    </div>
  )
}
