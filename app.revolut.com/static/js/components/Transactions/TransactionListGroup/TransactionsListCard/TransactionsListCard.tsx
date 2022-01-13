import qs from 'qs'
import { FC, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { Time } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'
import { browser, getLegacyTransactionDetailsUrl } from '@revolut/rwa-core-utils'
import {
  DateTime,
  getMoneyProps,
  transactionPropertyChecker,
  useLocalisedTransactionData,
  TransactionsScrollingContext,
} from '@revolut/rwa-feature-transactions'

import { getIcon as getTransactionIcon, getTransactionBulletProps } from '../../helpers'
import { SuspiciousTransactionCard } from './SuspiciousTransactionCard'
import { TransactionCard } from './TransactionCard'

type TransactionsListCardBasicProps = {
  transaction: TransactionDto
  height?: string
  pocketId?: string
}

const getComment = (transaction: TransactionDto) => {
  const isSuspicious = transactionPropertyChecker.isSuspicious(transaction)
  return isSuspicious ? undefined : transaction.comment
}

export const TransactionsListCard: FC<TransactionsListCardBasicProps> = ({
  transaction,
  pocketId,
  ...restProps
}) => {
  const getIcon = () => {
    return getTransactionIcon(transaction)
  }

  const { id, legId } = transaction || {}

  const history = useHistory()

  const { setShouldAutoScrollToTransactionBeUsed } = useContext(
    TransactionsScrollingContext,
  )

  const { getTitle, getStatusReason, getStatus } =
    useLocalisedTransactionData(transaction)

  const comment = getComment(transaction)

  const onCardClick = useCallback(() => {
    // Cause browser remembers last scroll position on the screen and it will be restored on returning back,
    // no need to use auto scrolling in this case.
    // But need to update history, to remember last visited transaction.
    setShouldAutoScrollToTransactionBeUsed(false)

    const currentUrlQuery = qs.parse(browser.getSearch())
    const updatedUrlQuery = qs.stringify({ ...currentUrlQuery, legId })

    history.replace(`${browser.getPathname()}?${updatedUrlQuery}`)
    history.push(getLegacyTransactionDetailsUrl(id, legId, pocketId))
  }, [history, id, legId, pocketId, setShouldAutoScrollToTransactionBeUsed])

  const commonProps = {
    comment,
    counterpartMoney: getMoneyProps(transaction).counterpart,
    date: <Time value={transaction.startedDate} />,
    icon: getIcon(),
    money: getMoneyProps(transaction).main,
    onClick: onCardClick,
    reversed: transactionPropertyChecker.isIncoming(transaction),
    title: getTitle(),
    transactionId: id,
    legId,
    pocketId,
    ...getTransactionBulletProps(transaction),
    ...restProps,
  }

  if (transactionPropertyChecker.isSuspicious(transaction)) {
    return (
      <SuspiciousTransactionCard
        {...commonProps}
        date={<DateTime datetime={transaction.startedDate} />}
      />
    )
  }

  if (transactionPropertyChecker.hasErrorStatus(transaction)) {
    return (
      <TransactionCard {...commonProps} statusText={getStatusReason() || getStatus()} />
    )
  }

  if (transactionPropertyChecker.isPending(transaction)) {
    return (
      <TransactionCard
        {...commonProps}
        statusText={
          !transaction.vault?.expectedArrival
            ? getStatusReason() || getStatus()
            : undefined
        }
      />
    )
  }

  return <TransactionCard {...commonProps} statusText={getStatusReason()} />
}
