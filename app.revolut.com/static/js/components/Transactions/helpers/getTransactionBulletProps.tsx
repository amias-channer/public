import { ReactElement } from 'react'
import * as Icons from '@revolut/icons'

import { TransactionDto } from '@revolut/rwa-core-types'
import { IconSize } from '@revolut/rwa-core-utils'
import { transactionPropertyChecker } from '@revolut/rwa-feature-transactions'

export enum DataTestId {
  ExclamationMarkBullet = 'transaction-exclamation-mark-bullet',
  PendingBullet = 'transaction-pending-bullet',
  ErrorBullet = 'transaction-error-bullet',
}

export enum BulletBackground {
  Warning = 'warning',
  Error = 'error',
}

export type BulletProps = {
  bullet: ReactElement
  bulletBackground: BulletBackground
}

export const getTransactionBulletProps = (
  transaction: TransactionDto,
): BulletProps | undefined => {
  const { hasErrorStatus, isPending, isSuspicious } = transactionPropertyChecker

  if (isSuspicious(transaction)) {
    return {
      bullet: (
        <Icons.ExclamationMarkSign
          data-testid={DataTestId.ExclamationMarkBullet}
          size={IconSize.Small}
        />
      ),
      bulletBackground: BulletBackground.Warning,
    }
  }

  if (isPending(transaction)) {
    return {
      bullet: (
        <Icons.StatusClockArrows
          data-testid={DataTestId.PendingBullet}
          size={IconSize.Small}
        />
      ),
      bulletBackground: BulletBackground.Warning,
    }
  }

  if (hasErrorStatus(transaction)) {
    return {
      bullet: <Icons.Cross data-testid={DataTestId.ErrorBullet} size={IconSize.Small} />,
      bulletBackground: BulletBackground.Error,
    }
  }

  return undefined
}
