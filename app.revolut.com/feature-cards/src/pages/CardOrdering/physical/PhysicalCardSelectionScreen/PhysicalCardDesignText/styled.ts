import styled from 'styled-components'
import { Box, Caption, Text } from '@revolut/ui-kit'

export const PhysicalCardDesignTextContainer = styled(Box)`
  max-width: 344px;
  margin: 0 auto;
  text-align: center;
`

export const PhysicalCardDesignTitle = styled(Text).attrs({
  variant: 'primary',
  use: 'div',
  fontSize: 16,
})``

export const PhysicalCardDesignDescription = styled(Caption).attrs({
  color: 'grey-tone-50',
  fontSize: 14,
})``
