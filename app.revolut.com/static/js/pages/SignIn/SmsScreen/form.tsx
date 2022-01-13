import { object as YupObject } from 'yup'

import {
  FormFieldProps,
  FormFieldScheme,
  MultipleCodeInput,
} from '@revolut/rwa-core-components'
import {
  SECURITY_CODE_LENGTH,
  securityCodeValidationSchema,
} from '@revolut/rwa-core-utils'

type FormScheme = FormFieldScheme[]

const DigitInputWrapper = (props: FormFieldProps) => (
  <MultipleCodeInput size={SECURITY_CODE_LENGTH} {...props} />
)

export enum FormFieldName {
  SecurityCode = 'securityCode',
}

export const formValidationSchema = YupObject({
  [FormFieldName.SecurityCode]: securityCodeValidationSchema,
})

export const createFormSchema = (
  isSecurityCodeInputShaking: boolean,
  securityCodeError?: string,
): FormScheme => [
  {
    name: FormFieldName.SecurityCode,
    Component: DigitInputWrapper,
    initialValue: '',
    props: {
      isInputShaking: isSecurityCodeInputShaking,
      errorMessage: securityCodeError,
    },
  },
]
