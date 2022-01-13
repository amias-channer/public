import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { AuthLayout } from '@revolut/rwa-core-components'
import { CardFee, DeliveryMethodDto, DeliveryMethodName } from '@revolut/rwa-core-types'
import {
  checkRequired,
  formatMoney,
  getCurrentIntlLocale,
  I18nNamespace,
  Url,
} from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { DeliveryMethods } from './DeliveryMethods'
import { Summary } from './Summary'
import { validateDeliveryMethod } from './utils'

type DeliveryDetailsProps = {
  deliveryMethods: DeliveryMethodDto[]
  cardFee?: CardFee
  closeUrl?: string
  onBackClick: VoidFunction
  onSubmit: (deliveryMethod: DeliveryMethodDto) => void
}

export const DeliveryDetails: FC<DeliveryDetailsProps> = ({
  cardFee,
  deliveryMethods,
  closeUrl = Url.CardsOverview,
  onBackClick,
  onSubmit,
}) => {
  const history = useHistory()
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  const standardDeliveryMethod = useMemo(
    () =>
      deliveryMethods.find(
        (deliveryMethod) => deliveryMethod.name === DeliveryMethodName.Standard,
      ),
    [deliveryMethods],
  )

  const priorityDeliveryMethod = useMemo(
    () =>
      deliveryMethods.find(
        (deliveryMethod) => deliveryMethod.name === DeliveryMethodName.Priority,
      ),
    [deliveryMethods],
  )

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    validateDeliveryMethod(standardDeliveryMethod || priorityDeliveryMethod),
  )

  const handleCloseClick = () => {
    history.push(closeUrl)
  }

  const totalAmount = (cardFee?.amount ?? 0) + selectedDeliveryMethod.fee.amount

  const totalPrice =
    totalAmount !== 0
      ? formatMoney(
          totalAmount,
          selectedDeliveryMethod.fee.currency,
          getCurrentIntlLocale(),
        )
      : t('common:free')

  const handleSubmit = () => {
    onSubmit(
      checkRequired(selectedDeliveryMethod, 'selectedDeliveryMethod can not be empty'),
    )
  }

  return (
    <AuthLayout
      title={t('CardOrdering.DeliveryDetailsScreen.title')}
      submitButtonText={t('CardOrdering.DeliveryDetailsScreen.button', {
        price: totalPrice,
      })}
      submitButtonEnabled
      handleBackButtonClick={onBackClick}
      handleCloseButtonClick={handleCloseClick}
      handleSubmitButtonClick={handleSubmit}
    >
      <DeliveryMethods
        standardDeliveryMethod={standardDeliveryMethod}
        priorityDeliveryMethod={priorityDeliveryMethod}
        onDeliveryMethodChange={setSelectedDeliveryMethod}
      />
      {cardFee?.amount ? (
        <Summary
          cardPrice={formatMoney(
            cardFee.amount,
            cardFee.currency,
            getCurrentIntlLocale(),
          )}
          totalPrice={totalPrice}
        />
      ) : null}
    </AuthLayout>
  )
}
