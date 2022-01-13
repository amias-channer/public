import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@revolut/ui-kit'

import { useCardsTranslation } from '../../../../hooks'

export const CardTypeSelectionScreenHeader: FC = () => {
  const history = useHistory()
  const t = useCardsTranslation()

  const handleBackButtonClick = () => {
    history.goBack()
  }

  return (
    <Header variant="form">
      <Header.BackButton onClick={handleBackButtonClick} />
      <Header.Title>{t('CardOrdering.CardSelection.title')}</Header.Title>
    </Header>
  )
}
