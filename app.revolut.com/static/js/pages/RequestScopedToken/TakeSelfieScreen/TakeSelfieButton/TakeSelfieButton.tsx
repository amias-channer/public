import { FC } from 'react'

import { SvgButton } from './styled'

const SIZE = 64

export const TAKE_SELFIE_BUTTON_TEST_ID = 'TakeSelfieButton'

export const TakeSelfieButton: FC<{ onClick: VoidFunction }> = ({ onClick }) => {
  return (
    <SvgButton
      data-testid={TAKE_SELFIE_BUTTON_TEST_ID}
      fill="none"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      onClick={onClick}
    >
      <circle cx={SIZE / 2} cy={SIZE / 2} r="30" stroke="white" strokeWidth="4" />
      <circle cx={SIZE / 2} cy={SIZE / 2} r="25" fill="white" />
    </SvgButton>
  )
}
