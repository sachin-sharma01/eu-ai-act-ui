import type { ReactNode } from 'react'
import { Header } from './Header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-ground text-content flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-9 pb-12">
        {children}
      </main>
    </div>
  )
}
