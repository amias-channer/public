import * as React from 'react'
import { Badge } from '@revolut/ui-kit'

import { ButtonBadgeWrapper } from './styles'

type Props = {
  count: number
}

export const ButtonBadge = ({ count = 0 }: Props) => (
  <ButtonBadgeWrapper>
    <Badge>{count}</Badge>
  </ButtonBadgeWrapper>
)
