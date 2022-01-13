import React from "react"
import styled from "styled-components"
import { entries } from "../../lib/helpers/object"
import { themeVariant } from "../../styles/styleUtils"

export const sizes = {
  xsmall: 18,
  small: 24,
  medium: 32,
  large: 64,
} as const

export const getClosestLoaderSize = (size: number) =>
  entries(sizes).reduce((closestSize, [curSize, value]) => {
    const difference = Math.abs(value - size)
    if (difference < Math.abs(sizes[closestSize] - size)) {
      return curSize
    }
    return closestSize
  }, "large" as keyof typeof sizes)

export interface LoaderProps {
  size?: keyof typeof sizes
}

// Reference taken from https://dribbble.com/shots/1918018-Circle-Loading-Animation as well as
// the styling implementation
export const Loader = ({ size = "medium" }: LoaderProps) => {
  return (
    <SVGContainer
      style={{ width: sizes[size], height: sizes[size] }}
      viewBox="0 0 120 120"
    >
      <circle className="Loader--inner-circle" cx="60" cy="60" r="30" />
      <circle className="Loader--outer-circle" cx="60" cy="60" r="50" />
    </SVGContainer>
  )
}

export default Loader

const SVGContainer = styled.svg`
  transform: rotate(-90deg);
  stroke-linecap: round;
  stroke-width: 4;
  fill: none;

  .Loader--inner-circle,
  .Loader--outer-circle {
    stroke-dashoffset: 0;
    transform-origin: center;
  }

  .Loader--inner-circle {
    stroke: ${props => props.theme.colors.primary};
    stroke-dasharray: 187;
    animation: inner 1s ease-in-out infinite;
  }

  .Loader--outer-circle {
    stroke: ${props => props.theme.colors.fog};
    stroke-dasharray: 312;
    animation: outer 1s linear infinite;

    ${props =>
      themeVariant({
        variants: {
          light: {
            stroke: props.theme.colors.fog,
          },
          dark: {
            stroke: props.theme.colors.ash,
          },
        },
      })}
  }

  @keyframes inner {
    0% {
      stroke-dashoffset: 187;
    }
    25% {
      stroke-dashoffset: 80;
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(360deg);
    }
  }

  @keyframes outer {
    0% {
      stroke-dashoffset: 312;
      transform: rotate(70deg);
    }
    60% {
      stroke-dashoffset: -312;
    }
    100% {
      stroke-dashoffset: -312;
      transform: rotate(450deg);
    }
  }
`
