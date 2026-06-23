import type { LexlyState } from '@/hooks/useLexly'

// Lexly palette — warm amber-sand, advisory register, distinct from the accent green
const LEXLY = {
  bg:           '#FAF6EE',
  border:       '#B08A40',
  headerBg:     '#F2E8D0',
  badgeText:    '#7A5A10',
  badgeBorder:  '#C9A84C',
  bodyText:     '#2A2318',
  mutedText:    '#8A7A58',
}

interface Props {
  state: LexlyState
}

function parseParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter(Boolean)
}

export function LexlyResponse({ state }: Props) {
  const { status, text, error } = state
  const isStreaming = status === 'streaming'
  const isLoading = status === 'loading'

  return (
    <div
      className="mx-0 animate-fade-in"
      style={{
        borderLeft: `3px solid ${LEXLY.border}`,
        background: LEXLY.bg,
      }}
    >
      {/* Persistent header — always visible at top of Lexly block */}
      <div
        className="flex items-center justify-between px-7 py-3 border-b"
        style={{ background: LEXLY.headerBg, borderColor: LEXLY.badgeBorder + '60' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-ui text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color: LEXLY.badgeText }}
          >
            Lexly
          </span>
          <span
            className="font-ui text-[10px] font-semibold tracking-[0.06em] uppercase px-[7px] py-[2px] rounded-[2px] border"
            style={{
              color: LEXLY.badgeText,
              borderColor: LEXLY.badgeBorder,
              background: LEXLY.bg,
            }}
          >
            Interpretation — Not Legal Advice
          </span>
        </div>
        {(isStreaming || isLoading) && (
          <div className="flex items-center gap-[3px]">
            <span
              className="w-[4px] h-[4px] rounded-full animate-dot-bounce inline-block"
              style={{ background: LEXLY.border }}
            />
            <span
              className="w-[4px] h-[4px] rounded-full animate-dot-bounce inline-block"
              style={{ background: LEXLY.border, animationDelay: '0.2s' }}
            />
            <span
              className="w-[4px] h-[4px] rounded-full animate-dot-bounce inline-block"
              style={{ background: LEXLY.border, animationDelay: '0.4s' }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-7 py-5">
        {error ? (
          <p
            className="font-ui text-[13px]"
            style={{ color: '#5C1414' }}
          >
            {error}
          </p>
        ) : isLoading && !text ? (
          <p
            className="font-body italic text-[14px] leading-relaxed animate-fade-in"
            style={{ color: LEXLY.mutedText }}
          >
            Thinking through the practical implications…
          </p>
        ) : (
          <div
            className="font-body text-[15px] leading-[1.72]"
            style={{ color: LEXLY.bodyText }}
          >
            {parseParagraphs(text).map((para, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {para}
              </p>
            ))}
            {isStreaming && (
              <span
                className="inline-block w-[2px] h-[16px] ml-[1px] align-middle animate-pulse"
                style={{ background: LEXLY.border }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
