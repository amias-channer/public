import { isEmpty } from 'lodash'
import { useCallback, FC, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Infinite from 'react-infinite'

import { UUID, TransactionDto } from '@revolut/rwa-core-types'
import { DEFAULT_LOCALE, formatMoney, getFormattedDate } from '@revolut/rwa-core-utils'
import {
  ContentLoader,
  ContentPartLoader,
  useTransactionGroups,
  TransactionsListEmptyState,
} from '@revolut/rwa-feature-transactions'

import { EDGE_OFFSET } from './constants'
import { TransactionListGroup } from './TransactionListGroup'

type TransactionsListProps = {
  isLoading: boolean
  isFetchingMore: boolean
  shouldShowEmptyState: boolean
  transactions: TransactionDto[]
  fetchMore: VoidFunction
  pocketId?: UUID
}

const GROUP_HEADER_HEIGHT = 68
const CARD_HEIGHT = 96
const CARD_PADDING = 8

export const TransactionsList: FC<TransactionsListProps> = (props) => {
  const {
    isLoading,
    shouldShowEmptyState,
    isFetchingMore,
    fetchMore,
    transactions,
    pocketId,
  } = props

  const groupedTransactions = useTransactionGroups(transactions, {
    groupHeaderHeight: GROUP_HEADER_HEIGHT,
    cardHeight: CARD_HEIGHT,
    cardPadding: CARD_PADDING,
  })

  const { t, i18n } = useTranslation('components.TransactionsList')

  const handleInfiniteLoad = useCallback(() => {
    fetchMore()
  }, [fetchMore])

  const getLoader = (): ReactElement | undefined => {
    if (!isLoading && !isFetchingMore) {
      return undefined
    }

    return !isFetchingMore ? <ContentLoader /> : <ContentPartLoader />
  }

  if (shouldShowEmptyState || !groupedTransactions) {
    return <TransactionsListEmptyState outlined />
  }

  const locale = i18n.language || DEFAULT_LOCALE

  const { suspicious, regular } = groupedTransactions

  return (
    <>
      {!isEmpty(suspicious) && (
        <TransactionListGroup
          titleOnLeft={t('groupHeaders.suspicious')}
          transactions={suspicious}
        />
      )}
      <Infinite
        elementHeight={regular.map(({ groupHeight }) => groupHeight)}
        onInfiniteLoad={handleInfiniteLoad}
        isInfiniteLoading={isLoading}
        loadingSpinnerDelegate={getLoader()}
        infiniteLoadBeginEdgeOffset={EDGE_OFFSET}
        useWindowAsScrollContainer
      >
        {regular.map(
          ({ groupDate, amount, currency, groupTransactions, groupHeight }, _) => (
            <TransactionListGroup
              key={new Date(groupDate).toISOString()}
              groupHeight={groupHeight}
              titleOnLeft={getFormattedDate(new Date(groupDate))}
              titleOnRight={
                amount && currency && pocketId && formatMoney(amount, currency, locale)
              }
              transactions={groupTransactions}
              pocketId={pocketId}
            />
          ),
        )}
      </Infinite>
    </>
  )
}
