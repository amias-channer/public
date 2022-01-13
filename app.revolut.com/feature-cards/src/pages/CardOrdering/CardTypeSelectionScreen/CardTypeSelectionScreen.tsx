import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Layout } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../hooks'
import { CardTypeSelectionScreenHeader } from './CardTypeSelectionScreenHeader'
import { CardTypeSelectionTile } from './CardTypeSelectionTile'
import { CardSelectionType, getAssetUrl } from './utils'

export const CardTypeSelectionScreen: FC = () => {
  const t = useCardsTranslation()

  return (
    <Layout>
      <Layout.Main>
        <CardTypeSelectionScreenHeader />
        <CardTypeSelectionTile
          Icon={Icons.SubtractCard}
          href={Url.CardOrderingDebit}
          title={t('CardOrdering.CardSelection.debitTab.physicalTile.title')}
          text={t('CardOrdering.CardSelection.debitTab.physicalTile.text')}
          assetUrl={getAssetUrl(CardSelectionType.Debit)}
        />
        <Spacer h="16px" />
        <CardTypeSelectionTile
          Icon={Icons.SubtractCloud}
          href={Url.CardOrderingVirtual}
          title={t('CardOrdering.CardSelection.debitTab.virtualTile.title')}
          text={t('CardOrdering.CardSelection.debitTab.virtualTile.text')}
          assetUrl={getAssetUrl(CardSelectionType.Virtual)}
        />
      </Layout.Main>
    </Layout>
  )
}
