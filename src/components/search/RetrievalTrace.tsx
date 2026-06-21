import { TRACE_STAGES, TRACE_STAGE_LABELS } from '@/constants'
import { TraceStep } from './TraceStep'
import { ArticleHit } from './ArticleHit'
import type { SearchState } from '@/types'

const STAGE_ORDER = TRACE_STAGES as readonly string[]

function getStepStatus(
  stage: string,
  currentStatus: SearchState['status'],
): 'pending' | 'active' | 'done' {
  const currentIdx = STAGE_ORDER.indexOf(currentStatus)
  const stageIdx = STAGE_ORDER.indexOf(stage)

  if (currentStatus === 'done' || currentStatus === 'no_results' || currentStatus === 'error') {
    return 'done'
  }
  if (currentIdx === -1) return 'pending'
  if (stageIdx < currentIdx) return 'done'
  if (stageIdx === currentIdx) return 'active'
  return 'pending'
}

interface Props {
  state: SearchState
}

export function RetrievalTrace({ state }: Props) {
  const isActive =
    state.status !== 'idle' && state.status !== 'done' && state.status !== 'error'

  return (
    <div className="bg-surface border-r border-edge-light flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-edge-light">
        <span className="font-ui text-[10px] font-bold tracking-[0.12em] uppercase text-content-muted">
          Retrieval trace
        </span>
        <div
          className={
            isActive
              ? 'w-[7px] h-[7px] rounded-full bg-accent animate-pulse-dot'
              : state.status === 'done'
              ? 'w-[7px] h-[7px] rounded-full bg-accent'
              : 'w-[7px] h-[7px] rounded-full bg-edge'
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {state.status === 'idle' ? (
          <div className="text-center px-5 pt-8">
            <div className="font-display text-[40px] opacity-20 leading-none mb-3">⌕</div>
            <p className="font-ui text-[12px] text-content-faint leading-relaxed">
              The retrieval trace will appear here as the system works.
            </p>
          </div>
        ) : (
          <>
            {/* Embedding step */}
            {(state.status === 'embedding' ||
              STAGE_ORDER.indexOf(state.status) > STAGE_ORDER.indexOf('embedding') ||
              state.status === 'done' ||
              state.status === 'no_results' ||
              state.status === 'error') && (
              <TraceStep
                stepNum="01"
                label={
                  getStepStatus('embedding', state.status) === 'done'
                    ? TRACE_STAGE_LABELS.embedding.done
                    : TRACE_STAGE_LABELS.embedding.active
                }
                meta={TRACE_STAGE_LABELS.embedding.meta}
                status={getStepStatus('embedding', state.status)}
              />
            )}

            {/* Searching step */}
            {(state.status === 'searching' ||
              STAGE_ORDER.indexOf(state.status) > STAGE_ORDER.indexOf('searching') ||
              state.status === 'done' ||
              state.status === 'no_results' ||
              state.status === 'error') &&
              state.status !== 'embedding' && (
              <TraceStep
                stepNum="02"
                label={
                  getStepStatus('searching', state.status) === 'done'
                    ? TRACE_STAGE_LABELS.searching.done
                    : TRACE_STAGE_LABELS.searching.active
                }
                meta={TRACE_STAGE_LABELS.searching.meta}
                status={getStepStatus('searching', state.status)}
              />
            )}

            {/* Articles found */}
            {state.articles.length > 0 && (
              <div className="my-1">
                <div className="px-5 mb-1">
                  <div className="font-ui text-[10px] text-content-faint border-l border-edge-light pl-3 ml-7">
                    {state.articles.length} article{state.articles.length !== 1 ? 's' : ''} retrieved
                  </div>
                </div>
                {state.articles.map(article => (
                  <ArticleHit key={article.article_number} article={article} />
                ))}
              </div>
            )}

            {/* No results */}
            {state.status === 'no_results' && (
              <div className="px-5 py-3 mx-5 mt-2 bg-white border border-edge-light rounded-[3px] animate-fade-in">
                <p className="font-ui text-[12px] text-content-muted">
                  No EU AI Act provisions matched above the similarity threshold. Try rephrasing your question.
                </p>
              </div>
            )}

            {/* Synthesising step */}
            {(state.status === 'synthesizing' || state.status === 'done') &&
              state.articles.length > 0 && (
              <TraceStep
                stepNum="03"
                label={
                  state.status === 'done'
                    ? TRACE_STAGE_LABELS.synthesizing.done
                    : TRACE_STAGE_LABELS.synthesizing.active
                }
                meta={TRACE_STAGE_LABELS.synthesizing.meta}
                status={state.status === 'done' ? 'done' : 'active'}
              />
            )}

            {/* Error */}
            {state.status === 'error' && state.error && (
              <div className="mx-5 mt-2 px-3 py-3 bg-[#F5EDEC] border border-[#C4A0A0] rounded-[3px] animate-fade-in">
                <p className="font-ui text-[12px] text-[#5C1414]">{state.error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
