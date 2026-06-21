import { useReducer, useCallback, useRef } from 'react'
import { streamSearch } from '@/lib/api'
import type { SearchState, SearchFilters, ArticleHit, ArticleSource } from '@/types'

type Action =
  | { type: 'START'; question: string }
  | { type: 'STATUS'; stage: string }
  | { type: 'ARTICLE'; article: ArticleHit }
  | { type: 'TOKEN'; text: string }
  | { type: 'SOURCES'; sources: ArticleSource[] }
  | { type: 'NO_RESULTS' }
  | { type: 'DONE' }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }

const initial: SearchState = {
  status: 'idle',
  question: '',
  articles: [],
  answer: '',
  sources: [],
  error: null,
}

function reducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'START':
      return { ...initial, status: 'embedding', question: action.question }
    case 'STATUS':
      return { ...state, status: action.stage as SearchState['status'] }
    case 'ARTICLE':
      return { ...state, articles: [...state.articles, action.article] }
    case 'TOKEN':
      return { ...state, answer: state.answer + action.text }
    case 'SOURCES':
      return { ...state, sources: action.sources }
    case 'NO_RESULTS':
      return { ...state, status: 'no_results' }
    case 'DONE':
      return { ...state, status: 'done' }
    case 'ERROR':
      return { ...state, status: 'error', error: action.message }
    case 'RESET':
      return initial
    default:
      return state
  }
}

export function useSearch() {
  const [state, dispatch] = useReducer(reducer, initial)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (question: string, filters: SearchFilters) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    dispatch({ type: 'START', question })

    try {
      for await (const event of streamSearch(question, filters, abortRef.current.signal)) {
        switch (event.type) {
          case 'status':
            dispatch({ type: 'STATUS', stage: event.stage })
            break
          case 'article':
            dispatch({ type: 'ARTICLE', article: event.data })
            break
          case 'token':
            dispatch({ type: 'TOKEN', text: event.data })
            break
          case 'sources':
            dispatch({ type: 'SOURCES', sources: event.data })
            break
          case 'no_results':
            dispatch({ type: 'NO_RESULTS' })
            break
          case 'done':
            dispatch({ type: 'DONE' })
            break
          case 'error':
            dispatch({ type: 'ERROR', message: event.message })
            break
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      dispatch({
        type: 'ERROR',
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
      })
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    dispatch({ type: 'RESET' })
  }, [])

  return { state, search, reset }
}
