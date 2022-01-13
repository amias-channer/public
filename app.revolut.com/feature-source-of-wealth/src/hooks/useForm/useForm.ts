import { useFormik } from 'formik'

import { UseFormHookArguments } from './types'

export const useForm = <T extends {}>({
  initialValues,
  validationSchema,
  initialTouched,
  validateOnMount,
  onSubmit,
}: UseFormHookArguments<T>) => {
  const { dirty, isValid, isSubmitting, ...formik } = useFormik<T>({
    initialValues,
    validationSchema,
    initialTouched,
    validateOnMount,
    onSubmit,
  })

  const isSubmitEnabled = isValid && !isSubmitting

  return {
    ...formik,
    dirty,
    isValid,
    isSubmitting,
    isSubmitEnabled,
  }
}
