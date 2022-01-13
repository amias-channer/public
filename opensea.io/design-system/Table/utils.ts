import { range } from "lodash"
import { TableContainerProps } from "./Table.react"

export const getKey = (value: string, index: number) => `${value}-${index}`

export const getColumnsTemplate = (props: TableContainerProps) => {
  const defaultMaxColumnWidth = props.defaultMaxColumnWidth
    ? `${props.defaultMaxColumnWidth}px`
    : "auto"
  const defaultMinColumnWidth = props.defaultMinColumnWidth
    ? `${props.defaultMinColumnWidth}px`
    : "auto"

  if (!props.minColumnWidths && !props.maxColumnWidths) {
    return `repeat(${props.columns}, minmax(${defaultMinColumnWidth}, ${defaultMaxColumnWidth}))`
  }
  if (!props.maxColumnWidths) {
    return range(props.columns).map(
      index =>
        ` minmax(${
          props.minColumnWidths?.[index] === undefined
            ? defaultMinColumnWidth
            : props.minColumnWidths?.[index] === "auto"
            ? "auto"
            : `${props.minColumnWidths?.[index]}px`
        }, ${defaultMaxColumnWidth})`,
    )
  }
  if (!props.minColumnWidths) {
    return range(props.columns).map(index => {
      return ` minmax(${defaultMinColumnWidth}, ${
        props.maxColumnWidths?.[index] === undefined
          ? defaultMaxColumnWidth
          : props.maxColumnWidths?.[index] === "auto"
          ? "auto"
          : `${props.maxColumnWidths?.[index]}px`
      })`
    })
  }
  return range(props.columns).map(
    index =>
      ` minmax(${
        props.minColumnWidths?.[index] === undefined
          ? defaultMinColumnWidth
          : props.minColumnWidths?.[index] === "auto"
          ? "auto"
          : `${props.minColumnWidths?.[index]}px`
      }, ${
        props.maxColumnWidths?.[index] === undefined
          ? defaultMaxColumnWidth
          : props.maxColumnWidths?.[index] === "auto"
          ? "auto"
          : `${props.maxColumnWidths?.[index]}px`
      })`,
  )
}
