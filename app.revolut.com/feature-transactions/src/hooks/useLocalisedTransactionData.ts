import { TFunction, i18n as I18nInterface } from 'i18next'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import { TransactionDto } from '@revolut/rwa-core-types'
import {
  LocalizationArgument,
  I18nNamespace,
  localization,
  removeLinks,
  replaceHtmlEntities,
} from '@revolut/rwa-core-utils'

import {
  getStatusReason as getStatusReasonLocalised,
  getTransactionTitle,
} from '../utils'

const checkIfKeyExists = (i18n: I18nInterface, namespace: string, key: string) => {
  return i18n.exists(`${namespace}:${key}`)
}

const processLocalizationKeyAndParams = (
  t: TFunction,
  i18n: I18nInterface,
  namespace: string,
  keyAndParam: LocalizationArgument | string | null,
) => {
  if (keyAndParam && typeof keyAndParam !== 'string') {
    const { key, param } = keyAndParam

    const doesKeyExist = checkIfKeyExists(i18n, namespace, key)

    if (key && doesKeyExist) {
      if (param) {
        return t(key, param)
      }
      return t(key)
    }
  }

  if (typeof keyAndParam === 'string') {
    return keyAndParam
  }

  return null
}

export const useLocalisedTransactionData = (transaction: TransactionDto) => {
  const { t, i18n } = useTranslation(I18nNamespace.Domain)

  const getTitle = () => {
    const titleKeyAndParam = getTransactionTitle(transaction)

    const titleTranslated = processLocalizationKeyAndParams(
      t,
      i18n,
      I18nNamespace.Domain,
      titleKeyAndParam,
    )

    return replaceHtmlEntities(titleTranslated || transaction.description)
  }

  const getStatus = () => {
    const status = processLocalizationKeyAndParams(
      t,
      i18n,
      I18nNamespace.Domain,
      localization.getString(`transaction-status-${transaction.state.toLowerCase()}`),
    )

    return capitalize(replaceHtmlEntities(status || transaction.state).toLowerCase())
  }

  const getStatusReason = () => {
    const statusTextLocalizationData = getStatusReasonLocalised(transaction)

    const statusText = processLocalizationKeyAndParams(
      t,
      i18n,
      I18nNamespace.Domain,
      statusTextLocalizationData,
    )

    return statusText ? capitalize(removeLinks(statusText)) : undefined
  }

  const getSuspiciousTransferWarning = () => {
    return processLocalizationKeyAndParams(
      t,
      i18n,
      I18nNamespace.Domain,
      localization.getString('transaction-suspicious_transfer'),
    )
  }

  return {
    getTitle,
    getStatus,
    getStatusReason,
    getSuspiciousTransferWarning,
  }
}
