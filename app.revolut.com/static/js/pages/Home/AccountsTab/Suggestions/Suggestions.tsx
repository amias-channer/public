import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, TransitionSlide, Subheader, Carousel } from '@revolut/ui-kit'
import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'
import { ShopperTile } from './ShopperTile'

const SUGGESTIONS = [
  {
    Component: ShopperTile,
    key: DefaultStorageKey.ShopperBannerIsClosed,
  },
]

type Props = {
  onClose?(): void
}

export const Suggestions = ({ onClose }: Props) => {
  const { t } = useTranslation('pages.Accounts')
  const [suggestions, setSuggestions] = useState(
    SUGGESTIONS.filter(({ key }) => !defaultStorage.getItem(key)),
  )

  const closeSuggestion = (selectedKey: DefaultStorageKey) => {
    setSuggestions(suggestions.filter(({ key }) => key !== selectedKey))
    defaultStorage.setItem(selectedKey, true)
  }

  useEffect(() => {
    if (suggestions.length === 0) {
      onClose?.()
    }
  }, [onClose, suggestions])

  return (
    <TransitionSlide offsetY={14} in={suggestions.length > 0}>
      <Box>
        <Subheader>
          <Subheader.Title>{t('Suggestions.title')}</Subheader.Title>
        </Subheader>
        <Carousel aria-label="Suggestion list">
          {suggestions.map(({ key, Component }) => (
            <Carousel.Item key={key} width={{ all: 1 / 3 }} minWidth={148}>
              <Component onClose={() => closeSuggestion(key)} />
            </Carousel.Item>
          ))}
        </Carousel>
      </Box>
    </TransitionSlide>
  )
}
