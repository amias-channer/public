import { TFunction, i18n as I18nInterface } from 'i18next'

import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'
import {
  CurrenciesType,
  RevolutBankAccount,
  UserCompany,
  RevolutBankAccountNote,
} from '@revolut/rwa-core-types'
import {
  currencyLocalization,
  formatMoney,
  getCurrentLocale,
} from '@revolut/rwa-core-utils'

import {
  checkIfLocalJpyAccountOfJapaneseCompanyUser,
  checkIfLocalSgdAccountOfSingaporeanCompanyUser,
} from '../utils'

export enum IconType {
  Coins = 'Coins',
  Flag = 'Flag',
  Insurance = 'Insurance',
  LightBulb = 'LightBulb',
  Time = 'Time',
  Warning = 'Warning',
  Globe = 'Globe',
  Info = 'Info',
}

const getLocalEeuBankUserAccountHints = (account: RevolutBankAccount, t: TFunction) => {
  const localizedCurrencyName = t(
    currencyLocalization.getCurrencyDisplayNameByCode(account.currency),
  )

  return [
    {
      icon: IconType.LightBulb,
      title: t('eu_account-local-first_point', { param: localizedCurrencyName }),
    },
    {
      icon: IconType.Time,
      title: t('eu_account-local-second_point'),
    },
    {
      icon: IconType.Flag,
      title: t('eu_account-local-third_point'),
    },
  ]
}

const getExternalEeuBankUserAccountHints = (t: TFunction) => {
  return [
    {
      icon: IconType.Coins,
      title: t('eu_account-swift-first_point'),
    },
    {
      icon: IconType.Time,
      title: t('eu_account-swift-second_point'),
    },
    {
      icon: IconType.Flag,
      title: t('eu_account-swift-third_point'),
    },
  ]
}

const getLocalUsAccountHints = (account: RevolutBankAccount, t: TFunction) => {
  return [
    {
      icon: IconType.LightBulb,
      title: t('bank-details-local-info-USA', { param: account.currency }),
    },
    {
      icon: IconType.Flag,
      title: t('bank-details-wiresAndDebits'),
    },
    {
      icon: IconType.Flag,
      title: t('bank-details-local_wires'),
    },
    {
      icon: IconType.Insurance,
      title: t('bank-details-direct_deposit-info-fdic'),
    },
  ]
}

const getLocalCanadianAccountHints = (t: TFunction) => {
  return [
    {
      icon: IconType.Insurance,
      title: t('bank-details-local-info-canada-funds'),
    },
    {
      icon: IconType.LightBulb,
      title: t('bank-details-local-info-canada-share'),
    },
    {
      icon: IconType.Warning,
      title: t('bank-details-local-info-canada-not_supported'),
    },
  ]
}

const getLocalEuroAccountHints = (t: TFunction) => {
  return [
    {
      icon: IconType.LightBulb,
      title: t('account-details-local-personal-EUR-info'),
    },
    {
      icon: IconType.Globe,
      title: t('account-details-local-personal-EUR-direct_debit'),
    },
    {
      icon: IconType.Time,
      title: t('account-details-local-personal-EUR-time'),
    },
    {
      icon: IconType.Flag,
      title: t('account-details-local-personal-EUR-iban'),
    },
  ]
}

const getLocalAustralianAccountHints = (account: RevolutBankAccount, t: TFunction) => {
  const localizedCurrencyName = t(
    currencyLocalization.getCurrencyDisplayNameByCode(account.currency),
  )
  return [
    {
      icon: IconType.LightBulb,
      title: t('bank-details-local-info', {
        param: localizedCurrencyName,
      }),
    },
    {
      icon: IconType.Globe,
      title: t('account-details-AUD-personal-direct_debit'),
    },
    {
      icon: IconType.Time,
      title: t('bank-details-local-time'),
    },
    {
      icon: IconType.Flag,
      title: t('bank-details-local-only_local_exclusive'),
    },
  ]
}

const getTransactionLimitSgText = (t: TFunction) => {
  const TRANSACTION_LIMIT_AMOUNT_VALUE = 20000000
  const currentLocale = getCurrentLocale()
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  const sgdSymbol = currencies.SGD.symbol
  const formattedAmount = `${sgdSymbol} ${formatMoney(
    TRANSACTION_LIMIT_AMOUNT_VALUE,
    'SGD',
    currentLocale,
    {
      withCurrency: false,
      useGrouping: true,
      noDecimal: true,
    },
  )}`

  return t('account-detail-transaction-limit', {
    param: formattedAmount,
  })
}

const getTransactionLimitJpText = (t: TFunction) => {
  const TRANSACTION_LIMIT_AMOUNT_VALUE = 1000000
  const TRANSACTION_LIMIT_VALUE_JP = '取引ごとの限度額は1,000,000円になります。'

  const currentLocale = getCurrentLocale()

  if (currentLocale === 'jp') {
    return TRANSACTION_LIMIT_VALUE_JP
  }

  const formattedAmount = formatMoney(
    TRANSACTION_LIMIT_AMOUNT_VALUE,
    'JPY',
    currentLocale,
    { withCurrency: true, useGrouping: true, noDecimal: true },
  )

  return t('account-detail-transaction-limit', {
    param: formattedAmount,
  })
}

const getHintsForLocalJpyAccountOfJapaneseCompanyUser = (t: TFunction) => {
  return [
    {
      icon: IconType.Info,
      title: t('account-detail-personal-account-number'),
    },
    {
      icon: IconType.LightBulb,
      title: t('account-detail-inbound-transfer-restriction-jpy'),
    },
    {
      icon: IconType.Time,
      title: t('bank-details-local-time'),
    },
    {
      icon: IconType.Warning,
      title: t('account-detail-warning-entering-details'),
    },
    {
      icon: IconType.Warning,
      title: getTransactionLimitJpText(t),
    },
    {
      icon: IconType.Warning,
      title: t('account-detail-not-supported-direct-debit'),
    },
  ]
}

