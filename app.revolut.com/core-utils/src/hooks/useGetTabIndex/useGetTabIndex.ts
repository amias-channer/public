import { useRef, useCallback } from 'react'

export const useGetTabIndex = (initialValue: number) => {
  const values = useRef<{ [name: string]: number }>({})
  const counter = useRef(initialValue)

  return useCallback(
    (name: string) => {
      if (values.current[name]) {
        return values.current[name]
      }

      counter.current += 1
      values.current[name] = counter.current

      return counter.current
    },
    [counter, values],
  )
}
