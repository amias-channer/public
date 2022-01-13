import { useEffect, VFC } from 'react'
import { Layout } from '@revolut/ui-kit'
import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'

import { useCryptoPeriodicalAssetsQuote } from '../../../hooks'
import { CryptoExchangeParams } from '../../../types'
import { CryptoExchangeConfirmationHeader } from './CryptoExchangeConfirmationHeader'
import { CryptoExchangeConfirmationDetails } from './CryptoExchangeConfirmationDetails'
import { CryptoExchangeConfirmationAction } from './CryptoExchangeConfirmationAction'

type Props = {
  cryptoExchangeParams: CryptoExchangeParams
}

export const CryptoExchangeConfirmation: VFC<Props> = ({ cryptoExchangeParams }) => {
  const { assetsQuote } = useCryptoPeriodicalAssetsQuote(cryptoExchangeParams)

  const { exchangeMethod, cryptoCurrencySymbol, fiatCurrencySymbol } =
    cryptoExchangeParams

  useEffect(() => {
    trackEvent(CryptoTrackingEvent.exchangeReviewOpened, {
      TICKER: cryptoCurrencySymbol,
      ORDERSIDE: exchangeMethod,
    })
  }, [cryptoCurrencySymbol, exchangeMethod])

  return (
    <>
      <Layout.Main>
        <CryptoExchangeConfirmationHeader
          assetsQuote={assetsQuote}
          cryptoCode={cryptoCurrencySymbol}
          exchangeMethod={exchangeMethod}
          fiatCurrencyCode={fiatCurrencySymbol}
        />
        <CryptoExchangeConfirmationDetails
          assetsQuote={assetsQuote}
          cryptoCode={cryptoCurrencySymbol}
          fiatCurrencyCode={fiatCurrencySymbol}
        />
      </Layout.Main>
      <Layout.Actions>
        <CryptoExchangeConfirmationAction
          assetsQuote={assetsQuote}
          cryptoCode={cryptoCurrencySymbol}
          exchangeMethod={exchangeMethod}
          fiatCurrencyCode={fiatCurrencySymbol}
        />
      </Layout.Actions>
    </>
  )
}
