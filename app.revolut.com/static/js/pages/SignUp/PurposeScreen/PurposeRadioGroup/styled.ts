import styled from 'styled-components'
import { Flex } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.RadioElement')

export const RadioElement = styled(Flex)`
  height: ${themeSize('height')};
  align-items: center;
  > label {
    cursor: pointer;
  }
`
