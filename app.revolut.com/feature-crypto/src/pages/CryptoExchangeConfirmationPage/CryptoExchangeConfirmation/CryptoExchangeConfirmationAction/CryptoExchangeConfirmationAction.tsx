import { VFC } from 'react'
import { Button, Footnote } from '@revolut/ui-kit'
import * as Sentry from '@sentry/react'
import { AxiosError } from 'axios'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import { useFxExchange, useInvalidateQueries } from '@revolut/rwa-core-api'
import { ErrorPopup, useModal } from '@revolut/rwa-core-components'
import { AssetsQuoteResponseDto } from '@revolut/rwa-core-types'
import {
  convertCurrencyToMonetaryUnits,
  getCryptoDetailsUrl,
  QueryKey,
} from '@revolut/rwa-core-utils'

import { CryptoExchangeMethod } from '../../../../types'
import { CryptoExchangeSuccessPopup } from '../CryptoExchangeSuccessPopup'
import { useGetAssetsValuesFromAssetsQuote } from '../hooks'
import { I18N_NAMESPACE } from '../../constants'

type Props = {
  assetsQuote?: AssetsQuoteResponseDto
  cryptoCode: string
  exchangeMethod: CryptoExchangeMethod
  fiatCurrencyCode: string
}

const prepareExchangeParams = (assetsQuote: AssetsQuoteResponseDto) => {
  const baseParams = {
    fromCcy: assetsQuote.fromAmount.symbol,
    rateTimestamp: assetsQuote.timestamp,
    toCcy: assetsQuote.toAmount.symbol,
  }

  if (assetsQuote.fromAmountAfterFees) {
    return {
      ...baseParams,
      toAmount: convertCurrencyToMonetaryUnits(
        assetsQuote.toAmount.symbol,
        Number(assetsQuote.toAmount.value),
      ),
    }
  }

  return {
    ...baseParams,
    fromAmount: convertCurrencyToMonetaryUnits(
      assetsQuote.fromAmount.symbol,
      Number(assetsQuote.fromAmount.value),
    ),
  }
}

export const CryptoExchangeConfirmationAction: VFC<Props> = ({
  assetsQuote,
  cryptoCode,
  exchangeMethod,
  fiatCurrencyCode,
}) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)

  const invalidateQueries = useInvalidateQueries()

  const { exchange, isExchangeProcessing } = useFxExchange()

  const [openSuccessPopup, successPopupProps] = useModal()
  const [openErrorPopup, errorPopupProps] = useModal()

  const { fiatValue, cryptoValue } = useGetAssetsValuesFromAssetsQuote({
    assetsQuote,
    cryptoCode,
    fiatCurrencyCode,
  })

  const handleExchange = () => {
    if (!assetsQuote) {
      return
    }

    exchange(prepareExchangeParams(assetsQuote), {
      onSuccess: () => {
        trackEvent(CryptoTrackingEvent.exchangeFlowCompleted, {
          TICKER: cryptoCode,
          ORDERSIDE: exchangeMethod,
        })
        openSuccessPopup()
      },
      onError: (error: AxiosError) => {
        Sentry.captureException(
          new Error(`error while ${exchangeMethod} crypto: ${error.response}`),
        )

        trackEvent(CryptoTrackingEvent.exchangeFlowFailed, {
          TICKER: cryptoCode,
          ORDERSIDE: exchangeMethod,
        })

        openErrorPopup()
      },
    })
  }

  const handleSuccessPopupClose = async () => {
    successPopupProps.onRequestClose()
    await invalidateQueries(
      QueryKey.Wallet,
      QueryKey.Accounts,
      QueryKey.CryptoHoldings,
      QueryKey.Transactions,
    )
    history.push(
      getCryptoDetailsUrl(cryptoCode, {
        tab: 'transactions',
        source: 'exchangeFlowCompleted',
      }),
    )
  }

  const isButtonDisabled = isExchangeProcessing || !assetsQuote

  return (
    <>
      <Footnote>{t('footnote')}</Footnote>
      <Button
        pending={isButtonDisabled}
        disabled={isButtonDisabled}
        elevated
        onClick={handleExchange}
      >
        {t('buttonText')}
      </Button>
      <ErrorPopup {...errorPopupProps} />
      <CryptoExchangeSuccessPopup
        cryptoAmount={cryptoValue}
        exchangeMethod={exchangeMethod}
        fiatAmount={fiatValue}
        {...successPopupProps}
        onRequestClose={handleSuccessPopupClose}
      />
    </>
  )
}
