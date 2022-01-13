import { FC, useEffect, useState, useRef, useCallback } from 'react'
import { endOfMonth } from 'date-fns'
import qs from 'qs'
import { throttle, noop, isEmpty } from 'lodash'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { Route } from 'react-router-dom'

import { Layout, Box, ThemeProvider, UnifiedTheme, Sticky } from '@revolut/ui-kit'

import { trackEvent, TransactionsListTrackingEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { User } from '@revolut/rwa-core-types'
import { Url, useEventListener, browser } from '@revolut/rwa-core-utils'

import {
  useQueryTransactions,
  useScrollToGroup,
  useSearchOfSuspiciousTransaction,
  useTransactionGroups,
} from '../../hooks'

import {
  RegularTransactionsGroup,
  TransactionsGroupSkeleton,
  NoTransactionsFound,
} from '../../components'

import { TransactionsGroup } from '../../types'
import { SuspiciousTransactionsGroup } from './SuspiciosTransactionsGroup'
import { TransactionsListHeader } from './TransactionsListHeader'
import { SkeletonsGroup, ListGroup } from './styled'
import { TransactionDetailsOnSide } from './TransactionDetailsOnSide'

type Props = {
  user: User
}

type UrlQueryParams = {
  accountId?: string
  legId?: string
}

const GROUP_ROLE_NAME = 'transactions-group'
const ON_SCROLL_DELAY = 100
const OVERSCAN = 300

export const TransactionsList: FC<Props> = ({ user }) => {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null)

  const { createdDate } = user
  const { accountId, legId } = qs.parse(browser.getSearch()) as UrlQueryParams

  const {
    status,
    data: transactions,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useQueryTransactions(accountId)

  useSearchOfSuspiciousTransaction(transactions, fetchMore, canFetchMore, isFetchingMore)

  const [currentMonth, setCurrentMonth] = useState<Date | undefined>()
  const [isScrollToGroupNeeded, setIsScrollToGroupNeeded] = useState(Boolean(legId))

  const groupedTransactions = useTransactionGroups(transactions)

  const { regular, suspicious } = groupedTransactions

  const groupRenderer = useCallback(
    (index: number, group: TransactionsGroup) => (
      <>
        <RegularTransactionsGroup accountId={accountId} group={group} />
        {canFetchMore && index === regular.length - 1 && <TransactionsGroupSkeleton />}
      </>
    ),
    [canFetchMore, accountId, regular.length],
  )

  useEffect(() => {
    if (currentMonth) {
      return
    }

    setCurrentMonth(
      regular.length ? endOfMonth(new Date(regular[0].groupDate)) : undefined,
    )
  }, [currentMonth, regular])

  useEffect(() => {
    trackEvent(TransactionsListTrackingEvent.listOpened, {
      accountId,
    })

    return () => {
      trackEvent(TransactionsListTrackingEvent.listClosed, {
        accountId,
      })
    }
  }, [accountId])

  const { scrollToDate, isSearching, scrollToTransactionGroup } = useScrollToGroup(
    transactions,
    regular,
    Boolean(canFetchMore),
    isFetchingMore,
    fetchMore,
    virtuosoRef,
  )

  useEffect(() => {
    if (!legId || !transactions || !isScrollToGroupNeeded) {
      return
    }
    browser.scrollTo({ top: 0 })
    scrollToTransactionGroup(legId)
    setIsScrollToGroupNeeded(false)
  }, [isScrollToGroupNeeded, legId, scrollToTransactionGroup, transactions])

  const isTransactionsLoading = status === 'loading'
  const isShowSkeletons = isTransactionsLoading || isSearching

  const onScroll = () => {
    if (isShowSkeletons || isEmpty(transactions)) {
      return
    }

    const trapLine = document.documentElement.clientHeight / 2
    const transactionsGroups = Array.from(
      document.querySelectorAll<HTMLDivElement>(`[role=${GROUP_ROLE_NAME}]`),
    )

    let closestGroup: HTMLDivElement = transactionsGroups[0]

    if (document.documentElement.scrollTop) {
      transactionsGroups.forEach((group) => {
        const closestGroupTop = closestGroup.getBoundingClientRect().top - trapLine
        const groupTop = group.getBoundingClientRect().top - trapLine
        if (closestGroup === group || groupTop > 0) {
          return
        }

        if (closestGroupTop <= groupTop) {
          closestGroup = group
        }
      })
    }

    const lookableMonth = endOfMonth(
      new Date(parseInt(closestGroup.dataset.group as string)),
    )

    if (lookableMonth.getTime() !== currentMonth?.getTime()) {
      setCurrentMonth(lookableMonth)
    }
  }

  useEventListener('scroll', throttle(onScroll, ON_SCROLL_DELAY))

  const onHeaderMonthClick = (month: Date) => {
    scrollToDate(endOfMonth(month))
  }

  return (
    <Layout>
      <Layout.Main>
        <TransactionsListHeader
          accountId={accountId}
          isLoading={isShowSkeletons}
          transactions={transactions}
          currentMonth={currentMonth}
          canFetchMore={Boolean(canFetchMore)}
          createdDate={createdDate}
          onMonthClick={onHeaderMonthClick}
        />
        <Box>
          <Sticky top={110}>
            <SkeletonsGroup isShown={isShowSkeletons}>
              <TransactionsGroupSkeleton />
              <TransactionsGroupSkeleton />
              <TransactionsGroupSkeleton />
            </SkeletonsGroup>
          </Sticky>
          <ListGroup pb="s-24" mb="s-24" isShown={!isShowSkeletons}>
            {isEmpty(transactions) ? (
              <NoTransactionsFound />
            ) : (
              <>
                {!isEmpty(suspicious) && (
                  <SuspiciousTransactionsGroup transactions={suspicious} />
                )}
                <Virtuoso
                  ref={virtuosoRef}
                  useWindowScroll
                  data={regular}
                  endReached={() =>
                    canFetchMore && !isFetchingMore ? fetchMore() : noop()
                  }
                  itemContent={groupRenderer}
                  overscan={OVERSCAN}
                />
              </>
            )}
          </ListGroup>
        </Box>
      </Layout.Main>
      <Layout.Side>
        <Route
          path={Url.TransactionDetailsOnSide}
          exact
          component={TransactionDetailsOnSide}
        />
      </Layout.Side>
    </Layout>
  )
}

export const TransactionsListPage: FC = () => {
  const { user } = useAuthContext()

  return user ? (
    <ThemeProvider theme={UnifiedTheme}>
      <TransactionsList user={user} />
    </ThemeProvider>
  ) : null
}
