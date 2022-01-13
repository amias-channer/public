import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, TextBox } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'

type ScreenDescription = {
  timeLeft: string
  isTimerFinished: boolean
}

export const ScreenDescription: FC<ScreenDescription> = ({
  timeLeft,
  isTimerFinished,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <Box>
      <TextBox>{t('IdentityVerificationFailedScreen.description')}</TextBox>
      <Spacer h="px16" />

      {!isTimerFinished && (
        <TextBox fontSize="smaller" color="identityVerificationFailedTimer">
          {t('IdentityVerificationFailedScreen.timer', {
            timeLeft,
          })}
        </TextBox>
      )}
    </Box>
  )
}
