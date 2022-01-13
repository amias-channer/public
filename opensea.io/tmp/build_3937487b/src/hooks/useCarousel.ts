import { useMedia } from "react-use"
import {
  BREAKPOINTS_PX,
  maxWidthBreakpoint,
  minWidthBreakpoint,
} from "../components/common/MediaQuery.react"

export const useCarousel = () => {
  const isLarge = useMedia(minWidthBreakpoint(BREAKPOINTS_PX.extraLarge), true)
  const isSmall = useMedia(maxWidthBreakpoint(BREAKPOINTS_PX.medium), false)

  const slidesToShow = isSmall ? 1 : isLarge ? 3 : 2
  const showArrows = !isSmall

  return { slidesToShow, showArrows }
}
