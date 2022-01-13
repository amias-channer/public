import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  IllustrationAsset,
  IllustrationAssetId,
  ProductStory,
  ProductStoryName,
  ProductStorySwitcher,
  useProductStorySwitcher,
} from '@revolut/rwa-core-components'

export const WelcomeStory: VFC = () => {
  const { t } = useTranslation('pages.Accounts')
  const { isProductStoryOpen, closeProductStory } = useProductStorySwitcher(
    ProductStoryName.Welcome,
  )

  const story: ProductStory = {
    content: {
      header: t('AccountsStory.title'),
    },
    screens: [
      {
        title: t('AccountsStory.title'),
        backgroundMedia: IllustrationAsset[IllustrationAssetId.GetStarted],
        buttons: [{ label: t('AccountsStory.continue') }],
      },
    ],
  }

  return (
    <ProductStorySwitcher
      productStory={story}
      isOpen={isProductStoryOpen}
      onClose={closeProductStory}
    />
  )
}
