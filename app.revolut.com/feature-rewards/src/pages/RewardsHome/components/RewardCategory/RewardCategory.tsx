import { FC } from 'react'
import { Button } from '@revolut/ui-kit'

import { getRewardCategoryIcon } from '../../../../utils'

type Props = {
  title: string
  categoryId?: string
  isActive?: boolean
  onCategoryClick: (categoryId?: string) => void
}

export const RewardCategory: FC<Props> = ({
  onCategoryClick,
  title,
  categoryId,
  isActive,
}) => {
  const onClick = (id?: string) => () => {
    onCategoryClick(id)
  }

  return (
    <Button
      useIcon={getRewardCategoryIcon(categoryId)}
      onClick={onClick(categoryId)}
      variant={isActive ? 'white' : 'text'}
      color={isActive ? '' : 'grey-50'}
      size="sm"
    >
      {title}
    </Button>
  )
}
