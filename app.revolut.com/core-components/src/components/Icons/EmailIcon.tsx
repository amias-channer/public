import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_WIDTH = 20
const BASE_HEIGHT = 15

export const EmailIcon: UiKitIconComponentType = ({ color, size = BASE_WIDTH }) => {
  const scaleRatio = (size as number) / BASE_WIDTH

  const width = size
  const height = scaleRatio * BASE_HEIGHT

  return (
    <IconBase
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      color={color}
      fill="none"
    >
      <g transform={`scale(${scaleRatio})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 0H18C19.1046 0 20 0.89543 20 2V13C20 14.1046 19.1046 15 18 15H2C0.89543 15 0 14.1046 0 13V2C0 0.89543 0.89543 0 2 0ZM16.4282 3.1796L10 7.65977L3.57178 3.1796C3.11869 2.86381 2.49538 2.97512 2.1796 3.42822C1.86381 3.88131 1.97512 4.50462 2.42822 4.8204L9.42822 9.69908C9.7718 9.93855 10.2282 9.93855 10.5718 9.69908L17.5718 4.8204C18.0249 4.50462 18.1362 3.88131 17.8204 3.42822C17.5046 2.97512 16.8813 2.86381 16.4282 3.1796Z"
          fill="currentColor"
        />
      </g>
    </IconBase>
  )
}
