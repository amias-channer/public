import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell, Group } from '@revolut/ui-kit'

import { useLocale } from '@revolut/rwa-core-i18n'
import { checkRequired, formatAssetsQuoteMoney } from '@revolut/rwa-core-utils'
import { AssetsQuoteResponseDto } from '@revolut/rwa-core-types'
import { ExpandableDetails } from '@revolut/rwa-core-components'

import { CryptoExchangeRate } from '../../../../components'
import { extractFinalRate } from '../../../../utils'
import { I18N_NAMESPACE } from '../../constants'
import { CryptoExchangeConfirmationDetailsSkeleton } from './CryptoExchangeConfirmationDetailsSkeleton'

type Props = {
  assetsQuote?: AssetsQuoteResponseDto
  cryptoCode: string
  fiatCurrencyCode: string
}

export enum CryptoExchangeConfirmationDetailsTestId {
  Amount = 'details-amount',
  Exchanged = 'details-exchanged',
  TotalCost = 'details-total-cost',
  TotalCredit = 'details-total-credit',
  PriceRate = 'details-rate',
  Fee = 'details-fee',
}

export const CryptoExchangeConfirmationDetails: VFC<Props> = ({
  assetsQuote,
  cryptoCode,
  fiatCurrencyCode,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { locale } = useLocale()

  if (!assetsQuote) {
    return <CryptoExchangeConfirmationDetailsSkeleton />
  }

  const amountAfterFees = checkRequired(
    assetsQuote.fromAmountAfterFees || assetsQuote.toAmountAfterFees,
    'one of after fees amount should be available',
  )
  const exchangedCurrency = amountAfterFees.symbol

  const [exchangedAmount, selectedAmount] =
    assetsQuote.fromAmount.symbol === exchangedCurrency
      ? [assetsQuote.fromAmount, assetsQuote.toAmount]
      : [assetsQuote.toAmount, assetsQuote.fromAmount]

  return (
    <Group>
      <DetailsCell>
        <DetailsCell.Title>{t('details.amount')}</DetailsCell.Title>
        <DetailsCell.Content data-testid={CryptoExchangeConfirmationDetailsTestId.Amount}>
          {formatAssetsQuoteMoney(selectedAmount, locale)}
        </DetailsCell.Content>
      </DetailsCell>
      <DetailsCell>
        <DetailsCell.Title>{t('details.price')}</DetailsCell.Title>
        <DetailsCell.Content
          data-testid={CryptoExchangeConfirmationDetailsTestId.PriceRate}
        >
          <CryptoExchangeRate
            cryptoCode={cryptoCode}
            fiatCurrencyCode={fiatCurrencyCode}
            rate={extractFinalRate(assetsQuote)}
          />
        </DetailsCell.Content>
      </DetailsCell>
      <DetailsCell>
        <DetailsCell.Title>{t('details.exchanged')}</DetailsCell.Title>
        <DetailsCell.Content
          data-testid={CryptoExchangeConfirmationDetailsTestId.Exchanged}
        >
          {formatAssetsQuoteMoney(exchangedAmount, locale)}
        </DetailsCell.Content>
      </DetailsCell>
      {assetsQuote.fee.breakdown.map((feeOptions) => (
        <ExpandableDetails
          key={feeOptions.shortDescription}
          title={feeOptions.title}
          content={formatAssetsQuoteMoney(feeOptions.amount, locale)}
          note={feeOptions.description}
        />
      ))}
      {assetsQuote.fromAmountAfterFees && (
        <DetailsCell>
          <DetailsCell.Title>{t('details.totalCost')}</DetailsCell.Title>
          <DetailsCell.Content
            data-testid={CryptoExchangeConfirmationDetailsTestId.TotalCost}
          >
            {formatAssetsQuoteMoney(assetsQuote.fromAmountAfterFees, locale)}
          </DetailsCell.Content>
        </DetailsCell>
      )}
      {assetsQuote.toAmountAfterFees && (
        <DetailsCell>
          <DetailsCell.Title>{t('details.totalCredit')}</DetailsCell.Title>
          <DetailsCell.Content
            data-testid={CryptoExchangeConfirmationDetailsTestId.TotalCredit}
          >
            {formatAssetsQuoteMoney(assetsQuote.toAmountAfterFees, locale)}
          </DetailsCell.Content>
        </DetailsCell>
      )}
    </Group>
  )
}
