import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

import { media, themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('modals.BaseModal')

export const BoxStyled = styled(Box)`
  max-width: ${themeSize('size')};

  ${media.tabletMax`
    max-width: ${themeSize('tabletMax.size')};
  `}
`
