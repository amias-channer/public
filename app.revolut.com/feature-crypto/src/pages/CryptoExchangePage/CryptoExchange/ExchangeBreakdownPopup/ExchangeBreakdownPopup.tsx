import { VFC } from 'react'
import { DetailsCell, Group, Header, Popup, PopupProps } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

import { ExpandableDetails } from '@revolut/rwa-core-components'
import { useLocale } from '@revolut/rwa-core-i18n'
import { AssetsQuoteAmountDto, AssetsQuoteFeeBreakdownDto } from '@revolut/rwa-core-types'
import { checkRequired, formatAssetsQuoteMoney } from '@revolut/rwa-core-utils'

import { CryptoExchangeRate } from '../../../../components'

type Props = {
  cryptoCode: string
  exchangedAmountWithoutFees: AssetsQuoteAmountDto
  feeBreakdown: AssetsQuoteFeeBreakdownDto[]
  fiatCurrencyCode: string
  fromAmountAfterFees?: AssetsQuoteAmountDto
  providedAmount: AssetsQuoteAmountDto
  rate: number
  toAmountAfterFees?: AssetsQuoteAmountDto
} & Pick<PopupProps, 'isOpen' | 'onExit'>

export const ExchangeBreakdownPopup: VFC<Props> = ({
  cryptoCode,
  exchangedAmountWithoutFees,
  fiatCurrencyCode,
  feeBreakdown,
  fromAmountAfterFees,
  providedAmount,
  rate,
  toAmountAfterFees,
  ...rest
}) => {
  const { locale } = useLocale()
  const { t } = useTranslation('pages.CryptoExchange')

  const exchangedTotalAmount = checkRequired(
    fromAmountAfterFees ?? toAmountAfterFees,
    'one of the after fees amount should be defined',
  )

  const totalAmountLabel = fromAmountAfterFees
    ? t('ExchangeBreakdownPopup.totalCost')
    : t('ExchangeBreakdownPopup.totalCredit')

  return (
    <Popup {...rest} variant="bottom-sheet">
      <Header variant="bottom-sheet">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{t('ExchangeBreakdownPopup.title')}</Header.Title>
      </Header>
      <Group>
        <DetailsCell>
          <DetailsCell.Title>{t('ExchangeBreakdownPopup.amount')}</DetailsCell.Title>
          <DetailsCell.Content>
            {formatAssetsQuoteMoney(providedAmount, locale)}
          </DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('ExchangeBreakdownPopup.price')}</DetailsCell.Title>
          <DetailsCell.Content>
            <CryptoExchangeRate
              cryptoCode={cryptoCode}
              fiatCurrencyCode={fiatCurrencyCode}
              rate={rate}
            />
          </DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('ExchangeBreakdownPopup.exchanged')}</DetailsCell.Title>
          <DetailsCell.Content>
            {formatAssetsQuoteMoney(exchangedAmountWithoutFees, locale)}
          </DetailsCell.Content>
        </DetailsCell>
        {feeBreakdown.map((feeOptions) => (
          <ExpandableDetails
            key={feeOptions.shortDescription}
            title={feeOptions.title}
            content={formatAssetsQuoteMoney(feeOptions.amount, locale)}
            note={feeOptions.description}
          />
        ))}
        <DetailsCell>
          <DetailsCell.Title>{totalAmountLabel}</DetailsCell.Title>
          <DetailsCell.Content>
            {formatAssetsQuoteMoney(exchangedTotalAmount, locale)}
          </DetailsCell.Content>
        </DetailsCell>
      </Group>
    </Popup>
  )
}
