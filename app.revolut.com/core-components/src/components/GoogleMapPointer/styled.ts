import styled from 'styled-components'
import { Card } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.GoogleMapsPointer')

export const StyledIframe = styled.iframe`
  width: 100%;
  height: ${themeSize('height')};
  border: 0;
`

export const StyledCard = styled(Card)`
  border: 0;
`
