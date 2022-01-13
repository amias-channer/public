import { FC } from 'react'
import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Flex, FlexProps } from '@revolut/ui-kit'

import {
  shakingAnimation,
  media,
  themeColor,
  themeFontSize,
  themeNamespace,
  themeSpace,
} from '@revolut/rwa-core-styles'

import { ErrorMessage } from '../../styled'

const { themeSize } = themeNamespace('components.DigitInput')

type ContainerStyledProps = {
  digitsAmount: 4 | 6
  isShaking?: boolean
} & FlexProps

export const ContainerStyled = styled<FC<ContainerStyledProps>>(Flex)`
  flex-direction: column;

  ${ifProp('isShaking', shakingAnimation)}
`

export const SeparatorStyled = styled.span`
  font-size: ${themeFontSize('default')};
  color: ${themeColor('codeInputSeparator')};
  width: ${themeSize('separator.width')};
  text-align: center;

  ${media.tabletMax`
    width: ${themeSize('separator.tabletMax.width')};
  `}
`

export const ErrorMessageStyled = styled(ErrorMessage)`
  margin-top: ${themeSpace('px16')};
`
