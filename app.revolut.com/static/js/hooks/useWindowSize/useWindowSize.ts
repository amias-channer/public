import debounce from 'lodash/debounce'
import { useLayoutEffect, useState } from 'react'

const DEBOUNCE_TIMEOUT_MS = 10

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0])

  useLayoutEffect(() => {
    const updateSize = debounce(function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }, DEBOUNCE_TIMEOUT_MS)

    window.addEventListener('resize', updateSize)

    updateSize()

    return () => {
      updateSize.cancel()

      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return { width: size[0], height: size[1] }
}
