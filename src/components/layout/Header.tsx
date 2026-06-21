export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-ground border-b border-edge flex items-center justify-between px-9 py-[18px]">
      <div className="flex items-baseline gap-[10px]">
        <span className="font-display text-[20px] font-normal tracking-[-0.02em] text-content">
          Lex AI
        </span>
        <span className="font-ui text-[11px] font-semibold tracking-[0.08em] uppercase text-content-muted border border-edge rounded-[2px] px-[7px] py-[2px]">
          EU AI Act · Reg. 2024/1689
        </span>
      </div>
      <div className="font-ui text-[12px] text-content-faint tracking-[0.02em]">
        113 Articles · 13 Annexes · 126 provisions indexed
      </div>
    </header>
  )
}
