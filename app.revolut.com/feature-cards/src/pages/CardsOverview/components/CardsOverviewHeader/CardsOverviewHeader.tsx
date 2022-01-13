import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { ProductWidget, MoreBar } from '@revolut/ui-kit'

import { ProductWidgetAvatar } from '@revolut/rwa-core-components'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { useCardOrderingButton } from '../../hooks'
import { PendingCardOrderPopup } from '../PendingCardOrderPopup'

export const CardsOverviewHeader: FC = () => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const {
    isAvailable: isCardOrderingButtonAvailable,
    isPending: isCardOrderingButtonPending,
    pendingCardOrderPopupProps,
    onAddCardButtonClick,
  } = useCardOrderingButton()

  if (!isCardOrderingButtonAvailable) {
    return null
  }

  return (
    <>
      <ProductWidget.Header>
        <ProductWidgetAvatar category="main" iconName="Credit-cards.png" />

        <ProductWidget.Bar>
          <MoreBar>
            <MoreBar.Action
              disabled={isCardOrderingButtonPending}
              pending={isCardOrderingButtonPending}
              useIcon={Icons.Plus}
              onClick={onAddCardButtonClick}
            >
              {t('addCard.button')}
            </MoreBar.Action>
          </MoreBar>
        </ProductWidget.Bar>
      </ProductWidget.Header>
      <PendingCardOrderPopup {...pendingCardOrderPopupProps} />
    </>
  )
}
