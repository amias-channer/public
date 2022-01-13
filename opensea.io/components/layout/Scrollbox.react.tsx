import React from "react"
import styled, { css } from "styled-components"
import { sizeMQ } from "../common/MediaQuery.react"

interface Props {
  children?: React.ReactNode
  className?: string
  theme?: "light" | "dark"
}

const Scrollbox = ({ children, className, theme }: Props) => {
  return (
    <DivContainer
      className={className}
      thumbColor={theme === "dark" ? "#ffffff" : "#000000"}
    >
      <div className="Scrollbox--content">{children}</div>
    </DivContainer>
  )
}
export default Scrollbox

const DivContainer = styled.div<{ thumbColor: string }>`
  display: flex;
  flex-direction: column;

  .Scrollbox--content {
    border-color: ${p => p.thumbColor}00;
    overflow-y: auto;
    transition: border-color 0.2s ease-in;

    @media (hover: hover) {
      &:hover {
        border-color: ${p => p.thumbColor}66;
        transition: none;
      }
    }

    ${sizeMQ({
      small: css`
        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-thumb {
          border: 4px solid;
          border-color: inherit;
          border-radius: 4px;
          height: 80px;
        }

        &::-webkit-scrollbar-corner {
          background: inherit;
        }
      `,
    })}
  }
`
