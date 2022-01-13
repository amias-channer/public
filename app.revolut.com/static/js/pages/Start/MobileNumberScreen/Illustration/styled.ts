import styled from 'styled-components'
import { prop } from 'styled-tools'
import { Box, Button, Flex, mq } from '@revolut/ui-kit'

import { themeNamespace, themeSpace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('pages.Start')

export const ContainerStyled = styled(Flex).attrs({
  bg: 'getTheAppIllustrationBg',
})<{ asset: string }>`
  width: ${themeSize('Illustration.Container.width')};
  min-width: ${themeSize('Illustration.Container.minWidth')};

  flex-direction: column;

  position: relative;

  background-image: url(${prop('asset')});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
`

export const DescriptionContainer = styled(Box).attrs({
  flex: 1,
  mx: 'px32',
  mt: 'px32',
})``

export const DescriptionContent = styled(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
})``

export const ButtonStyled = styled(Button).attrs({
  variant: 'outline',
  width: 'auto',
  color: 'getTheAppIllustrationButtonColor',
})`
  white-space: nowrap;

  @media ${mq('md')} {
    padding-left: ${themeSpace('px24')};
    padding-right: ${themeSpace('px24')};
    height: ${themeSize('Illustration.CtaButton.height')};
  }

  &:hover {
    opacity: 1;
  }
`
