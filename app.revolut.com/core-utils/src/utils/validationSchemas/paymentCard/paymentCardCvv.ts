import * as Yup from 'yup'

export const paymentCardCvvValidationSchema = Yup.string()
  .required()
  .matches(/^\d{3}$/)
