import { VFC } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Header } from '@revolut/ui-kit'

import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'

import { SendAgainAction, checkHasSendAgainAction } from './SendAgainAction'
import { checkIsTransactionFailed } from './utils'
import { HeaderActionId, HeaderAction, HeaderActionsProps } from './types'

const ACTIONS: ReadonlyArray<HeaderAction> = [
  {
    checkIsAvailable: (transaction, isFeatureActive) =>
      isFeatureActive(FeatureKey.AllowPayments) && checkHasSendAgainAction(transaction),
    render: (transaction) => (
      <SendAgainAction key={HeaderActionId.SendAgain} transaction={transaction} />
    ),
  },
]

export const HeaderActions: VFC<HeaderActionsProps> = ({ transaction }) => {
  const { isFeatureActive } = useFeaturesConfig()

  if (checkIsTransactionFailed(transaction)) {
    return null
  }

  const actions = ACTIONS.filter((action) =>
    action.checkIsAvailable(transaction, isFeatureActive),
  )

  if (isEmpty(actions)) {
    return null
  }

  return <Header.Bar>{actions.map((action) => action.render(transaction))}</Header.Bar>
}
