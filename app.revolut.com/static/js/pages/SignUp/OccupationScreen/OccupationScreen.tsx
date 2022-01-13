import { useCallback, useMemo } from 'react'

import {
  AuthLayout,
  FormFieldScheme,
  FormTextInput,
  useForm,
} from '@revolut/rwa-core-components'

import { useRunAuthFlowElements, useSignUpTranslation } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'

export const OccupationScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const t = useSignUpTranslation()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const formSchema: FormFieldScheme[] = useMemo(
    () => [
      {
        name: 'occupation',
        Component: FormTextInput,
        initialValue: '',
        props: {
          autoFocus: true,
          placeholder: t('OccupationScreen.input.placeholder'),
        },
      },
    ],
    [t],
  )

  const handleSubmit = useCallback(
    async (values) => {
      await runAuthFlowElements(
        {
          identityDetails: {
            occupation: values.occupation,
          },
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
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const isButtonEnabled = formik.values.occupation && formik.values.occupation.length > 5

  return (
    <AuthLayout
      title={t('OccupationScreen.title')}
      description={t('OccupationScreen.description')}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
