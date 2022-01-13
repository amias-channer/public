import { useContext, useRef, useEffect, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { AmountGroup, Button, Header, Layout } from '@revolut/ui-kit'

import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import { checkRequired, getCryptoDetailsUrl } from '@revolut/rwa-core-utils'
import { useModal } from '@revolut/rwa-core-components'

import { CryptoContext } from '../../../providers'
import { CryptoExchangeRate } from '../../../components'
import { CryptoExchangeMethod, CryptoExchangeUrlParams } from '../../../types'
import {
  getCryptoExchangeConfirmationUrl,
  getCryptoExchangeMethodUrl,
} from '../../../utils'

import { CurrentExchangeRate } from '../../../types'
import { I18N_NAMESPACE } from './constants'
import { FiatCurrencyPopup } from './FiatCurrencyPopup'
import { CryptoCurrencyInput } from './CryptoCurrencyInput'
import { FiatCurrencyInput } from './FiatCurrencyInput'
import { useExchangeInputs } from './hooks'
import { checkIsCryptoBuyMethod } from './utils'
import { ExchangeBreakdownPopup } from './ExchangeBreakdownPopup'

type Props = {
  onExchangeRateUpdate: (newExchangeRate: CurrentExchangeRate) => void
}

export const CryptoExchange: VFC<Props> = ({ onExchangeRateUpdate }) => {
  const history = useHistory()

  const { t } = useTranslation(I18N_NAMESPACE)

  const { cryptoCode, exchangeMethod } = useParams<CryptoExchangeUrlParams>()

  const initialExchangeMethodRef = useRef(exchangeMethod)

  const { targetCurrency, setTargetCurrency } = useContext(CryptoContext)

  const [showExchangeBreakdownPopup, exchangeBreakdownPopupProps] = useModal()

  const {
    cryptoErrorMessage,
    cryptoFee,
    cryptoLowerLimit,
    cryptoUpperLimit,
    cryptoValue,
    exchangedAmountWithoutFees,
    fiatErrorMessage,
    fiatFee,
    fiatLowerLimit,
    fiatUpperLimit,
    fiatValue,
    fromAmountAfterFees,
    providedAmount,
    rate,
    rateTimestamp,
    toAmountAfterFees,
    onCryptoInputChange,
    onCryptoInputError,
    onCryptoInputFocus,
    onFiatInputChange,
    onFiatInputError,
    onFiatInputFocus,
    onReviewClick,
  } = useExchangeInputs({
    cryptoCode,
    exchangeMethod,
    fiatCurrencyCode: targetCurrency,
  })

  useEffect(() => {
    onExchangeRateUpdate({ rate, timestamp: rateTimestamp })
  }, [onExchangeRateUpdate, rate, rateTimestamp])

  useEffect(() => {
    trackEvent(CryptoTrackingEvent.exchangeFlowOpened, {
      ORDERSIDE: exchangeMethod,
      TICKER: cryptoCode,
    })
  }, [cryptoCode, exchangeMethod])

  const [showFiatCurrencyPopup, fiatCurrencyPopupProps] = useModal()

  const handleMethodSwitch = () => {
    const isBuyMethod = checkIsCryptoBuyMethod(exchangeMethod)

    history.replace(
      getCryptoExchangeMethodUrl(
        cryptoCode,
        isBuyMethod ? CryptoExchangeMethod.Sell : CryptoExchangeMethod.Buy,
      ),
    )
  }

  const handleBackClick = () => {
    history.push(
      getCryptoDetailsUrl(cryptoCode, {
        tab: 'overview',
        source: 'exchangeFlowCanceled',
      }),
    )
  }

  const handleReviewButtonClick = () => {
    onReviewClick()
    history.push(getCryptoExchangeConfirmationUrl(cryptoCode, exchangeMethod))
  }

  const CryptoInput = (
    <CryptoCurrencyInput
      key="crypto-currency-input"
      cryptoCode={cryptoCode}
      errorMessage={cryptoErrorMessage}
      exchangeMethod={exchangeMethod}
      fee={cryptoFee}
      fiatCurrencyCode={targetCurrency}
      lowerLimit={cryptoLowerLimit}
      upperLimit={cryptoUpperLimit}
      value={cryptoValue}
      onChange={onCryptoInputChange}
      onError={onCryptoInputError}
      onFeeClick={showExchangeBreakdownPopup}
      onFocus={onCryptoInputFocus}
    />
  )

  const FiatInput = (
    <FiatCurrencyInput
      key="fiat-currency-input"
      cryptoExchangeMethod={exchangeMethod}
      currencyCode={targetCurrency}
      errorMessage={fiatErrorMessage}
      fee={fiatFee}
      lowerLimit={fiatLowerLimit}
      upperLimit={fiatUpperLimit}
      value={fiatValue}
      onChange={onFiatInputChange}
      onCurrencyClick={showFiatCurrencyPopup}
      onError={onFiatInputError}
      onFeeClick={showExchangeBreakdownPopup}
      onFocus={onFiatInputFocus}
    />
  )

  const inputsBuyOrder = [CryptoInput, FiatInput]

  const isInitialBuyMethod = checkIsCryptoBuyMethod(initialExchangeMethodRef.current)

  const hasMethodChanged = initialExchangeMethodRef.current !== exchangeMethod

  const hasError = Boolean(cryptoErrorMessage) || Boolean(fiatErrorMessage)

  const buttonDisabled = hasError || !cryptoValue || !fiatValue

  const totalFee = cryptoFee || fiatFee

  const isFeesPopupAvailable =
    Boolean(exchangedAmountWithoutFees?.value) &&
    Boolean(fromAmountAfterFees || toAmountAfterFees) &&
    Boolean(providedAmount?.value) &&
    Boolean(totalFee)

  return (
    <>
      <Layout.Main>
        <Header variant="item">
          <Header.BackButton onClick={handleBackClick} />
          <Header.Title>
            {t(`CryptoExchange.title.${exchangeMethod}`, { cryptoCode })}
          </Header.Title>

          <Header.Subtitle>
            <CryptoExchangeRate
              cryptoCode={cryptoCode}
              fiatCurrencyCode={targetCurrency}
              rate={rate}
            />
          </Header.Subtitle>
        </Header>
        <AmountGroup
          variant="grey"
          onClick={handleMethodSwitch}
          aria-label="Switch"
          switched={hasMethodChanged}
        >
          {isInitialBuyMethod ? inputsBuyOrder : inputsBuyOrder.reverse()}
        </AmountGroup>
        <FiatCurrencyPopup
          {...fiatCurrencyPopupProps}
          selectedCurrency={targetCurrency}
          onCurrencyChange={setTargetCurrency}
        />
        {isFeesPopupAvailable && (
          <ExchangeBreakdownPopup
            cryptoCode={cryptoCode}
            exchangedAmountWithoutFees={checkRequired(exchangedAmountWithoutFees)}
            feeBreakdown={checkRequired(totalFee).breakdown}
            fiatCurrencyCode={targetCurrency}
            fromAmountAfterFees={fromAmountAfterFees}
            providedAmount={checkRequired(providedAmount)}
            rate={rate}
            toAmountAfterFees={toAmountAfterFees}
            {...exchangeBreakdownPopupProps}
          />
        )}
      </Layout.Main>
      <Layout.Actions>
        <Button disabled={buttonDisabled} elevated onClick={handleReviewButtonClick}>
          {t('CryptoExchange.reviewButton')}
        </Button>
      </Layout.Actions>
    </>
  )
}
