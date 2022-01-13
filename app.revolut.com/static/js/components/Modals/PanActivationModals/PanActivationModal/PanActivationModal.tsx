import isEmpty from 'lodash/isEmpty'
import { FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card as CardIcon } from '@revolut/icons'
import { TextBox as UiKitTextBox, TextButton } from '@revolut/ui-kit'

import {
  BaseModal,
  CardNumberInput,
  H2,
  HiddenFormButton,
  PrimaryButton,
  Spacer,
} from '@revolut/rwa-core-components'
import { IconSize, validateCardNumber } from '@revolut/rwa-core-utils'

import { PanActivationModalProps } from './types'

export const PanActivationModal: FC<PanActivationModalProps> = ({
  isOpen,
  isLoading,
  onRequestClose,
  onCardActivate,
}) => {
  const { t } = useTranslation('pages.Cards')
  const [cardNumber, setCardNumber] = useState('')
  const [isActivationErrorShown, setIsActivaionErrorShown] = useState(false)

  const showActivationError = () => {
    setIsActivaionErrorShown(true)
  }

  const clearCardNumber = useCallback(() => {
    setCardNumber('')
  }, [])

  const hideActivationError = useCallback(() => {
    setIsActivaionErrorShown(false)
  }, [])

  useEffect(() => {
    if (!isEmpty(cardNumber) && !isLoading && isActivationErrorShown) {
      hideActivationError()
    }
  }, [cardNumber, hideActivationError, isActivationErrorShown, isLoading])

  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      if (event) {
        event.preventDefault()
      }

      if (validateCardNumber(cardNumber)) {
        clearCardNumber()
        await onCardActivate({
          cardNumber,
          onSuccess: onRequestClose,
          onError: showActivationError,
        })
      }
    },
    [cardNumber, clearCardNumber, onCardActivate, onRequestClose],
  )

  const errorMessage = isActivationErrorShown
    ? t('CardSettingsActivation.PanActivationModal.error')
    : null

  const handleModalClose = useCallback<VoidFunction>(() => {
    if (!isLoading) {
      clearCardNumber()
      onRequestClose()
    }
  }, [clearCardNumber, isLoading, onRequestClose])

  const isButtonEnabled = validateCardNumber(cardNumber) && !isLoading

  return (
    <BaseModal isOpen={isOpen} onRequestClose={handleModalClose}>
      <H2>
        <CardIcon size={IconSize.ExtraLarge} color="primary" />
        <Spacer h={{ _: 'px24', tablet: 'px32' }} />
        {t('PanActivationModal.title')}
      </H2>

      <Spacer h="px16" />

      <form onSubmit={handleSubmit}>
        <CardNumberInput
          value={cardNumber}
          error={errorMessage}
          disabled={isLoading}
          onChange={setCardNumber}
          autoFocus
        />

        <HiddenFormButton type="submit" />
      </form>

      <Spacer h={{ _: 'px24', tablet: 'px40' }} />

      <PrimaryButton
        isLoading={isLoading}
        disabled={!isButtonEnabled}
        hasElevation={false}
        onClick={handleSubmit}
      >
        {t('PanActivationModal.button')}
      </PrimaryButton>

      <Spacer h={{ _: 'px20', md: 'px28' }} />

      <UiKitTextBox textAlign="center">
        <TextButton onClick={handleModalClose}>{t('common:cancel')}</TextButton>
      </UiKitTextBox>
    </BaseModal>
  )
}
