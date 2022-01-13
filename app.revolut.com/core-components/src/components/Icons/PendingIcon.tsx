import { UiKitIconComponentType } from '@revolut/icons'

import { IconBase } from './styled'

const BASE_SIZE = 96

export const PendingIcon: UiKitIconComponentType = ({ color, size = BASE_SIZE }) => {
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
          d="M0 48C0 21.6 21.6 0 48 0C74.4 0 96 21.6 96 48C96 74.4 74.4 96 48 96C21.6 96 0 74.4 0 48ZM48 1.6C22.4837 1.6 1.6 22.4837 1.6 48C1.6 73.5163 22.4837 94.4 48 94.4C73.5163 94.4 94.4 73.5163 94.4 48C94.4 22.4837 73.5163 1.6 48 1.6Z"
          fill="currentColor"
        />
        <path
          d="M48.8 16.8C48.8 16.3582 48.4418 16 48 16C47.5582 16 47.2 16.3582 47.2 16.8V48C47.2 48.4418 47.5582 48.8 48 48.8C48.4418 48.8 48.8 48.4418 48.8 48V16.8Z"
          fill="currentColor"
        />
        <path
          d="M48.8971 47.7657C48.5846 47.4533 48.0781 47.4533 47.7657 47.7657C47.4533 48.0781 47.4533 48.5846 47.7657 48.8971L60.7765 61.9078C61.0889 62.2202 61.5954 62.2202 61.9078 61.9078C62.2202 61.5954 62.2202 61.0889 61.9078 60.7765L48.8971 47.7657Z"
          fill="currentColor"
        />
      </g>
    </IconBase>
  )
}
