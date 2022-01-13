import { format } from 'date-fns'
import * as locales from 'date-fns/locale'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LogoRevolut, StatusClockArrows } from '@revolut/icons'
import { Card, Circle, Media, TextBox, Color } from '@revolut/ui-kit'

import { Bullet } from '@revolut/rwa-core-components'
import { CardFee } from '@revolut/rwa-core-types'
import {
  DateFormat,
  formatMoney,
  getCurrentLocale,
  getDateFnsFormatCurrentLocale,
  IconSize,
  Url,
} from '@revolut/rwa-core-utils'

import { useGetPendingCardPayment } from 'hooks'
import { getTotalCardFee } from 'utils'

export const PendingCardPaymentAction: FC = () => {
  const { t } = useTranslation('pages.Accounts')
  const { pendingCardPayment } = useGetPendingCardPayment()

  if (!pendingCardPayment) {
    return null
  }

  const totalCardPrice: CardFee = getTotalCardFee(pendingCardPayment.card)

  const cardOrderCreatedDate = format(
    new Date(pendingCardPayment.createdDate),
    DateFormat.CardOrderCreatedDate,
    {
      locale: locales[getDateFnsFormatCurrentLocale()] || locales.enGB,
    },
  )

  return (
    <Link to={Url.CardOrderingTopUp}>
      <Card p="px16" variant="elevated">
        <Media pl={{ md: 'px8' }} pr={{ md: 'px16' }}>
          <Media.Side px={{ md: 'px4' }}>
            <Bullet.Anchor>
              <Circle bg="pendingCardPaymentActionIconBg" size={56}>
                <LogoRevolut
                  size={IconSize.Medium}
                  color="pendingCardPaymentActionLogo"
                />
              </Circle>

              <Bullet bg="primary" color={'primaryWhite' as Color}>
                <StatusClockArrows size={IconSize.Small} />
              </Bullet>
            </Bullet.Anchor>
          </Media.Side>
          <Media>
            <Media.Content alignSelf="center" px="px16">
              <TextBox variant="primary" fontWeight="bolder">
                {t('PendingCardPaymentAction.title')}
              </TextBox>
              <TextBox mt="px4" variant="secondary" color="secondaryTextColor">
                {t('PendingCardPaymentAction.text', { date: cardOrderCreatedDate })}
              </TextBox>
            </Media.Content>
            <Media.Side>
              <TextBox variant="primary" textAlign="right">
                -
                {formatMoney(
                  totalCardPrice.amount,
                  totalCardPrice.currency,
                  getCurrentLocale(),
                )}
              </TextBox>
            </Media.Side>
          </Media>
        </Media>
      </Card>
    </Link>
  )
}
