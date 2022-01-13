import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { Url, HttpCode } from '@revolut/rwa-core-utils'
import { UnifiedTheme, ThemeProvider, StatusPopup, Button } from '@revolut/ui-kit'

import { useInvalidateAccessRecovery } from 'hooks'
import { AccessRecoveryStatus } from './constants'
import { LinkExpired } from './LinkExpired'

export const InvalidateAccessRecovery = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [accessRecoveryStatus, setAccessRecoveryStatus] = useState<AccessRecoveryStatus>()
  const history = useHistory()
  const { t } = useTranslation('pages.InvalidateAccessRecovery')
  const { invalidateAccessRecovery } = useInvalidateAccessRecovery()

  const redirectToStartPage = useCallback(() => {
    history.push(Url.Start)
  }, [history])

  useEffect(() => {
    if (!sessionId) redirectToStartPage()

    invalidateAccessRecovery(sessionId, {
      onSuccess: ({ status: httpCode }) => {
        httpCode === HttpCode.NoContent
          ? setAccessRecoveryStatus(AccessRecoveryStatus.Invalidated)
          : setAccessRecoveryStatus(AccessRecoveryStatus.Expired)
      },
      onError: () => {
        setAccessRecoveryStatus(AccessRecoveryStatus.Expired)
      },
    })
  }, [history, invalidateAccessRecovery, redirectToStartPage, sessionId])

  return (
    <ThemeProvider theme={UnifiedTheme}>
      {accessRecoveryStatus === AccessRecoveryStatus.Expired && (
        <LinkExpired onAction={redirectToStartPage} />
      )}

      <StatusPopup
        variant="success-optional"
        isOpen={accessRecoveryStatus === AccessRecoveryStatus.Invalidated}
        onExit={redirectToStartPage}
      >
        <StatusPopup.Title>{t('SuccessPopup.title')}</StatusPopup.Title>
        <StatusPopup.Description>{t('SuccessPopup.subtitle')}</StatusPopup.Description>
        <StatusPopup.Actions>
          <Button variant="secondary" onClick={redirectToStartPage}>
            {t('SuccessPopup.action')}
          </Button>
        </StatusPopup.Actions>
      </StatusPopup>
    </ThemeProvider>
  )
}
