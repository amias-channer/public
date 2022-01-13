import { FC } from 'react'
import { Portal, Relative } from '@revolut/ui-kit'

import { VerificationSteps } from '@revolut/rwa-core-auth'
import { CopiedSuccessPopup } from '@revolut/rwa-core-components'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { CardItemDto, CardState } from '@revolut/rwa-core-types'
import { checkRequired, formatToBase64Image } from '@revolut/rwa-core-utils'

import { isCardPaymentPending } from '../../../../helpers'
import { useGetUserCard } from '../../../../hooks'
import { checkIsCardFrozen } from '../../utils'
import { EyeButton } from './EyeButton'
import { CardOptionsDialog } from './CardOptionsDialog'
import { CardImage } from './styled'
import { useCardDetails } from './hooks'

type CardImageContainerProps = {
  cardId: string
}

const isDisposableLimitReached = (card: CardItemDto) => {
  return card.disposable && card.state === CardState.Created
}

export const Card: FC<CardImageContainerProps> = ({ cardId }) => {
  const { cardData } = useGetUserCard(cardId)
  const { isFeatureActive } = useFeaturesConfig()
  const {
    cardOptionsDialogProps,
    copiedSuccessPopupProps,
    isCardDetailsRevealed,
    unmaskedCardImage,
    verificationStepsProps,
    onOpenCardOptionsDialog,
  } = useCardDetails(cardId)

  if (!cardData || !cardData?.image) {
    return null
  }

  const isCardFrozen = checkIsCardFrozen(cardData)

  const isCardDetailsActionsAvailable =
    isFeatureActive(FeatureKey.ShowCardDetails) &&
    !isCardPaymentPending(cardData) &&
    !isDisposableLimitReached(cardData)

  const cardImageSrc = formatToBase64Image(
    isCardDetailsRevealed
      ? checkRequired(
          unmaskedCardImage,
          'unmasked image was checked in isCardDetailsRevealed',
        )
      : cardData.image,
  )

  return (
    <>
      <Relative alignSelf="center">
        <CardImage
          src={cardImageSrc}
          isFrozen={isCardFrozen}
          isCardDetailsActionsAvailable={isCardDetailsActionsAvailable}
          onClick={isCardDetailsActionsAvailable ? onOpenCardOptionsDialog : undefined}
        />

        {isCardDetailsActionsAvailable && (
          <EyeButton
            isShowState={!isCardDetailsRevealed}
            onClick={onOpenCardOptionsDialog}
          />
        )}
      </Relative>
      <CardOptionsDialog
        isCardDetailsRevealed={isCardDetailsRevealed}
        {...cardOptionsDialogProps}
      />
      <CopiedSuccessPopup {...copiedSuccessPopupProps} />
      <Portal>
        <VerificationSteps {...verificationStepsProps} />
      </Portal>
    </>
  )
}
