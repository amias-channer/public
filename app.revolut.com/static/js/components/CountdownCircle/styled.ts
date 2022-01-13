import styled, { keyframes } from 'styled-components'
import { themeVariant } from '@revolut/ui-kit'

import { themeColor } from '@revolut/rwa-core-styles'

const getAnimation = (offset: number) => keyframes`
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: ${offset};
  }
`

export const Container = styled.svg``

export const BackgroundCircle = styled.circle`
  stroke: ${themeColor('countdownCircleBackgroundCircle')};
  fill: transparent;
`

type AnimatedCircleProps = {
  strokeDasharray: number
  duration: number
}

export const AnimatedCircle = styled(BackgroundCircle)<AnimatedCircleProps>`
  stroke: ${themeColor('countdownCircleAnimatedCircle')};
  stroke-linecap: round;
  stroke-dashoffset: ${(props) => props.strokeDasharray};

  animation-name: ${(props) => getAnimation(props.strokeDasharray)};
  animation-duration: ${(props) => props.duration}ms;
  animation-timing-function: linear;

  transform: rotate(270deg);
  transform-origin: center;
`

export const TimerText = styled.text`
  ${themeVariant('textStyles.h4')}
`
