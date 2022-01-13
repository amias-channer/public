import noop from 'lodash/noop'
import { FC, useCallback, useState } from 'react'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useModal } from '@revolut/rwa-core-components'

import { ErrorPopup } from '../../ErrorPopup'
import { useRefreshAccountBalance } from '../../hooks'
import { SuccessPopup } from '../../SuccessPopup'
import { ApplePayButton } from './ApplePayButton'
import { useHandleFormSubmit } from './hooks'

type TopUpViaApplePayActionProps = {
  disabled?: boolean
  onSuccess: VoidFunction
}

/**
 * @see https://revolut.atlassian.net/wiki/spaces/RET/pages/1732936641/Apple+Pay
 */
export const ApplePayAction: FC<TopUpViaApplePayActionProps> = ({
  disabled,
  onSuccess,
}) => {
  const refreshAccountBalance = useRefreshAccountBalance()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)

  const [showSuccessPopup, successPopupProps] = useModal()
  const [showErrorPopup, errorPopupProps] = useModal()

  const handleBeforeSubmit = useCallback(() => {
    setSubmitButtonLoading(true)

    trackEvent(TopUpTrackingEvent.topUpViaApplePayStarted)
  }, [setSubmitButtonLoading])

  const handleSubmitSuccess = useCallback(() => {
    setSubmitButtonLoading(false)

    refreshAccountBalance().then(showSuccessPopup)
    trackEvent(TopUpTrackingEvent.topUpViaApplePayCompleted)
  }, [refreshAccountBalance, setSubmitButtonLoading, showSuccessPopup])

  const handleSubmitError = useCallback(() => {
    setSubmitButtonLoading(false)
    showErrorPopup()
    trackEvent(TopUpTrackingEvent.topUpViaApplePayFailed)
  }, [setSubmitButtonLoading, showErrorPopup])

  const handleSubmitCancel = useCallback(() => {
    setSubmitButtonLoading(false)
    trackEvent(TopUpTrackingEvent.topUpViaApplePayCancelled)
  }, [setSubmitButtonLoading])

  const handleSubmit = useHandleFormSubmit({
    onBeforeSubmit: handleBeforeSubmit,
    onSuccess: handleSubmitSuccess,
    onError: handleSubmitError,
    onCancel: handleSubmitCancel,
  })

  return (
    <>
      <ApplePayButton
        isLoading={isSubmitButtonLoading}
        disabled={disabled}
        onClick={handleSubmit}
      />

      <SuccessPopup onAutoHide={onSuccess} {...successPopupProps} />
      <ErrorPopup onTryAnotherMethod={noop} {...errorPopupProps} />
    </>
  )
}
