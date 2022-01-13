import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, TextBox, TextButton } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { Spacer } from '@revolut/rwa-core-components'
import { SignInOtpChannel } from '@revolut/rwa-core-types'
import { formatPhoneNumber } from '@revolut/rwa-core-utils'

import { useCountdown } from 'hooks'

import { I18N_NAMESPACE } from '../constants'
import { useSignIn } from './hooks'

export const ScreenDescription: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { phoneNumber } = useAuthContext()
  const { timeLeft, isFinished, restartCountdown } = useCountdown()
  const { signIn } = useSignIn()

  const plainPhoneNumber = formatPhoneNumber(phoneNumber)

  const handleNoCodeReceived = useCallback(async () => {
    restartCountdown()

    await signIn({
      phone: plainPhoneNumber,
      channel: SignInOtpChannel.Email,
    })
  }, [plainPhoneNumber, restartCountdown, signIn])

  return (
    <Box mt="px16">
      <TextBox>
        {t('EmailScreen.ScreenDescription.checkYourEmail', {
          phoneNumber: plainPhoneNumber,
        })}
      </TextBox>
      <Spacer h="px16" />

      {isFinished ? (
        <TextBox>
          {t('EmailScreen.ScreenDescription.noCodeReceivedText')}{' '}
          <TextButton onClick={handleNoCodeReceived}>
            {t('EmailScreen.ScreenDescription.noCodeReceivedAction')}
          </TextButton>
        </TextBox>
      ) : (
        <TextBox>
          {t('EmailScreen.ScreenDescription.codeResend', {
            timeLeft,
          })}
        </TextBox>
      )}
    </Box>
  )
}
