import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Subheader, Group, DetailsCell } from '@revolut/ui-kit'
import { isNil } from 'lodash'

import { formatMoney } from '@revolut/rwa-core-utils'
import { useLocale } from '@revolut/rwa-core-i18n'
import { Currency } from '@revolut/rwa-core-config'
import { RatePerformance } from '@revolut/rwa-core-components'

import { CryptoHoldingItem } from '../../../../../hooks'
import { I18N_NAMESPACE } from '../../../constants'

type Props = {
  cryptoHolding: CryptoHoldingItem
  targetCurrency: Currency
}

export const CryptoHolding: FC<Props> = ({ cryptoHolding, targetCurrency }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { locale } = useLocale()

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('Investment.groupTitle')}</Subheader.Title>
      </Subheader>
      <Group>
        <DetailsCell>
          <DetailsCell.Title>{t('Investment.totalHolding.title')}</DetailsCell.Title>
          <DetailsCell.Content>
            {formatMoney(cryptoHolding.amount, cryptoHolding.code, locale)}
          </DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('Investment.valueOfHolding.title')}</DetailsCell.Title>
          <DetailsCell.Content>
            {formatMoney(cryptoHolding.totalPrice, targetCurrency, locale)}
          </DetailsCell.Content>
        </DetailsCell>
        {!isNil(cryptoHolding.pnl) && !isNil(cryptoHolding.growthIndex) && (
          <DetailsCell>
            <DetailsCell.Title>{t('Investment.totalReturn.title')}</DetailsCell.Title>
            <DetailsCell.Content>
              <RatePerformance
                pnl={cryptoHolding!.pnl}
                currency={targetCurrency}
                performance={cryptoHolding!.growthIndex}
              />
            </DetailsCell.Content>
          </DetailsCell>
        )}
      </Group>
    </>
  )
}
