import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { object as YupObject } from 'yup'
import { Box, Relative } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  ErrorMessage,
  Paragraph,
  Spacer,
  TextBox,
  TextButton,
  useForm,
} from '@revolut/rwa-core-components'
import { ConfigKey, FeatureKey, getConfigValue } from '@revolut/rwa-core-config'
import { useLocale } from '@revolut/rwa-core-i18n'
import {
  AxiosSecurity,
  browser,
  phoneValidationSchema,
  Url,
} from '@revolut/rwa-core-utils'

import { PhoneNumberInput } from 'components'
import { useFeaturesConfig } from 'hooks'

import { I18N_NAMESPACE } from '../constants'
import { Illustration } from './Illustration'
import {
  AuthLayoutStyled,
  LanguageSelectorContainer,
  LanguageSelectorStyled,
} from './styled'
import { MobileNumberScreenScheme, MobileNumberScreenValues } from './types'

const validationSchema = YupObject({
  phoneNumber: phoneValidationSchema,
})

export const MobileNumberScreen: FC = () => {
  const history = useHistory()
  const { isFeatureActive } = useFeaturesConfig()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { phoneNumber, setSignInFlowChannel, setPhoneNumber, setAuthorized } =
    useAuthContext()
  const [formError, setFormError] = useState('')
  const { locale, setNewLocale } = useLocale()

  const formSchema: MobileNumberScreenScheme = [
    {
      name: 'phoneNumber',
      Component: PhoneNumberInput,
      initialValue: phoneNumber,
    },
  ]

  const handleSubmit = useCallback(
    async (values: MobileNumberScreenValues) => {
      AxiosSecurity.signOut()

      setAuthorized(false)
      setPhoneNumber(values.phoneNumber)

      history.push(Url.SignIn)
    },
    [setAuthorized, setPhoneNumber, history],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    setFormError('')
  }, [formik.values.phoneNumber])

  useEffect(() => {
    setSignInFlowChannel(undefined)
  }, [setSignInFlowChannel])

  const handleCtaButtonClick = () => {
    if (isFeatureActive(FeatureKey.AllowNewDownloadTheAppFlow)) {
      history.push(Url.DownloadTheApp)
    } else {
      browser.navigateTo(getConfigValue(ConfigKey.RevolutWebsiteGetTheAppUrl))
    }
  }

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const isSubmitButtonLoading = formik.isSubmitting
  const isSubmitButtonEnabled = !formik.isSubmitting && !formik.errors.phoneNumber

  return (
    <Relative>
      <AuthLayoutStyled
        title={t('MobileNumberScreen.title')}
        description={t('MobileNumberScreen.description')}
        illustration={<Illustration />}
        submitButtonText={t('MobileNumberScreen.submitButtonText')}
        submitButtonLoading={isSubmitButtonLoading}
        submitButtonEnabled={isSubmitButtonEnabled}
        handleSubmitButtonClick={handleSubmitButtonClick}
      >
        <FormComponent {...formProps} />

        <Paragraph>
          <ErrorMessage>{formError}</ErrorMessage>
        </Paragraph>

        <Box hide="xl-*">
          <Spacer h="px32" />

          <TextBox>
            {t('MobileNumberScreen.dontHaveAccount')}{' '}
            <TextButton onClick={handleCtaButtonClick}>
              {t('MobileNumberScreen.dontHaveAccountButtonText')}
            </TextButton>
          </TextBox>
        </Box>
      </AuthLayoutStyled>

      <LanguageSelectorContainer>
        <LanguageSelectorStyled locale={locale} onChange={setNewLocale} />
      </LanguageSelectorContainer>
    </Relative>
  )
}
