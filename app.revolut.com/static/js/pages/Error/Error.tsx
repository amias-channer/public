import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { trackEvent, CommonTrackingEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from './constants'

export enum NextPage {
  Home = 'Home',
  Start = 'Start',
}

const NextPageParams = {
  [NextPage.Home]: {
    url: Url.Home,
  },
  [NextPage.Start]: {
    url: Url.Start,
  },
}

export const Error: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const history = useHistory()
  const { isAuthorized } = useAuthContext()

  const getNextPage = () => (isAuthorized ? NextPage.Home : NextPage.Start)

  useEffect(() => {
    trackEvent(CommonTrackingEvent.errorPageOpened)
    return () => {
      trackEvent(CommonTrackingEvent.errorPageClosed)
    }
  }, [])

  const handleCloseButtonClick = () => {
    const nextPage = getNextPage()
    trackEvent(CommonTrackingEvent.errorPageCloseButtonClicked, { destination: nextPage })
    history.push(NextPageParams[nextPage].url)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Error}
      title={t('title')}
      authLayoutProps={{
        description: t('description'),
        handleCloseButtonClick,
      }}
    />
  )
}
