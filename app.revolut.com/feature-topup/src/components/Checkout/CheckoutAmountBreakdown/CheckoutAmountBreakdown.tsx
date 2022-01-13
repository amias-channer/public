import { FC, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Details } from '@revolut/ui-kit'

import { Pocket, TopupAmount } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../constants'
import { TopUpContext } from '../../TopUpProvider'
import { formatMoney } from '../../utils'

type CheckoutAmountBreakdownProps = {
  currentPocket: Pocket
  requiredAmount: TopupAmount
  extraAmount: TopupAmount
}

export const CheckoutAmountBreakdown: FC<CheckoutAmountBreakdownProps> = ({
  currentPocket,
  requiredAmount,
  extraAmount,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { setPocketId } = useContext(TopUpContext)

  useEffect(() => {
    setPocketId(currentPocket.id)
  }, [currentPocket.id, setPocketId])

  const formattedTakenFromBalance = formatMoney({
    amount: currentPocket.balance,
    currency: requiredAmount.currency,
  })
  const formattedTotalAmount = formatMoney({
    amount: requiredAmount.amount - currentPocket.balance + extraAmount.amount,
    currency: requiredAmount.currency,
  })

  return (
    <Box px="s-16">
      <Details>
        <Details.Title>
          {t('facelift.CheckoutAmountBreakdown.items.takenFromBalance')}
        </Details.Title>
        <Details.Content>
          {currentPocket.balance > 0 ? '-' : ''}
          {formattedTakenFromBalance}
        </Details.Content>
      </Details>

      <Details>
        <Details.Title>
          {t('facelift.CheckoutAmountBreakdown.items.totalAmount')}
        </Details.Title>
        <Details.Content>{formattedTotalAmount}</Details.Content>
      </Details>
    </Box>
  )
}
