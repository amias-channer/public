import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Box } from '@revolut/ui-kit'

import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import { AuthLayout, CardSelect } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE, SignInScreen } from '../constants'
import { SignInScreenProps } from '../types'
import { AuthenticationMethod } from './constants'
import { useOptions } from './useOptions'

export const AuthenticationMethodScreen: FC<SignInScreenProps> = ({ onScreenChange }) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const options = useOptions()

  const handleBackButtonClick = () => history.push(Url.Start)

  const handleCardChange = (method: string) => {
    switch (method as AuthenticationMethod) {
      case AuthenticationMethod.Email:
        trackEvent(SignInTrackingEvent.authenticationMethodSelected, {
          method: SignInScreen.Email,
        })
        onScreenChange(SignInScreen.Email)
        return
      case AuthenticationMethod.Sms:
        trackEvent(SignInTrackingEvent.authenticationMethodSelected, {
          method: SignInScreen.Sms,
        })
        onScreenChange(SignInScreen.Sms)
        return
      default:
        trackEvent(SignInTrackingEvent.unknownAuthenticationMethod, {
          method,
        })
        throw new Error(`Unknown auth method: ${method}`)
    }
  }

  useEffect(() => {
    trackEvent(SignInTrackingEvent.authenticationMethodScreenOpened)
    return () => {
      trackEvent(SignInTrackingEvent.authenticationMethodScreenClosed)
    }
  }, [])

  return (
    <AuthLayout
      title={t('AuthenticationMethodScreen.title')}
      description={t('AuthenticationMethodScreen.description')}
      handleBackButtonClick={handleBackButtonClick}
    >
      <Box maxWidth="pages.SignIn.AuthenticationMethodScreen.CardSelect.maxWidth">
        <CardSelect options={options} onChange={handleCardChange} />
      </Box>
    </AuthLayout>
  )
}
