import styled from 'styled-components'

import { themeSize } from '@revolut/rwa-core-styles'

import { THEME_ILLUSTRATION_SIZE_KEY } from './constants'

export const AssetImage = styled.img`
  display: block;

  height: ${themeSize(THEME_ILLUSTRATION_SIZE_KEY)};
`
