import format from 'date-fns/format'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { object as YupObject } from 'yup'

import { AuthLayout, useForm } from '@revolut/rwa-core-components'
import { birthDateValidationSchema, DateFormat } from '@revolut/rwa-core-utils'

import { useRunAuthFlowElements } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { BirthDateInput } from './BirthDateInput'
import { BirthDateScreenScheme } from './types'

const validationSchema = YupObject({
  birthDate: birthDateValidationSchema,
})

const formSchema: BirthDateScreenScheme = [
  {
    name: 'birthDate',
    Component: BirthDateInput,
    initialValue: '',
  },
]

export const BirthDateScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const { t } = useTranslation('pages.SignUp')
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const handleSubmit = useCallback(
    async (values) => {
      await runAuthFlowElements(
        {
          birthDate: format(values.birthDate, DateFormat.ApiRequest),
        },
        {
          onSuccess: ({ data }) => {
            goToNextScreen(getUserAuthFlowElement(data))
          },
        },
      )
    },
    [goToNextScreen, runAuthFlowElements],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback(() => {
    formik.handleSubmit()
  }, [formik])

  const isButtonEnabled = formik.values.birthDate && !formik.errors.birthDate

  return (
    <AuthLayout
      title={t('BirthDateScreen.title')}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
