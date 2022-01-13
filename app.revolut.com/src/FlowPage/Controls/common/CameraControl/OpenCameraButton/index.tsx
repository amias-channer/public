import React, { FC } from 'react'
import ActionCard from '../../Cards/ActionCard'

type Props = {
  buttonTitle?: string
  onClick: () => void
}

export const DEFAULT_OPEN_CAMERA_TEXT = 'Open camera'

const OpenCameraButton: FC<Props> = ({ onClick, buttonTitle }) => (
  <ActionCard
    text={buttonTitle || DEFAULT_OPEN_CAMERA_TEXT}
    onClick={onClick}
    icon="Camera"
  />
)

export default OpenCameraButton
