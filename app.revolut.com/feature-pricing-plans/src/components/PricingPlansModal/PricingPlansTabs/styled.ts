import styled from 'styled-components'
import { Sticky } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'

export const PricingPlansTabsBase = styled(Sticky)`
  z-index: ${Z_INDICES.modalHeader};
`
