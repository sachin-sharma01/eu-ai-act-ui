import { useReducer, useCallback, useRef } from 'react'
import { streamLexly } from '@/lib/api'
import type { LexlyParams } from '@/lib/api'

export type LexlyStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export interface LexlyState {
  status: LexlyStatus
  text: string
  error: string | null
}

type Action =
  | { type: 'START' }
  | { type: 'TOKEN'; text: string }
  | { type: 'DONE' }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }

const initial: LexlyState = { status: 'idle', text: '', error: null }

function reducer(state: LexlyState, action: Action): LexlyState {
  switch (action.type) {
    case 'START':  return { status: 'loading', text: '', error: null }
    case 'TOKEN':  return { ...state, status: 'streaming', text: state.text + action.text }
    case 'DONE':   return { ...state, status: 'done' }
    case 'ERROR':  return { status: 'error', text: '', error: action.message }
    case 'RESET':  return initial
    default:       return state
  }
}

export function useLexly() {
  const [state, dispatch] = useReducer(reducer, initial)
  const abortRef = useRef<AbortController | null>(null)

  const invoke = useCallback(async (params: LexlyParams) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    dispatch({ type: 'START' })

    try {
      for await (const event of streamLexly(params, abortRef.current.signal)) {
        switch (event.type) {
          case 'token': dispatch({ type: 'TOKEN', text: event.data }); break
          case 'done':  dispatch({ type: 'DONE' }); break
          case 'error': dispatch({ type: 'ERROR', message: event.message }); break
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

  return { state, invoke, reset }
}
