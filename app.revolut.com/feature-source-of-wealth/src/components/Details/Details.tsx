import { FC } from 'react'
import { Group, DetailsCell } from '@revolut/ui-kit'

import { DetailsProps } from './types'

export const Details: FC<DetailsProps> = ({ details }) => {
  return (
    <Group>
      {details.map(({ value, title }) => (
        <DetailsCell key={title} data-testid={title}>
          <DetailsCell.Title>{title}</DetailsCell.Title>
          <DetailsCell.Content>{value}</DetailsCell.Content>
        </DetailsCell>
      ))}
    </Group>
  )
}
