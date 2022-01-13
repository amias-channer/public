// w/a for typescript issue https://github.com/microsoft/TypeScript/issues/29808
// https://github.com/microsoft/TypeScript/issues/36800
import type {} from 'csstype'
import { TLengthStyledSystem, ResponsiveValue } from 'styled-system'
import { CompatTheme, DefaultTheme, Color, Radius, px } from '@revolut/ui-kit'

type TableVariant = 'default' | 'outlined'

type TableStyles = {
  [K in TableVariant]: {
    borderColor: TLengthStyledSystem
    backgroundColor: TLengthStyledSystem
    headerColor: TLengthStyledSystem
    cellColor: TLengthStyledSystem
    primeColor: TLengthStyledSystem
    radius: ResponsiveValue<string | number>
    bodyPy: ResponsiveValue<string | number>
    headerPx: ResponsiveValue<string | number>
    rowPx: ResponsiveValue<string | number>
    rowHeight: ResponsiveValue<string | number>
  }
}

const defaultTableStyle = {
  borderColor: 'transparent',
  backgroundColor: DefaultTheme.colors[Color.WHITE],
  headerColor: DefaultTheme.colors[Color.GREY_50],
  cellColor: DefaultTheme.colors[Color.GREY_35],
  primeColor: DefaultTheme.colors[Color.BLACK],
  radius: DefaultTheme.radii[Radius.CARD],
  bodyPy: 1,
  headerPx: { all: 2, md: 3 },
  rowPx: { all: 2, md: 3 },
  rowHeight: { all: '5rem', md: '4.5rem' },
}

const tableStyles: TableStyles = {
  default: defaultTableStyle,
  outlined: {
    ...defaultTableStyle,
    borderColor: DefaultTheme.colors[Color.GREY_100],
  },
}

export const FaceliftTheme = {
  ...CompatTheme,
  circleButtonStyles: {
    transparent: {
      color: Color.WHITE,
      backgroundColor: 'transparent',
      borderColor: Color.WHITE,
      borderWidth: 1,
    },
  },
  tableStyles,
  pageStyles: {
    default: {
      color: DefaultTheme.colors[Color.BLACK],
      backgroundColor: DefaultTheme.colors[Color.WHITE],
    },
    primary: {
      color: DefaultTheme.colors[Color.BLACK],
      backgroundColor: DefaultTheme.colors[Color.GREY_100],
    },
  },
  bannerStyles: {
    sm: {
      border: `1px solid ${DefaultTheme.colors['grey-90']}`,
      color: DefaultTheme.colors[Color.BLACK],
      backgroundColor: DefaultTheme.colors[Color.WHITE],
    },
    md: {
      color: DefaultTheme.colors[Color.BLACK],
      backgroundColor: DefaultTheme.colors[Color.WHITE],
    },
    lg: {
      color: DefaultTheme.colors[Color.BLACK],
      backgroundColor: DefaultTheme.colors[Color.WHITE],
    },
  },
  borders: {
    'card-outline': `1px solid ${DefaultTheme.colors['grey-90']}`,
  },
  breakpoints: Object.assign([px(400), px(720), px(1024), px(1280), px(1920)], {
    all: null,
    sm: px(400),
    md: px(720),
    lg: px(1024),
    xl: px(1280),
    xxl: px(1920),
  }),
}
