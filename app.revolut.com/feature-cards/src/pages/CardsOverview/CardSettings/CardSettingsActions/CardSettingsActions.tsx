import { FC, memo } from 'react'
import { generatePath } from 'react-router-dom'
import { Group } from '@revolut/ui-kit'

import { usePerformStepUpForUrl } from '@revolut/rwa-core-auth'
import { checkRequired, Url } from '@revolut/rwa-core-utils'

import { useGetUserCard } from '../../../../hooks'
import {
  isCardPaymentPending,
  isDisposableCard,
  isVirtualCard,
} from '../../../../helpers'
import { UnblockPinCvvAction } from '../../actions'
import { checkIsCardFrozen } from '../../utils'
import { useDeactivateCard, useFreezeCard, useUnfreezeCard } from '../hooks'
import { CardActionSkeleton } from './CardActionSkeleton'
import { CardFreezeAction } from './CardFreezeAction'
import { CardOtherSettingsAction } from './CardOtherSettingsAction'
import { CardReportAction } from './CardReportAction'
import { CardSecurityAction } from './CardSecurityAction'
import { CardUnfreezeAction } from './CardUnfreezeAction'
import { checkIsCardReportingAvailable } from './utils'

type CardSettingsActionsProps = {
  cardId: string
}

export const CardSettingsActions: FC<CardSettingsActionsProps> = memo(({ cardId }) => {
  const { cardData, isFetching } = useGetUserCard(cardId)
  const { setFreezeCard, isLoading: isFreezing } = useFreezeCard()
  const { setUnfreezeCard, isLoading: isUnfreezing } = useUnfreezeCard()
  const { deactivateCard, isLoading: isDeactivating } = useDeactivateCard()
  const { performStepUpForUrl, isStepUpInitializing } = usePerformStepUpForUrl(
    generatePath(Url.CardOverview, { cardId }),
  )

  const handleUnfreezeClick = async () => {
    const willStepUp = performStepUpForUrl()

    if (!willStepUp) {
      await setUnfreezeCard(cardId)
    }
  }

  const renderActions = () => {
    const isCardsActionsLoading =
      isFetching || isFreezing || isUnfreezing || isDeactivating || isStepUpInitializing

    if (!cardData || isCardsActionsLoading) {
      return (
        <>
          <CardActionSkeleton />
          <CardActionSkeleton />
        </>
      )
    }

    const checkedCardData = checkRequired(cardData, 'card data can not be undefined')

    const isCardFrozen = checkIsCardFrozen(checkedCardData)
    const isCardReportingAvailable = checkIsCardReportingAvailable(checkedCardData)
    const isCardPaymentDone = !isCardPaymentPending(cardData)

    if (isCardFrozen) {
      return (
        <>
          <CardUnfreezeAction onClick={handleUnfreezeClick} />
          {isCardReportingAvailable && (
            <CardReportAction onReport={() => deactivateCard(cardId)} />
          )}
        </>
      )
    }

    const isCardVirtual = isVirtualCard(cardData) && isDisposableCard(cardData)
    const isCardDisposable = isDisposableCard(cardData)
    const isFreezeActionAvailable = isCardPaymentDone && !isCardDisposable

    return (
      <>
        {isFreezeActionAvailable && (
          <CardFreezeAction onClick={() => setFreezeCard(cardId)} />
        )}
        {isCardPaymentDone &&
          (!isCardVirtual ? (
            <CardSecurityAction />
          ) : (
            <UnblockPinCvvAction
              cardId={cardId}
              titleKey="CardSettings.cvv.unblock.title"
              descriptionKey="CardSettings.cvv.unblock.subtitle"
            />
          ))}
        <CardOtherSettingsAction cardData={cardData} />
      </>
    )
  }

  return <Group>{renderActions()}</Group>
})
