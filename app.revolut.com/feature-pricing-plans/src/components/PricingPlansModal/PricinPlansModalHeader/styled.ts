import styled from 'styled-components'
import { Sticky } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'

export const PricingPlansModalHeaderBase = styled(Sticky)`
  top: -1.5rem;
  background-color: inherit;
  z-index: ${Z_INDICES.modalHeader};
`
