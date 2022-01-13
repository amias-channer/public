import styled from 'styled-components'

import { themeColor, ThemeProps } from '@revolut/rwa-core-styles'

export const IconBase = styled.svg`
  color: ${(props) => themeColor(props.color as keyof ThemeProps['colors']) ?? 'primary'};
`
