import { FC, useContext, useEffect } from 'react'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { UserTopupCardDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { TopUpMethod } from '../../../constants'
import { TopUpContext } from '../../../TopUpProvider'
import { MethodSelectPopupHeader } from '../MethodSelectPopupHeader'
import { MethodsGroupLinkedCards } from '../MethodsGroupLinkedCards'
import { MethodsGroupOthers } from '../MethodsGroupOthers'
import { TopUpMethodOnChangeArgs } from '../types'

type MethodsPopupScreenProps = {
  showApplePay: boolean
  showGooglePay: boolean
  linkedCards: ReadonlyArray<UserTopupCardDto>
  shouldChangeMethod: (method: TopUpMethod) => boolean
  onBeforeMethodChanged: VoidFunction
  onCardInfoClick: (card: UserTopupCardDto) => void
}

export const MethodsPopupScreen: FC<MethodsPopupScreenProps> = ({
  showApplePay,
  showGooglePay,
  linkedCards,
  shouldChangeMethod,
  onBeforeMethodChanged,
  onCardInfoClick,
}) => {
  const { setMethod, setLinkedCard } = useContext(TopUpContext)

  const hasLinkedCards = linkedCards.length > 0

  const handleDepositMethodChange = (args: TopUpMethodOnChangeArgs) => {
    onBeforeMethodChanged()

    if (!shouldChangeMethod(args.method)) {
      return
    }

    setMethod(args.method)

    if (args.method === TopUpMethod.DebitOrCreditCard && args.cardId) {
      const card = linkedCards.find((value) => value.id === args.cardId)

      setLinkedCard(checkRequired(card, '"card" can not be empty'))
    } else {
      setLinkedCard(undefined)
    }
  }

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpAvailableMethodsPopupShown)
  }, [])

  return (
    <>
      <MethodSelectPopupHeader />

      {hasLinkedCards && (
        <MethodsGroupLinkedCards
          linkedCards={linkedCards}
          onSelect={handleDepositMethodChange}
          onCardInfoClick={onCardInfoClick}
        />
      )}

      <MethodsGroupOthers
        hasLinkedCards={hasLinkedCards}
        showApplePay={showApplePay}
        showGooglePay={showGooglePay}
        onSelect={handleDepositMethodChange}
      />
    </>
  )
}
