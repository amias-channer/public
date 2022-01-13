import { FC } from 'react'

import { IconSize } from '@revolut/rwa-core-utils'

import { AnimatedCircle, BackgroundCircle, Container, TimerText } from './styled'

type CountdownCircleProps = {
  secondsAmount: number
  timeLeft: string
  size?: number
  strokeWidth?: number
}

export const CountdownCircle: FC<CountdownCircleProps> = ({
  secondsAmount,
  timeLeft,
  size = IconSize.Large,
  strokeWidth = 4,
}) => {
  const center = size / 2
  const radius = center - strokeWidth / 2
  const strokeDasharray = (size - strokeWidth) * Math.PI

  return (
    <Container width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <BackgroundCircle strokeWidth={strokeWidth} r={radius} cx={center} cy={center} />

      <AnimatedCircle
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        duration={secondsAmount * 1000}
        r={radius}
        cx={center}
        cy={center}
      />

      <TimerText x="50%" y="50%" dominantBaseline="central" textAnchor="middle">
        {timeLeft}
      </TimerText>
    </Container>
  )
}
