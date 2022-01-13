import * as React from 'react'
import styled from 'styled-components'
import { Flex } from '@revolut/ui-kit'

import { draw, fadeIn } from '../keyframes'
import { transition } from '../../constants/timings'

export const CircleWrapper = styled('svg')`
  width: 6.75rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  circle {
    opacity: 0.1;
    stroke-dasharray: 320;
    animation: ${draw} 2s infinite;
  }
`
CircleWrapper.displayName = 'CircleWrapper'

export const Spinner = () => (
  <CircleWrapper viewBox='0 0 102 102'>
    <circle
      fill='none'
      stroke='rgb(138,148,158)'
      strokeWidth='2'
      strokeLinecap='round'
      cx='51'
      cy='51'
      r='50'
    />
  </CircleWrapper>
)

export const LoaderWrapper = styled(Flex).attrs({
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})`
  opacity: 0;
  animation: ${fadeIn} ${transition(transition.INTERVALS.MD)};
  animation-fill-mode: both;
  animation-delay: ${({ delay }: { delay: number }) => delay || 0}ms;
`
LoaderWrapper.displayName = 'LoaderWrapper'
