import * as Icons from '@revolut/icons'
import { Status, TextProps } from '@revolut/ui-kit'

import { formatPercents } from '@revolut/rwa-core-utils'

export enum TestId {
  Root = 'Percents-value',
}

type Props = { value: number } & Omit<TextProps, 'color' | 'variant'>

export const Percents = ({ value, ...rest }: Props) => {
  const isNegative = value < 0
  const isZero = value === 0

  const icon = isNegative ? Icons.StocksArrowDown : Icons.StocksArrowUp
  const color = isNegative ? 'pink' : 'blue'

  return (
    <Status
      useIcon={isZero ? undefined : icon}
      iconSize={8}
      color={isZero ? 'grey-tone-50' : color}
      display="inline-flex"
      variant="caption"
      data-testid={TestId.Root}
      {...rest}
    >
      {formatPercents(Math.abs(value))}
    </Status>
  )
}
