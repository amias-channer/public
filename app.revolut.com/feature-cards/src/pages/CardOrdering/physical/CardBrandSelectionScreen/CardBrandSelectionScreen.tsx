import { FC } from 'react'
import { Group, Layout } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { FullPageLoader, Spacer } from '@revolut/rwa-core-components'
import { CardBrand } from '@revolut/rwa-core-types'

import { useCardsTranslation } from '../../../../hooks'
import { CardBrandItem } from './CardBrandItem'
import { CardBrandSelectionScreenHeader } from './CardBrandSelectionScreenHeader'

type CardPaymentSchemeSelectionScreenProps = {
  cardBrands: CardBrand[]
  onGoBack: VoidFunction
  onSubmit: (cardBrand?: CardBrand) => void
}

export const CardBrandSelectionScreen: FC<CardPaymentSchemeSelectionScreenProps> = ({
  cardBrands,
  onGoBack,
  onSubmit,
}) => {
  const t = useCardsTranslation()
  const { user } = useAuthContext()

  if (!user) {
    return <FullPageLoader />
  }

  return (
    <Layout>
      <Layout.Main>
        <CardBrandSelectionScreenHeader onGoBack={onGoBack} />

        <Group>
          {cardBrands.map((cardBrand) => {
            const cardBrandItemKey = cardBrand.toLowerCase()
            const description =
              cardBrand !== CardBrand.Maestro
                ? t(
                    `CardOrdering.CardPaymentSchemeSelection.items.${cardBrandItemKey}.description`,
                  )
                : undefined

            return (
              <CardBrandItem
                key={cardBrandItemKey}
                title={t(
                  `CardOrdering.CardPaymentSchemeSelection.items.${cardBrandItemKey}.title`,
                )}
                description={description}
                cardBrand={cardBrand}
                onClick={onSubmit}
              />
            )
          })}
        </Group>

        <Spacer h="8px" />

        <CardBrandItem
          title={t('CardOrdering.CardPaymentSchemeSelection.items.noPreference.title')}
          onClick={onSubmit}
        />
      </Layout.Main>
    </Layout>
  )
}
