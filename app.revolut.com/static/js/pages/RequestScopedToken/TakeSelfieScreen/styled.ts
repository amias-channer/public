import { RefAttributes } from 'react'
import Webcam from 'react-webcam'
import styled from 'styled-components'
import * as Icons from '@revolut/icons'
import { Flex } from '@revolut/ui-kit'

import { themeColor } from '@revolut/rwa-core-styles'

import { SelfieHeading } from '../components'
import { selfieMediaDimensions } from '../styled'

export const BackButton = styled(Icons.ArrowThinLeft)`
  cursor: pointer;
`

export const WebcamStyled = styled(Webcam)<RefAttributes<Webcam>>`
  ${selfieMediaDimensions};
`

export const ContainerStyled = styled(Flex)`
  background-color: ${themeColor('primaryBlack')};
  height: 100vh;
`

export const Heading = styled(SelfieHeading)`
  color: ${themeColor('primaryWhite')};
`
