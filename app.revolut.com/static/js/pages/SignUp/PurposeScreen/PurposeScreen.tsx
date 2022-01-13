import { useCallback } from 'react'

import { AuthLayout, useForm } from '@revolut/rwa-core-components'

import { useRunAuthFlowElements, useSignUpTranslation } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { Description } from './Description'
import { formSchema } from './form'

export const PurposeScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const t = useSignUpTranslation()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const handleSubmit = useCallback(
    async (values) => {
      await runAuthFlowElements(
        {
          identityDetails: {
            accountPurpose: values.purpose,
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

  const isButtonEnabled = Boolean(formik.values.purpose)

  return (
    <AuthLayout
      title={t('PurposeScreen.title')}
      description={<Description />}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
