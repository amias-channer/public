import { object as YupObject } from 'yup'

import {
  FormFieldProps,
  FormFieldScheme,
  MultipleCodeInput,
} from '@revolut/rwa-core-components'
import { PASS_CODE_LENGTH, passcodeValidationSchema } from '@revolut/rwa-core-utils'

type FormScheme = FormFieldScheme[]

const DigitInputWrapper = (props: FormFieldProps) => (
  <MultipleCodeInput size={PASS_CODE_LENGTH} {...props} />
)

export enum FormFieldName {
  Passcode = 'passcode',
}

export enum PasscodeError {
  Incorrect = 'INCORRECT',
  Blocked = 'BLOCKED',
  Unknown = 'UNKNOWN',
}

export const formValidationSchema = YupObject({
  [FormFieldName.Passcode]: passcodeValidationSchema,
})

export const createFormSchema = (
  isPasscodeInputShaking: boolean,
  isPasscodeDisabled: boolean,
  passcodeErrorMessage?: string,
): FormScheme => [
  {
    name: FormFieldName.Passcode,
    Component: DigitInputWrapper,
    initialValue: '',
    props: {
      isInputShaking: isPasscodeInputShaking,
      disabled: isPasscodeDisabled,
      errorMessage: passcodeErrorMessage,
    },
  },
]
