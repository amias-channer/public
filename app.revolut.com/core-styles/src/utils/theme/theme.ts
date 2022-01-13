import { theme } from 'styled-tools'
import { COLORS as UI_KIT_COLORS } from '@revolut/ui-kit'

import type { ThemeProps } from '../../types'

export const themeColor = (
  colorName: keyof ThemeProps['colors'] | keyof typeof UI_KIT_COLORS,
) => theme(`colors.${String(colorName)}`)

export const themeFont = (fontName: keyof ThemeProps['fonts']) =>
  theme(`fonts.${fontName}`)

export const themeFontSize = (sizeName: keyof ThemeProps['fontSizes']) =>
  theme(`fontSizes.${sizeName}`)

export const themeFontWeight = (fontWeightName: keyof ThemeProps['fontWeights']) =>
  theme(`fontWeights.${fontWeightName}`)

export const themeLineHeight = (sizeName: keyof ThemeProps['lineHeights']) =>
  theme(`lineHeights.${sizeName}`)

export const themeRadius = (radiusName: keyof ThemeProps['radii']) =>
  theme(`radii.${radiusName}`)

export const themeSize = (path: string) => theme<string>(`sizes.${path}`)

export const themeSpace = (spaceName: keyof ThemeProps['space']) =>
  theme(`space.${spaceName}`)

export const themeZIndex = (indexName: keyof ThemeProps['zIndices']) =>
  theme(`zIndices.${indexName}`)

export const themeNamespace = (namespace: string) => ({
  themeSize: (path: string) => themeSize(`${namespace}.${path}`),
})
