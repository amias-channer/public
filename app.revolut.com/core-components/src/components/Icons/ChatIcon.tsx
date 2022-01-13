import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_WIDTH = 22
const BASE_HEIGHT = 19

export const ChatIcon: UiKitIconComponentType = ({ size = BASE_WIDTH }) => {
  const scaleRatio = (size as number) / BASE_WIDTH

  const width = size
  const height = scaleRatio * BASE_HEIGHT

  return (
    <IconBase
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <g transform={`scale(${scaleRatio})`}>
        <path
          d="M10.9883 16.625C16.8908 16.625 21.6758 12.9034 21.6758 8.3125C21.6758 3.72163 16.8908 0 10.9883 0C5.08574 0 0.300781 3.72163 0.300781 8.3125C0.300781 10.2921 1.19046 12.11 2.67578 13.5377V17.3155C2.67578 18.0745 3.48826 18.5568 4.15463 18.1934L7.74453 16.2352C8.76756 16.4884 9.85741 16.625 10.9883 16.625Z"
          fill="white"
        />
      </g>
    </IconBase>
  )
}
