import { FC } from 'react'

import { BoxStyled } from './styled'

type ProgressBarProps = {
  current: number
  total: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ current, total }) => (
  <BoxStyled
    height="components.ProgressBar.height"
    width={`${(current / total) * 100}%`}
    bg="primary"
  />
)
