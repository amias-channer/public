import { useFormik } from 'formik'
import defer from 'lodash/defer'
import isNil from 'lodash/isNil'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Button, Layout } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { useQueryUserConfig, useQueryWallet } from '@revolut/rwa-core-api'
import { FullPageLoader, HiddenFormButton, useModal } from '@revolut/rwa-core-components'
import { TopupCardIssuerDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { getBin } from '../../utils'
import { AvoidBankFeesPopup } from '../AvoidBankFeesPopup'
import { I18N_NAMESPACE } from '../constants'
import { ErrorPopup } from '../ErrorPopup'
import { useRefreshAccountBalance } from '../hooks'
import { SuccessPopup } from '../SuccessPopup'
import { TopUpContext } from '../TopUpProvider'
import { formatMoney } from '../utils'
import { CardForm } from './CardForm'
import { FormFieldName, getFormInitialValues, getFormValidationSchema } from './form'
import {
  useHandleFormSubmit,
  useQueryCardIssuerInfo,
  useQueryTopupTransactionStatus,
} from './hooks'
import { ScreenHeader } from './ScreenHeader'
import { IFrame3ds, IFrame3dsContainer, IFrame3dsSpinnerContainer } from './styled'
import { OnSuccessHandlerArgs } from './types'
import { submitFormToIframe } from './utils'

const IFRAME_3DS_NAME = 'topup-iframe3ds'
const EMPTY_FORMATTED_AMOUNT = ''

export enum TopUpViaCardScreenTestId {
  IFrame = 'TopUpViaCardScreenTestId.IFrame',
}

type TopUpViaCardScreenProps = {
  onGoBack: VoidFunction
  onSuccess: VoidFunction
}

export const TopUpViaCardScreen: FC<TopUpViaCardScreenProps> = ({
  onGoBack,
  onSuccess,
}) => {
  const { t } = useTranslation([
    I18N_NAMESPACE,
    I18nNamespace.Common,
    I18nNamespace.Domain,
  ])
  const { user } = useAuthContext()
  const { amount, linkedCard } = useContext(TopUpContext)
  const refreshAccountBalance = useRefreshAccountBalance()

  const [showAvoidBankFeesPopup, avoidBankFeesPopupProps] = useModal()
  const [showSuccessPopup, successPopupProps] = useModal()
  const [showErrorPopup, errorPopupProps] = useModal()

  const [userConfig] = useQueryUserConfig()
  const { data: walletData } = useQueryWallet()

  const [isPostCodeRequired, setPostCodeRequired] = useState(false)
  const [issuer, setIssuer] = useState<TopupCardIssuerDto | undefined>(linkedCard?.issuer)
  const [isIFrame3dsShown, setIFrame3dsShown] = useState(false)

  const [paymentId, setPaymentId] = useState<string>()
  const [paymentUrl, setPaymentUrl] = useState<string>()

  const handleTopUpSuccess = useCallback(() => {
    showSuccessPopup()

    trackEvent(TopUpTrackingEvent.topUpViaCardCompleted, {
      linkedCardId: linkedCard?.id,
    })
  }, [linkedCard?.id, showSuccessPopup])

  const handleTopUpError = useCallback(() => {
    showErrorPopup()

    trackEvent(TopUpTrackingEvent.topUpViaCardFailed, {
      linkedCardId: linkedCard?.id,
    })
  }, [linkedCard?.id, showErrorPopup])

  const handleErrorPopupRetry = () => {
    setIFrame3dsShown(false)
  }

  const handleFormSubmitSuccess = useCallback(
    (data: OnSuccessHandlerArgs) => {
      setPaymentId(data.paymentId)

      if (data.paymentUrl) {
        if (data.formToIframeData) {
          submitFormToIframe(IFRAME_3DS_NAME, data.paymentUrl, data.formToIframeData)
        } else {
          setPaymentUrl(data.paymentUrl)
        }
      }
    },
    [setPaymentId, setPaymentUrl],
  )

  const handleFormSubmit = useHandleFormSubmit({
    onSuccess: handleFormSubmitSuccess,
    onError: handleTopUpError,
  })

  const {
    values: formValues,
    errors: formErrors,
    handleChange: handleFormChange,
    handleBlur: handleFormBlur,
    setFieldValue: setFormFieldValue,
    validateForm,
    dirty: isFormDirty,
    isValid: isFormValid,
    isSubmitting: isFormSubmitting,
    handleSubmit: formHandleSubmit,
  } = useFormik({
    initialValues: getFormInitialValues(linkedCard),
    validationSchema: getFormValidationSchema({
      t,
      isPostCodeRequired,
      hasLinkedCard: Boolean(linkedCard),
      issuer,
    }),
    onSubmit: handleFormSubmit,
  })

  const { data: issuerData } = useQueryCardIssuerInfo(
    getBin(formValues[FormFieldName.CardNumber]),
  )

  useEffect(() => {
    if (!linkedCard) {
      setIssuer(issuerData?.data)
    }
  }, [issuerData?.data, linkedCard, setIssuer])

  useEffect(() => {
    if (user?.address.country === issuer?.country) {
      setFormFieldValue(FormFieldName.PostCode, user?.address.postcode)
    }

    setPostCodeRequired(issuer?.postcodeRequired ?? false)
  }, [
    issuer,
    user?.address.country,
    user?.address.postcode,
    setPostCodeRequired,
    setFormFieldValue,
  ])

  useEffect(() => {
    // Revalidate on next tick
    defer(validateForm)
  }, [issuer, validateForm])

  const { status: topupRequestStatus } = useQueryTopupTransactionStatus(paymentId)

  useEffect(() => {
    if (isNil(paymentId)) {
      return
    }

    if (topupRequestStatus === 'success') {
      refreshAccountBalance().then(handleTopUpSuccess)
    } else if (topupRequestStatus === 'error') {
      handleTopUpError()
      setPaymentId(undefined)
    }
  }, [
    paymentId,
    topupRequestStatus,
    refreshAccountBalance,
    setPaymentId,
    handleTopUpSuccess,
    handleTopUpError,
  ])

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpViaCardStarted, {
      linkedCardId: linkedCard?.id,
    })
  }, [linkedCard?.id])

  const issuerCurrency = issuer?.currency
  const amountCurrency = amount?.currency

  const shouldSubmit = useCallback(() => {
    if (isNil(issuerCurrency) || isNil(amountCurrency)) {
      return false
    }

    if (issuerCurrency === amountCurrency) {
      return true
    }

    showAvoidBankFeesPopup()

    return false
  }, [issuerCurrency, amountCurrency, showAvoidBankFeesPopup])

  const handleSubmitButtonClick = useCallback(() => {
    if (!shouldSubmit()) {
      return
    }

    formHandleSubmit()
  }, [shouldSubmit, formHandleSubmit])

  const handleFormElementSubmit = useCallback(
    (e) => {
      e.preventDefault()

      if (!shouldSubmit()) {
        return false
      }

      formHandleSubmit()

      return false
    },
    [shouldSubmit, formHandleSubmit],
  )

  const handleIFrameLoad = () => {
    if (isNil(paymentId)) {
      return
    }

    setIFrame3dsShown(true)
  }

  if (isNil(userConfig) || isNil(walletData)) {
    return <FullPageLoader />
  }

  const isSubmitButtonLoading = isFormSubmitting
  const isSubmitButtonEnabled =
    isFormDirty && isFormValid && !isFormSubmitting && !paymentId

  return (
    <Layout>
      <Layout.Main>
        <ScreenHeader
          title={t('facelift.TopUpViaCardScreen.ScreenHeader.title')}
          onGoBack={onGoBack}
        />

        <IFrame3dsContainer isShown={isIFrame3dsShown}>
          <IFrame3dsSpinnerContainer>
            <Spinner />
          </IFrame3dsSpinnerContainer>

          <IFrame3ds
            data-testid={TopUpViaCardScreenTestId.IFrame}
            name={IFRAME_3DS_NAME}
            src={paymentUrl}
            referrerPolicy="no-referrer"
            // This configuration is strongly discouraged, but the only option for now.
            // For more details please see:
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#Attributes
            sandbox="allow-scripts allow-forms allow-same-origin"
            onLoad={handleIFrameLoad}
          />
        </IFrame3dsContainer>

        {!isIFrame3dsShown && (
          <>
            <form onSubmit={handleFormElementSubmit}>
              <CardForm
                values={formValues}
                errors={formErrors}
                linkedCard={linkedCard}
                isPostCodeRequired={isPostCodeRequired}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
              />

              <HiddenFormButton type="submit" />
            </form>
            <Layout.Actions>
              <Button
                pending={isSubmitButtonLoading}
                disabled={!isSubmitButtonEnabled}
                onClick={!isIFrame3dsShown ? handleSubmitButtonClick : undefined}
              >
                {t(`${I18N_NAMESPACE}:TopUpViaCreditCardScreen.addMoneyButtonText`, {
                  amountWithCurrency: amount
                    ? formatMoney(amount)
                    : EMPTY_FORMATTED_AMOUNT,
                })}
              </Button>
            </Layout.Actions>
          </>
        )}

        <SuccessPopup onAutoHide={onSuccess} {...successPopupProps} />
        <ErrorPopup
          onTryAnotherMethod={onGoBack}
          onRetry={handleErrorPopupRetry}
          {...errorPopupProps}
        />
        <AvoidBankFeesPopup
          pocketCurrency={amountCurrency}
          cardCurrency={issuerCurrency}
          onContinue={formHandleSubmit}
          {...avoidBankFeesPopupProps}
        />
      </Layout.Main>
    </Layout>
  )
}
