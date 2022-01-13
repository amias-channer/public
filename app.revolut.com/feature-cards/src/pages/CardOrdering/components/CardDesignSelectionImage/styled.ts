import styled from 'styled-components'
import { Flex, Image, mq } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('pages.Cards')

export const CardDesignSelectionImageContainer = styled(Flex)`
  justify-content: center;
  position: relative;

  @media ${mq('sm')} {
    height: ${themeSize('CardOrdering.CardTypeSelectionImageContainer.height.sm')};
  }

  @media ${mq('*-sm')} {
    height: ${themeSize('CardOrdering.CardTypeSelectionImageContainer.height.*-sm')};
  }
`

export const CardDesignSelectionImageStyled = styled(Image)`
  width: auto;
  max-width: ${themeSize('CardOrdering.CardTypeSelectionImage.maxWidth')};

  @media ${mq('sm')} {
    position: absolute;
    transform: rotate(-90deg) translateX(65px);
    width: ${themeSize('CardOrdering.CardTypeSelectionImage.width.sm')};
  }

  @media ${mq('*-sm')} {
    height: 100%;
  }
`
