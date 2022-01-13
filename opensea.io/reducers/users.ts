import BigNumber from "bignumber.js"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { WALLET_NAME } from "../constants"
import { Account, AccountConfig, buildAccount } from "./accounts"

export interface User {
  account?: Account
  email?: string
  emailVerified?: boolean
  id?: number
  isAffiliate?: boolean
  lastWalletType?: WALLET_NAME
  username?: string
  publicUsername?: string /* Hides auto generated usernames by our BE */
  userProfile?: any
  viewingUser?: User
}

export interface UserProfile {
  shouldReceiveItemSoldEmails: boolean
  shouldReceiveOwnedAssetUpdateEmails: boolean
  shouldReceiveBidReceivedEmails: boolean
  bidReceivedEmailsPriceThreshold: BigNumber | string
  shouldReceiveBidItemPriceChangeEmails: boolean
  shouldReceiveOutbidEmails: boolean
  shouldReceiveNewAssetReceivedEmails: boolean
  shouldReceiveBidInvalidEmails: boolean
  shouldReceiveReferralEmails: boolean
  shouldReceiveAuctionCreationEmails: boolean
  shouldReceiveAuctionExpirationEmails: boolean
  shouldReceiveBundleInvalidEmails: boolean
  shouldReceivePurchaseEmails: boolean
  shouldReceiveCancellationEmails: boolean
  shouldReceiveNewsletter: boolean
  hasAffirmativelyAcceptedOpenSeaTerms: boolean
}

const initialState: User = {
  id: undefined,
  email: undefined,
  username: undefined,
  emailVerified: false,
  account: {},
  isAffiliate: false,
  viewingUser: undefined,
  userProfile: {},
  lastWalletType: undefined,
}

const UsersReducer = (state: User = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_USER:
      if (!action.data) {
        return {
          ...initialState,
          viewingUser: state.viewingUser,
        }
      } else {
        const newState = {
          ...state,
          ...buildUser(action.data),
          viewingUser: state.viewingUser,
        }
        return newState
      }

    case ActionTypes.RECEIVE_VIEWING_USER:
      if (!action.data) {
        return {
          ...state,
          viewingUser: initialState.viewingUser,
        }
      } else {
        return {
          ...state,
          viewingUser: action.bootstrapped
            ? action.data
            : buildUser(action.data),
        }
      }

    case ActionTypes.RECEIVE_EMAIL:
      return {
        ...state,
        email: action.email,
        emailVerified: action.emailVerified == true,
      }

    default:
      return state
  }
}

export const buildUser = (userData: any): User => {
  const user: User = {
    // Public nullable
  }

  if (userData.lastWalletType !== undefined) {
    user.lastWalletType = userData.lastWalletType
  }
  if (userData.publicUsername !== undefined) {
    user.publicUsername = userData.publicUsername
  }
  if (userData.username !== undefined) {
    user.username = userData.username
  }
  // Public
  if (userData.account) {
    user.account = buildAccount(userData.account)
    if (
      user.account.config &&
      [
        AccountConfig.AffiliateAccepted,
        AccountConfig.AffiliateRequested,
        AccountConfig.Moderator,
        AccountConfig.PartnerAccepted,
        AccountConfig.Verified,
      ].includes(user.account.config)
    ) {
      user.isAffiliate = true
    }
  }
  // Private, do not nullify locally if server sends null
  if (userData.id) {
    user.id = userData.id
  }
  if (userData.email) {
    user.email = userData.email
  }
  if (userData.user_profile) {
    user.userProfile = userData.user_profile
    user.emailVerified = userData.user_profile.email_verified
  }
  return user
}

export default UsersReducer
