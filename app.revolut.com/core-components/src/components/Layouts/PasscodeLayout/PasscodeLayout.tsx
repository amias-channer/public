import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Layout, TextButton } from '@revolut/ui-kit'

import {
  PASS_CODE_LENGTH,
  passcodeValidationSchema,
  useCodeInput,
  I18nNamespace,
} from '@revolut/rwa-core-utils'

import { MultipleCodeInput } from '../../Inputs'
import { PasscodeLayoutInnerProps, PasscodeLayoutProps } from './types'

export const PasscodeLayout: PasscodeLayoutProps<PasscodeLayoutInnerProps> = ({
  title,
  description,
  errorMessage,
  onBackButtonClick,
  onCloseButtonClick,
  onErrorMessageClear,
  onPasscodeConfirm,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const { inputValue, isInputShaking, onInputChange } = useCodeInput({
    errorMessage,
    onErrorMessageClear,
  })

  const handleDigitInputChange = useCallback(
    (value: string) => {
      onInputChange(value)

      if (passcodeValidationSchema.isValidSync(value)) {
        onPasscodeConfirm(value)
      }
    },
    [onInputChange, onPasscodeConfirm],
  )

  return (
    <Layout>
      <Layout.Main>
        <Header variant="form">
          <Header.BackButton aria-label="Back" onClick={onBackButtonClick} />
          <Header.Title>{title}</Header.Title>
          {description && <Header.Description>{description}</Header.Description>}
          {onCloseButtonClick && (
            <Header.Actions>
              <TextButton onClick={onCloseButtonClick}>
                {t('closeButton.text')}
              </TextButton>
            </Header.Actions>
          )}
        </Header>
        <MultipleCodeInput
          size={PASS_CODE_LENGTH}
          value={inputValue}
          isInputShaking={isInputShaking}
          errorMessage={errorMessage}
          onChange={handleDigitInputChange}
        />
      </Layout.Main>
    </Layout>
  )
}
