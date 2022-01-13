import cardValidator from 'card-validator'
import compact from 'lodash/compact'
import isNil from 'lodash/isNil'
import isString from 'lodash/isString'
import { FC, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from '@revolut/ui-kit'

import {
  CardCvvInput,
  DateInput,
  CardNumberInput,
  FormField,
  Spacer,
  TextInput,
} from '@revolut/rwa-core-components'
import {
  DateFormat,
  useGetTabIndex,
  ValidationErrorMessageType,
} from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../constants'
import { FormFieldName } from '../form'
import { useFormAutoFocus } from '../hooks'
import { CardFormError, CardFormProps } from './types'

const DATE_INPUT_DATE_FORMAT = DateFormat.CardExpireDateShort
const CARD_EXPIRY_DATE_INPUT_MASK = DATE_INPUT_DATE_FORMAT.toUpperCase()

export const CardForm: FC<CardFormProps> = ({
  values,
  errors,
  linkedCard,
  isPostCodeRequired,
  onChange,
  onBlur,
}) => {
  const { t } = useTranslation([I18N_NAMESPACE, 'components.CardExpiryDateInput'])
  const getTabIndex = useGetTabIndex(1)

  const cardNumberInputRef = useRef<HTMLInputElement>()
  const cardExpiryDateInputRef = useRef<HTMLInputElement>()
  const cardCvvInputRef = useRef<HTMLInputElement>()
  const postCodeInputRef = useRef<HTMLInputElement>()

  const inputsRefs = useMemo(
    () => ({
      [FormFieldName.CardNumber]: cardNumberInputRef,
      [FormFieldName.CardExpiryDate]: cardExpiryDateInputRef,
      [FormFieldName.CardCvv]: cardCvvInputRef,
      [FormFieldName.PostCode]: postCodeInputRef,
    }),
    [],
  )

  const autoFocusRules = useMemo(
    () =>
      compact([
        {
          self: FormFieldName.CardNumber,
          next: FormFieldName.CardExpiryDate,
        },
        {
          self: FormFieldName.CardExpiryDate,
          next: FormFieldName.CardCvv,
        },
        isPostCodeRequired && {
          self: FormFieldName.CardCvv,
          next: FormFieldName.PostCode,
        },
      ]),
    [isPostCodeRequired],
  )

  const getComponentCommonProps = (componentName: FormFieldName) => {
    const getComponentValue = () => {
      const result = values[componentName]

      if (
        componentName === FormFieldName.CardExpiryDate &&
        result === CARD_EXPIRY_DATE_INPUT_MASK
      ) {
        return undefined
      }

      return result
    }

    const isFocused = document.activeElement === inputsRefs[componentName].current

    const error = errors[componentName] as CardFormError
    const [errorType, errorText] =
      isNil(error) || isString(error)
        ? [ValidationErrorMessageType.Builtin, error]
        : [error.type, error.text]
    const isAppError = errorType === ValidationErrorMessageType.App
    const hasError = (!isFocused || isAppError) && Boolean(getComponentValue() && error)

    return {
      hasError,
      disabled: linkedCard ? componentName !== FormFieldName.CardCvv : undefined,
      error: isAppError ? errorText : undefined,
      tabIndex: getTabIndex(componentName),
    }
  }

  const formAutoFocus = useFormAutoFocus(autoFocusRules, inputsRefs)

  useEffect(() => {
    // Run on the next tick
    const timerId = setTimeout(() => formAutoFocus(errors), 0)

    return () => clearTimeout(timerId)
  }, [values, errors, isPostCodeRequired, formAutoFocus])

  return (
    <Box>
      <FormField
        key={FormFieldName.CardNumber}
        name={FormFieldName.CardNumber}
        innerRef={cardNumberInputRef}
        Component={CardNumberInput}
        value={values[FormFieldName.CardNumber]}
        componentProps={{
          ...getComponentCommonProps(FormFieldName.CardNumber),
          initialCardType: cardValidator.number(linkedCard?.issuer.bin).card?.type,
        }}
        onChange={onChange}
        onBlur={onBlur}
      />

      <Spacer h="16px" />

      <Flex>
        <Box width="50%" mr="8px">
          <FormField
            key={FormFieldName.CardExpiryDate}
            name={FormFieldName.CardExpiryDate}
            innerRef={cardExpiryDateInputRef}
            Component={DateInput}
            value={values[FormFieldName.CardExpiryDate]}
            componentProps={{
              ...getComponentCommonProps(FormFieldName.CardExpiryDate),
              dateFormat: DATE_INPUT_DATE_FORMAT,
              placeholder: t('components.CardExpiryDateInput:placeholder'),
            }}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Box>

        <Box width="50%" ml="8px">
          <FormField
            key={FormFieldName.CardCvv}
            name={FormFieldName.CardCvv}
            innerRef={cardCvvInputRef}
            Component={CardCvvInput}
            value={values[FormFieldName.CardCvv]}
            componentProps={getComponentCommonProps(FormFieldName.CardCvv)}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Box>
      </Flex>

      {isPostCodeRequired && (
        <>
          <Spacer h="16px" />

          <FormField
            key={FormFieldName.PostCode}
            name={FormFieldName.PostCode}
            innerRef={postCodeInputRef}
            Component={TextInput}
            value={values[FormFieldName.PostCode]}
            componentProps={{
              ...getComponentCommonProps(FormFieldName.PostCode),
              placeholder: t(
                'TopUpViaCreditCardScreen.CardForm.PostCodeInput.placeholder',
              ),
            }}
            onChange={onChange}
            onBlur={onBlur}
          />
        </>
      )}
    </Box>
  )
}
