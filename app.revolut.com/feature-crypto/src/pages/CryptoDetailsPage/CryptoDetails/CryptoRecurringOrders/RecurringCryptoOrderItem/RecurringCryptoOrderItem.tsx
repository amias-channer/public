import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Item, Avatar, chain } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { getConfigValue, ConfigKey, CurrenciesType } from '@revolut/rwa-core-config'
import { useLocale } from '@revolut/rwa-core-i18n'
import { RecurringPaymentCrypto, StandingOrderState } from '@revolut/rwa-core-types'
import {
  formatMoney,
  getFormattedDate,
  getRecurringPeriodText,
} from '@revolut/rwa-core-utils'

import { CryptoAvatar } from '../../../../../components'
import { I18N_NAMESPACE } from '../../../constants'

type Props = {
  recurringPaymentItem: RecurringPaymentCrypto
  cryptoCode: string
  onClick: VoidFunction
}

export const RecurringCryptoOrderItem: VFC<Props> = ({
  recurringPaymentItem,
  cryptoCode,
  onClick,
}) => {
  const { t } = useTranslation([I18N_NAMESPACE, 'common'])

  const { locale } = useLocale()
  const cryptoCurrenciesInfo = getConfigValue<CurrenciesType>(ConfigKey.CryptoCurrencies)
  const currencyInfo = cryptoCurrenciesInfo[cryptoCode]

  const isInactive = recurringPaymentItem.state === StandingOrderState.Inactive
  return (
    <Item inactive={isInactive} use="button" onClick={onClick}>
      <Item.Avatar>
        <CryptoAvatar cryptoCode={cryptoCode}>
          <Avatar.Badge useIcon={Icons.PaymentsRecurring} />
        </CryptoAvatar>
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{currencyInfo.currency}</Item.Title>
        <Item.Description>
          {chain([
            getRecurringPeriodText(recurringPaymentItem.period),
            isInactive
              ? t(`${I18N_NAMESPACE}:RecurringOrderItem.deactivatedState`)
              : t(`${I18N_NAMESPACE}:RecurringOrderItem.nextPaymentDate`, {
                  nextDate: getFormattedDate(new Date(recurringPaymentItem.nextDate)),
                }),
          ])}
        </Item.Description>
      </Item.Content>
      <Item.Side>
        <Item.Value>
          {formatMoney(
            recurringPaymentItem.amount,
            recurringPaymentItem.currency,
            locale,
          )}
        </Item.Value>
      </Item.Side>
    </Item>
  )
}
