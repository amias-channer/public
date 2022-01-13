import { isEmpty, last } from 'lodash'
import qs from 'qs'
import { useContext, useEffect, useState } from 'react'
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query'

import { TransactionDto } from '@revolut/rwa-core-types'
import { browser, checkRequired } from '@revolut/rwa-core-utils'
import { TransactionsScrollingContext } from '@revolut/rwa-feature-transactions'

const RETRY_INTERVAL_MS = 1000

type AutoScrollToTransactionProps = {
  elementRole: string
  transactions: TransactionDto[]
  isFetchingMore: boolean
  canFetchMore: boolean
  fetchMore: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<TransactionDto[], unknown>>
}

export const useAutoScrollToTransaction = ({
  elementRole,
  transactions,
  isFetchingMore,
  canFetchMore,
  fetchMore,
}: AutoScrollToTransactionProps) => {
  const { legId } = qs.parse(browser.getSearch()) as { legId?: string }

  const { shouldAutoScrollToTransactionBeUsed } = useContext(TransactionsScrollingContext)

  const [shouldScrollToTransaction, setShouldScrollToTransaction] = useState(
    Boolean(legId) && shouldAutoScrollToTransactionBeUsed,
  )

  useEffect(() => {
    if (!shouldScrollToTransaction || isFetchingMore) {
      return
    }

    const isLoaded = transactions.find((transaction) => transaction.legId === legId)
    if (!isLoaded) {
      if (canFetchMore) {
        fetchMore()
      }
      return
    }

    // Cause transactions are appeared in the DOM only when they close to viewport,
    // (the ones before and after viewport are removed or not yet rendered, even already loaded from the backend)
    // this method has been added to scroll viewport bottom to make next group be added into the dom.
    const scrollUntilTransactionAppeared = () => {
      const element = document.getElementById(
        checkRequired(legId, 'legId should not be empty'),
      )

      if (!element) {
        const all = document.querySelectorAll<HTMLElement>(`[role=${elementRole}]`)

        if (isEmpty(all)) {
          // Rendering is not finished yet
          if (!isEmpty(transactions)) {
            setTimeout(scrollUntilTransactionAppeared, RETRY_INTERVAL_MS)
          }

          return
        }

        const lastLoadedItem = checkRequired(
          last(all),
          'last selected item should not be empty',
        )

        browser.scrollTo({
          left: 0,
          top: lastLoadedItem.offsetTop + lastLoadedItem.offsetHeight,
        })

        // Making next check on the next tick, because scrolling and rendering needs time.
        setTimeout(scrollUntilTransactionAppeared, RETRY_INTERVAL_MS)
        return
      }
      element.scrollIntoView()
      setShouldScrollToTransaction(false)
    }

    scrollUntilTransactionAppeared()
  }, [
    elementRole,
    fetchMore,
    isFetchingMore,
    legId,
    shouldScrollToTransaction,
    transactions,
    canFetchMore,
  ])
}
