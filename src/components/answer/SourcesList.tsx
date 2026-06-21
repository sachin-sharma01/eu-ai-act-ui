import { SourceItem } from './SourceItem'
import type { ArticleSource } from '@/types'

interface Props {
  sources: ArticleSource[]
}

export function SourcesList({ sources }: Props) {
  if (sources.length === 0) return null

  return (
    <div className="border-t border-edge-light animate-fade-in">
      <div className="flex items-center justify-between px-7 py-[14px] border-b border-edge-light">
        <span className="font-ui text-[10px] font-bold tracking-[0.12em] uppercase text-content-muted">
          Sources
        </span>
        <span className="font-mono text-[11px] text-content-faint">
          {sources.length} article{sources.length !== 1 ? 's' : ''} cited
        </span>
      </div>
      <div className="p-[12px_20px] flex flex-col gap-[6px]">
        {sources.map(source => (
          <SourceItem key={source.article_number} source={source} />
        ))}
      </div>
    </div>
  )
}
