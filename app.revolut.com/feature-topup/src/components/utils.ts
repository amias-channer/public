import { TopupAmount, TopupCardBrand } from '@revolut/rwa-core-types'
import { formatMoney as formatMoneyUtil, getCurrentLocale } from '@revolut/rwa-core-utils'

export const formatMoney = (amount: TopupAmount, noDecimal?: boolean) =>
  formatMoneyUtil(amount.amount, amount.currency, getCurrentLocale(), {
    withCurrency: true,
    useGrouping: true,
    noDecimal,
  })

export const patchCardIssuer = (cardBrand?: string) =>
  cardBrand === TopupCardBrand.Uatp ? TopupCardBrand.Jcb : cardBrand
