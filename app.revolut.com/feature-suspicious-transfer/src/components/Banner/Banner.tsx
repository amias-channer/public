import { FC } from 'react'
import { generatePath, Link } from 'react-router-dom'

import { UUID } from '@revolut/rwa-core-types'
import { ActionWidget, Button } from '@revolut/ui-kit'
import { Warning } from '@revolut/icons'

import { BannerSkeleton } from './BannerSkeleton'
import { useTransactionBanner } from '../../hooks'
import { Url } from '../../consts'
import { BannerActionTitleTestId, BannerTestId } from './consts'

type Props = {
  transactionId: UUID
}

export const Banner: FC<Props> = ({ transactionId }) => {
  const { isLoading, data } = useTransactionBanner(transactionId)

  if (isLoading) {
    return <BannerSkeleton />
  }

  if (data) {
    return (
      <ActionWidget data-testid={BannerTestId}>
        <ActionWidget.Title>{data.title}</ActionWidget.Title>
        <ActionWidget.Content>{data.description}</ActionWidget.Content>
        {data.actionTitle && (
          <ActionWidget.Actions data-testid={BannerActionTitleTestId}>
            <Link to={generatePath(Url.SuspiciousTransfer, { transactionId })}>
              <Button variant="secondary" size="sm">
                {data.actionTitle}
              </Button>
            </Link>
          </ActionWidget.Actions>
        )}
        <ActionWidget.Avatar>
          <Warning size={24} color="orange" />
        </ActionWidget.Avatar>
      </ActionWidget>
    )
  }

  return null
}
