import { FC, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, TextBox, TextButton } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { formatPhoneNumber, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { useCountdown } from 'hooks'

import { I18N_NAMESPACE } from '../constants'
import { DownloadTheAppContext } from '../DownloadTheAppProvider'
import { useLinkPhoneToPromotion } from '../hooks'

export const ScreenDescription: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const navigateToErrorPage = useNavigateToErrorPage()
  const { phoneNumber } = useContext(DownloadTheAppContext)
  const { timeLeft, isFinished, restartCountdown } = useCountdown()
  const { linkPhoneToPromotion } = useLinkPhoneToPromotion()

  const handleNoLinkReceived = useCallback(async () => {
    restartCountdown()

    await linkPhoneToPromotion(
      {
        phone: formatPhoneNumber(phoneNumber),
      },
      {
        onError: () => navigateToErrorPage('Phone can not be linked to promotion'),
      },
    )
  }, [navigateToErrorPage, phoneNumber, restartCountdown, linkPhoneToPromotion])

  return (
    <Box mt="px16">
      <TextBox>{t('SuccessScreen.ScreenDescription.checkYourPhone')}</TextBox>
      <Spacer h="px48" />

      {isFinished ? (
        <>
          <TextBox>
            {t('SuccessScreen.ScreenDescription.noLinkReceivedText')}{' '}
            <TextButton onClick={handleNoLinkReceived}>
              {t('SuccessScreen.ScreenDescription.noLinkReceivedAction')}
            </TextButton>
          </TextBox>
        </>
      ) : (
        <TextBox>
          {t('SuccessScreen.ScreenDescription.linkResend', {
            timeLeft,
          })}
        </TextBox>
      )}
    </Box>
  )
}
