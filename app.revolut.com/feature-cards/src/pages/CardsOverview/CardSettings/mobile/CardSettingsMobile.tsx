import { FC, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Button, Header, Layout } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { CARDS_I18N_NAMESPACE, getCardsOverviewUrl } from '../../../../helpers'
import { PendingCardOrderPopup } from '../../components'
import { useCardOrderingButton } from '../../hooks'
import { CardSettingsActions } from '../CardSettingsActions'
import { CardSettingsActivation } from '../CardSettingsActivation'
import { CardsCarousel } from './CardsCarousel'

type CardSettingsMobileProps = {
  cardId: string
}

export const CardSettingsMobileTestId = 'card-settings-mobile-testid'

export const CardSettingsMobile: FC<CardSettingsMobileProps> = ({ cardId }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const history = useHistory()
  const {
    isAvailable: isCardOrderingButtonAvailable,
    isPending: isCardOrderingButtonPending,
    pendingCardOrderPopupProps,
    onAddCardButtonClick,
  } = useCardOrderingButton()

  // temp hack to avoid scrolling in background on home page
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleBackButtonClicked = () => {
    history.push(getCardsOverviewUrl())
  }

  return (
    <>
      <Layout data-testid={CardSettingsMobileTestId}>
        <Layout.Main>
          <Header variant="form" displayMode="large">
            <Header.BackButton aria-label="Back" onClick={handleBackButtonClicked} />
            <Header.Title>{t('title')}</Header.Title>

            {isCardOrderingButtonAvailable && (
              <Header.Actions>
                <Button
                  useIcon={Icons.Plus}
                  variant="bar"
                  aria-label="Add card"
                  pending={isCardOrderingButtonPending}
                  disabled={isCardOrderingButtonPending}
                  onClick={onAddCardButtonClick}
                />
              </Header.Actions>
            )}
          </Header>

          <CardsCarousel selectedCardId={cardId} />
          <Spacer h="24px" />
          <CardSettingsActivation cardId={cardId} />
          <Spacer h="16px" />
          <CardSettingsActions cardId={cardId} />
        </Layout.Main>
      </Layout>
      <PendingCardOrderPopup {...pendingCardOrderPopupProps} />
    </>
  )
}
