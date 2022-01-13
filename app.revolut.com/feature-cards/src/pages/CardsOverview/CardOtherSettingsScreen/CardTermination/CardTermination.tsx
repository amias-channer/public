import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, generatePath } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { usePerformStepUpForUrl } from '@revolut/rwa-core-auth'
import { ErrorPopup, useModal } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE, getCardsOverviewUrl } from '../../../../helpers'
import { CardItemSkeleton } from '../../components'
import { CardTerminationPopup } from './CardTerminationPopup'
import { SuccessTerminationPopup } from './SuccessTerminationPopup'
import { useTerminateCard } from './hooks'

type CardTerminationProps = {
  cardId: string
}

export const CardTermination: FC<CardTerminationProps> = ({ cardId }) => {
  const history = useHistory()
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const [showCardTerminationPopup, cardTerminationPopupProps] = useModal()
  const [showSuccessTerminationPopup, successTerminationPopupProps] = useModal()
  const [showErrorPopup, errorPopupProps] = useModal()
  const { terminateCard, isCardTerminationInProgress } = useTerminateCard()
  const { performStepUpForUrl, isStepUpInitializing } = usePerformStepUpForUrl(
    generatePath(Url.CardSettingsOther, { cardId }),
  )

  const handleTerminateCard = () => {
    terminateCard(cardId, {
      onSuccess: () => {
        cardTerminationPopupProps.onRequestClose()
        showSuccessTerminationPopup()
      },
      onError: () => {
        cardTerminationPopupProps.onRequestClose()
        showErrorPopup()
      },
    })
  }

  const handleItemClick = () => {
    const willStepUp = performStepUpForUrl()

    if (!willStepUp) {
      showCardTerminationPopup()
    }
  }

  const handleSuccessTerminationPopupClose = () => {
    history.push(getCardsOverviewUrl())
  }

  if (isStepUpInitializing) {
    return <CardItemSkeleton />
  }

  return (
    <>
      <Item use="button" onClick={handleItemClick}>
        <Item.Avatar>
          <Avatar useIcon={Icons.Delete} color="error" />
        </Item.Avatar>
        <Item.Content>
          <Item.Title>{t('CardSettings.CardTermination.title')}</Item.Title>
          <Item.Description>
            {t('CardSettings.CardTermination.description')}
          </Item.Description>
        </Item.Content>
      </Item>
      <CardTerminationPopup
        {...cardTerminationPopupProps}
        isTerminating={isCardTerminationInProgress}
        onSubmit={handleTerminateCard}
      />
      <SuccessTerminationPopup
        {...successTerminationPopupProps}
        onRequestClose={handleSuccessTerminationPopupClose}
      />
      <ErrorPopup {...errorPopupProps} />
    </>
  )
}
