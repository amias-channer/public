import React from "react"
import styled from "styled-components"
import { useTheme } from "../../design-system/Context/ThemeContext"
import THEMES, { HUES } from "../../styles/themes"
import Image from "../common/Image.react"

export interface Props {
  progress: number
  showClock?: boolean
  step: number
}

export const ActionProgress = ({ progress, showClock, step }: Props) => {
  const size = 32
  const strokeWidth = 4
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const { theme } = useTheme()
  return (
    <DivContainer>
      {progress === 100 ? (
        <svg height={size} width={size}>
          <circle
            cx={center}
            cy={center}
            fill={HUES.seaGrass}
            r={radius}
            stroke={HUES.seaGrass}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeWidth={strokeWidth}
          />
          <path
            d="M 10 16 l 4 4 l 8 -8"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      ) : showClock ? (
        <Image size={32} url="/static/images/icons/clock.svg" />
      ) : (
        <>
          <svg className="ActionProgress--svg" height={size} width={size}>
            <circle
              cx={center}
              cy={center}
              fill="none"
              r={radius + 1}
              stroke={
                theme === "dark" ? HUES.darkGray : THEMES[theme].colors.border
              }
              strokeDasharray={circumference * 1.1}
              strokeDashoffset={0}
              strokeWidth={2}
            />
            <circle
              cx={center}
              cy={center}
              fill="none"
              r={radius}
              stroke={HUES.seaGrass}
              strokeDasharray={circumference}
              strokeDashoffset={((100 - progress) / 100) * circumference}
              strokeWidth={strokeWidth}
              transform={`rotate(-90,${center},${center})`}
            />
            <text
              className="ActionProgress--step"
              dominantBaseline="middle"
              fill={THEMES[theme].colors.text.heading}
              textAnchor="middle"
              x="50%"
              // For some reason 50% is off center
              y="53%"
            >
              {step}
            </text>
          </svg>
        </>
      )}
    </DivContainer>
  )
}

const DivContainer = styled.div`
  align-items: center;
  display: flex;
  position: relative;

  .ActionProgress--svg {
    max-width: 100%;
  }

  .ActionProgress--step {
    font-size: 12px;
    font-weight: 700;
  }
`

export default ActionProgress
