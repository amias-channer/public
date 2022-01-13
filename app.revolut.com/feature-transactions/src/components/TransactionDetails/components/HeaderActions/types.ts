import { TransactionDto } from '@revolut/rwa-core-types'
import { FeatureKey } from '@revolut/rwa-core-config'

export enum HeaderActionId {
  SendAgain = 'SendAgain',
}

export type HeaderAction = {
  checkIsAvailable: (
    transaction: TransactionDto,
    isFeatureActive: (key: FeatureKey) => boolean,
  ) => boolean
  render: (transaction: TransactionDto) => JSX.Element
}

export type HeaderActionsProps = {
  transaction: TransactionDto
}