const getHintsForLocalSgdAccountOfSingaporeanCompanyUser = (t: TFunction) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  const sgdSymbol = currencies.SGD.symbol
  return [
    {
      icon: IconType.LightBulb,
      title: t('account-detail-transfer-restriction-account-type', { param: sgdSymbol }),
    },
    {
      icon: IconType.Time,
      title: t('bank-processing-time_few_hours'),
    },
    {
      icon: IconType.Flag,
      title: t('account-detail-supported-network-fast'),
    },
    {
      icon: IconType.Warning,
      title: getTransactionLimitSgText(t),
    },
    {
      icon: IconType.Warning,
      title: t('account-detail-not-supported-direct-debit'),
    },
  ]
}

const getTextForNoteForLocalPersonalAccount = (
  note: string,
  account: RevolutBankAccount,
  t: TFunction,
) => {
  const localizedCurrencyName = t(
    currencyLocalization.getCurrencyDisplayNameByCode(account.currency),
  )

  const textByNote = {
    [RevolutBankAccountNote.FEES]: t('bank-details-local-info', {
      param: localizedCurrencyName,
    }),
    [RevolutBankAccountNote.TIME]: t('bank-details-local-time'),
    [RevolutBankAccountNote.IBAN]: t('bank-details-local-only_local'),
  }

  return textByNote[note]
}

const getIconForHintForNotes = (note: string, account: RevolutBankAccount) => {
  const iconByNote = {
    [RevolutBankAccountNote.FEES]: account.local ? IconType.LightBulb : IconType.Coins,
    [RevolutBankAccountNote.TIME]: IconType.Time,
    [RevolutBankAccountNote.IBAN]: IconType.Flag,
  }

  return iconByNote[note]
}

const getPersonalKeyPart = (account: RevolutBankAccount) => {
  return account.local && account.personal ? '-personal' : ''
}
const generateCurrencySpecificLocalisationKey = (
  account: RevolutBankAccount,
  noteType: string,
) => {
  const base = `bank-details-`
  const personalKeyPart = getPersonalKeyPart(account)
  const currencyKeyPart = account.currency.toUpperCase()
  const noteKeyPart = `-${noteType}`

  return `${base}${currencyKeyPart}${personalKeyPart}${noteKeyPart}`
}

const getDefaultTextForNote = (noteType: string, t: TFunction) =>
  t(`bank-details-default-${noteType}`)

const checkIfLocalisedValueExists = (localisationKey: string, i18n: I18nInterface) =>
  i18n.exists(`domain:${localisationKey}`)

const getHintsForNotes = (
  account: RevolutBankAccount,
  t: TFunction,
  i18n: I18nInterface,
) => {
  const notes = Object.values(RevolutBankAccountNote)

  const hints: {
    icon: string
    title: string
  }[] = []

  notes.forEach((note: string) => {
    const localisationKey = generateCurrencySpecificLocalisationKey(account, note)

    let localisedHintValue = checkIfLocalisedValueExists(localisationKey, i18n)
      ? t(localisationKey)
      : null

    if (!localisedHintValue && (!account.personal || !account.local)) {
      localisedHintValue = getDefaultTextForNote(note, t)
    }

    if (!localisedHintValue && account.local && account.personal) {
      localisedHintValue = getTextForNoteForLocalPersonalAccount(note, account, t)
    }

    if (localisedHintValue) {
      const icon = getIconForHintForNotes(note, account)
      hints.push({ icon, title: localisedHintValue })
    }
  })

  return hints
}

const checkIfEeuBankUser = (userCompany: UserCompany) => {
  return userCompany.region === 'LT' && userCompany.features.includes('BANK')
}

export const getHints = (
  account: RevolutBankAccount,
  userCompany: UserCompany,
  t: TFunction,
  i18n: I18nInterface,
) => {
  const isUsAccount = account.address?.country === 'US'
  const isCanadianAccount = account.address?.country === 'CA'
  const isEeuBankUser = checkIfEeuBankUser(userCompany)
  const isLocalEuroAccount = account.local && account.currency === 'EUR'
  const isLocalAustralianAccount = account.local && account.currency === 'AUD'
  const isLocalJapaneseAccountOfJapaneseCompanyUser =
    checkIfLocalJpyAccountOfJapaneseCompanyUser(account, userCompany)

  const isLocalSgdAccountOfSincaporeanCompanyUser =
    checkIfLocalSgdAccountOfSingaporeanCompanyUser(account, userCompany)

  if (isUsAccount) {
    return getLocalUsAccountHints(account, t)
  }

  if (isCanadianAccount) {
    return getLocalCanadianAccountHints(t)
  }

  if (isLocalAustralianAccount) {
    return getLocalAustralianAccountHints(account, t)
  }

  if (isLocalEuroAccount) {
    return getLocalEuroAccountHints(t)
  }

  if (isEeuBankUser) {
    if (account.local) {
      return getLocalEeuBankUserAccountHints(account, t)
    }

    return getExternalEeuBankUserAccountHints(t)
  }

  if (isLocalJapaneseAccountOfJapaneseCompanyUser) {
    return getHintsForLocalJpyAccountOfJapaneseCompanyUser(t)
  }

  if (isLocalSgdAccountOfSincaporeanCompanyUser) {
    return getHintsForLocalSgdAccountOfSingaporeanCompanyUser(t)
  }

  return getHintsForNotes(account, t, i18n)
}
