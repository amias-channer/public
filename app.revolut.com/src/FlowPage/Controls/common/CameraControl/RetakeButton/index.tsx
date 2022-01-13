import React, { FC, MouseEventHandler, useMemo } from 'react'
import { CircleButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  buttonTitle?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BUTTON_RETAKE_TESTID = 'button-retake-testid'

const RetakeButton: FC<Props> = ({ buttonTitle, onClick }) => {
  const title = useMemo(() => buttonTitle || 'Re-take', [buttonTitle])

  return (
    <CircleButton
      mx="s-16"
      my={{ '*-sm': 's-16', md: 's-24' }}
      title={title}
      label={title}
      variant="error"
      onClick={onClick}
      data-testid={BUTTON_RETAKE_TESTID}
    >
      <Icons.Cross size={20} color="white" />
    </CircleButton>
  )
}

export default RetakeButton
