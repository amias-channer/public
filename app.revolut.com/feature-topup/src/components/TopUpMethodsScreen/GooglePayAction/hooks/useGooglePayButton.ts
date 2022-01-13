import { useEffect } from 'react'
import * as Sentry from '@sentry/react'

import {
  ConfigKey,
  getConfigValue,
  isStagingOrProductionEnv,
} from '@revolut/rwa-core-config'
import { TopupAmount, TopupByGooglePayRequestDto } from '@revolut/rwa-core-types'
import {
  base64Encode,
  buildSentryContext,
  checkRequired,
  SentryTag,
} from '@revolut/rwa-core-utils'

import { useGooglePayGatewayConfig, useTopupByGooglePay } from './api'

const PATH_AUTH_METHOD = 'PAN_ONLY'

enum GooglePayEnv {
  Test = 'TEST',
  Production = 'PRODUCTION',
}

const patchAllowedAuthMethods = (
  paymentDataRequest: google.payments.api.PaymentDataRequest,
) => {
  paymentDataRequest.allowedPaymentMethods.forEach((method) => {
    method.parameters.allowedAuthMethods.push(PATH_AUTH_METHOD)
  })
}

const patchMerchantId = (paymentDataRequest: google.payments.api.PaymentDataRequest) => {
  paymentDataRequest.merchantInfo.merchantId = getConfigValue(
    ConfigKey.GooglePayMerchantId,
  )
}

const prepareTopupData = (
  checkedAmount: TopupAmount,
  paymentData: google.payments.api.PaymentData,
) =>
  ({
    lastFour: paymentData.paymentMethodData.info?.cardDetails,
    cardBrand: paymentData.paymentMethodData.info?.cardNetwork,
    amount: checkedAmount.amount,
    currency: checkedAmount.currency,
    paymentToken: base64Encode(paymentData.paymentMethodData.tokenizationData.token),
  } as TopupByGooglePayRequestDto)

const rebuildContainer = (container: HTMLElement | null, button: HTMLElement) => {
  if (!container) {
    return
  }

  for (const child of Array.from(container.children)) {
    if (child.tagName !== 'STYLE') {
      child.remove()
    }
  }

  container.appendChild(button)
}

type UseGooglePayButtonArgs = {
  isGooglePayApiReady: boolean
  amount: TopupAmount | undefined
  container: HTMLElement | null
  onBeforeSubmit: VoidFunction
  onSuccess: VoidFunction
  onError: VoidFunction
}

export const useGooglePayButton = ({
  isGooglePayApiReady,
  amount,
  container,
  onBeforeSubmit,
  onSuccess,
  onError,
}: UseGooglePayButtonArgs) => {
  const { data: gatewayConfigData } = useGooglePayGatewayConfig(amount, onError)
  const topupByGooglePay = useTopupByGooglePay()

  useEffect(() => {
    if (!isGooglePayApiReady || !gatewayConfigData) {
      return
    }

    const checkedAmount = checkRequired(amount, '"amount" can not be empty')
    const paymentDataRequest =
      gatewayConfigData as unknown as google.payments.api.PaymentDataRequest

    patchAllowedAuthMethods(paymentDataRequest)
    patchMerchantId(paymentDataRequest)

    const paymentsClient = new google.payments.api.PaymentsClient({
      environment: isStagingOrProductionEnv()
        ? GooglePayEnv.Production
        : GooglePayEnv.Test,
    })

    const isReadyToPayRequest: google.payments.api.IsReadyToPayRequest = {
      apiVersion: paymentDataRequest.apiVersion,
      apiVersionMinor: paymentDataRequest.apiVersionMinor,
      allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
      existingPaymentMethodRequired: false,
    }

    const buttonOnClick = () => {
      onBeforeSubmit()

      paymentsClient
        .loadPaymentData(paymentDataRequest)
        .then((paymentData) =>
          topupByGooglePay(prepareTopupData(checkedAmount, paymentData)),
        )
        .then(onSuccess)
        .catch((e) => {
          Sentry.captureException(e, {
            tags: { [SentryTag.Context]: buildSentryContext(['top up', 'google pay']) },
          })

          onError()
        })
    }

    paymentsClient
      .isReadyToPay(isReadyToPayRequest)
      .then((response) => {
        if (!response.result) {
          return
        }

        const button = paymentsClient.createButton({
          buttonColor: 'default',
          buttonType: 'plain',
          buttonSizeMode: 'fill',
          onClick: buttonOnClick,
        })

        rebuildContainer(container, button)
      })
      .catch((e) => {
        Sentry.captureException(e, {
          tags: { [SentryTag.Context]: buildSentryContext(['top up', 'google pay']) },
        })

        onError()
      })
  }, [
    isGooglePayApiReady,
    amount,
    container,
    gatewayConfigData,
    topupByGooglePay,
    onBeforeSubmit,
    onSuccess,
    onError,
  ])
}
