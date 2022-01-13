import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell } from '@revolut/ui-kit'

import { MoneyLabel } from '../../../MoneyLabel'
import { I18N_NAMESPACE } from '../../constants'
import { checkIfCryptoTransaction, showExchangeRate } from './utils'

type Props = {
  baseAmount: number
  currencyFrom: string
  currencyTo: string
  fee: string
  rate?: number
  targetAmount: number
}

export const DetailsExchange: FC<Props> = ({
  baseAmount,
  currencyFrom,
  currencyTo,
  fee,
  rate,
  targetAmount,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const isCryptoTransaction = checkIfCryptoTransaction(currencyFrom, currencyTo)

  return (
    <>
      {isCryptoTransaction && baseAmount < 0 && (
        <DetailsCell>
          <DetailsCell.Title>{t('properties.spent')}</DetailsCell.Title>
          <DetailsCell.Content>
            <MoneyLabel
              amount={baseAmount}
              currency={currencyFrom}
              isGrey={false}
              isStrikethru={false}
              withSign={false}
            />
          </DetailsCell.Content>
        </DetailsCell>
      )}

      <DetailsCell>
        <DetailsCell.Title>
          {targetAmount > 0 ? t('properties.bought') : t('properties.sold')}
        </DetailsCell.Title>
        <DetailsCell.Content>
          <MoneyLabel
            amount={targetAmount}
            currency={currencyTo}
            isGrey={false}
            isStrikethru={false}
            withSign={false}
          />
        </DetailsCell.Content>
      </DetailsCell>

      {isCryptoTransaction && baseAmount > 0 && (
        <DetailsCell>
          <DetailsCell.Title>{t('properties.proceeds')}</DetailsCell.Title>
          <DetailsCell.Content>
            <MoneyLabel
              amount={baseAmount}
              currency={currencyFrom}
              isGrey={false}
              isStrikethru={false}
              withSign={false}
            />
          </DetailsCell.Content>
        </DetailsCell>
      )}

      {rate && (
        <DetailsCell>
          <DetailsCell.Title>{t('properties.exchangeRate')}</DetailsCell.Title>
          <DetailsCell.Content>
            {showExchangeRate(currencyFrom, currencyTo, rate)}
          </DetailsCell.Content>
        </DetailsCell>
      )}

      <DetailsCell>
        <DetailsCell.Title>{t('properties.fee')}</DetailsCell.Title>
        <DetailsCell.Content>{fee}</DetailsCell.Content>
      </DetailsCell>
    </>
  )
}
