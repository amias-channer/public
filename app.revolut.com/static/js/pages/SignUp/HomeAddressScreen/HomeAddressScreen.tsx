import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from '@revolut/ui-kit'

import { AddressResponseItemDto } from '@revolut/rwa-core-types'
import {
  AuthLayout,
  AddressForm,
  AddressFormValues,
  useAddressForm,
  useModal,
} from '@revolut/rwa-core-components'
import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  ApiErrorCode,
  HttpCode,
  I18nNamespace,
  useNavigateToErrorPage,
  getApiErrorCode,
} from '@revolut/rwa-core-utils'

import { PostCodeInvalidModal } from 'components'

import { useRunAuthFlowElements } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { Description } from './Description'
import { SignUpStatutory } from './SignUpStatutory'
import { AddressRequestArguments } from './types'
import { UnsupportedCountryScreen } from './UnsupportedCountryScreen'

export const HomeAddressScreen: SignUpScreenComponent = ({
  goToNextScreen,
  onHomeAddressProvided,
}) => {
  const { t } = useTranslation(['pages.SignUp', I18nNamespace.Common])
  const { phoneNumber } = useAuthContext()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()
  const [showPostCodeInvalidModal, postCodeInvalidModalProps] = useModal()
  const [isUnsupportedCountryScreenVisible, setUnsupportedCountryScreenVisible] =
    useState(false)
  const navigateToErrorPage = useNavigateToErrorPage()

  const handleApiError = useCallback(
    (error: AxiosError) => {
      const responseStatus = error.response?.status
      const errorCode = getApiErrorCode(error)

      let isErrorHandled = false

      if (responseStatus === HttpCode.BadRequest) {
        if (errorCode === ApiErrorCode.InvalidPostCode) {
          showPostCodeInvalidModal()
          isErrorHandled = true
        }
      } else if (responseStatus === HttpCode.UnavailableLegalReasons) {
        if (errorCode === ApiErrorCode.UnsupportedCountry) {
          setUnsupportedCountryScreenVisible(true)
          isErrorHandled = true
        }
      }

      if (!isErrorHandled) {
        navigateToErrorPage(error)
      }
    },
    [navigateToErrorPage, showPostCodeInvalidModal],
  )

  const handleSubmit = useCallback(
    async (formValues: AddressFormValues) => {
      if (formValues) {
        onHomeAddressProvided?.(formValues.country)
        const variables: AddressRequestArguments = {
          address: {
            streetLine1: formValues.addressLine1,
            streetLine2: formValues.addressLine2,
            city: formValues.city,
            country: formValues.country,
            postcode: formValues.postCode,
            region: formValues.region,
          },
        }

        if (formValues.addressSearch?.id) {
          variables.addressRef = formValues.addressSearch.id
        }

        await runAuthFlowElements(variables, {
          onError: handleApiError,
          onSuccess: ({ data }) => {
            goToNextScreen(getUserAuthFlowElement(data))
          },
        })
      }
    },
    [goToNextScreen, handleApiError, onHomeAddressProvided, runAuthFlowElements],
  )

  const addressFormProps = useAddressForm({
    initialCountry: phoneNumber.code,
    onSubmit: handleSubmit,
  })

  const { formValues, handleFormSubmit, isRequiredFieldsFilled } = addressFormProps

  const countryCode = formValues.country

  const postCode =
    formValues.postCode || (formValues.postCodeSearch as AddressResponseItemDto)?.postcode

  if (isUnsupportedCountryScreenVisible) {
    return <UnsupportedCountryScreen countryCode={countryCode} />
  }

  return (
    <AuthLayout
      title={t('HomeAddressScreen.title')}
      description={<Description />}
      submitButtonText={t('common:signup')}
      submitButtonEnabled={isRequiredFieldsFilled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleFormSubmit}
    >
      <Flex flexDirection="column" justifyContent="space-between">
        <AddressForm {...addressFormProps} />
        {countryCode && <SignUpStatutory countryCode={countryCode} />}
      </Flex>
      <PostCodeInvalidModal postCode={postCode} {...postCodeInvalidModalProps} />
    </AuthLayout>
  )
}
