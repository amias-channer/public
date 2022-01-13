import { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { object as YupObject } from 'yup'

import {
  AuthLayout,
  FormFieldScheme,
  FormTextInput,
  useForm,
  useModal,
} from '@revolut/rwa-core-components'
import { UserAuthFlowElement, UserAuthSimilarityGrade } from '@revolut/rwa-core-types'
import {
  AxiosCommonHeader,
  emailValidationSchema,
  HttpHeader,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { DuplicateAccountExistingModal, DuplicateAccountSimilarModal } from 'components'

import { useRunAuthFlowElements, useSignUpTranslation } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { getAccountSimilarity } from './utils'

const validationSchema = YupObject({
  email: emailValidationSchema,
})

export const EmailScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const t = useSignUpTranslation()
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()
  const [canContinue, setCanContinue] = useState(true)
  const [showAccountExistingModal, accountExistingModalProps] = useModal()
  const [showAccountSimilarModal, accountSimilarModalProps] = useModal()

  const formSchema: FormFieldScheme[] = useMemo(
    () => [
      {
        name: 'email',
        Component: FormTextInput,
        initialValue: '',
        props: {
          autoFocus: true,
          isErrorShown: false,
          placeholder: t('EmailScreen.input.placeholder'),
        },
      },
    ],
    [t],
  )

  const handleSubmit = useCallback(
    async (values) => {
      await runAuthFlowElements(
        {
          email: values.email,
        },
        {
          onSuccess: ({ data }) => {
            const element = getUserAuthFlowElement(data)

            if (element === UserAuthFlowElement.DuplicateAccountCheck) {
              const accountSimilarity = getAccountSimilarity(data)

              setCanContinue(false)

              if (accountSimilarity === UserAuthSimilarityGrade.Similar) {
                showAccountSimilarModal()
              } else if (accountSimilarity === UserAuthSimilarityGrade.Duplicate) {
                showAccountExistingModal()
              } else {
                navigateToErrorPage(
                  `Account similarity is not supported: ${accountSimilarity}`,
                )
              }
            } else {
              goToNextScreen(element)
            }
          },
        },
      )
    },
    [
      navigateToErrorPage,
      goToNextScreen,
      setCanContinue,
      runAuthFlowElements,
      showAccountSimilarModal,
      showAccountExistingModal,
    ],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const handleModalLogInClick = useCallback(() => {
    history.push(Url.Start)
  }, [history])

  const handleModalContinueClick = useCallback(() => {
    AxiosCommonHeader.set(HttpHeader.SkipSimilarityCheck, true)

    setCanContinue(true)
    formik.handleSubmit()
  }, [formik, setCanContinue])

  const isButtonEnabled = canContinue && formik.values.email && !formik.errors.email

  return (
    <AuthLayout
      title={t('EmailScreen.title')}
      description={t('EmailScreen.description')}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />

      <DuplicateAccountExistingModal
        {...accountExistingModalProps}
        onLogIn={handleModalLogInClick}
      />
      <DuplicateAccountSimilarModal
        {...accountSimilarModalProps}
        onLogIn={handleModalLogInClick}
        onContinue={handleModalContinueClick}
      />
    </AuthLayout>
  )
}
