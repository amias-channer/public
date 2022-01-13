import styled from 'styled-components'
import { Button, mq } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.Rewards.GoToRewardButton')

export const GoToButton = styled(Button).attrs({
  use: 'a',
  target: '_blank',
  variant: 'primary',
})`
  width: 100%;
  @media ${mq('md')} {
    width: ${themeSize('width')};
  }
  margin: 0 auto;
`
