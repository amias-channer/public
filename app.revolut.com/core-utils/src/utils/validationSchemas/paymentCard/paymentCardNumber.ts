import cardValidator from 'card-validator'
import { TFunction } from 'i18next'
import isNil from 'lodash/isNil'
import startCase from 'lodash/startCase'
import { getI18n } from 'react-i18next'
import * as Yup from 'yup'

import { TopupCardBrand, TopupCardIssuerDto } from '@revolut/rwa-core-types'

import { checkRequired } from '../../checkRequired'
import { ApiErrorCode } from '../../constants'
import { I18nNamespace } from '../../i18n'
import { ValidationErrorMessage, ValidationErrorMessageType } from '../types'
import { validateSchema } from './utils'

const BIN_LENGTH = 6
const NUMBER_MIN_LENGTH = 16

const patchCardIssuer = (cardBrand?: TopupCardBrand) =>
  cardBrand === TopupCardBrand.Uatp ? TopupCardBrand.Jcb : cardBrand

const binRequiredAndMinSchema = Yup.string().required().min(BIN_LENGTH)

const numberRequiredAndMinSchema = Yup.string().required().min(NUMBER_MIN_LENGTH)

const binExistsSchema = Yup.string().test({
  name: 'paymentCardBinExists',

  message: (): ValidationErrorMessage => ({
    type: ValidationErrorMessageType.App,
  }),

  test: (value?: string) => Boolean(cardValidator.number(value).card?.type),
})

const makeBinBackendCheckSchema = (t: TFunction, issuer?: TopupCardIssuerDto) => {
  const i18n = getI18n()
  const humanizedCardType = (cardType?: string) =>
    startCase(cardType?.replace(/-/g, ' ').toLowerCase())

  const getI18nOptionsForCode = (
    errorCode: ApiErrorCode,
  ): { [key: string]: any } | undefined => {
    /*
     * Also handled (no params are required):
     * - ApiErrorCode.TopupCardUnsupportedIssuer
     * - ApiErrorCode.TopupCardUnsupportedCardType
     * - ApiErrorCode.TopupCardUnsupportedCreditCard
     */
    switch (errorCode) {
      case ApiErrorCode.TopupCardUnsupportedIssuerCountry:
        return {
          country: t(`${I18nNamespace.Common}:countries.${issuer?.country}`),
        }
      case ApiErrorCode.TopupCardUnsupportedCardBrand:
        return {
          cardType: humanizedCardType(patchCardIssuer(issuer?.cardBrand)),
        }
      default:
        return undefined
    }
  }

  return Yup.string().test({
    name: 'paymentCardBinBackendCheck',

    params: {
      issuer,
    },

    message: ({ issuer: issuerParam }): ValidationErrorMessage => {
      const getErrorMessageKey = (code: number) =>
        `${I18nNamespace.Domain}:error-api-${code}`

      const errorCode = checkRequired(
        issuerParam?.errorCode,
        '"errorCode" can not be empty',
      )
      const errorMessageKey = i18n.exists(getErrorMessageKey(errorCode))
        ? getErrorMessageKey(errorCode)
        : getErrorMessageKey(ApiErrorCode.TopupCardUnsupportedCardType)

      return {
        type: ValidationErrorMessageType.App,
        text: t(errorMessageKey, getI18nOptionsForCode(errorCode)),
      }
    },

    test: () => isNil(issuer?.errorCode),
  })
}

export const validateCardNumber = (value: string) => cardValidator.number(value).isValid

export const makePaymentCardNumberValidationSchema = (
  formFieldName: string,
  t: TFunction,
  issuer?: TopupCardIssuerDto,
) => {
  const binBackendCheckSchema = makeBinBackendCheckSchema(t, issuer)

  return Yup.string().test({
    name: 'paymentCardNumber',

    message: (): ValidationErrorMessage => ({
      type: ValidationErrorMessageType.App,
    }),

    test: async (value?: string) => {
      await validateSchema(formFieldName, value, binRequiredAndMinSchema)
      await validateSchema(formFieldName, value, binExistsSchema)
      await validateSchema(formFieldName, value, binBackendCheckSchema)
      await validateSchema(formFieldName, value, numberRequiredAndMinSchema)

      return validateCardNumber(checkRequired(value, '"value" can not be empty'))
    },
  })
}
