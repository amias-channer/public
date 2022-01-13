import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell, Group } from '@revolut/ui-kit'

import { ExchangeRate } from '@revolut/rwa-core-components'
import { useLocaleFormatMoney } from '@revolut/rwa-core-i18n'
import { MoneyDto } from '@revolut/rwa-core-types'
import { CurrencyUnit } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../constants'

export enum TestId {
  RecipientGetsCell = 'BankTransferAmount.RecipientGetsCell',
  FeesCell = 'BankTransferAmount.FeesCell',
  YourTotalCell = 'BankTransferAmount.YourTotalCell',
}

type BankTransferAmountProps = {
  fees?: MoneyDto
  rate?: number
  recipientGets: MoneyDto
  yourTotal: MoneyDto
}

export const BankTransferAmount: VFC<BankTransferAmountProps> = ({
  fees,
  rate,
  recipientGets,
  yourTotal,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const localeFormatMoney = useLocaleFormatMoney()

  return (
    <Group>
      <DetailsCell data-testid={TestId.RecipientGetsCell}>
        <DetailsCell.Title>{t('field.recipientGets')}</DetailsCell.Title>
        <DetailsCell.Content>
          {localeFormatMoney(Math.abs(recipientGets.amount), recipientGets.currency)}
        </DetailsCell.Content>
      </DetailsCell>

      {recipientGets.currency !== yourTotal.currency && rate && (
        <>
          <DetailsCell>
            <DetailsCell.Title>{t('field.exchangeRate')}</DetailsCell.Title>
            <DetailsCell.Content>
              <ExchangeRate
                color="black"
                exchangeUnit={localeFormatMoney(CurrencyUnit.Fiat, yourTotal.currency)}
                rate={rate}
                rateCurrency={recipientGets.currency}
              />
            </DetailsCell.Content>
          </DetailsCell>
          <DetailsCell>
            <DetailsCell.Title>{t('field.exchangedAmount')}</DetailsCell.Title>
            <DetailsCell.Content>
              {localeFormatMoney(Math.abs(yourTotal.amount), yourTotal.currency)}
            </DetailsCell.Content>
          </DetailsCell>
        </>
      )}

      <DetailsCell data-testid={TestId.FeesCell}>
        <DetailsCell.Title>{t('field.fees')}</DetailsCell.Title>
        <DetailsCell.Content>
          {fees ? localeFormatMoney(fees.amount, fees.currency) : t('fees.noFees')}
        </DetailsCell.Content>
      </DetailsCell>

      <DetailsCell data-testid={TestId.YourTotalCell}>
        <DetailsCell.Title>{t('field.yourTotal')}</DetailsCell.Title>
        <DetailsCell.Content>
          {localeFormatMoney(
            Math.abs(yourTotal.amount) + (fees?.amount ?? 0),
            yourTotal.currency,
          )}
        </DetailsCell.Content>
      </DetailsCell>
    </Group>
  )
}
