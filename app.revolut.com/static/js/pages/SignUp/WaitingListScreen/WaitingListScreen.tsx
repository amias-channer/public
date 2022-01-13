import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AbsoluteLoader,
  Illustration,
  IllustrationAssetId,
  StatusIconType,
  StatusLayout,
} from '@revolut/rwa-core-components'

import { useCurrentPositionInWaitingList } from './hooks'

export const WaitingListScreen: FC = () => {
  const { t } = useTranslation('pages.SignUp')
  const { currentPositionData, isLoading } = useCurrentPositionInWaitingList()

  if (isLoading) {
    return <AbsoluteLoader />
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Pending}
      title={t('WaitingListScreen.title', {
        currentPosition: currentPositionData?.currentPosition,
      })}
      authLayoutProps={{
        description: t('WaitingListScreen.description'),
        illustration: <Illustration assetId={IllustrationAssetId.WaitingList} />,
      }}
    />
  )
}
