import { AxiosResponse } from 'axios'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, useQueryClient, UseMutateFunction } from 'react-query'
import {
  Warning as WarningIcon,
  Cross as CrossIcon,
  Check as CheckIcon,
} from '@revolut/icons'
import { ActionWidget, Button, StatusPopup, StatusPopupVariant } from '@revolut/ui-kit'

import {
  trackEvent,
  TransactionTrackingEvent,
  RetailEventOptions,
} from '@revolut/rwa-core-analytics'
import { TransactionDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { useSuspiciousTransactionHandler } from '../../../../hooks'
import { I18N_NAMESPACE } from '../../constants'
import { ConfirmDeclinePopup } from './ConfirmDeclinePopup'

enum Action {
  Nothing = 'NOTHING',
  Confirm = 'CONFIRM',
  Decline = 'DECLINE',
}

type StatusState = {
  isOpen: boolean
  title: string
  variant: StatusPopupVariant
}

type ActionFunction = UseMutateFunction<AxiosResponse<any>, unknown, string, unknown>

type ConfirmationPopupState = {
  isOpen: boolean
  title: string
  description: string
  actionFunc?: ActionFunction
  analyticEvent?: RetailEventOptions<string>
}

type Props = {
  transaction: TransactionDto
}

const STATUS_ANIMATION_TIMEOUT = 4000
const DEFAULT_STATUS: StatusState = {
  isOpen: false,
  title: '',
  variant: 'success-optional',
}

const DEFAULT_CONFIRMATION_POPUP_STATE: ConfirmationPopupState = {
  isOpen: false,
  title: '',
  description: '',
}

export const invalidateCacheAfterTransactionJustifinement = (
  queryClient: QueryClient,
) => {
  const invalidateOptions = {
    refetchActive: true,
    refetchInactive: true,
  }
  queryClient.invalidateQueries(QueryKey.Transaction, invalidateOptions)
  queryClient.invalidateQueries(QueryKey.UserCard, invalidateOptions)
  queryClient.invalidateQueries(QueryKey.Transactions, invalidateOptions)
  queryClient.invalidateQueries(QueryKey.Cards, invalidateOptions)
}

export const SuspiciousTransactionWidget: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const queryClient = useQueryClient()

  const [action, setAction] = useState<Action>(Action.Nothing)
  const [statusState, setStatusState] = useState<StatusState>(DEFAULT_STATUS)

  const { confirm, decline } = useSuspiciousTransactionHandler()

  const getConfirmationPopupState: () => ConfirmationPopupState = () => {
    switch (action) {
      case Action.Confirm:
        return {
          isOpen: true,
          title: t('confirmSuspiciousTransaction.title'),
          description: t('confirmSuspiciousTransaction.description'),
          actionFunc: confirm,
          analyticEvent: TransactionTrackingEvent.confirmed,
        }
      case Action.Decline:
        return {
          isOpen: true,
          title: t('declineSuspiciousTransaction.title'),
          description: t('declineSuspiciousTransaction.description', {
            last4: transaction.card?.lastFour,
          }),
          actionFunc: decline,
          analyticEvent: TransactionTrackingEvent.declined,
        }
      default:
        return DEFAULT_CONFIRMATION_POPUP_STATE
    }
  }

  const onPopupClose = () => {
    setAction(Action.Nothing)
  }

  const onActionConfirmed =
    (actionFunc?: ActionFunction, analyticEvent?: RetailEventOptions<string>) => () => {
      if (!actionFunc) {
        return
      }

      if (analyticEvent) {
        trackEvent(analyticEvent, { transactionId: transaction.id })
      }

      setStatusState({
        isOpen: true,
        variant: 'loading',
        title: '',
      })

      actionFunc(transaction.id, {
        onSuccess: () => {
          // this timeout is needed to prevent blinking between loading and final popup state.
          setTimeout(
            () =>
              setStatusState({
                variant: 'success-optional',
                isOpen: true,
                title:
                  action === Action.Confirm
                    ? t('cardUnfrozenStatus.title', { last4: transaction.card?.lastFour })
                    : t('cardTerminatedStatus.title', {
                        last4: transaction.card?.lastFour,
                      }),
              }),
            1000,
          )
        },
        onError: () => {
          setStatusState({
            variant: 'error',
            isOpen: true,
            title: t('transactionJustificationFailed.title'),
          })
        },
        onSettled: () => {
          // This timeout is needed to finish status animation and not start page rerender immideately
          setTimeout(() => {
            setAction(Action.Nothing)
            setStatusState(DEFAULT_STATUS)
            invalidateCacheAfterTransactionJustifinement(queryClient)
          }, STATUS_ANIMATION_TIMEOUT)
        },
      })
    }

  const onExit = () => {
    setStatusState(DEFAULT_STATUS)
  }

  const confirmationPopupState = getConfirmationPopupState()

  return (
    <>
      <ActionWidget>
        <ActionWidget.Title>{t('suspiciousHandler.header')}</ActionWidget.Title>
        <ActionWidget.Avatar>
          <WarningIcon color="orange" />
        </ActionWidget.Avatar>
        <ActionWidget.Content>{t('suspiciousHandler.description')}</ActionWidget.Content>
        <ActionWidget.Actions justifySelf="center">
          <Button
            size="sm"
            variant="negative"
            useIcon={CrossIcon}
            onClick={() => setAction(Action.Decline)}
          >
            {t('suspiciousHandler.noButton')}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            useIcon={CheckIcon}
            onClick={() => setAction(Action.Confirm)}
          >
            {t('suspiciousHandler.yesButton')}
          </Button>
        </ActionWidget.Actions>
      </ActionWidget>
      <ConfirmDeclinePopup
        isOpen={confirmationPopupState.isOpen}
        onExit={onPopupClose}
        onConfirm={onActionConfirmed(
          confirmationPopupState.actionFunc,
          confirmationPopupState.analyticEvent,
        )}
        onCancel={onPopupClose}
        title={confirmationPopupState.title}
        description={confirmationPopupState.description}
      />
      <StatusPopup
        variant={statusState.variant}
        isOpen={statusState.isOpen}
        onExit={onExit}
      >
        <StatusPopup.Title>{statusState.title}</StatusPopup.Title>
      </StatusPopup>
    </>
  )
}
