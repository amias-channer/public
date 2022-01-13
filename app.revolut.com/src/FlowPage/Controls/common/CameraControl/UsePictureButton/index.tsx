import React, { FC, MouseEventHandler, useMemo } from 'react'
import { CircleButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  buttonTitle?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BUTTON_USE_PICTURE_TESTID = 'button-use-picture-testid'

const UsePictureButton: FC<Props> = ({ buttonTitle, onClick }) => {
  const title = useMemo(() => buttonTitle || 'Use picture', [buttonTitle])

  return (
    <CircleButton
      mx="s-16"
      my={{ '*-sm': 's-16', md: 's-24' }}
      title={title}
      label={title}
      variant="success"
      onClick={onClick}
      data-testid={BUTTON_USE_PICTURE_TESTID}
    >
      <Icons.Check size={20} color="white" />
    </CircleButton>
  )
}

export default UsePictureButton
