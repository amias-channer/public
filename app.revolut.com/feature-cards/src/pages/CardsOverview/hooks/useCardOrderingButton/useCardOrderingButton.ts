import { useHistory } from 'react-router-dom'

import { usePerformStepUpForUrl } from '@revolut/rwa-core-auth'
import { useModal } from '@revolut/rwa-core-components'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { browser, Url } from '@revolut/rwa-core-utils'

import { useGetPendingCardPayment } from 'hooks'

export const useCardOrderingButton = () => {
  const history = useHistory()
  const { isFeatureActive } = useFeaturesConfig()
  const { pendingCardPayment, isPendingCheckoutsFetching } = useGetPendingCardPayment()
  const { performStepUpForUrl, isStepUpInitializing } = usePerformStepUpForUrl(
    browser.getPathname(),
  )

  const [showPendingCardOrderPopup, pendingCardOrderPopupProps] = useModal()

  const goToCardOrdering = () => {
    history.push(Url.CardOrdering)
  }

  const handleAddCardButtonClick = () => {
    const willStepUp = performStepUpForUrl()

    if (!willStepUp) {
      if (!pendingCardPayment) {
        goToCardOrdering()
      } else {
        showPendingCardOrderPopup()
      }
    }
  }

  return {
    isAvailable: isFeatureActive(FeatureKey.AllowCardAdding),
    isPending: isStepUpInitializing || isPendingCheckoutsFetching,
    pendingCardOrderPopupProps,
    onAddCardButtonClick: handleAddCardButtonClick,
  }
}
