import { useContext, useEffect, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Action, DetailsCell } from '@revolut/ui-kit'

import { trackEvent, TransactionTrackingEvent } from '@revolut/rwa-core-analytics'
import { useQueryWallet } from '@revolut/rwa-core-api'
import { TransactionDto } from '@revolut/rwa-core-types'
import { StatementsContext, StatementUrl } from '@revolut/rwa-feature-statements'

import { I18N_NAMESPACE } from '../../constants'
import { isStatementAvailable } from '../../utils'

type Props = {
  transaction: TransactionDto
}

export const StatementCell: VFC<Props> = ({ transaction }) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const { data: wallet } = useQueryWallet()

  const { isFetching, isPreparing, isReady, downloadStatement, generateStatement } =
    useContext(StatementsContext)

  useEffect(() => {
    if (isReady) {
      downloadStatement()
    }
  }, [downloadStatement, isReady])

  const handleDownloadStatementClick = () => {
    const trackEventOptions = {
      transactionId: transaction.id,
      currency: transaction.currency,
    }

    generateStatement({
      fetchUrl: StatementUrl.TransactionStatementUrl,
      urlParams: transaction.id,
      queryParams: {
        ccy: transaction.currency,
      },
      onError: () => {
        trackEvent(TransactionTrackingEvent.statementGenerationFailed, trackEventOptions)
      },
      onDownload: () => {
        trackEvent(TransactionTrackingEvent.statementDownloaded, trackEventOptions)
      },
    })
  }

  const transactionPocket = wallet?.pockets.find(
    (pocket) => pocket.id === transaction.account.id,
  )

  if (!isStatementAvailable(transaction, transactionPocket?.origin)) {
    return null
  }

  return (
    <DetailsCell>
      <DetailsCell.Title>{t('statement.title')}</DetailsCell.Title>
      <DetailsCell.Content>
        <Action
          useIcon={Icons.Download}
          disabled={isFetching || isPreparing}
          onClick={handleDownloadStatementClick}
        >
          {t('statement.button')}
        </Action>
      </DetailsCell.Content>
    </DetailsCell>
  )
}
