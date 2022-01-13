import { createContext, FC, useCallback, useEffect, useRef } from 'react'

import { checkRequired } from '@revolut/rwa-core-utils'

import { useGetStatement } from '../../hooks'
import { GenerateRequestArgs } from '../../types'
import { StatementToastWrapper } from './StatementToastWrapper'
import { StatementLoadingToast, StatementReadyToast } from './toasts'
import { useStatementToastState } from './hooks'
import { isAccountStatementPending, isAccountStatementReady } from './utils'
import { StatementToastState } from './types'

type StatementsContextProps = {
  isFetching: boolean
  isPreparing: boolean
  isReady: boolean
  isToastOpen: boolean
  hasError: boolean
  downloadStatement: VoidFunction
  generateStatement: (args: GenerateRequestArgs) => void
  onPendingPopupOpen: VoidFunction
  showToast: VoidFunction
}

export const StatementsContext = createContext<StatementsContextProps>(
  {} as StatementsContextProps,
)

export const StatementsProvider: FC = ({ children }) => {
  const lastStatementGenerationArgs = useRef<GenerateRequestArgs>()

  const { response, isFetching, isError, generateStatement } = useGetStatement()

  const { toastState, showLoadingToast, waitForPendingPopupClose } =
    useStatementToastState({ response, isError })

  const handleDownloadStatement = useCallback(() => {
    generateStatement(
      checkRequired(
        lastStatementGenerationArgs.current,
        'statement generation args can not be empty',
      ),
    )
  }, [generateStatement])

  useEffect(() => {
    const isStatementFetchedWithoutPending = toastState === undefined

    if (isAccountStatementReady(response?.state) && isStatementFetchedWithoutPending) {
      handleDownloadStatement()
    }
  }, [handleDownloadStatement, response?.state, toastState])

  const handleGenerateStatement = useCallback<typeof generateStatement>(
    (args) => {
      lastStatementGenerationArgs.current = args
      generateStatement(args)
    },
    [generateStatement],
  )

  const getStatementToast = () => {
    switch (toastState) {
      case StatementToastState.Pending:
        return <StatementLoadingToast />
      case StatementToastState.Ready:
        return <StatementReadyToast onDownload={handleDownloadStatement} />
      default:
        return null
    }
  }

  const StatementToast = getStatementToast()

  const value: StatementsContextProps = {
    isFetching,
    isPreparing: isAccountStatementPending(response?.state),
    isReady: isAccountStatementReady(response?.state),
    isToastOpen: Boolean(StatementToast),
    hasError: isError,
    downloadStatement: handleDownloadStatement,
    generateStatement: handleGenerateStatement,
    onPendingPopupOpen: waitForPendingPopupClose,
    showToast: showLoadingToast,
  }

  return (
    <StatementsContext.Provider value={value}>
      {children}
      <StatementToastWrapper>{StatementToast}</StatementToastWrapper>
    </StatementsContext.Provider>
  )
}
