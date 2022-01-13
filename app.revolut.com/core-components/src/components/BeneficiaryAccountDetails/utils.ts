import * as Sentry from '@sentry/react'

import { formatIban, formatSortCode } from '@revolut/rwa-core-utils'
import { AccountFieldType } from '@revolut/rwa-core-types'

export const mapAccountKeyToLokaliseKey = (key: AccountFieldType) => {
  switch (key) {
    case AccountFieldType.AccountNumber:
      return 'field.accountNumber'
    case AccountFieldType.SortCode:
      return 'field.sortCode'
    case AccountFieldType.BsbCode:
      return 'field.bsbCode'
    case AccountFieldType.RoutingNumber:
      return 'field.routingNumber'
    case AccountFieldType.Bic:
      return 'field.bic'
    case AccountFieldType.Clabe:
      return 'field.clabe'
    case AccountFieldType.Iban:
      return 'field.iban'
    case AccountFieldType.InstitutionNumber:
      return 'field.institutionNumber'
    case AccountFieldType.TransitNumber:
      return 'field.transitNumber'
    case AccountFieldType.Ifsc:
      return 'field.ifsc'
    case AccountFieldType.RfcCurp:
      return 'field.curp'
    case AccountFieldType.ZenginBankCode:
      return 'field.zenginBankCode'
    case AccountFieldType.ZenginBranchCode:
      return 'field.zenginBranchCode'
    case AccountFieldType.ZenginAccountType:
      return 'field.zenginAccountType'
    case AccountFieldType.ClearingCode:
      return 'field.clearingCode'
    case AccountFieldType.BankBranchCode:
      return 'field.branchCode'
    case AccountFieldType.Msisdn:
      return 'field.msisdn'
    case AccountFieldType.BrazilAccountType:
      return 'field.brazilAccountType'
    case AccountFieldType.BrazilBranchNumber:
      return 'field.brazilBranchNumber'
    case AccountFieldType.BrazilCpfId:
      return 'field.brazilCpfId'
    default:
      Sentry.captureException(`account field type ${key} was not handled`)
      return undefined
  }
}

export const getFieldValueByAccountKey = (key: AccountFieldType, value: string) => {
  switch (key) {
    case AccountFieldType.SortCode:
      return formatSortCode(value)
    case AccountFieldType.Iban:
      return formatIban(value)
    default:
      return value
  }
}
