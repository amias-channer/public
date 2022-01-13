import last from 'lodash/last'
import { Context, FC, useContext } from 'react'
import Infinite from 'react-infinite'
import { withTheme } from 'styled-components'
import { Row, Col, DefaultTheme, BreakpointsContext } from '@revolut/ui-kit'

import { splitEvery, toArray } from 'utils'

import { getGroupKey } from './helpers'

type InfiniteGridProps = {
  theme: typeof DefaultTheme
  cols: number[]
  items: any[]
  children: (item: any, itemIndex: number, groupIndex: number) => React.ReactNode
  elementHeight: number
}

const InfiniteGrid: FC<InfiniteGridProps> = ({
  theme = DefaultTheme,
  cols: allColumns = [1],
  items = [],
  children,
  ...rest
}) => {
  const gridSize = theme?.grid ?? 12
  const [defaultCol, ...responsiveCols] = toArray(allColumns)
  const cols = toArray(allColumns).map((n) => gridSize / n)
  const breakpoints: any = useContext(BreakpointsContext as unknown as Context<any>)

  if (items && !items.length) {
    return null
  }

  const colsPerRow =
    breakpoints.index === -1
      ? defaultCol
      : responsiveCols[breakpoints.index] || last(responsiveCols) || defaultCol

  return (
    <Infinite
      useWindowAsScrollContainer
      preloadBatchSize={Infinite.containerHeightScaleFactor(2)}
      {...rest}
    >
      {splitEvery(colsPerRow, toArray(items)).map((group, groupIndex: number) => {
        return (
          <Row key={getGroupKey(group)}>
            {group.map((item, itemIndex) => (
              <Col key={item.id || itemIndex} cols={cols}>
                {children(item, itemIndex, groupIndex)}
              </Col>
            ))}
          </Row>
        )
      })}
    </Infinite>
  )
}

InfiniteGrid.displayName = 'InfiniteGrid'

const InfiniteGridWithTheme = withTheme(InfiniteGrid)

export { InfiniteGridWithTheme as InfiniteGrid }
