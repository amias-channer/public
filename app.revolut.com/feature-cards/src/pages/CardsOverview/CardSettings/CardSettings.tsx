import { FC } from 'react'
import { Header } from '@revolut/ui-kit'
import { Redirect } from 'react-router-dom'

import { Spacer } from '@revolut/rwa-core-components'
import { checkRequired } from '@revolut/rwa-core-utils'

import { useGetUserCard } from '../../../hooks'
import { getCardsOverviewUrl } from '../../../helpers'
import { useGetCardTitle } from '../hooks'
import { CardSettingsActions } from './CardSettingsActions'
import { CardSettingsActivation } from './CardSettingsActivation'
import { CardSettingsSkeleton } from './CardSettingsSkeleton'
import { Card } from './Card'

type CardSettingsProps = {
  cardId: string
}

export const CardSettings: FC<CardSettingsProps> = ({ cardId }) => {
  const { cardData, isFetching } = useGetUserCard(cardId)
  const cardLabelText = useGetCardTitle(cardData)

  const isContentDisplayed = !isFetching && cardData
  const isCardUnavailable = !isFetching && !cardData

  if (isCardUnavailable) {
    return <Redirect to={getCardsOverviewUrl()} />
  }

  if (!isContentDisplayed) {
    return <CardSettingsSkeleton />
  }

  const checkedCardData = checkRequired(cardData, 'card data can not be empty')

  return (
    <>
      <Header variant="item">
        <Header.CloseButton aria-label="Close card settings" />
        <Header.Title>{cardLabelText}</Header.Title>
      </Header>

      {checkedCardData.image && (
        <>
          <Spacer h="16px" />
          <Card cardId={checkedCardData.id} />
        </>
      )}

      <Spacer h="40px" />
      <CardSettingsActivation cardId={cardId} />
      <Spacer h="16px" />
      <CardSettingsActions cardId={cardId} />
    </>
  )
}
