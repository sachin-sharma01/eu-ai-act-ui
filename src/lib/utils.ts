import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(similarity: number): string {
  return `${(similarity * 100).toFixed(1)}%`
}

export function scoreBarWidth(similarity: number): string {
  return `${Math.round(similarity * 100)}%`
}
