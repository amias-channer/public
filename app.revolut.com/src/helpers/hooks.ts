import * as React from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const prevCountRef = React.useRef()
  React.useEffect(() => {
    prevCountRef.current = value as any
  })
  return prevCountRef.current
}
