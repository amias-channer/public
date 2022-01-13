import { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  AuthLayout,
  AddressForm,
  AddressFormValues,
  FullPageLoader,
  useAddressForm,
} from '@revolut/rwa-core-components'
import { AddressDto } from '@revolut/rwa-core-types'
import { checkRequired, Url } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../hooks'

export type DeliveryAddressFormProps = {
  address: AddressDto
  closeUrl?: string
  onBackClick: VoidFunction
  onSubmit: (addressFormValues: AddressFormValues) => Promise<void>
}

export const DeliveryAddressForm: FC<DeliveryAddressFormProps> = ({
  address,
  closeUrl = Url.CardsOverview,
  onBackClick,
  onSubmit,
}) => {
  const history = useHistory()
  const { phoneNumber } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useCardsTranslation()

  const handleCloseClick = () => {
    history.push(closeUrl)
  }

  const handleSubmit = async (formValues: AddressFormValues) => {
    setIsSubmitting(true)

    const checkedFormValues = checkRequired(formValues, `formValues can't be empty`)

    await onSubmit(checkedFormValues)

    setIsSubmitting(false)
  }

  const addressFormInitialValues = useMemo(() => {
    const initialValues: AddressFormValues = {
      country: address.country,
      postCode: checkRequired(address.postcode, '"postCode" can not be empty'),
      addressLine1: address.streetLine1,
      addressLine2: address.streetLine2,
      city: address.city,
    }

    if (address.region) {
      initialValues.region = address.region
    }

    return initialValues
  }, [address])

  const addressFormProps = useAddressForm({
    initialCountry: phoneNumber.code,
    initialValues: addressFormInitialValues,
    onSubmit: handleSubmit,
  })

  const { handleFormSubmit, isRequiredFieldsFilled } = addressFormProps

  return (
    <>
      {isSubmitting && <FullPageLoader />}
      <AuthLayout
        title={t('CardOrdering.DeliveryAddressScreen.title')}
        submitButtonText={t('CardOrdering.DeliveryAddressScreen.button')}
        submitButtonEnabled={isRequiredFieldsFilled}
        handleSubmitButtonClick={handleFormSubmit}
        handleBackButtonClick={onBackClick}
        handleCloseButtonClick={handleCloseClick}
      >
        <AddressForm {...addressFormProps} />
      </AuthLayout>
    </>
  )
}
