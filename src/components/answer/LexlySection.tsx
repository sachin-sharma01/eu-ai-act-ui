import { useLexly } from '@/hooks/useLexly'
import { LexlyResponse } from './LexlyResponse'
import type { ArticleSource } from '@/types'

interface Props {
  question: string
  ragAnswer: string
  sources: ArticleSource[]
}

export function LexlySection({ question, ragAnswer, sources }: Props) {
  const { state, invoke, reset } = useLexly()
  const isIdle = state.status === 'idle'

  const handleInvoke = () => {
    invoke({
      question,
      ragAnswer,
      sources: sources.map(s => ({
        article_number: s.article_number,
        title: s.title,
        risk_tier: s.risk_tier,
      })),
    })
  }

  return (
    <div className="border-t border-edge-light">
      {isIdle ? (
        /* Trigger area */
        <div className="px-7 py-5 flex items-center justify-between gap-4">
          <p className="font-ui text-[13px] text-content-muted">
            Want a practical take on this?
          </p>
          <button
            onClick={handleInvoke}
            className="flex-shrink-0 font-ui text-[12px] font-semibold tracking-[0.02em] px-4 py-2 rounded-[3px] border cursor-pointer transition-all duration-150"
            style={{
              color: '#7A5A10',
              borderColor: '#C9A84C',
              background: '#FAF6EE',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F2E8D0'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FAF6EE'
            }}
          >
            Ask Lexly to interpret this
          </button>
        </div>
      ) : (
        /* Response area */
        <div>
          <LexlyResponse state={state} />
          {/* Allow re-running after done/error */}
          {(state.status === 'done' || state.status === 'error') && (
            <div className="px-7 py-3 flex justify-end border-t border-edge-light bg-surface">
              <button
                onClick={reset}
                className="font-ui text-[11px] text-content-faint hover:text-content-muted transition-colors cursor-pointer bg-transparent border-none"
              >
                Clear Lexly interpretation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
