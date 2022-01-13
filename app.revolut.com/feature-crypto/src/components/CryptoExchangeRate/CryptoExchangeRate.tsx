import { VFC } from 'react'

import { ExchangeRate } from '@revolut/rwa-core-components'

type Props = {
  cryptoCode: string
  fiatCurrencyCode: string
  rate: number
}

const ONE_CRYPTO_UNIT = 1
const FIAT_RATE_FRACTION = 4

export const CryptoExchangeRate: VFC<Props> = ({
  cryptoCode,
  fiatCurrencyCode,
  rate,
}) => {
  const formattedCryptoUnit = `${ONE_CRYPTO_UNIT} ${cryptoCode}`

  return (
    <ExchangeRate
      color="black"
      exchangeUnit={formattedCryptoUnit}
      rate={rate}
      rateCurrency={fiatCurrencyCode}
      rateFraction={FIAT_RATE_FRACTION}
    />
  )
}
