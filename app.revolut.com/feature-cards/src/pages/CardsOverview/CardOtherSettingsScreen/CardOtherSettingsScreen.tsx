import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { Group, Subheader } from '@revolut/ui-kit'

import { CARDS_I18N_NAMESPACE } from '../../../helpers'
import { useGetUserCard } from '../../../hooks'
import { CardActionsScreenContainer } from '../components'
import { CardTermination } from './CardTermination'

export const CardOtherSettingsScreen: FC = () => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const history = useHistory()

  const { cardId } = useParams<{ cardId: string }>()
  const { cardData } = useGetUserCard(cardId)

  return (
    <CardActionsScreenContainer
      title={t('CardSettings.otherSettings.title')}
      cardData={cardData}
      onClose={() => history.goBack()}
    >
      <Subheader>
        <Subheader.Title>{t('CardSettings.otherSettings.title')}</Subheader.Title>
      </Subheader>
      <Group>
        <CardTermination cardId={cardId} />
      </Group>
    </CardActionsScreenContainer>
  )
}
