import styled from 'styled-components'

import { Box } from '@revolut/ui-kit'

export const SearchButtonMask = styled(Box).attrs({
  radius: 'widget',
})`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  cursor: pointer;
`

export const BoxStyled = styled(Box)`
  position: relative;
`
