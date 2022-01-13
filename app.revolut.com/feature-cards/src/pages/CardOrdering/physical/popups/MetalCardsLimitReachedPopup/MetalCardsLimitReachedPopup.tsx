import { FC } from 'react'

import { BaseModalProps } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'
import { CardLimitReachedPopup } from '../../../components'

export const MetalCardsLimitReachedPopup: FC<BaseModalProps> = (props) => {
  const t = useCardsTranslation()

  return (
    <CardLimitReachedPopup
      {...props}
      title={t('MetalCardsLimitReachedPopup.title')}
      text={t('MetalCardsLimitReachedPopup.description')}
    />
  )
}
