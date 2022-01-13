import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, useQueryClient } from 'react-query'
import { ExclamationTriangle, Check, Cross } from '@revolut/icons'
import { Box, Card, Flex, TextBox } from '@revolut/ui-kit'

import { trackEvent, TransactionTrackingEvent } from '@revolut/rwa-core-analytics'
import { ActionButton, ActionButtonVariant, useModal } from '@revolut/rwa-core-components'
import { IconSize, QueryKey, useNavigateToErrorPage } from '@revolut/rwa-core-utils'
import { useSuspiciousTransactionHandler } from '@revolut/rwa-feature-transactions'

import { CardTerminationConfirmationModal } from 'components/Modals'

import { I18N_NAMESPACE } from '../constants'

type Props = {
  transactionId: string
  onConfirmed: VoidFunction
  onCardTerminated: VoidFunction
}

export const invalidateCacheAfterTransactionJustifinement = (
  queryClient: QueryClient,
) => {
  queryClient.invalidateQueries(QueryKey.Transaction)
  queryClient.removeQueries(QueryKey.Transactions)
  queryClient.invalidateQueries(QueryKey.UserCard)
  queryClient.removeQueries(QueryKey.Cards)
}

export const SuspiciousHandler: React.FC<Props> = ({
  transactionId,
  onConfirmed,
  onCardTerminated,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const navigateToErrorPage = useNavigateToErrorPage()
  const queryClient = useQueryClient()

  const [showTerminationConfirmationModal, generalModalProps] = useModal()

  const { decline: denyTransaction, confirm: confirmTransaction } =
    useSuspiciousTransactionHandler()

  const redirectToError = () => {
    navigateToErrorPage('Suspicious transaction can not be confirmed')
  }

  const onConfirmClick = () => {
    trackEvent(TransactionTrackingEvent.confirmed, {
      transactionId,
    })
    confirmTransaction(transactionId, {
      onSuccess: () => {
        invalidateCacheAfterTransactionJustifinement(queryClient)
        onConfirmed()
      },
      onError: redirectToError,
    })
  }

  const onDenyClick = async () => {
    trackEvent(TransactionTrackingEvent.declined, {
      transactionId,
    })
    showTerminationConfirmationModal()
  }

  const onTerminationConfirmed = () => {
    denyTransaction(transactionId, {
      onSuccess: () => {
        invalidateCacheAfterTransactionJustifinement(queryClient)
        onCardTerminated()
      },
      onError: redirectToError,
    })
  }

  return (
    <>
      <Card variant="plain" p="px24">
        <Flex justifyContent="space-between">
          <TextBox variant="primary" fontWeight={500}>
            {t('suspiciousHandler.header')}
          </TextBox>
          <ExclamationTriangle size={IconSize.Medium} color="warning" />
        </Flex>
        <TextBox mt="px8" color="grey-50">
          {t('suspiciousHandler.description')}
        </TextBox>
        <Flex mt="px16">
          <Box>
            <ActionButton
              useIcon={Check}
              variant={ActionButtonVariant.Secondary}
              buttonProps={{ onClick: onConfirmClick }}
            >
              {t('suspiciousHandler.yesButton')}
            </ActionButton>
          </Box>
          <Box ml="px12">
            <ActionButton
              buttonProps={{ onClick: onDenyClick }}
              useIcon={Cross}
              variant={ActionButtonVariant.Secondary}
              textColor="error"
            >
              {t('suspiciousHandler.noButton')}
            </ActionButton>
          </Box>
        </Flex>
      </Card>
      <CardTerminationConfirmationModal
        {...generalModalProps}
        onTerminationConfirmed={onTerminationConfirmed}
      />
    </>
  )
}
