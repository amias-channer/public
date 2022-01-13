import capitalize from 'lodash/capitalize'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { CardBrand } from '@revolut/rwa-core-types'
import { getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../helpers'

type SuccessScreenProps = {
  address: string
  cardBrand: CardBrand
  cardId: string
  lastFour: string
}

export const SuccessScreen: FC<SuccessScreenProps> = ({
  address,
  cardBrand,
  cardId,
  lastFour,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, 'common'])
  const history = useHistory()

  const handleButtonClick = () => {
    history.push(getCardDetailsUrl(cardId))
  }

  const capitalizedCardBrand = capitalize(cardBrand)

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('CardDeliveryUpdate.SuccessScreen.title', {
        cardBrand: capitalizedCardBrand,
        lastFour,
      })}
      authLayoutProps={{
        description: t('CardDeliveryUpdate.SuccessScreen.description', { address }),
        submitButtonText: t('common:done'),
        handleSubmitButtonClick: handleButtonClick,
      }}
    />
  )
}
