import { useHistory } from 'react-router-dom'

import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

import { useSowState } from '../useSowState'

import { useTranslation } from '../useTranslation'
import { I18nNamespace, Url } from '../../utils'

const SOW_ENTRY_POINT = 'sow-entry-point'

export const useEntryPoint = () => {
  const history = useHistory()
  const { t } = useTranslation(I18nNamespace.WidgetEntryPoint)

  const { isLoading, sowState } = useSowState()

  const isRestricted = sowState?.isRestricted

  const handleRedirect = () => {
    history.push(Url.SowVerification)
  }

  return isRestricted
    ? {
        id: SOW_ENTRY_POINT,
        title: t('title'),
        description: t('content'),
        image: {
          url: getAsset(
            'business/illustrations-repository/checklist-pencil.png',
            AssetProject.Media,
          ),
          url2x: getAsset(
            'business/illustrations-repository/checklist-pencil@2x.png',
            AssetProject.Media,
          ),
          url3x: getAsset(
            'business/illustrations-repository/checklist-pencil@3x.png',
            AssetProject.Media,
          ),
        },
        onClick: handleRedirect,
        isLoading,
      }
    : null
}
