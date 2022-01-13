import { useCallback, useEffect, useState } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { AbsoluteLoader, AuthLayout } from '@revolut/rwa-core-components'
import { AxiosCommonHeader, HttpHeader, useEventListener } from '@revolut/rwa-core-utils'

import { isScrollAtBottom } from 'utils'

import { useRunAuthFlowElements, useSignUpTranslation } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { I18N_KEY } from './constants'
import { DisclosureScreenContent } from './DisclosureScreenContent'

export const DisclosureScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const t = useSignUpTranslation()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const { countryCode } = useAuthContext()

  const scrollListener = useCallback(() => {
    if (isScrollAtBottom() && countryCode) {
      setIsButtonEnabled(true)
      window.removeEventListener('scroll', scrollListener)
    }
  }, [countryCode])

  useEffect(() => {
    scrollListener()
  }, [scrollListener])

  useEventListener('scroll', scrollListener)

  const handleSubmit = useCallback(async () => {
    AxiosCommonHeader.set(HttpHeader.SkipDisclosure, true)
    await runAuthFlowElements(
      {},
      {
        onSuccess: ({ data }) => {
          goToNextScreen(getUserAuthFlowElement(data))
        },
      },
    )
  }, [goToNextScreen, runAuthFlowElements])

  return (
    <AuthLayout
      title={t(`${I18N_KEY}.title`)}
      description={t(`${I18N_KEY}.description`)}
      submitButtonText={t(
        `${I18N_KEY}.buttonText.${isButtonEnabled ? 'enabled' : 'disabled'}`,
      )}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmit}
    >
      {countryCode ? (
        <DisclosureScreenContent countryCode={countryCode} />
      ) : (
        <AbsoluteLoader />
      )}
    </AuthLayout>
  )
}
