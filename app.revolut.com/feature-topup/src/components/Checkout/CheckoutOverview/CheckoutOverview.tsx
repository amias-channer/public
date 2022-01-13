import { FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@revolut/ui-kit'

import { AmountSuggestions } from '../../AmountSuggestions'
import { I18N_NAMESPACE, MIN_PAID_VALUE } from '../../constants'
import { TopUpContext } from '../../TopUpProvider'
import { CheckoutItemProps } from '../CheckoutItem'
import { CheckoutItems } from '../CheckoutItems'
import {
  AMOUNT_SUGGESTIONS_VALUES,
  AMOUNT_SUGGESTIONS_VALUES_WITHOUT_0,
} from './constants'

type CheckoutOverviewProps = {
  currency: string
  checkoutItems: CheckoutItemProps[]
}

const getAvailableSuggestions = (paidValue: number) => {
  if (paidValue < MIN_PAID_VALUE) {
    return AMOUNT_SUGGESTIONS_VALUES_WITHOUT_0
  }

  return AMOUNT_SUGGESTIONS_VALUES
}

export const CheckoutOverview: FC<CheckoutOverviewProps> = ({
  currency,
  checkoutItems,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const {
    checkoutExtraAmount,
    setCheckoutExtraAmount,
    amount: topUpAmount,
  } = useContext(TopUpContext)
  const [availableSuggestions, setAvailableSuggestions] =
    useState<ReadonlyArray<number>>()

  useEffect(() => {
    if (
      !topUpAmount?.amount ||
      checkoutExtraAmount?.amount === undefined ||
      Boolean(availableSuggestions)
    ) {
      return
    }

    setAvailableSuggestions(
      getAvailableSuggestions(topUpAmount?.amount - checkoutExtraAmount?.amount),
    )
  }, [availableSuggestions, checkoutExtraAmount?.amount, topUpAmount?.amount])

  const handleSuggestionSelect = (value: number) => {
    setCheckoutExtraAmount({
      amount: value,
      currency,
    })
  }

  return (
    <Card px="s-16" pb="s-8" variant="plain">
      <CheckoutItems items={checkoutItems} />
      {availableSuggestions && (
        <AmountSuggestions
          title={t('facelift.CheckoutOverview.amountSuggestionsTitle')}
          currency={currency}
          currentValue={checkoutExtraAmount?.amount}
          availableValues={availableSuggestions}
          allowOther
          onSelect={handleSuggestionSelect}
        />
      )}
    </Card>
  )
}
