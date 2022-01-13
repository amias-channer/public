import { StatementState } from '@revolut/rwa-core-types'

export const isAccountStatementReady = (state?: StatementState) =>
  state === StatementState.Ready

export const isAccountStatementPending = (state?: StatementState) =>
  state === StatementState.InPreparation
