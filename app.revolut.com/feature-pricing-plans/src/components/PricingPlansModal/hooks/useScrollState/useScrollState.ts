import { useCallback, useState } from 'react'

type ScrollOptions = {
  offsetIn: number
  offsetOut: number
}
export const useScrollState = ({ offsetIn, offsetOut }: ScrollOptions) => {
  const [isScrolled, setScrolled] = useState(false)

  const handlePosition = useCallback(
    (position: number) => {
      if (position >= offsetIn) {
        setScrolled(true)
      } else if (position <= offsetOut) {
        setScrolled(false)
      }
    },
    [offsetIn, offsetOut],
  )

  return [isScrolled, handlePosition] as const
}
