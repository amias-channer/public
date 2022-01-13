import React from "react"
import styled, { css } from "styled-components"
import Overflow from "../../components/common/Overflow.react"
import { getColumnsTemplate, getKey } from "./utils"

export type TableContainerProps = {
  columns: number
  minColumnWidths?: (number | "auto")[]
  maxColumnWidths?: (number | "auto")[]
  defaultMinColumnWidth?: number
  defaultMaxColumnWidth?: number
}

const TableContainer = styled.ul.attrs({ role: "table" })<TableContainerProps>`
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: ${getColumnsTemplate};

  > :nth-child(${props => props.columns}n) {
    padding-right: 16px;
  }
  > :nth-child(${props => props.columns}n + 1) {
    padding-left: 16px;
  }
`

const TableRow = styled.li.attrs({ role: "row" })`
  display: contents;
`

const TableCellContainer = styled.div<{
  variant: "header" | "body"
}>`
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: ${props => (props.variant === "body" ? "16px" : "4px")};
  padding-bottom: ${props => (props.variant === "body" ? "16px" : "4px")};
  background-color: ${props =>
    props.variant === "body"
      ? props.theme.colors.surface
      : props.theme.colors.header};
  border-top: ${props =>
    props.variant === "body"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};

  ${props =>
    props.variant === "header" &&
    css`
      position: sticky;
      top: 0;
      border-bottom: 1px solid ${props.theme.colors.border};
      /* Workaround for double border issue */
      margin-top: -1px;
    `}
`

type TableCellProps = { children?: React.ReactNode }
const TableHeaderCell = ({ children }: TableCellProps) => {
  return (
    <TableCellContainer role="columnheader" variant="header">
      <Overflow>{children}</Overflow>
    </TableCellContainer>
  )
}
const TableCell = ({ children }: TableCellProps) => {
  return (
    <TableCellContainer role="cell" variant="body">
      <Overflow>{children}</Overflow>
    </TableCellContainer>
  )
}

export type TableProps = {
  headers: string[]
  minColumnWidths?: (number | "auto")[]
  maxColumnWidths?: (number | "auto")[]
  defaultMinColumnWidth?: number
  defaultMaxColumnWidth?: number
  children: React.ReactNode
}
const TableBase = ({
  headers,
  minColumnWidths,
  maxColumnWidths,
  defaultMinColumnWidth,
  defaultMaxColumnWidth,
  children,
}: TableProps) => {
  return (
    <TableContainer
      columns={headers.length}
      defaultMaxColumnWidth={defaultMaxColumnWidth}
      defaultMinColumnWidth={defaultMinColumnWidth}
      maxColumnWidths={maxColumnWidths}
      minColumnWidths={minColumnWidths}
    >
      {headers.map((title, index) => (
        <TableHeaderCell key={getKey(title, index)}>{title}</TableHeaderCell>
      ))}
      {children}
    </TableContainer>
  )
}

export const Table = Object.assign(TableBase, {
  Row: TableRow,
  Cell: TableCell,
})

export default Table
