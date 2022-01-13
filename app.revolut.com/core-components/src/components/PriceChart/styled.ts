import styled from 'styled-components'
import { ChartWidget, TabBar } from '@revolut/ui-kit'

export const PriceChartWidget = styled(ChartWidget)<{ withShadow: boolean }>`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ withShadow }) =>
    withShadow
      ? '0px 2px 4px rgb(25 28 31 / 5%), 0px 3px 16px rgb(25 28 31 / 10%)'
      : 'none'};
`

export const CondensedTabBarItem = styled(TabBar.Item)`
  padding: 0 !important;
`

export const ChartWidgetTitleStyled = styled(ChartWidget.Title)`
  align-self: flex-start;
`
