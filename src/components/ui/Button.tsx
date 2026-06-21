import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-ui font-semibold rounded-[3px]',
        'transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-accent text-white hover:bg-accent-dim':
            variant === 'primary',
          'bg-transparent text-accent border border-accent hover:bg-accent-bg':
            variant === 'outline',
          'bg-transparent text-content-muted hover:text-content hover:bg-surface':
            variant === 'ghost',
        },
        {
          'text-[12px] tracking-[0.02em] px-[18px] py-[8px]': size === 'sm',
          'text-[13px] tracking-[0.02em] px-[22px] py-[10px]': size === 'md',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
