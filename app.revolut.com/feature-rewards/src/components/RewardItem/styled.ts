import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.Rewards.RewardItem')

export const RewardItemWrapper = styled(Box)`
  text-align: center;
  width: ${themeSize('width')};
`
