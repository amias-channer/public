import * as Yup from 'yup'

export const validateSchema = (
  formFieldName: string,
  value: string | undefined,
  schema: Yup.Schema<any>,
) =>
  Yup.object({
    [formFieldName]: schema,
  }).validate({ [formFieldName]: value })
