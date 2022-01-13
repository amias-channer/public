import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TextButton } from '@revolut/ui-kit'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { Paragraph, Spacer, TextBox } from '@revolut/rwa-core-components'
import { isStagingOrProductionEnv } from '@revolut/rwa-core-config'

import { useCountdown } from 'hooks'

import { I18N_NAMESPACE } from '../constants'
import { DevActions } from './DevActions'

export const DIFFERENT_METHOD_COUNTDOWN_SECONDS = 20
const MIN_MOBILE_APP_VERSION = '7.23'

type ScreenDescriptionProps = {
  phoneNumber: string
  isStepUp?: boolean
  onUseDifferentMethod: VoidFunction
}

export const ScreenDescription: FC<ScreenDescriptionProps> = ({
  phoneNumber,
  isStepUp,
  onUseDifferentMethod,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { timeLeft, isFinished } = useCountdown(DIFFERENT_METHOD_COUNTDOWN_SECONDS)

  const isDifferentMethodAvailable = getConfigValue<boolean>(ConfigKey.CookieAuth)
    ? !isStepUp
    : true

  return (
    <>
      <Paragraph>
        <TextBox>
          {t('PushNotificationScreen.ScreenDescription.pushIsSent', {
            phoneNumber,
            appVersion: MIN_MOBILE_APP_VERSION,
          })}
        </TextBox>

        {!isStagingOrProductionEnv() && (
          <DevActions
            isDifferentMethodAvailable={isDifferentMethodAvailable}
            onUseDifferentMethod={onUseDifferentMethod}
          />
        )}
      </Paragraph>

      <Spacer h={{ _: 'px32', md: 'px48' }} />

      {isDifferentMethodAvailable && (
        <>
          {isFinished ? (
            <TextButton onClick={onUseDifferentMethod}>
              {t('PushNotificationScreen.ScreenDescription.useDifferentMethodAction')}
            </TextButton>
          ) : (
            <TextBox>
              {t('PushNotificationScreen.ScreenDescription.useDifferentMethodIn', {
                timeLeft,
              })}
            </TextBox>
          )}
        </>
      )}
    </>
  )
}
