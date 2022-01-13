import styled from 'styled-components'
import { Carousel, mq, themeRadius, themeSpace } from '@revolut/ui-kit'

export const StyledCarousel = styled(Carousel)`
  border-radius: ${themeRadius('card')};
  padding-left: ${themeSpace('s-12')};
  @media ${mq('*-md')} {
    border-radius: 0;
  }
`
