import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'

import { CARDS_I18N_NAMESPACE } from '../../../helpers'
import { useGetUserCard } from '../../../hooks'
import { CardActionsScreenContainer } from '../components'
import { OtherSecuritySettings } from './OtherSecuritySettings'
import { PinSettings } from './PinSettings'

export const CardSecurityScreen: FC = () => {
  const history = useHistory()
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  const { cardId } = useParams<{ cardId: string }>()
  const { cardData } = useGetUserCard(cardId)

  return (
    <CardActionsScreenContainer
      title={t('CardSettings.security.title')}
      cardData={cardData}
      onClose={() => history.goBack()}
    >
      <PinSettings cardId={cardId} />
      {cardData && <OtherSecuritySettings cardData={cardData} />}
    </CardActionsScreenContainer>
  )
}
