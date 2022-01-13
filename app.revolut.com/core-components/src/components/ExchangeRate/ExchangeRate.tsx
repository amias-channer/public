import { VFC } from 'react'
import { Media, Text } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { useLocale } from '@revolut/rwa-core-i18n'
import { formatRate } from '@revolut/rwa-core-utils'

type Props = {
  color?: string
  exchangeUnit: string
  rate: number
  rateCurrency: string
  rateFraction?: number
}

export const ExchangeRate: VFC<Props> = ({
  color = 'primary',
  exchangeUnit,
  rate,
  rateCurrency,
  rateFraction,
}) => {
  const { locale } = useLocale()

  return (
    <Media color={color} alignItems="center">
      <Media.Side mr="s-8">
        <Icons.ArrowRates size={16} />
      </Media.Side>
      <Media.Content>
        <Text use="p">
          {exchangeUnit} = {formatRate(rate, rateCurrency, locale, rateFraction)}
        </Text>
      </Media.Content>
    </Media>
  )
}
