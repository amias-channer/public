import styled from 'styled-components'
import { mq, Button } from '@revolut/ui-kit'

import { themeColor, themeRadius, themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.CloseButton')

export const StyledOutlineButton = styled(Button).attrs({
  variant: 'outline',
})`
  border: 0;
  width: ${themeSize('tabletMax.size')};
  height: ${themeSize('tabletMax.size')};
  padding: 0;

  @media ${mq('md')} {
    border: 1px solid ${themeColor('buttonBorder')};
    border-radius: ${themeRadius('roundButton')};
    width: ${themeSize('size')};
  }
`
