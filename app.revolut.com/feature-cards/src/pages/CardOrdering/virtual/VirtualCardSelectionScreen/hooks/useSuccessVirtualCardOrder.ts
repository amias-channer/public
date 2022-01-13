import { useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { useModal } from '@revolut/rwa-core-components'
import { CheckoutResponseDto, CheckoutState } from '@revolut/rwa-core-types'
import { Url, getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { useInvalidateCardOrderQueries } from '../../../hooks'

type UseSuccessVirtualCardOrderReturn = [
  (checkoutResponse: CheckoutResponseDto) => void,
  { isOpen: boolean; onRequestClose: VoidFunction },
]

const isOrderRequireTopUp = (state: CheckoutState) => state === CheckoutState.Pending

export const useSuccessVirtualCardOrder = (): UseSuccessVirtualCardOrderReturn => {
  const orderedCardIdRef = useRef('')
  const history = useHistory()

  const [showSuccessVirtualCardOrderPopup, successVirtualCardOrderPopupProps] = useModal()
  const invalidateQueries = useInvalidateCardOrderQueries()

  const proceedToCheckoutFlow = useCallback(() => {
    history.push(Url.CardOrderingCheckout)
  }, [history])

  const handleSuccessCardOrder = useCallback(
    (checkoutResponse: CheckoutResponseDto) => {
      if (!isOrderRequireTopUp(checkoutResponse.state)) {
        orderedCardIdRef.current = checkoutResponse.card.id

        showSuccessVirtualCardOrderPopup()
        return
      }

      proceedToCheckoutFlow()
    },
    [proceedToCheckoutFlow, showSuccessVirtualCardOrderPopup],
  )

  const navigateToOrderedCardDetails = () => {
    history.push(getCardDetailsUrl(orderedCardIdRef.current))
  }

  const handleCloseSuccessPopup = async () => {
    successVirtualCardOrderPopupProps.onRequestClose()
    await invalidateQueries()
    navigateToOrderedCardDetails()
  }

  return [
    handleSuccessCardOrder,
    {
      ...successVirtualCardOrderPopupProps,
      onRequestClose: handleCloseSuccessPopup,
    },
  ]
}
