import qs from 'qs'
import { generatePath } from 'react-router'

import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'
import { UUID } from '@revolut/rwa-core-types'

import { Url } from './constants'

type RewardUrlOptions = {
  groupId?: string
  categoryId?: string
  search?: string
}

type HomeUrlOptions =
  | {
      tab: 'accounts'
      queryParams: {
        accountId?: string
        transactionId?: string
        transactionLegId?: string
      }
    }
  | {
      tab: 'cards'
      queryParams: {
        cardId?: string
      }
    }
  | {
      tab: 'crypto'
      queryParams?: {}
    }
  | {
      tab: 'stocks'
      queryParams?: {}
    }
  | {
      tab: 'vaults'
      queryParams?: {}
    }

export type CryptoDetailsTabOption = 'overview' | 'recurring' | 'transactions'
export type CryptoDetailsSourceOption =
  | 'investPage'
  | 'holdingsWidget'
  | 'holdingsPage'
  | 'topMoversWidget'
  | 'topMoversPage'
  | 'populaCryptoWidget'
  | 'populaCryptoPage'
  | 'exchangeFlowCompleted'
  | 'exchangeFlowCanceled'
export type CryptoDetailsUrlOptions = {
  tab: CryptoDetailsTabOption
  source: CryptoDetailsSourceOption
}

export const getHomeUrl = ({ tab, queryParams }: HomeUrlOptions) => {
  const query = qs.stringify(queryParams)
  const baseUrl = generatePath(Url.HomeTab, { tab })

  return `${baseUrl}${query ? `?${query}` : ''}`
}

export const getAccountTransactionsUrl = (pocketId: UUID, transactionLegId?: string) => {
  const query = qs.stringify({ legId: transactionLegId })
  return `${Url.Accounts}/${pocketId}/transactions${query ? `?${query}` : ''}`
}

export const getAccountsTransactionsUrl = (transactionLegId?: string) => {
  const query = qs.stringify({ legId: transactionLegId })
  return `${Url.AccountsTransactions}${query ? `?${query}` : ''}`
}

export const getAccountDetailsUrl = (pocketId: UUID) => {
  return `${Url.Accounts}/${pocketId}/details`
}

export const getIncidentUrl = (incidentId: string) => {
  return Url.IncidentContent.replace(':incidentId', incidentId)
}

export const getRewardCategoryUrl = (categoryId?: string) => {
  const query = qs.stringify({ categoryId })
  return `${Url.RewardsHome}${query ? `?${query}` : ''}`
}

export const getRewardUrl = (rewardId: string, options: RewardUrlOptions = {}) => {
  const query = qs.stringify(options)
  return `${Url.RewardDetails.replace(':rewardId', rewardId)}${query ? `?${query}` : ''}`
}

export const getRewardFeedbackUrl = (rewardId: string, rewardQuery?: string) => {
  return `${Url.RewardFeedback.replace(':rewardId', rewardId)}${
    rewardQuery ? `?${rewardQuery}` : ''
  }`
}

export const getRewardsHomeUrl = (options: RewardUrlOptions) => {
  const query = qs.stringify(options)
  return `${Url.RewardsHome}${query ? `?${query}` : ''}`
}

export const getRewardsGroupUrl = (groupId: string) => {
  return Url.RewardsGroup.replace(':rewardsGroupId', groupId)
}

export const getLegalTermsUrl = (countryCode: string) =>
  `${getConfigValue(ConfigKey.RevolutWebsiteUrl)}/en-${countryCode}/legal`

export const getRdpLinkUrl = () =>
  `${getConfigValue(ConfigKey.RevolutWebsiteUrl)}/responsible-disclosure-program`

export const getWebsiteTermsUrl = (countryCode: string) => {
  if (countryCode === 'US') {
    return getLegalTermsUrl(countryCode)
  }

  return `${getLegalTermsUrl(countryCode)}/website-terms-and-conditions`
}

