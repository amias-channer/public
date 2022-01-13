import { VFC } from 'react'
import { Status, TextButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { useTranslation } from 'react-i18next'

import { AssetsQuoteAmountDto } from '@revolut/rwa-core-types'
import { useLocale } from '@revolut/rwa-core-i18n'
import { formatAssetsQuoteMoney } from '@revolut/rwa-core-utils'

type Props = {
  isBuyMethod: boolean
  totalFee: AssetsQuoteAmountDto
  onClick: VoidFunction
}

export const ExchangeFee: VFC<Props> = ({ isBuyMethod, totalFee, onClick }) => {
  const { locale } = useLocale()
  const { t } = useTranslation('pages.Crypto')

  if (parseFloat(totalFee.value) === 0) {
    return null
  }

  const feeAmount = formatAssetsQuoteMoney(totalFee, locale)

  const exchangeFeeHintText = isBuyMethod
    ? t('ExchangeFee.hint.afterFee', { amount: feeAmount })
    : t('ExchangeFee.hint.includingFee', { amount: feeAmount })

  return (
    <TextButton color="grey-tone-50" onClick={onClick}>
      <Status useIcon={Icons.InfoOutline}>{exchangeFeeHintText}</Status>
    </TextButton>
  )
}
