import { useEffect, useState } from 'react'

export const useAwaitForFetching = (isFetching: boolean) => {
  const [isAwaitingForFetch, setAwaitingForFetch] = useState(true)

  useEffect(() => {
    if (isFetching) {
      setAwaitingForFetch(false)
    }
  }, [isFetching])

  return isAwaitingForFetch
}
