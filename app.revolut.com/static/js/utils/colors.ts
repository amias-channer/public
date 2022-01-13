import { COLORS } from '@revolut/ui-kit'

export const SECONDARY_COLORS = {
  BROWN: '#C28231',
  RED: '#E8614F',
  TERRAKOTTA: '#EF7240',
  ORANGE: '#EF8F1A',
  YELLOW: '#FBC70A',
  LIME: '#CBDD00',
  LIGHT_GREEN: '#7CD120',
  GREEN: '#59C045',
  TEAL: '#15D18D',
  CYAN: '#0CCFCF',
  SKY: '#1EA2E4',
  INDIGO: '#6262D3',
  DEEP_PURPLE: '#805CF5',
  PURPLE: '#C054D3',
  PINK: '#E950A4',
  DEEP_GREY: '#6A8CAD',
}

/**
 * The algorithm is described here and it's common among all platforms - iOS, Android, Web.
 * @see https://www.figma.com/file/6GIS8z85bc1T1W47r0mHik/Avatar-colors-WIP?node-id=15%3A2406
 */
function hash(input: string, arraySize: number, base = 59): number {
  return input
    .split('')
    .reduce((acc, char) => (acc * base + char.charCodeAt(0)) % arraySize, 0)
}

const colors = [
  SECONDARY_COLORS.BROWN,
  SECONDARY_COLORS.RED,
  SECONDARY_COLORS.TERRAKOTTA,
  SECONDARY_COLORS.ORANGE,
  SECONDARY_COLORS.LIME,
  SECONDARY_COLORS.LIGHT_GREEN,
  SECONDARY_COLORS.TEAL,
  SECONDARY_COLORS.CYAN,
  SECONDARY_COLORS.SKY,
  SECONDARY_COLORS.INDIGO,
  SECONDARY_COLORS.DEEP_PURPLE,
  SECONDARY_COLORS.PURPLE,
  SECONDARY_COLORS.PINK,
]

export function generateColorFromString(input?: string) {
  if (!input) {
    return COLORS['grey-100']
  }
  return colors[hash(input, colors.length)]
}
