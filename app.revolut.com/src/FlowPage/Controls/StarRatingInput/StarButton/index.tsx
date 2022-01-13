import React, { FC } from 'react'
import { Button } from '@revolut/ui-kit'

type Props = {
  isActive: boolean
  index: number
  disabled: boolean
  isLast?: boolean
  onClick: (index?: number) => void
}

export const pluralize = (count: number) => `${count} star${count !== 1 ? 's' : ''}`

const StarButton: FC<Props> = ({ isActive, isLast, index, onClick, disabled }) => (
  <Button
    title={pluralize(index)}
    disabled={disabled}
    onClick={() => onClick(isActive ? undefined : index)}
    width="42px"
    height="36px"
    size="sm"
    mr={isLast ? 0 : 's-24'}
    variant={isActive ? 'default' : 'secondary'}
  >
    {index}
  </Button>
)

export default StarButton
