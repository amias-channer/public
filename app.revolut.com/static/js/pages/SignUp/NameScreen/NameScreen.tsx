import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { object as YupObject } from 'yup'

import { AuthLayout, FormTextInput, useForm } from '@revolut/rwa-core-components'
import { nameValidationSchema } from '@revolut/rwa-core-utils'

import { useRunAuthFlowElements } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { NameScreenScheme } from './types'

const validationSchema = YupObject({
  firstName: nameValidationSchema,
  lastName: nameValidationSchema,
  alias: nameValidationSchema,
})

export const NameScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const { t } = useTranslation(['pages.SignUp', 'common'])
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const formSchema: NameScreenScheme = [
    {
      name: 'firstName',
      Component: FormTextInput,
      initialValue: '',
      props: {
        autoFocus: true,
        isErrorShown: false,
        'data-testid': 'first-name-input',
        placeholder: t('NameScreen.fields.firstName'),
      },
    },
    {
      name: 'lastName',
      Component: FormTextInput,
      initialValue: '',
      props: {
        isErrorShown: false,
        'data-testid': 'last-name-input',
        placeholder: t('NameScreen.fields.lastName'),
      },
    },
    {
      name: 'alias',
      Component: FormTextInput,
      initialValue: '',
      props: {
        isErrorShown: false,
        placeholder: t('NameScreen.fields.alias'),
        message: t('common:optional'),
      },
    },
  ]

  const handleSubmit = useCallback(
    async (values) => {
      const variables = {
        firstName: values.firstName,
        lastName: values.lastName,
        identityDetails: {},
      }

      if (values.alias) {
        variables.identityDetails = {
          alias: values.alias,
        }
      }

      await runAuthFlowElements(variables, {
        onSuccess: ({ data }) => {
          goToNextScreen(getUserAuthFlowElement(data))
        },
      })
    },
    [goToNextScreen, runAuthFlowElements],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const isSubmitButtonEnabled =
    formik.values.firstName &&
    formik.values.lastName &&
    !formik.errors.firstName &&
    !formik.errors.lastName &&
    !formik.errors.alias

  return (
    <AuthLayout
      title={t('NameScreen.title')}
      submitButtonEnabled={isSubmitButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
