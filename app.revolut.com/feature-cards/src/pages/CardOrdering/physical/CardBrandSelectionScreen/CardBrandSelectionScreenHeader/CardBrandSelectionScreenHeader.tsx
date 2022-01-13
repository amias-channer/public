import { FC } from 'react'
import { Header } from '@revolut/ui-kit'

import { useCardsTranslation } from '../../../../../hooks'

type CardBrandSelectionScreenHeaderProps = {
  onGoBack: VoidFunction
}

export const CardBrandSelectionScreenHeader: FC<CardBrandSelectionScreenHeaderProps> = ({
  onGoBack,
}) => {
  const t = useCardsTranslation()

  return (
    <Header variant="form">
      <Header.BackButton onClick={onGoBack} />
      <Header.Title>{t('CardOrdering.CardPaymentSchemeSelection.title')}</Header.Title>
    </Header>
  )
}
