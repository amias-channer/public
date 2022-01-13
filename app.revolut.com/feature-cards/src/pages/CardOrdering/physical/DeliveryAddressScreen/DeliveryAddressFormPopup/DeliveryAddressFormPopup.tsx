import { FC, useCallback, useMemo } from 'react'
import { Button, Popup } from '@revolut/ui-kit'

import {
  AddressForm,
  AddressFormValues,
  BaseModalProps,
  useAddressForm,
} from '@revolut/rwa-core-components'
import { AddressDto } from '@revolut/rwa-core-types'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { checkRequired } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../../hooks'

type DeliveryAddressFormPopupProps = {
  address: AddressDto
  onSubmit: (addressFormValues: AddressFormValues) => void
} & BaseModalProps

export const DeliveryAddressFormPopup: FC<DeliveryAddressFormPopupProps> = ({
  address,
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const t = useCardsTranslation()
  const { phoneNumber } = useAuthContext()

  const handleSubmit = useCallback(
    async (formValues: AddressFormValues) => {
      const checkedFormValues = checkRequired(formValues, `formValues can't be empty`)

      onSubmit(checkedFormValues)
      onRequestClose()
    },
    [onRequestClose, onSubmit],
  )

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

  const { handleFormSubmit, resetForm } = addressFormProps

  const handleModalClosed = () => {
    resetForm()
  }

  return (
    <Popup
      variant="modal-view"
      shouldKeepMaxHeight
      isOpen={isOpen}
      onExit={onRequestClose}
      onExited={handleModalClosed}
    >
      <Popup.Header>
        <Popup.CloseButton onClick={onRequestClose} />
        <Popup.Title>{t('CardOrdering.DeliveryAddressFormPopup.title')}</Popup.Title>
      </Popup.Header>
      <AddressForm {...addressFormProps} />
      <Popup.Actions>
        <Button elevated onClick={() => handleFormSubmit()}>
          {t('CardOrdering.DeliveryAddressFormPopup.button')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
