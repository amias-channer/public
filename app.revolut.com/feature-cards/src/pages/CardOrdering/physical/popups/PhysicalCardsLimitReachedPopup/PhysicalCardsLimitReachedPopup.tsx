import { FC } from 'react'

import { useQueryUserConfig } from '@revolut/rwa-core-api'
import { BaseModalProps } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'
import { CardLimitReachedPopup } from '../../../components'

export const PhysicalCardsLimitReachedPopup: FC<BaseModalProps> = (props) => {
  const t = useCardsTranslation()
  const [configData] = useQueryUserConfig()

  return (
    <CardLimitReachedPopup
      {...props}
      title={t('PhysicalCardsLimitReachedPopup.title')}
      text={t('PhysicalCardsLimitReachedPopup.description', {
        cardsAmount: configData?.cardMaxActiveCount.physical ?? '',
      })}
    />
  )
}
