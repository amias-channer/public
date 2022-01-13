import styled from 'styled-components'
import { Relative, Badge } from '@revolut/ui-kit'
import { themeGet } from '@styled-system/theme-get'

export const RoundBullet = styled(Badge)`
  display: flex;
  padding: 0;
  box-sizing: content-box;
  border: 2px solid ${themeGet('colors.white')};
`

export const Anchor = styled(Relative)`
  display: flex;
  width: fit-content;
  height: fit-content;
`
