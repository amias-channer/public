import React, { useState, useEffect } from 'react'
import { Flex, Box } from '@revolut/ui-kit'

const DEFAULT_INTERVAL_MS = 5000
const HEART_BEAT_MS = 200

type Props = {
  interval?: number
  onElapsed: () => void
}

export const BannerTimer = ({
  interval = DEFAULT_INTERVAL_MS,
  onElapsed,
}: Props) => {
  const [isActive, setIsActive] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) {
      return
    }

    let timeoutId: number | null = null

    if (timeElapsed < interval) {
      timeoutId = setTimeout(() => {
        setTimeElapsed(timeElapsed + HEART_BEAT_MS)
      }, HEART_BEAT_MS)
    } else if (timeElapsed > interval) {
      setTimeElapsed(interval)
    } else {
      setIsActive(false)
      onElapsed()
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [isActive, timeElapsed, interval, onElapsed])

  return (
    <Flex width='100%' justifyContent='center'>
      <Box width={40} height={4} bg='grey-100' radius={9}>
        <Box
          width={`${(timeElapsed / interval) * 100}%`}
          height={4}
          bg='grey-90'
          radius={9}
        />
      </Box>
    </Flex>
  )
}
