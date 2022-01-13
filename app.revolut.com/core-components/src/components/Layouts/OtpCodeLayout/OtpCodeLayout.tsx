import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Layout, TextButton } from '@revolut/ui-kit'

import { useQueryVerificationCode } from '@revolut/rwa-core-api'
import {
  I18nNamespace,
  SECURITY_CODE_LENGTH,
  securityCodeValidationSchema,
  useCodeInput,
} from '@revolut/rwa-core-utils'

import { MultipleCodeInput } from '../../Inputs'
import { OtpCodeLayoutDescription } from './Description'

type OtpCodeLayoutProps = {
  title: string
  description?: string
  phone?: string
  value?: string
  defaultValue?: string
  errorMessage?: string
  disabled?: boolean
  onBackButtonClick?: VoidFunction
  onCloseButtonClick?: VoidFunction
  onErrorMessageClear?: VoidFunction
  onSubmit: (otpCode: string) => any
}

export const OtpCodeLayout: FC<OtpCodeLayoutProps> = ({
  title,
  description,
  errorMessage,
  phone,
  onBackButtonClick,
  onCloseButtonClick,
  onErrorMessageClear,
  onSubmit,
  ...rest
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const { inputValue, isInputShaking, onInputChange } = useCodeInput({
    errorMessage,
    onErrorMessageClear,
  })

  const verificationCode = useQueryVerificationCode(phone)

  const handleCodeInputChange = useCallback(
    (code: string) => {
      onInputChange(code)

      if (securityCodeValidationSchema.isValidSync(code)) {
        onSubmit(code)
      }
    },
    [onInputChange, onSubmit],
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
        <OtpCodeLayoutDescription
          code={verificationCode}
          onOtpCodeClick={handleCodeInputChange}
        />

        <MultipleCodeInput
          size={SECURITY_CODE_LENGTH}
          value={inputValue}
          isInputShaking={isInputShaking}
          errorMessage={errorMessage}
          onChange={handleCodeInputChange}
          {...rest}
        />
      </Layout.Main>
    </Layout>
  )
}
