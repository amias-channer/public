import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Carousel } from '@revolut/ui-kit'

import { RewardCategoryDto } from '@revolut/rwa-core-types'

import { RewardCategory } from '../RewardCategory'

type Props = {
  categories: RewardCategoryDto[]
  currentCategory?: string
  isSearchActive?: boolean
  onCategoryClick: (categoryId?: string) => void
}

export const RewardsCategories: FC<Props> = ({
  categories,
  currentCategory,
  isSearchActive,
  onCategoryClick,
}) => {
  const { t } = useTranslation('pages.RewardsHome')

  return (
    <Carousel>
      <Carousel.Item>
        <RewardCategory
          onCategoryClick={onCategoryClick}
          key="home"
          isActive={!isSearchActive && !currentCategory}
          title={t('category.home')}
        />
      </Carousel.Item>
      {categories.map(({ id, name }) => (
        <Carousel.Item>
          <RewardCategory
            onCategoryClick={onCategoryClick}
            key={id}
            categoryId={id}
            title={name}
            isActive={currentCategory === id}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
