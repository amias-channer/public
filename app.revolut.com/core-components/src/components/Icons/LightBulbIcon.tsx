import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 24

export const LightBulbIcon: UiKitIconComponentType = ({ size = BASE_SIZE }) => {
  const scaleRatio = (size as number) / BASE_SIZE

  return (
    <IconBase width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <g transform={`scale(${scaleRatio})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13 3C13 3.6 12.6 4 12 4C11.4 4 11 3.6 11 3V1C11 0.4 11.4 0 12 0C12.6 0 13 0.4 13 1V3ZM6.3 6.3C6.7 5.9 6.7 5.3 6.3 4.9L4.9 3.5C4.5 3.1 3.9 3.1 3.5 3.5C3.1 3.9 3.1 4.5 3.5 4.9L4.9 6.3C5.1 6.5 5.4 6.6 5.6 6.6C5.8 6.6 6.1 6.5 6.3 6.3ZM3 11H1C0.4 11 0 11.4 0 12C0 12.6 0.4 13 1 13H3C3.6 13 4 12.6 4 12C4 11.4 3.6 11 3 11ZM20.5 3.5C20.1 3.1 19.5 3.1 19.1 3.5L17.7 4.9C17.3 5.3 17.3 5.9 17.7 6.3C17.9 6.5 18.2 6.6 18.4 6.6C18.6 6.6 18.9 6.5 19.1 6.3L20.5 4.9C20.9 4.5 20.9 3.9 20.5 3.5ZM21 11H23C23.6 11 24 11.4 24 12C24 12.6 23.6 13 23 13H21C20.4 13 20 12.6 20 12C20 11.4 20.4 11 21 11ZM12 5C8.1 5 5 8.1 5 12C5 14.7 6.6 17.2 9 18.3V20C9 20.6 9.4 21 10 21H14C14.6 21 15 20.6 15 20V18.3C17.4 17.2 19 14.7 19 12C19 8.1 15.9 5 12 5ZM9 23C9 22.4 9.4 22 10 22H14C14.6 22 15 22.4 15 23C15 23.6 14.6 24 14 24H10C9.4 24 9 23.6 9 23Z"
          fill="#15171A"
        />
      </g>
    </IconBase>
  )
}
