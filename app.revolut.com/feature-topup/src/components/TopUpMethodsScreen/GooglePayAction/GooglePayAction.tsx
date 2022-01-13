import noop from 'lodash/noop'
import { FC, useRef, useCallback, useContext, useEffect, useState } from 'react'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useModal } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { asyncScriptLoader, checkRequired } from '@revolut/rwa-core-utils'

import { ErrorPopup } from '../../ErrorPopup'
import { useRefreshAccountBalance } from '../../hooks'
import { SuccessPopup } from '../../SuccessPopup'
import { TopUpContext } from '../../TopUpProvider'
import { useGooglePayButton } from './hooks'
import { GooglePayContainerStyled } from './styled'

// Zero amount is required to show disabled G-Pay button.
const getZeroAmount = (currency: string | undefined) => ({
  amount: 0,
  currency: checkRequired(currency, '"currency" can not be empty'),
})

type GooglePayActionProps = {
  disabled?: boolean
  onSuccess: VoidFunction
}

/**
 * @see https://revolut.atlassian.net/wiki/spaces/RET/pages/1926564870/Google+Pay
 */
export const GooglePayAction: FC<GooglePayActionProps> = ({ disabled, onSuccess }) => {
  const { amount } = useContext(TopUpContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const refreshAccountBalance = useRefreshAccountBalance()
  const [showSuccessPopup, successPopupProps] = useModal()
  const [showErrorPopup, errorPopupProps] = useModal()

  const [isGooglePayApiReady, setGooglePayApiReady] = useState(false)

  const handleBeforeSubmit = useCallback(() => {
    trackEvent(TopUpTrackingEvent.topUpViaGooglePayStarted)
  }, [])

  const handleSubmitSuccess = useCallback(() => {
    refreshAccountBalance().then(showSuccessPopup)
    trackEvent(TopUpTrackingEvent.topUpViaGooglePayCompleted)
  }, [refreshAccountBalance, showSuccessPopup])

  const handleSubmitError = useCallback(() => {
    showErrorPopup()
    trackEvent(TopUpTrackingEvent.topUpViaGooglePayFailed)
  }, [showErrorPopup])

  useEffect(() => {
    asyncScriptLoader(getConfigValue(ConfigKey.GooglePayApiUrl)).then(() =>
      setGooglePayApiReady(true),
    )
  }, [setGooglePayApiReady])

  useGooglePayButton({
    isGooglePayApiReady,
    amount: disabled ? getZeroAmount(amount?.currency) : amount,
    container: containerRef.current,
    onBeforeSubmit: handleBeforeSubmit,
    onSuccess: handleSubmitSuccess,
    onError: handleSubmitError,
  })

  return (
    <>
      <GooglePayContainerStyled
        ref={containerRef}
        disabled={!isGooglePayApiReady || disabled}
      />

      <SuccessPopup onAutoHide={onSuccess} {...successPopupProps} />
      <ErrorPopup onTryAnotherMethod={noop} {...errorPopupProps} />
    </>
  )
}
