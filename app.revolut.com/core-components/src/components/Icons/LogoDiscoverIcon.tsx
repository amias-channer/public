import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 32

export const LogoDiscoverIcon: UiKitIconComponentType = ({ size = BASE_SIZE }) => {
  const scaleRatio = (size as number) / BASE_SIZE

  return (
    <IconBase width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <g transform={`scale(${scaleRatio})`}>
        <path
          fill="#000000"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4,8.2 L6.6,8.2 C7.1,8.2,7.5,8.3,7.9,8.5 C8.3,8.7,8.6,8.9,8.9,9.2 C9.2,9.5,9.4,9.9,9.6,10.3 C9.8,10.7,9.9,11.1,9.9,11.6 C9.9,12,9.8,12.5,9.6,12.9 C9.4,13.3,9.2,13.7,8.9,14 C8.6,14.3,8.3,14.5,7.9,14.7 C7.5,14.9,7.1,15,6.6,15 L4,15 L4,8.2 Z M5.7,13.4 L6.1,13.4 C6.4,13.4,6.7,13.4,6.9,13.3 C7.1,13.2,7.3,13.1,7.5,12.9 C7.7,12.7,7.8,12.5,7.9,12.3 C8,12,8,11.8,8,11.5 C8,11.2,8,11,7.9,10.8 C7.8,10.6,7.7,10.4,7.5,10.2 C7.3,10,7.1,9.9,6.9,9.8 C6.7,9.7,6.4,9.6,6.1,9.6 L5.7,9.6 L5.7,13.4 Z"
        />
        <path
          fill="#000000"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.9,8.2 L12.6,8.2 L12.6,14.8 L10.9,14.8 L10.9,8.2 Z"
        />
        <path
          fill="#000000"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.5,10.4 C24.1,9.9,23.6,9.7,23,9.7 C22.7,9.7,22.5,9.7,22.3,9.8 C22.1,9.9,21.9,10,21.7,10.2 C21.5,10.4,21.4,10.6,21.3,10.8 C21.2,11,21.2,11.3,21.2,11.5 C21.2,11.8,21.2,12,21.3,12.2 C21.4,12.4,21.5,12.6,21.7,12.8 C21.9,13,22.1,13.1,22.3,13.2 C22.5,13.3,22.8,13.3,23,13.3 C23.6,13.3,24,13.1,24.5,12.6 L24.5,14.6 L24.3,14.7 C24,14.8,23.8,14.9,23.6,14.9 C23.4,14.9,23.1,15,22.9,15 C22.4,15,22,14.9,21.6,14.7 C21.2,14.5,20.8,14.3,20.5,14 C20.2,13.7,19.9,13.3,19.7,12.9 C19.5,12.5,19.4,12,19.4,11.5 S19.5,10.5,19.7,10.1 C19.9,9.7,20.1,9.3,20.5,9 C20.8,8.7,21.2,8.5,21.6,8.3 C22,8.1,22.4,8,22.9,8 C23.2,8,23.4,8,23.7,8.1 C24,8.2,24.2,8.2,24.5,8.4 L24.5,10.4 Z"
        />
        <path
          fill="#000000"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7,9.9 C17.5,9.7,17.3,9.6,17.1,9.6 C16.9,9.5,16.7,9.5,16.6,9.5 C16.4,9.5,16.2,9.6,16.1,9.7 C16,9.8,15.9,9.9,15.9,10.1 C15.9,10.2,15.9,10.3,16,10.4 C16.1,10.5,16.2,10.5,16.3,10.6 C16.4,10.7,16.5,10.7,16.7,10.7 C16.8,10.7,17,10.8,17.1,10.8 C17.7,11,18.1,11.2,18.3,11.6 C18.6,11.9,18.7,12.3,18.7,12.8 C18.7,13.1,18.6,13.4,18.5,13.7 C18.4,14,18.2,14.2,18,14.4 C17.8,14.6,17.5,14.7,17.2,14.9 C16.8,15,16.5,15,16.1,15 C15.3,15,14.5,14.8,13.8,14.3 L14.5,12.9 C14.8,13.1,15,13.3,15.3,13.4 C15.6,13.5,15.8,13.6,16,13.6 C16.3,13.6,16.5,13.5,16.6,13.4 C16.7,13.3,16.8,13.1,16.8,13 C16.8,12.9,16.8,12.8,16.7,12.7 C16.7,12.6,16.6,12.6,16.5,12.5 C16.4,12.4,16.3,12.4,16.2,12.3 C16.1,12.2,15.9,12.2,15.7,12.1 C15.5,12,15.3,12,15,11.9 C14.8,11.8,14.6,11.7,14.4,11.6 C14.2,11.5,14.1,11.3,14,11.1 C13.9,10.9,13.8,10.6,13.8,10.3 C13.8,10,13.9,9.7,14,9.4 C14.1,9.1,14.3,8.9,14.5,8.7 C14.7,8.5,14.9,8.4,15.2,8.3 C15.6,8.1,16,8,16.3,8 C16.6,8,17,8,17.3,8.1 C17.7,8.2,18,8.3,18.3,8.5 L17.7,9.9 Z"
        />
        <path
          fill="#FF7B00"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.3,23 C27.2,23,28,22.3,28,21.4 L28,15 L13,23 L26.3,23 Z"
        />
      </g>
    </IconBase>
  )
}