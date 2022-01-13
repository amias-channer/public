import { FC, useContext, useEffect, useState, useCallback } from 'react'
import { Popup } from '@revolut/ui-kit'

import { UserTopupCardDto } from '@revolut/rwa-core-types'

import { TopUpMethod } from '../../constants'
import { TopUpContext } from '../../TopUpProvider'
import { CardInfoPopupScreen } from './CardInfoPopupScreen'
import { CurrentMethod } from './CurrentMethod'
import { MethodsPopupScreen } from './MethodsPopupScreen'

enum PopupScreen {
  CardInfo = 'CardInfo',
  Methods = 'Methods',
}

type MethodSelectProps = {
  showApplePay: boolean
  showGooglePay: boolean
  linkedCards: ReadonlyArray<UserTopupCardDto>
  shouldChangeMethod: (method: TopUpMethod) => boolean
}

type CurrentScreen =
  | {
      screen: PopupScreen.Methods
    }
  | {
      screen: PopupScreen.CardInfo
      data: {
        card: UserTopupCardDto
      }
    }

export const MethodSelect: FC<MethodSelectProps> = ({
  showApplePay,
  showGooglePay,
  linkedCards,
  shouldChangeMethod,
}) => {
  const { method, setMethod, setLinkedCard } = useContext(TopUpContext)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>({
    screen: PopupScreen.Methods,
  })

  useEffect(() => {
    if (method) {
      return
    }

    if (showApplePay) {
      setMethod(TopUpMethod.ApplePay)
    } else if (linkedCards.length > 0) {
      setMethod(TopUpMethod.DebitOrCreditCard)
      setLinkedCard(linkedCards[0])
    } else {
      setMethod(TopUpMethod.DebitOrCreditCard)
    }
  }, [showApplePay, linkedCards, method, setMethod, setLinkedCard])

  const closePopup = useCallback(() => setIsPopupOpen(false), [setIsPopupOpen])

  const renderCurrentPopup = () => {
    switch (currentScreen.screen) {
      case PopupScreen.Methods:
        return (
          <Popup
            variant="modal-view"
            shouldKeepMaxHeight
            isOpen={isPopupOpen}
            onExit={() => setIsPopupOpen(false)}
          >
            <MethodsPopupScreen
              showApplePay={showApplePay}
              showGooglePay={showGooglePay}
              linkedCards={linkedCards}
              shouldChangeMethod={shouldChangeMethod}
              onBeforeMethodChanged={closePopup}
              onCardInfoClick={(card) =>
                setCurrentScreen({
                  screen: PopupScreen.CardInfo,
                  data: {
                    card,
                  },
                })
              }
            />
          </Popup>
        )
      case PopupScreen.CardInfo:
        return (
          <Popup
            variant="modal-view"
            shouldKeepMaxHeight
            isOpen={isPopupOpen}
            onExit={() => setIsPopupOpen(false)}
            onExited={() => setCurrentScreen({ screen: PopupScreen.Methods })}
          >
            <CardInfoPopupScreen
              card={currentScreen.data.card}
              onGoBack={() =>
                setCurrentScreen({
                  screen: PopupScreen.Methods,
                })
              }
            />
          </Popup>
        )
      default:
        throw new Error(`Screen ${currentScreen} not reachable. It needs to be handled.`)
    }
  }

  return (
    <>
      {method && <CurrentMethod onChange={() => setIsPopupOpen(true)} />}
      {renderCurrentPopup()}
    </>
  )
}
