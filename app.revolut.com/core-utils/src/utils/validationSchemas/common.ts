import { parsePhoneNumber } from 'libphonenumber-js/min'
import * as Yup from 'yup'
import type { TestContext } from 'yup'

import { formatPhoneNumber } from '../format'

const PHONE_COUNTRY_CODE_LENGTH = 2
export const PASS_CODE_LENGTH = 4
export const SECURITY_CODE_LENGTH = 6
const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 40

const checkPhoneNumberValid = (phone: string) => {
  try {
    const parsedPhoneNumber = parsePhoneNumber(phone)
    return parsedPhoneNumber.isPossible()
  } catch {
    return false
  }
}

function testPhoneNumber(this: TestContext, value: string) {
  const { code } = this.parent

  const combinedPhone = code ? formatPhoneNumber({ code, number: value }) : value

  return checkPhoneNumberValid(combinedPhone)
}

export const birthDateValidationSchema = Yup.date()
  .min(new Date(1900, 1, 1))
  .max(new Date())

export const emailValidationSchema = Yup.string().email().required()

export const nameValidationSchema = Yup.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH)

export const passcodeValidationSchema = Yup.string()
  .min(PASS_CODE_LENGTH)
  .max(PASS_CODE_LENGTH)
  .matches(/^\d+$/)
  .required()

export const phoneValidationSchema = Yup.object({
  code: Yup.string().length(PHONE_COUNTRY_CODE_LENGTH).required(),
  number: Yup.string()
    .test('phone number test', 'number should be valid', testPhoneNumber)
    .matches(/^\d+$/)
    .required(),
})

export const securityCodeValidationSchema = Yup.string()
  .min(SECURITY_CODE_LENGTH)
  .max(SECURITY_CODE_LENGTH)
  .matches(/^\d+$/)
  .required()

export const usCodeValidationSchema = Yup.string()
  .matches(/\d{3}-\d{2}-\d{4}/)
  .required()

export const createMoneyValidationSchema = (minimumAmount: number) =>
  Yup.number().moreThan(minimumAmount).required()
