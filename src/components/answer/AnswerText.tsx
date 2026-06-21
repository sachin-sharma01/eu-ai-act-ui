import type { ReactNode } from 'react'

interface Props {
  text: string
  isStreaming: boolean
}

function parseParagraphs(text: string) {
  return text.split(/\n\n+/).filter(Boolean)
}

function parseCitations(para: string): ReactNode[] {
  const parts = para.split(/(\[\d+\])/g)
  return parts.map((part, i) => {
    if (/^\[\d+\]$/.test(part)) {
      return (
        <sup
          key={i}
          className="font-mono text-[10px] font-semibold text-accent bg-accent-bg px-[4px] py-[1px] rounded-[2px] mx-[1px] not-italic"
        >
          {part}
        </sup>
      )
    }
    return part
  })
}

export function AnswerText({ text, isStreaming }: Props) {
  const paragraphs = parseParagraphs(text)

  return (
    <div className="font-body text-[15px] leading-[1.72] text-content animate-fade-in">
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {parseCitations(para)}
        </p>
      ))}
      {isStreaming && (
        <span className="inline-block w-[2px] h-[16px] bg-accent ml-[1px] align-middle animate-pulse" />
      )}
    </div>
  )
}
