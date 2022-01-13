import { FormikProps, useFormik } from 'formik'
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import { useMemo } from 'react'

import { Form } from '../Form'
import { FormInitialValues, UseFormHook } from './types'
import useFormikInstance from './useFormikInstance'
import { filterFormSchema } from './utils'

export const useForm: UseFormHook = ({ formSchema, validationSchema, onSubmit }) => {
  const formik = useFormik<FormInitialValues>({
    initialValues: mapValues(keyBy(filterFormSchema(formSchema), 'name'), 'initialValue'),
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit,
  })

  const memoizedFormikInstance = useFormikInstance<FormikProps<FormInitialValues>>(formik)

  return useMemo(
    () => ({
      FormComponent: Form,
      formProps: {
        formik: memoizedFormikInstance,
        formSchema: filterFormSchema(formSchema),
      },
      formik: memoizedFormikInstance,
    }),
    [memoizedFormikInstance, formSchema],
  )
}
