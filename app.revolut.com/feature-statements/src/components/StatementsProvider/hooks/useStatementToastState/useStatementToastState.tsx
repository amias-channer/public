import { useCallback, useEffect, useState } from 'react'

import { StatementResponseDto } from '@revolut/rwa-core-types'

import { isAccountStatementReady } from '../../utils'
import { StatementToastState } from '../../types'

type UseStatementToastStateArgs = {
  response?: StatementResponseDto
  isError: boolean
}

export const useStatementToastState = ({
  response,
  isError,
}: UseStatementToastStateArgs) => {
  const [toastState, setToastState] = useState<StatementToastState>()

  const resetToastState = useCallback(() => {
    setToastState(undefined)
  }, [])

  useEffect(() => {
    if (!response || isError) {
      resetToastState()
    }
  }, [isError, resetToastState, response])

  useEffect(() => {
    const isPreviousStatementStatePending = toastState === StatementToastState.Pending

    if (isAccountStatementReady(response?.state) && isPreviousStatementStatePending) {
      setToastState(StatementToastState.Ready)
    }
  }, [response?.state, response?.url, toastState])

  const showLoadingToast = useCallback(() => {
    if (!isError && response !== undefined) {
      setToastState(StatementToastState.Pending)
    }
  }, [isError, response])

  const waitForPendingPopupClose = useCallback(() => {
    setToastState(StatementToastState.AwaitingPopupClose)
  }, [])

  return {
    toastState,
    showLoadingToast,
    waitForPendingPopupClose,
  }
}
