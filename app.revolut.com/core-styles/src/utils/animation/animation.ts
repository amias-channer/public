import { css, keyframes } from 'styled-components'

const shake = keyframes`
  10%, 90% {
    transform: translateX(-1px);
  }

  20%, 80% {
    transform: translateX(2px);
  }

  30%, 50%, 70% {
    transform: translateX(-4px);
  }

  40%, 60% {
    transform: translateX(4px);
  }
`

export const shakingAnimation = css`
  animation: ${shake} 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
`
