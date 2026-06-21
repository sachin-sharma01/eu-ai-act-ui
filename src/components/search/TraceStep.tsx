import { cn } from '@/lib/utils'

interface Props {
  stepNum: string
  label: string
  meta?: string
  status: 'pending' | 'active' | 'done'
}

export function TraceStep({ stepNum, label, meta, status }: Props) {
  return (
    <div className="flex items-start gap-0 px-5 mb-[2px] animate-fade-in-up">
      <div className="font-mono text-[10px] text-content-faint min-w-[28px] pt-[2px] flex-shrink-0">
        {stepNum}
      </div>
      <div
        className={cn(
          'flex-1 py-[6px] pl-3 border-l border-edge-light',
          'transition-colors duration-300',
        )}
      >
        <div
          className={cn(
            'font-ui text-[12px] leading-[1.4] transition-colors duration-300',
            status === 'active' && 'text-content font-medium',
            status === 'done' && 'text-content',
            status === 'pending' && 'text-content-muted',
          )}
        >
          {label}
          {status === 'active' && (
            <span className="inline-flex items-center gap-[3px] ml-2">
              <span className="w-[4px] h-[4px] rounded-full bg-accent animate-dot-bounce inline-block" />
              <span
                className="w-[4px] h-[4px] rounded-full bg-accent animate-dot-bounce inline-block"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-[4px] h-[4px] rounded-full bg-accent animate-dot-bounce inline-block"
                style={{ animationDelay: '0.4s' }}
              />
            </span>
          )}
          {status === 'done' && (
            <span className="inline-block ml-2 text-accent text-[10px] font-mono">✓</span>
          )}
        </div>
        {meta && status !== 'pending' && (
          <div className="font-mono text-[10px] text-content-faint mt-[2px]">{meta}</div>
        )}
      </div>
    </div>
  )
}
