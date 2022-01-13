import React, { FC, MouseEventHandler } from 'react'
import { CircleButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  disabled: boolean
  buttonTitle: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BUTTON_TAKE_PICTURE_TESTID = 'button-take-picture-testid'

const TakePictureButton: FC<Props> = ({ onClick, disabled, buttonTitle }) => (
  <CircleButton
    my={{ '*-sm': 's-16', md: 's-24' }}
    title={buttonTitle || 'Take picture'}
    label={buttonTitle || 'Take picture'}
    variant="primary"
    onClick={onClick}
    disabled={disabled}
    data-testid={BUTTON_TAKE_PICTURE_TESTID}
  >
    <Icons.Camera size={20} color="white" />
  </CircleButton>
)

export default TakePictureButton
