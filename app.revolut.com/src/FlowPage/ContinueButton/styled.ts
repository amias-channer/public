import { Box, Text, mq, themeColor, Color } from '@revolut/ui-kit'
import styled, { keyframes } from 'styled-components'
import { themeGet } from 'styled-system'

export const BoxStyled = styled(Box)`
  flex-shrink: 0;
  position: sticky;
  pointer-events: none;
  bottom: 1.5rem;
  width: 100%;
`

export const InnerBoxWrapperStyled = styled(Box)`
  margin: 0 auto;
  pointer-events: all;

  @media ${mq('*-md')} {
    max-width: 100%;
  }
`

const animationTextAppear = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export const TextStyled = styled(Text)`
  display: block;
  text-align: center;
  opacity: 0;
  max-width: 400px;
  font-size: ${themeGet('textStyles.secondary.fontSize')};
  line-height: ${themeGet('textStyles.secondary.lineHeight')};
  color: ${themeColor(Color.GREY_50)};
  margin: 0 auto ${themeGet('space.1')};
  animation: ${animationTextAppear} 0.3s ease 0.6s;
  animation-fill-mode: forwards;
`
