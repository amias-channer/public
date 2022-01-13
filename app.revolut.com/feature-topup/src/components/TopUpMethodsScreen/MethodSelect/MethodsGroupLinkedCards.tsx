import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { UserTopupCardDto } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE, TopUpMethod } from '../../constants'
import { getTopUpMethodProps } from '../utils'
import { MethodsGroup } from './MethodsGroup'
import { MethodsGroupItem } from './MethodsGroupItem'
import { TopUpMethodOnChangeArgs } from './types'

type MethodsGroupLinkedCardsProps = {
  linkedCards: ReadonlyArray<UserTopupCardDto>
  onSelect: (args: TopUpMethodOnChangeArgs) => void
  onCardInfoClick: (card: UserTopupCardDto) => void
}

export const MethodsGroupLinkedCards: FC<MethodsGroupLinkedCardsProps> = ({
  linkedCards,
  onSelect,
  onCardInfoClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <MethodsGroup
      groupTitle={t('facelift.TopUpMethodsScreen.MethodSelect.popup.group.cards.title')}
      actionButtonText={t<string>(
        'facelift.TopUpMethodsScreen.MethodSelect.popup.group.cards.actionButtonText',
      )}
      actionButtonOnClick={() => onSelect({ method: TopUpMethod.DebitOrCreditCard })}
      isFirst
    >
      {linkedCards.map((card) => (
        <MethodsGroupItem
          key={card.id}
          {...getTopUpMethodProps(t, {
            method: TopUpMethod.DebitOrCreditCard,
            card,
          })}
          onClick={() =>
            onSelect({
              method: TopUpMethod.DebitOrCreditCard,
              cardId: card.id,
            })
          }
          onInfoClick={() => onCardInfoClick(card)}
        />
      ))}
    </MethodsGroup>
  )
}
