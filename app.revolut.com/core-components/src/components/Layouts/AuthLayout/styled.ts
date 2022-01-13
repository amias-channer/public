import styled, { css } from 'styled-components'
import { Absolute, Flex, Box, TextButton, mq } from '@revolut/ui-kit'

import {
  themeFontSize,
  themeSpace,
  themeNamespace,
  themeZIndex,
  media,
} from '@revolut/rwa-core-styles'

import { BackButton, CloseButton, PrimaryButton } from '../../Buttons'
import { H2 } from '../../H2'

const { themeSize } = themeNamespace('components.AuthLayout')

const CONTAINER_SPACE_DESKTOP = themeSpace('px32')
const CONTAINER_SPACE_TABLET = themeSpace('px16')
const INNER_CONTAINER_SPACE = themeSpace('authLayoutInnerSpace')

export const AUTH_BUTTON_BOX_CSS = css`
  position: fixed;
  bottom: ${themeSpace('px48')};
  left: calc(${INNER_CONTAINER_SPACE} + ${CONTAINER_SPACE_DESKTOP});
  font-size: ${themeFontSize('default')};
  z-index: ${themeZIndex('min')};

  ${media.desktop`
    max-width: ${themeSize('elements.maxWidth')};
  `}

  ${media.tabletMax`
    left: ${CONTAINER_SPACE_TABLET};
    bottom: ${themeSpace('px24')};
    width: calc(100% - ${CONTAINER_SPACE_TABLET} * 2);
  `}
`

export const ContainerStyled = styled(Flex)`
  margin-left: ${CONTAINER_SPACE_DESKTOP};
  position: relative;

  @media ${mq('*-xl')} {
    margin-right: ${CONTAINER_SPACE_DESKTOP};
  }

  @media ${mq('*-md')} {
    margin-left: ${CONTAINER_SPACE_TABLET};
    margin-right: ${CONTAINER_SPACE_TABLET};
  }
`

export const InnerContainerStyled = styled(Box)`
  width: 100%;
  min-height: 100vh;
  max-width: ${themeSize('LayoutContainer.maxWidth')};
  position: relative;

  ${media.desktop`
    margin-left: ${INNER_CONTAINER_SPACE};
  `}
`

export const PrimaryButtonStyled = styled(PrimaryButton)`
  ${media.desktop`
    width: ${themeSize('elements.maxWidth')};
  `}

  ${media.tabletMax`
    width: 100%;
  `}
`

export const SecondaryButtonStyled = styled(TextButton)`
  text-align: center;

  &:focus {
    box-shadow: none;
  }

  ${media.desktop`
    width: ${themeSize('elements.maxWidth')};
  `}

  ${media.tabletMax`
    width: 100%;
  `}
`

export const ButtonsBox = styled(Box)`
  ${AUTH_BUTTON_BOX_CSS}
`

export const StyledBackButton = styled(BackButton)`
  position: absolute;
  left: ${CONTAINER_SPACE_DESKTOP};
  top: ${themeSpace('px32')};
  z-index: ${themeZIndex('min')};

  ${media.tabletMax`
    position: absolute;
    left: -${themeSpace('px8')};
    top: ${themeSpace('px24')};
  `}
`

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: ${CONTAINER_SPACE_DESKTOP};
  top: ${themeSpace('px32')};
  z-index: ${themeZIndex('min')};

  ${media.tabletMax`
    position: absolute;
    right: -${themeSpace('px8')};
    top: ${themeSpace('px24')};
  `}
`

export const Subtitle = styled(H2)`
  color: #828b94;
`

export const CenterContentContainer = styled(Absolute)`
  top: 47%;
  transform: translateY(-50%);
`
