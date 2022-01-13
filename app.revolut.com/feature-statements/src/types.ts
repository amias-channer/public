import { StatementFormat } from '@revolut/rwa-core-types'

export enum StatementUrl {
  AccountStatementUrl = 'user/current/statements/account-statements',
  TransactionStatementUrl = 'user/current/statements/transaction-statements',
}

export type QueryParamsFactoryArgs = {
  dateFrom: string
  dateTo: string
  format: StatementFormat
}

export type GenerateRequestArgs = {
  fetchUrl: StatementUrl
  queryParams: Object
  urlParams?: string
  onError?: VoidFunction
  onDownload?: VoidFunction
}
