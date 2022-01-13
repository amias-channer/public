import styled from 'styled-components'
import * as Icons from '@revolut/icons'
import { Flex, Box, mq } from '@revolut/ui-kit'

import { PrimaryButton } from '@revolut/rwa-core-components'
import { themeNamespace, themeSpace } from '@revolut/rwa-core-styles'

import { selfieMediaDimensions } from '../styled'

const { themeSize } = themeNamespace('pages.RequestScopedToken.ConfirmSelfieScreen')

export const SelfieImageStyled = styled.img`
  ${selfieMediaDimensions};
`

export const ContainerStyled = styled(Flex)`
  height: 100vh;
`

export const ActionsContainerStyled = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${themeSpace('px36')};

  text-align: center;

  @media ${mq('*-md')} {
    display: flex;
    justify-content: space-between;
    padding-left: ${themeSpace('px16')};
    padding-right: ${themeSpace('px16')};
  }
`

export const SubmitSelfieButtonStyled = styled(PrimaryButton)`
  width: ${themeSize('SubmitSelfieButton.width')};
  margin: auto;
`

export const BackButton = styled(Icons.ArrowThinLeft)`
  cursor: pointer;
`
