import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 90

export const ExclamationMarkOutlinedIcon: UiKitIconComponentType = ({
  color,
  size = BASE_SIZE,
}) => {
  const scaleRatio = (size as number) / BASE_SIZE

  return (
    <IconBase
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      color={color}
      fill="none"
    >
      <g transform={`scale(${scaleRatio})`}>
        <path
          d="M44.0769 23.3078C44.0769 22.5431 44.6968 21.9232 45.4616 21.9232C46.2263 21.9232 46.8462 22.5431 46.8462 23.3078V62.077C46.8462 62.8417 46.2263 63.4616 45.4616 63.4616C44.6968 63.4616 44.0769 62.8417 44.0769 62.077V23.3078Z"
          fill="currentColor"
        />
        <path
          d="M43.1539 69.4616C43.1539 68.1871 44.187 67.1539 45.4616 67.1539C46.7361 67.1539 47.7692 68.1871 47.7692 69.4616C47.7692 70.7361 46.7361 71.7693 45.4616 71.7693C44.187 71.7693 43.1539 70.7361 43.1539 69.4616Z"
          fill="currentColor"
        />
        <path
          d="M89.3077 45.0001C89.3077 69.4705 69.4705 89.3078 45 89.3078C20.5296 89.3078 0.692322 69.4705 0.692322 45.0001C0.692322 20.5296 20.5296 0.692383 45 0.692383C69.4705 0.692383 89.3077 20.5296 89.3077 45.0001ZM86.5385 45.0001C86.5385 22.059 67.9411 3.46161 45 3.46161C22.059 3.46161 3.46155 22.059 3.46155 45.0001C3.46155 67.9411 22.059 86.5385 45 86.5385C67.9411 86.5385 86.5385 67.9411 86.5385 45.0001Z"
          fill="currentColor"
        />
      </g>
    </IconBase>
  )
}
