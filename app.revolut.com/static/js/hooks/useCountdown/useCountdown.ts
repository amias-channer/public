import format from 'date-fns/format'
import { useCallback, useEffect, useRef, useState } from 'react'

const ONE_SECOND = 1000
const TIME_BUFFER = 100

const getEndTime = (secondsAmount: number) =>
  Date.now() + ONE_SECOND * secondsAmount + TIME_BUFFER

const formatDate = (date: number) => format(date, 'mm:ss')

type UseCountdownReturn = {
  timeLeft: string
  restartCountdown: (newSecondsAmount?: number) => void
  isFinished: boolean
}

export const useCountdown = (initialSecondsAmount: number = 60): UseCountdownReturn => {
  const [endTime, setInitialTime] = useState<number>(getEndTime(initialSecondsAmount))
  const [timeLeft, setTimeLeft] = useState<string>(formatDate(endTime - Date.now()))
  const descriptionInterval = useRef<number>()

  const handleTimeChange = useCallback(() => {
    const timeDifference = Math.max(endTime - Date.now(), 0)

    if (timeDifference < ONE_SECOND) {
      clearInterval(descriptionInterval.current)
    }

    setTimeLeft(formatDate(timeDifference))
  }, [endTime, setTimeLeft])

  useEffect(() => {
    // FIXME: Rush migration
    // @ts-expect-error
    descriptionInterval.current = setInterval(handleTimeChange, ONE_SECOND)

    return () => {
      clearInterval(descriptionInterval.current)
    }
  }, [handleTimeChange])

  const restartCountdown = useCallback(
    (newSecondsAmount?: number) => {
      const newEndTime = getEndTime(newSecondsAmount ?? initialSecondsAmount)
      setInitialTime(newEndTime)
      setTimeLeft(formatDate(newEndTime - Date.now()))
    },
    [initialSecondsAmount],
  )

  return {
    timeLeft,
    restartCountdown,
    isFinished: endTime - Date.now() < ONE_SECOND,
  }
}
