import * as Yup from 'yup'

const POST_CODE_MIN_LENGTH = 3
const POST_CODE_MAX_LENGTH = 10

export const makePaymentCardPostCodeValidationSchema = (isPostCodeRequired: boolean) => {
  if (!isPostCodeRequired) {
    return Yup.string().notRequired()
  }

  return Yup.string().required().min(POST_CODE_MIN_LENGTH).max(POST_CODE_MAX_LENGTH)
}
