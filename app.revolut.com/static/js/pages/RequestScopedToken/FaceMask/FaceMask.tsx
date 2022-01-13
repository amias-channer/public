import { FC } from 'react'

import { useWindowSize } from 'hooks'

import { SvgMask } from './styled'
import { getScaleRatio } from './utils'

const REFERENCE_DX = -136
const REFERENCE_DY = -200

type FaceMaskProps = {
  bg: string
  opacity: number
}

export const FaceMask: FC<FaceMaskProps> = ({ bg, opacity }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  if (windowWidth === 0) {
    return null
  }

  const scaleRatio = getScaleRatio(windowWidth, windowHeight)
  const dx = REFERENCE_DX * scaleRatio
  const dy = REFERENCE_DY * scaleRatio

  return (
    <SvgMask>
      <mask id="faceMask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" fillOpacity={opacity} />

        <g transform={`translate(${dx} ${dy})`}>
          <svg x="50%" y="50%">
            <g transform={`scale(${scaleRatio})`}>
              <path
                d="M272 168C272 283.111 227.111 400 136 400C44.8893 400 0 291.111 0 168C0 44.8893 60.8893 0 136 0C211.111 0 272 44.8893 272 168Z"
                fill="black"
              />
            </g>
          </svg>
        </g>
      </mask>

      <rect x="0" y="0" width="100%" height="100%" fill={bg} mask="url(#faceMask)" />
    </SvgMask>
  )
}
