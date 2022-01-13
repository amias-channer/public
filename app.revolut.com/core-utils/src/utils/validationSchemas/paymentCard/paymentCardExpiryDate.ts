import { getMonth, getYear } from 'date-fns'
import toNumber from 'lodash/toNumber'
import * as Yup from 'yup'

import { TopupCardExpiryYearFormat } from '@revolut/rwa-core-types'

import { checkRequired } from '../../checkRequired'
import { parseExpiryDate } from '../../date'
import { ValidationErrorMessage, ValidationErrorMessageType } from '../types'
import { validateSchema } from './utils'

const EXPIRY_DATE_MAX_YEAR_DELTA = 20
const EXPIRY_DATE_MIN_MONTH = 1
const EXPIRY_DATE_MAX_MONTH = 12
const EXPIRY_DATE_REGEX = /^(1[0-2]|0[1-9])\d\d$/
const INCOMPLETE_EXPIRY_DATE_REGEX = /^(1[0-2]\d{0,2}|0[1-9]\d{0,2}|[01])$/

const expiryDateRequiredSchema = Yup.string().required()

const expiryDateMatchesTemplateSchema = Yup.string().matches(EXPIRY_DATE_REGEX)

const incompleteExpiryDateMatchesTemplateSchema = Yup.string().test({
  name: 'paymentCardIncompleteExpiryDateMatchesTemplate',

  message: (): ValidationErrorMessage => ({
    type: ValidationErrorMessageType.App,
  }),

  test: (value?: string) => {
    const checkedValue = checkRequired(value, '"value" can not be empty')

    return INCOMPLETE_EXPIRY_DATE_REGEX.test(filterNonNumbers(checkedValue))
  },
})

const filterNonNumbers = (value: string) => value.replace(/[^0-9]/g, '')

export const makePaymentCardExpiryDateValidationSchema = (formFieldName: string) =>
  Yup.string().test({
    name: 'paymentCardExpiryDate',

    message: (): ValidationErrorMessage => ({
      type: ValidationErrorMessageType.App,
    }),

    test: async (value?: string) => {
      await validateSchema(formFieldName, value, expiryDateRequiredSchema)
      await validateSchema(
        formFieldName,
        value,
        incompleteExpiryDateMatchesTemplateSchema,
      )

      const checkedValue = checkRequired(value, '"value" can not be empty')

      await validateSchema(
        formFieldName,
        filterNonNumbers(checkedValue),
        expiryDateMatchesTemplateSchema,
      )

      const expiryDate = parseExpiryDate(checkedValue, TopupCardExpiryYearFormat.Full)

      const expiryMonth = toNumber(expiryDate.month)
      const expiryYear = toNumber(expiryDate.year)
      const now = Date.now()
      const minYear = getYear(now)
      const maxYear = minYear + EXPIRY_DATE_MAX_YEAR_DELTA

      if (
        expiryYear < minYear ||
        (expiryYear === minYear && expiryMonth < getMonth(now) + 1)
      ) {
        return false
      }

      return (
        expiryMonth >= EXPIRY_DATE_MIN_MONTH &&
        expiryMonth <= EXPIRY_DATE_MAX_MONTH &&
        expiryYear <= maxYear
      )
    },
  })
