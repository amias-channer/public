import { map, mapValues, join, values, parseInt } from 'lodash'
import { css, Interpolation } from 'styled-components'

import { theme } from '../theme'
import { Media, Queries, Query } from './types'

const { breakpoints: themeBreakpoints } = theme

const mobileInt = parseInt(themeBreakpoints.mobile)
const tabletInt = parseInt(themeBreakpoints.tablet)

const queries: Queries = {
  mobile: {
    'max-width': `${mobileInt - 1}px`,
  },
  tablet: {
    'min-width': themeBreakpoints.mobile,
    'max-width': `${tabletInt - 1}px`,
  },
  tabletMax: {
    'max-width': `${tabletInt - 1}px`,
  },
  desktop: {
    'min-width': themeBreakpoints.tablet,
  },
}

const getMediaQuery = (breakpoint: Query) =>
  `(${join(values(map(breakpoint, (value, key) => `${key}: ${value}`)), ') and (')})`

export const media: Media = mapValues(queries, (breakpoint: Query) => {
  const query = getMediaQuery(breakpoint)

  return (
    cssTemplate: TemplateStringsArray,
    ...interpolations: Interpolation<any>[]
  ) => css`
    @media ${query} {
      ${css(cssTemplate, ...interpolations)};
    }
  `
})
