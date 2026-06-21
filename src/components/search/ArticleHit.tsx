import { RiskBadge } from '@/components/ui/Badge'
import { formatScore, scoreBarWidth } from '@/lib/utils'
import type { ArticleHit as ArticleHitType } from '@/types'

interface Props {
  article: ArticleHitType
}

export function ArticleHit({ article }: Props) {
  return (
    <div className="mx-5 my-1 p-[10px_12px] bg-white border border-edge-light rounded-[3px] animate-fade-in-up">
      <div className="font-mono text-[10px] text-accent font-semibold mb-[2px]">
        {article.article_number}
      </div>
      <div className="font-ui text-[11px] text-content font-medium leading-[1.3] mb-[6px]">
        {article.title}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-[6px]">
          <div className="w-[60px] h-[3px] bg-edge rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-[width] duration-700"
              style={{ width: scoreBarWidth(article.similarity) }}
            />
          </div>
          <span className="font-mono text-[10px] text-content-muted">
            {formatScore(article.similarity)}
          </span>
        </div>
        <RiskBadge tier={article.risk_tier} />
      </div>
    </div>
  )
}
