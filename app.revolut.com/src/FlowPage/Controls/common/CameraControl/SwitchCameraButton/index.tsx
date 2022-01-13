import React, { FC, MouseEventHandler, useMemo } from 'react'
import { CircleButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  disabled: boolean
  buttonTitle?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BUTTON_SWITCH_CAMERA_TESTID = 'button-switch-camera-testid'

const SwitchCameraButton: FC<Props> = ({ onClick, disabled, buttonTitle }) => {
  const title = useMemo(() => buttonTitle || 'Switch camera', [buttonTitle])

  return (
    <CircleButton
      m="s-16"
      title={title}
      label={title}
      disabled={disabled}
      onClick={onClick}
      data-testid={BUTTON_SWITCH_CAMERA_TESTID}
    >
      <Icons.ArrowsPayments size={20} color="black" />
    </CircleButton>
  )
}

export default SwitchCameraButton
