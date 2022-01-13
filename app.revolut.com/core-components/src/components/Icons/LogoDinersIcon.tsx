import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 32

export const LogoDinersIcon: UiKitIconComponentType = ({ size = BASE_SIZE }) => {
  const scaleRatio = (size as number) / BASE_SIZE

  return (
    <IconBase width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <g transform={`scale(${scaleRatio})`}>
        <path
          fill="#2082B9"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5,26.7 C8.7,26.8,4,22.1,4,16.5 C4,10.3,8.7,6,14.5,6 L17.2,6 C22.8,6,28,10.3,28,16.5 C28,22.2,22.8,26.8,17.2,26.8 L14.5,26.8 Z M14.5,6.9 C9.2,6.9,5,11.1,5,16.4 C5,21.6,9.2,25.9,14.5,25.9 C19.7,25.9,24,21.6,24,16.4 C24,11.1,19.7,6.9,14.5,6.9 Z M12.3,22 L12.3,10.7 C10,11.6,8.4,13.8,8.4,16.3 C8.5,18.9,10.1,21.1,12.3,22 Z M20.5,16.4 C20.5,13.8,18.9,11.6,16.6,10.8 L16.6,22 C18.9,21.1,20.5,18.9,20.5,16.4 Z"
        />
      </g>
    </IconBase>
  )
}
