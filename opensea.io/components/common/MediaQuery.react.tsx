import { css } from "styled-components"
import { keys } from "../../lib/helpers/object"

export { css } from "styled-components"

const genericBreakpoints = {
  small: 600,
  medium: 815,
  large: 993,
  extraLarge: 1200,
  wideScreen: 1600,
} as const

const deviceBreakpoints = {
  phoneXs: 320,
  phoneS: 360,
  phoneM: 375,
  phoneL: 411,
  phoneXl: 414,
  mobile: genericBreakpoints.small,
  tabletS: 768,
  tabletL: 1024,
} as const

const semanticBreakpoints = {
  navbar: 1316,
  mobileNavbar: deviceBreakpoints.tabletL,
} as const

export const BREAKPOINTS_PX = {
  ...semanticBreakpoints,
  ...genericBreakpoints,
  ...deviceBreakpoints,
} as const

export const minWidthBreakpoint = (breakpoint: number) => {
  return `(min-width: ${breakpoint}px)`
}

export const maxWidthBreakpoint = (breakpoint: number) => {
  return `(max-width: ${breakpoint}px)`
}

type Breakpoint = keyof typeof BREAKPOINTS_PX
type Css = ReturnType<typeof css>

export const sizeMQ = (styles: { [key in Breakpoint]?: Css }): Css =>
  keys(styles)
    .sort((a, b) => BREAKPOINTS_PX[a] - BREAKPOINTS_PX[b])
    .map(
      k =>
        css`
          @media (min-width: ${BREAKPOINTS_PX[k]}px) {
            ${styles[k]}
          }
        `,
    )
    .reduce((agg, arr) => agg.concat(arr), [])
