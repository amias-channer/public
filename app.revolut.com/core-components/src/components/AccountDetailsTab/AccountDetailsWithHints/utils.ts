import { TFunction } from 'i18next'
import { isNil, isString } from 'lodash'

import {
  ACCOUNT_FIELDS_BY_TYPE,
  AccountType,
  AccountDetailProperty,
  RevolutBankAccount,
  UserCompany,
} from '@revolut/rwa-core-types'
import { getCurrentLocale, I18nNamespace } from '@revolut/rwa-core-utils'

export const LOCALIZATION_KEY_BY_FIELD = {
  [AccountDetailProperty.accountNumber]: 'topup-bank-details-account',
  [AccountDetailProperty.achRoutingNumber]:
    'bank-transfer-beneficiary-account-field-routing_number',
  [AccountDetailProperty.bankCode]: 'revolut_accounts-details-bank_code',
  [AccountDetailProperty.bankName]: 'account-detail-bank-name',
  [AccountDetailProperty.beneficiaryName]: 'topup-bank-details-beneficiary',
  [AccountDetailProperty.bic]: 'topup-bank-details-swiftbic',
  [AccountDetailProperty.bsb]: 'bank-form-bsb',
  [AccountDetailProperty.iban]: 'topup-bank-details-iban',
  [AccountDetailProperty.institutionNumber]: 'topup-bank-details-institution_number',
  [AccountDetailProperty.requiredReference]: 'bank-reference_warning-form-reference',
  [AccountDetailProperty.sortCode]: 'topup-bank-details-sort_code',
  [AccountDetailProperty.transitNumber]: 'topup-bank-details-transit_number',
}

export const checkIfLocal = (account: RevolutBankAccount) => account.local

export const checkIfSwift = (account: RevolutBankAccount) => !account.local

const checkIfIsLocalAuBankAccount = (account: RevolutBankAccount) => !isNil(account.bsb)

const checkIfIsLocalCanadianAccount = (account: RevolutBankAccount) =>
  !isNil(account.institutionNumber)

const checkIfHasAchRoutingNumber = (account: RevolutBankAccount) =>
  !isNil(account.achRoutingNumber)

const checkIfHasBicOrIban = (account: RevolutBankAccount) =>
  !isNil(account.bic) || !isNil(account.iban)

const checkIfHasAccountNumberOrSortCode = (account: RevolutBankAccount) =>
  !isNil(account.accountNumber) || !isNil(account.sortCode)

export const checkIfLocalJpyAccountOfJapaneseCompanyUser = (
  account: RevolutBankAccount,
  userCompany: UserCompany,
) => account.local && account.currency === 'JPY' && userCompany.region === 'JP'

export const checkIfLocalSgdAccountOfSingaporeanCompanyUser = (
  account: RevolutBankAccount,
  userCompany: UserCompany,
) => account.local && account.currency === 'SGD' && userCompany.region === 'SG'

const determineAccountType = (account: RevolutBankAccount): AccountType | null => {
  const isLocalAuBankAccount = checkIfIsLocalAuBankAccount(account)
  const hasAchRoutingNumber = checkIfHasAchRoutingNumber(account)
  const hasBicOrIban = checkIfHasBicOrIban(account)
  const hasAccountNumberOrSortCode = checkIfHasAccountNumberOrSortCode(account)
  const isLocalCanadianAccount = checkIfIsLocalCanadianAccount(account)

  if (isLocalAuBankAccount) {
    return AccountType.LocalAu
  }

  if (hasAchRoutingNumber) {
    return AccountType.LocalUs
  }

  if (isLocalCanadianAccount) {
    return AccountType.LocalCa
  }

  if (hasBicOrIban) {
    return AccountType.Swift
  }

  if (hasAccountNumberOrSortCode) {
    return AccountType.Local
  }

  return null
}

export const getAccountDetails = (account: RevolutBankAccount) => {
  const accountType = determineAccountType(account)

  return [
    AccountDetailProperty.beneficiaryName,
    AccountDetailProperty.requiredReference,
    ...ACCOUNT_FIELDS_BY_TYPE[accountType as AccountType],
  ]
}

const getLocalJpyAccountDetails = (account: RevolutBankAccount, t: TFunction) => {
  const BANK_NAME_VALUE = 'ジェー・ピー・モルガン (0402)\nJ.P. Morgan'
  const BANK_NAME_VALUE_JP = 'ジェー・ピー・モルガン (0402)'
  const BRANCH_NAME_VALUE = '東京支店 (001) '
  const ACCOUNT_TYPE_VALUE = '当座 '
  const JAPANESE_LOCALE = 'ja'

  const currentLocale = getCurrentLocale()

  const getBankNameString = () =>
    currentLocale === JAPANESE_LOCALE ? BANK_NAME_VALUE_JP : BANK_NAME_VALUE

  const getBranchNameString = () =>
    currentLocale === JAPANESE_LOCALE
      ? BRANCH_NAME_VALUE
      : BRANCH_NAME_VALUE + t('account-detail-bank-branch-name-tokyo')

  const getAccountTypeString = () =>
    currentLocale === JAPANESE_LOCALE ? '' : ACCOUNT_TYPE_VALUE

  return [
    {
      title: t('account-detail-bank-name-with-code'),
      value: getBankNameString(),
    },
    {
      title: t('account-detail-bank-branch-name-with-code'),
      value: getBranchNameString(),
    },
    {
      title: t('account-detail-account-type'),
      value: getAccountTypeString() + t('account-detail-account-type-current'),
    },
    {
      title: t('topup-bank-details-account_number'),
      value: account.accountNumber || '',
    },
    {
      title: t(LOCALIZATION_KEY_BY_FIELD[AccountDetailProperty.beneficiaryName]),
      value: account.beneficiaryName || '',
    },
  ]
}

export const getDetails = (
  account: RevolutBankAccount,
  userCompany: UserCompany,
  t: TFunction,
) => {
  const isLocalJpyAccountOfJapaneseCompanyUser =
    checkIfLocalJpyAccountOfJapaneseCompanyUser(account, userCompany)

  if (isLocalJpyAccountOfJapaneseCompanyUser) {
    return getLocalJpyAccountDetails(account, t)
  }

  const details = getAccountDetails(account)

  return details
    .map((fieldName) => {
      return {
        title: t(`${I18nNamespace.Domain}:${LOCALIZATION_KEY_BY_FIELD[fieldName]}`),
        value: account[fieldName] ?? '',
      }
    })
    .filter(
      (i) =>
        Boolean(i.title) &&
        (isString(i.value) ? Boolean(i.value.trim()) : Boolean(i.value)),
    )
}
