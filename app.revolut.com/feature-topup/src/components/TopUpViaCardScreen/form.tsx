import { TFunction } from 'i18next'
import padStart from 'lodash/padStart'
import * as Yup from 'yup'

import {
  CardExpiryDate as CardExpiryDateType,
  TopupCardIssuerDto,
  UserTopupCardDto,
} from '@revolut/rwa-core-types'
import {
  makePaymentCardExpiryDateValidationSchema,
  makePaymentCardNumberValidationSchema,
  makePaymentCardPostCodeValidationSchema,
  paymentCardCvvValidationSchema,
} from '@revolut/rwa-core-utils'

export enum FormFieldName {
  CardNumber = 'cardNumber',
  CardExpiryDate = 'cardExpiryDate',
  CardCvv = 'cardCvv',
  PostCode = 'postCode',
}

export type FormValues = {
  [FormFieldName.CardNumber]: string
  [FormFieldName.CardExpiryDate]: string
  [FormFieldName.CardCvv]: string
  [FormFieldName.PostCode]: string | undefined
}

type GetFormValidationSchemaArgs = {
  t: TFunction
  isPostCodeRequired: boolean
  hasLinkedCard: boolean
  issuer?: TopupCardIssuerDto
}

const getMaskedCardNumber = (lastFour: string) => `**** **** **** ${lastFour}`
const getLastNChars = (value: string | number, n: number) => String(value).slice(-n)
const getMonth = (expiryDate: CardExpiryDateType) =>
  padStart(String(expiryDate.month), 2, '0')
const getYear = (expiryDate: CardExpiryDateType) => getLastNChars(expiryDate.year, 2)

export const getFormInitialValues = (linkedCard?: UserTopupCardDto): FormValues => {
  const expiryDate = linkedCard
    ? `${getMonth(linkedCard.expiryDate)}/${getYear(linkedCard.expiryDate)}`
    : ''

  return {
    [FormFieldName.CardNumber]: linkedCard
      ? getMaskedCardNumber(linkedCard.lastFour)
      : '',
    [FormFieldName.CardExpiryDate]: expiryDate,
    [FormFieldName.CardCvv]: '',
    [FormFieldName.PostCode]: undefined,
  }
}

export const getFormValidationSchema = ({
  t,
  isPostCodeRequired,
  hasLinkedCard,
  issuer,
}: GetFormValidationSchemaArgs) => {
  if (hasLinkedCard) {
    return Yup.object({
      [FormFieldName.CardCvv]: paymentCardCvvValidationSchema,
    })
  }

  return Yup.object({
    [FormFieldName.CardNumber]: makePaymentCardNumberValidationSchema(
      FormFieldName.CardNumber,
      t,
      issuer,
    ),
    [FormFieldName.CardExpiryDate]: makePaymentCardExpiryDateValidationSchema(
      FormFieldName.CardExpiryDate,
    ),
    [FormFieldName.CardCvv]: paymentCardCvvValidationSchema,
    [FormFieldName.PostCode]: makePaymentCardPostCodeValidationSchema(isPostCodeRequired),
  })
}
