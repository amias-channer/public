import React, { CSSProperties } from "react"
import styled, { css } from "styled-components"
import { mapChildren } from "../../lib/helpers/array"
import { selectClassNames } from "../../lib/helpers/styling"
import { sizeMQ } from "./MediaQuery.react"

interface Props {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
  spaced?: boolean
  columnIndexClassName?: {
    [index: number]: string
  }
  style?: CSSProperties
}

const Row = ({
  children,
  className,
  columnIndexClassName,
  isHeader,
  spaced,
  style,
}: Props) => (
  <DivContainer
    className={selectClassNames(
      "Row",
      {
        isHeader,
      },
      className,
    )}
    role="row"
    style={style}
  >
    {mapChildren(children, (child, index) =>
      child === undefined ? null : (
        <div
          className={selectClassNames(
            "Row",
            { cell: true, cellIsSpaced: spaced },
            columnIndexClassName?.[index],
          )}
        >
          {child}
        </div>
      ),
    )}
  </DivContainer>
)
export default Row

const DivContainer = styled.div`
  display: flex;

  &:last-child {
    .Row--cell {
      border-bottom: none;
    }
  }

  .Row--cell {
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;
    flex: 1 0 100px;
    overflow-x: auto;
    padding: 16px 4px;

    &:first-child {
      padding-left: 16px;
    }

    &:last-child {
      padding-right: 16px;
    }
  }

  &.Row--isHeader {
    position: sticky;
    top: 0;
    z-index: 1;

    .Row--cell {
      background-color: ${props => props.theme.colors.header};
      color: ${props => props.theme.colors.text.heading};
      padding-bottom: 4px;
      padding-top: 4px;
    }
  }

  .Row--cellIsSpaced {
    flex-basis: 150px;
  }

  ${sizeMQ({
    mobile: css`
      .Row--cellIsSpaced {
        flex-basis: 100px;
      }
    `,
  })}
`