export const getPrivacyPolicyUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/privacy`

export const getComplaintsPolicyUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/complaints-policy`

export const getLegalFeesUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/fees`

export const getCardholderTermsUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/cardholder-terms`

export const getPdsLinkUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/product-disclosure-statement`

export const getFinServGuideUrl = (countryCode: string) =>
  `${getLegalTermsUrl(countryCode)}/financial-services-guide`

export const getTopUpWorldpay3dsUrl = (paymentId: string) =>
  `${Url.TopUpWorldpay3ds}/${paymentId}?skip3ds=false`

// TODO: Remove during https://revolut.atlassian.net/browse/PCONG-1649
export const getLegacyTransactionDetailsUrl = (
  transactionId: string,
  legId?: string,
  accountId?: string,
) => {
  const transactionUrlProps = {
    legId,
    accountId,
  }

  return `${Url.TransactionDetails.replace(
    ':transactionId',
    transactionId,
  )}?${qs.stringify(transactionUrlProps)}`
}

export const getTransactionsListUrl = (accountId?: string) => {
  const query = qs.stringify({
    accountId,
  })

  return `${Url.TransactionsList}${query ? `?${query}` : ''}`
}
export const getTransactionDetailsUrl = (
  transactionId: string,
  legId?: string,
  accountId?: string,
) => {
  const query = qs.stringify({
    legId,
    accountId,
  })

  return `${Url.TransactionDetailsOnSide.replace(':transactionId', transactionId)}${
    query ? `?${query}` : ''
  }`
}

export const getCardDetailsUrl = (cardId: string) =>
  getHomeUrl({ tab: 'cards', queryParams: { cardId } })

export const getErrorUrl = (eventId: string) => `${Url.Error}?eventId=${eventId}`

export const getCryptoDetailsUrl = (
  cryptoCode: string,
  options: CryptoDetailsUrlOptions,
) => {
  const getPath = (tab: CryptoDetailsTabOption) => {
    switch (tab) {
      case 'recurring':
        return generatePath(Url.CryptoRecurringOrders, {
          cryptoCode,
        })

      case 'transactions':
        return generatePath(Url.CryptoTransactions, { cryptoCode })
      default:
        return generatePath(Url.CryptoDetailsOverview, {
          cryptoCode,
        })
    }
  }
  const path = getPath(options.tab)
  const query = qs.stringify({ source: options.source })
  return `${path}?${query}`
}

export const getCryptoStatsUrl = (
  cryptoCode: string,
  source: CryptoDetailsSourceOption,
) => {
  const path = generatePath(Url.CryptoStats, {
    cryptoCode,
  })
  const query = qs.stringify({ source })
  return `${path}?${query}`
}

export const getCryptoRecurringOrderDetailsUrl = (
  cryptoCode: string,
  recurringOrderId: string,
  source: CryptoDetailsSourceOption,
) => {
  const path = generatePath(Url.CryptoRecurringOrderDetails, {
    cryptoCode,
    recurringOrderId,
  })

  const query = qs.stringify({ source })
  return `${path}?${query}`
}

export const getCryptoTransactionDetailsUrl = (
  cryptoCode: string,
  transactionId: string,
  source: CryptoDetailsSourceOption,
  transactionLegId?: string,
) => {
  const query = qs.stringify({
    legId: transactionLegId,
    source,
  })

  const path = generatePath(Url.CryptoTransactionDetails, { cryptoCode, transactionId })
  return `${path}?${query}`
}

export const getPaymentAmountUrl = (beneficiaryId: string) =>
  `${Url.PaymentsAmount}?beneficiary=${beneficiaryId}`

export const getAppStoreDownloadUrl = (countryCode: string) => {
  return `https://apps.apple.com/${countryCode}/app/revolut/id932493382`
}

export const getPlayStoreDownloadUrl = (countryCode: string) => {
  return `https://play.google.com/store/apps/details?id=com.revolut.revolut&hl=${countryCode}&gl=${countryCode}`
}
