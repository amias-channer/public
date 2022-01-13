import { useMemo } from 'react'

import { useCardsTranslation } from '../../../../../hooks'
import { getCardOrderDesignImage } from '../../../../../helpers'
import { VirtualCardType } from '../../constants'
import { VirtualCardTypeOptions } from '../VirtualCardTypeSelection'
import { useGetAvailableVirtualCardDesigns } from './api'

export const useGetVirtualCardTypesOptions = (): VirtualCardTypeOptions[] | undefined => {
  const t = useCardsTranslation()
  const availableVirtualCardDesigns = useGetAvailableVirtualCardDesigns()

  return useMemo(
    () =>
      availableVirtualCardDesigns?.map((virtualCardDesign) => {
        const imgSrc = getCardOrderDesignImage(
          virtualCardDesign.brand,
          virtualCardDesign.code,
        )

        if (virtualCardDesign.disposable) {
          return {
            ...virtualCardDesign,
            type: VirtualCardType.Disposable,
            name: t('CardOrdering.VirtualCardSelection.disposable.name'),
            imgSrc,
            submitButtonText: t(
              'CardOrdering.VirtualCardSelection.disposable.buttonText',
            ),
            submitButtonVariant: 'default',
          }
        }

        return {
          ...virtualCardDesign,
          type: VirtualCardType.Virtual,
          name: t('CardOrdering.VirtualCardSelection.virtual.name'),
          imgSrc,
          submitButtonText: t('CardOrdering.VirtualCardSelection.virtual.buttonText'),
          submitButtonVariant: 'default',
        }
      }),
    [availableVirtualCardDesigns, t],
  )
}
