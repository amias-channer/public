import { TFunction } from 'i18next'
import { ReactElement } from 'react'
import * as Icons from '@revolut/icons'
import { Avatar } from '@revolut/ui-kit'

import { GooglePayIcon } from '@revolut/rwa-core-components'
import { UserTopupCardDto } from '@revolut/rwa-core-types'

import { TopUpMethod } from '../../constants'
import { patchCardIssuer } from '../../utils'

const I18N_PREFIX = 'facelift.TopUpMethodsScreen.MethodSelect.popup.options'

type TopUpMethodProps = {
  Icon: ReactElement
  title: string
  description?: string
}

const TOP_UP_METHOD_PROPS = {
  [TopUpMethod.DebitOrCreditCard]: (
    t: TFunction,
    card?: UserTopupCardDto,
  ): TopUpMethodProps => {
    if (card) {
      return {
        Icon: <Avatar useIcon={Icons.Card} />,
        title:
          patchCardIssuer(card.issuer.name) ??
          t('TopUpMethodsScreen.section.linkedCards.undefinedBank'),
        description: `${card.issuer.cardBrand} *${card.lastFour}`,
      }
    }

    return {
      Icon: <Avatar useIcon={Icons.Card} />,
      title: t('TopUpMethodsScreen.options.debitOrCreditCard'),
      description: t(`${I18N_PREFIX}.debitOrCreditCard.description`),
    }
  },
  [TopUpMethod.RegularBankTransfer]: (t: TFunction): TopUpMethodProps => ({
    Icon: <Avatar useIcon={Icons.ArrowRightLeft} />,
    title: t(`${I18N_PREFIX}.regularBankTransfer.title`),
    description: t(`${I18N_PREFIX}.regularBankTransfer.description`),
  }),
  [TopUpMethod.ApplePay]: (t: TFunction): TopUpMethodProps => ({
    Icon: <Icons.ApplePay size="40" />,
    title: t('TopUpMethodsScreen.options.applePay'),
  }),
  [TopUpMethod.GooglePay]: (t: TFunction): TopUpMethodProps => ({
    Icon: <GooglePayIcon size="40" />,
    title: t('TopUpMethodsScreen.options.googlePay'),
  }),
}

type GetTopUpMethodPropsParams =
  | {
      method:
        | TopUpMethod.RegularBankTransfer
        | TopUpMethod.GooglePay
        | TopUpMethod.ApplePay
    }
  | { method: TopUpMethod.DebitOrCreditCard; card?: UserTopupCardDto }

export const getTopUpMethodProps = (t: TFunction, params: GetTopUpMethodPropsParams) => {
  return params.method === TopUpMethod.DebitOrCreditCard
    ? TOP_UP_METHOD_PROPS[params.method](t, params.card)
    : TOP_UP_METHOD_PROPS[params.method](t)
}
