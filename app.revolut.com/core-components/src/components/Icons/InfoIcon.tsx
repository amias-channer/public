import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 96

export const InfoIcon: UiKitIconComponentType = ({ color, size = BASE_SIZE }) => {
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 48C0 21.6 21.6 0 48 0C74.4 0 96 21.6 96 48C96 74.4 74.4 96 48 96C21.6 96 0 74.4 0 48ZM48 1.6C22.4837 1.6 1.6 22.4837 1.6 48C1.6 73.5163 22.4837 94.4 48 94.4C73.5163 94.4 94.4 73.5163 94.4 48C94.4 22.4837 73.5163 1.6 48 1.6Z"
          fill="currentColor"
        />
        <rect
          x="47.1992"
          y="25.6"
          width="1.6"
          height="35.2"
          rx="0.799999"
          fill="currentColor"
        />
        <ellipse cx="47.9984" cy="68.8" rx="1.6" ry="1.6" fill="currentColor" />
      </g>
    </IconBase>
  )
}
