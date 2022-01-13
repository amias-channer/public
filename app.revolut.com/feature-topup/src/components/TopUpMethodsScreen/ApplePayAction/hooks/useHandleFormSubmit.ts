import { useCallback, useContext } from 'react'

import { TopupAmount } from '@revolut/rwa-core-types'
import {
  DEFAULT_LOCALE,
  base64Encode,
  browser,
  checkRequired,
  formatMoney,
} from '@revolut/rwa-core-utils'

import { TopUpContext } from '../../../TopUpProvider'
import {
  APPLE_PAY_API_VERSION,
  APPLE_PAY_DISPLAY_NAME,
  APPLE_PAY_INITIATIVE,
  MERCHANT_COUNTRY_CODE,
} from '../constants'
import {
  useApplePayGatewayConfig,
  useValidateApplePayMerchant,
  useTopupByApplePay,
} from './api'

/**
 * Please see:
 * https://developer.apple.com/documentation/apple_pay_on_the_web/applepaylineitem/1916086-amount
 */
export const formatRequestAmount = (amount: TopupAmount) => {
  return formatMoney(amount.amount, amount.currency, DEFAULT_LOCALE, {
    withCurrency: false,
    useGrouping: false,
  }).replace(',', '.')
}

const makePaymentRequest = (amount: TopupAmount): ApplePayJS.ApplePayPaymentRequest => {
  return {
    countryCode: MERCHANT_COUNTRY_CODE,
    currencyCode: amount.currency,
    supportedNetworks: ['visa', 'masterCard'],
    merchantCapabilities: ['supports3DS'],
    total: {
      label: APPLE_PAY_DISPLAY_NAME,
      amount: formatRequestAmount(amount),
    },
  }
}

export type UseHandleFormSubmitArgs = {
  onBeforeSubmit: VoidFunction
  onSuccess: VoidFunction
  onError: VoidFunction
  onCancel: VoidFunction
}

export const useHandleFormSubmit = ({
  onBeforeSubmit,
  onSuccess,
  onError,
  onCancel,
}: UseHandleFormSubmitArgs) => {
  const { amount } = useContext(TopUpContext)

  const getApplePayGatewayConfig = useApplePayGatewayConfig()
  const validateApplePayMerchant = useValidateApplePayMerchant()
  const topupByApplePay = useTopupByApplePay()

  return useCallback(() => {
    onBeforeSubmit()

    const checkedAmount = checkRequired(amount, '"amount" can not be empty')

    const applePaySession = new ApplePaySession(
      APPLE_PAY_API_VERSION,
      makePaymentRequest(checkedAmount),
    )

    getApplePayGatewayConfig(checkedAmount).then((gatewayConfig) => {
      /**
       * Merchant Validation
       *
       * We call our merchant session endpoint, passing the URL to use
       */
      applePaySession.onvalidatemerchant = (event) => {
        return validateApplePayMerchant(
          {
            displayName: APPLE_PAY_DISPLAY_NAME,
            initiative: APPLE_PAY_INITIATIVE,
            initiativeContext: browser.getHostname(),
            merchantIdentifier: gatewayConfig.merchantId,
            validationURI: event.validationURL,
          },
          {
            onSuccess: ({ data: merchantSession }) =>
              applePaySession.completeMerchantValidation(merchantSession),

            onError: () => {
              applePaySession.abort()
              onError()
            },
          },
        )
      }

      /**
       * Payment Authorization
       *
       * Here you receive the encrypted payment data. You would then send it
       * on to your payment provider for processing, and return an appropriate
       * status in session.completePayment()
       */
      applePaySession.onpaymentauthorized = (event) => {
        const { paymentMethod, paymentData } = event.payment.token

        return topupByApplePay(
          {
            amount: checkedAmount.amount,
            currency: checkedAmount.currency,
            cardBrand: paymentMethod.network.toUpperCase(),
            cardType: paymentMethod.type.toUpperCase(),
            /**
             * Payment data dictionary (serialized and base64 encoded)
             *
             * See https://developer.apple.com/library/archive/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html
             */
            paymentToken: base64Encode(JSON.stringify(paymentData)),
          },
          {
            onSuccess: () => {
              applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS)
              onSuccess()
            },

            onError: () => {
              applePaySession.completePayment(ApplePaySession.STATUS_FAILURE)
              onError()
            },
          },
        )
      }

      applePaySession.oncancel = onCancel

      applePaySession.begin()
    })
  }, [
    amount,
    getApplePayGatewayConfig,
    topupByApplePay,
    validateApplePayMerchant,
    onBeforeSubmit,
    onSuccess,
    onError,
    onCancel,
  ])
}
