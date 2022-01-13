import { FormikProps } from 'formik'
import { useEffect } from 'react'

export const useFormAutoSubmit = (formik: FormikProps<any>) => {
  const shouldTriggerFormSubmit = formik.isValid && formik.dirty && !formik.isSubmitting

  useEffect(() => {
    if (shouldTriggerFormSubmit) {
      formik.handleSubmit()
    }
  }, [shouldTriggerFormSubmit, formik])
}
