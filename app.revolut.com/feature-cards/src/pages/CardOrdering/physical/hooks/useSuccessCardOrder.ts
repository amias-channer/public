import { useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { useModal } from '@revolut/rwa-core-components'
import {
  CheckoutResponseDto,
  CheckoutState,
  PricingPlanCode,
} from '@revolut/rwa-core-types'
import { Url, getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { useInvalidateCardOrderQueries } from '../../hooks'

type UseSuccessCardOrderReturn = [
  (checkoutResponse: CheckoutResponseDto) => void,
  { isOpen: boolean; pricingPlanCode?: PricingPlanCode; onRequestClose: VoidFunction },
]

const isOrderRequireTopUp = (state: CheckoutState) => state === CheckoutState.Pending

export const useSuccessCardOrder = (): UseSuccessCardOrderReturn => {
  const history = useHistory()

  const orderedCardIdRef = useRef('')

  const [showSuccessCardOrderPopup, successCardOrderPopupProps] = useModal()
  const invalidateCardOrderQueries = useInvalidateCardOrderQueries()

  const proceedToCheckoutFlow = useCallback(() => {
    history.push(Url.CardOrderingCheckout)
  }, [history])

  const handleSuccessCardOrder = useCallback(
    (checkoutResponse: CheckoutResponseDto) => {
      if (!isOrderRequireTopUp(checkoutResponse.state)) {
        orderedCardIdRef.current = checkoutResponse.card.id

        showSuccessCardOrderPopup()
        return
      }

      proceedToCheckoutFlow()
    },
    [proceedToCheckoutFlow, showSuccessCardOrderPopup],
  )

  const navigateToOrderedCardDetails = () => {
    history.push(getCardDetailsUrl(orderedCardIdRef.current))
  }

  const handleCloseSuccessPopup = async () => {
    successCardOrderPopupProps.onRequestClose()
    await invalidateCardOrderQueries()
    navigateToOrderedCardDetails()
  }

  return [
    handleSuccessCardOrder,
    {
      ...successCardOrderPopupProps,
      onRequestClose: handleCloseSuccessPopup,
    },
  ]
}
