import { createMedia } from "@artsy/fresnel"

const breakpoints = {
  xs: 0,
  sm: 600,
  md: 1024,
  xxl: 1600,
} as const

const MediaResult = createMedia({
  breakpoints,
})

// Make styles for injection into the header of the page
export const mediaStyles = MediaResult.createMediaStyle()

export type Breakpoint = keyof typeof breakpoints

export const getBreakpointPixelValue = (bp: Breakpoint) => {
  return breakpoints[bp]
}

export const { Media, MediaContextProvider } = MediaResult
