import localForage from "localforage"
import { API_MESSAGE_403, API_MESSAGE_404, IS_SERVER } from "../constants"
import { captureWarning, trackUser } from "../lib/analytics/analytics"
import Auth from "../lib/auth"
import Wallet from "../lib/chain/wallet"
import { bn, ETH_DECIMALS } from "../lib/helpers/numberUtils"
import Router from "../lib/helpers/router"
import Transport from "../lib/transport"
import { delay } from "../lib/wyvern"
import { User, UserProfile } from "../reducers/users"
import { Action, AsyncAction, getIsTestnet } from "../store"
import ErrorActions from "./errors"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"
import NoticeActions from "./notices"

const USER_STORE_KEY = "user"

const UserActions = {
  loadCached: (): AsyncAction => async dispatch => {
    if (IS_SERVER) {
      return
    }
    try {
      const cached = await localForage.getItem<User | undefined>(USER_STORE_KEY)
      await dispatch(UserActions.receive(cached))
    } catch (error) {
      dispatch(UserActions.logout())
    }
  },

  findCurrentWithoutAuth:
    (): AsyncAction<User> => async (dispatch, getState) => {
      const address = Wallet.wallet?.getActiveAccountKey()?.address
      if (address) {
        await dispatch(UserActions.findByAddress(address, true, true))
      }
      return getState().user
    },

  findCurrent: (): AsyncAction => async dispatch => {
    try {
      await dispatch(UserActions._fetchWithAccount(null, true))
    } catch (error) {
      await dispatch(UserActions._logErrorAndLogout(error))
    }
  },

  findByAddress:
    (address: string, isCurrentUser = false, silent = false): AsyncAction =>
    async dispatch => {
      try {
        if (!silent) {
          dispatch(FetchingActions.start("Getting user information"))
        }
        await dispatch(UserActions._fetchWithAccount(address, isCurrentUser))
      } catch (error) {
        // Don't log out current users! There could be a network error
        // Disadvantage of this: changing user accounts will keep the old user set
        // even if the address changed
        dispatch(ErrorActions.show(error))
      } finally {
        if (!silent) {
          dispatch(FetchingActions.stop())
        }
      }
    },

  joinWaitlist:
    (email: string, featureName: string): AsyncAction =>
    async dispatch => {
      try {
        const url = `/waitlist/${featureName}/`
        await Transport.sendJSON(url, {
          body: {
            email,
          },
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    },

  updateUser:
    ({
      email,
      username,
      shouldReceiveItemSoldEmails,
      shouldReceiveOwnedAssetUpdateEmails,
      shouldReceiveBidReceivedEmails,
      bidReceivedEmailsPriceThreshold,
      shouldReceiveBidItemPriceChangeEmails,
      shouldReceiveOutbidEmails,
      shouldReceiveNewAssetReceivedEmails,
      shouldReceiveBidInvalidEmails,
      shouldReceiveReferralEmails,
      shouldReceiveAuctionCreationEmails,
      shouldReceiveAuctionExpirationEmails,
      shouldReceiveBundleInvalidEmails,
      shouldReceivePurchaseEmails,
      shouldReceiveCancellationEmails,
      hasAffirmativelyAcceptedOpenSeaTerms,
      shouldReceiveNewsletter,
    }: Partial<UserProfile> & {
      email?: string | null
      username?: string | null
    }): AsyncAction =>
    async dispatch => {
      try {
        dispatch(FetchingActions.start("Saving..."))
        if (email === null) {
          email = undefined
        }
        if (username === null) {
          username = undefined
        }
        await Auth.UNSAFE_login()
        const path = `/user/update/`
        const data = await Transport.sendJSON(path, {
          method: "PUT",
          body: {
            email,
            username,
            user_profile: {
              receive_item_sold_emails: shouldReceiveItemSoldEmails,
              receive_owned_asset_update_emails:
                shouldReceiveOwnedAssetUpdateEmails,
              receive_bid_received_emails: shouldReceiveBidReceivedEmails,
              bid_received_emails_price_threshold:
                bidReceivedEmailsPriceThreshold
                  ? bn(
                      bidReceivedEmailsPriceThreshold,
                      -ETH_DECIMALS,
                    ).toString()
                  : undefined,
              receive_bid_item_price_change_emails:
                shouldReceiveBidItemPriceChangeEmails,
              receive_outbid_emails: shouldReceiveOutbidEmails,
              receive_bid_invalid_emails: shouldReceiveBidInvalidEmails,
              receive_new_asset_received_emails:
                shouldReceiveNewAssetReceivedEmails,
              receive_referral_emails: shouldReceiveReferralEmails,
              receive_auction_creation_emails:
                shouldReceiveAuctionCreationEmails,
              receive_auction_expiration_emails:
                shouldReceiveAuctionExpirationEmails,
              receive_bundle_invalid_emails: shouldReceiveBundleInvalidEmails,
              receive_purchase_emails: shouldReceivePurchaseEmails,
              receive_cancellation_emails: shouldReceiveCancellationEmails,
              receive_newsletter: shouldReceiveNewsletter,
              has_affirmatively_accepted_opensea_terms:
                hasAffirmativelyAcceptedOpenSeaTerms,
            },
          },
        })
        await dispatch(UserActions._handleResponse(data, true))
        dispatch(UserActions.showEmailVerificationNoticeIfNecessary())
      } catch (error) {
        if (error.message.startsWith(API_MESSAGE_403)) {
          await dispatch(UserActions._logErrorAndLogout(error))
        } else {
          dispatch(
            ErrorActions.show(
              error,
              `Problem updating your account: ${error.message}`,
            ),
          )
        }
        throw error
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  // Where this is called directly from a component after a call to updateUser, it's necessary to await the updateUser
  showEmailVerificationNoticeIfNecessary:
    (): AsyncAction => async (dispatch, getState) => {
      const { email, emailVerified } = getState().user
      if (email && !emailVerified && !getIsTestnet()) {
        await dispatch(
          NoticeActions.show(
            `Please check ${email} and verify your new email address.`,
          ),
        )
      }
    },

  updateSetting:
    (address: string, setting: string, enabled = true): AsyncAction =>
    async dispatch => {
      try {
        dispatch(FetchingActions.start(`Updating ${setting} setting...`))

        const url = `/account/update/${address}/`
        const data = await Transport.sendJSON(url, {
          method: "PUT",
          body: { setting, enabled },
        })
        await dispatch(UserActions._handleResponse(data))
      } catch (error) {
        dispatch(
          ErrorActions.show(
            error,
            `There was an error trying to set ${setting}`,
          ),
        )
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  verifyEmail: (): AsyncAction => async dispatch => {
    try {
      dispatch(FetchingActions.start(`Verifying email...`))
      await Auth.UNSAFE_login()
      const url = `/user/email/verify/`
      await Transport.sendJSON(url)
    } catch (error) {
      dispatch(ErrorActions.show(error))
    } finally {
      dispatch(FetchingActions.stop())
    }
  },

  /**
   * Call UserActions.cache if you want to save user data
   * to local storage
   */
  cache: (): AsyncAction => async (_dispatch, getState) => {
    if (IS_SERVER) {
      return
    }
    try {
      const userData = getState().user
      await localForage.setItem<User>(USER_STORE_KEY, userData)
    } catch (error) {
      // Browser probably blocked it, like Brave does for iframes.
      captureWarning(error)
    }
  },

  receive: (data: any): Action => {
    trackUser(data)
    return { type: ActionTypes.RECEIVE_USER, data }
  },

  receiveViewingUser: (data: any) => ({
    type: ActionTypes.RECEIVE_VIEWING_USER,
    data,
  }),

  bootstrapViewingUser: (data: any) => ({
    type: ActionTypes.RECEIVE_VIEWING_USER,
    bootstrapped: true,
    data,
  }),

  logout: (): AsyncAction => async dispatch => {
    await Auth.logout()
    await dispatch(UserActions.receive(null))
    await dispatch(UserActions.cache())
  },

  /**
   * Checks whether a user has an email address attached to their account
   * @returns whether the user has a set and verified email
   */
  enterEmailIfNeeded:
    (): AsyncAction<boolean> => async (dispatch, getState) => {
      await Auth.UNSAFE_login()
      await dispatch(UserActions.findCurrent())
      const state = getState()
      const { tokenName } = state.asset
      const { email, emailVerified } = state.user

      if (!email || !emailVerified) {
        if (!email) {
          await Router.push("/account/settings", {
            referrer: encodeURIComponent(Router.getPath()),
          })
          dispatch(
            NoticeActions.show(
              `Please set an email and verify it` +
                (tokenName ? ` to purchase from ${tokenName}.` : ``),
            ),
          )
        } else if (!emailVerified) {
          dispatch(
            NoticeActions.show(
              `Please check ${email} for a verification link and verify that email address` +
                (tokenName ? ` to purchase from ${tokenName}.` : ``),
            ),
          )
        }
        return false
      }
      return true
    },

  loadExternalEmail:
    (email: string): AsyncAction<void> =>
    async (dispatch, getState) => {
      const { user } = getState()
      if (user.email !== email) {
        dispatch(UserActions.receive({ email }))
        if (!user.publicUsername) {
          // Ask user to input their username
          await Router.push("/account/settings", {
            referrer: encodeURIComponent(Router.getPath()),
          })
          await delay(100)
          dispatch(
            NoticeActions.show(
              `Your wallet provided a${
                user.email ? " new" : "n"
              } email (visible to you only). Please add a username.`,
            ),
          )
        }
      }
    },

  _fetchWithAccount:
    (address: string | null, isCurrentUser = false): AsyncAction =>
    async dispatch => {
      if (!address) {
        await Auth.UNSAFE_login()
      }
      const path = `/user/${address ? address + "/" : ""}`
      try {
        const data = await Transport.fetch(path)
        await dispatch(UserActions._handleResponse(data, isCurrentUser))
      } catch (error) {
        if (
          error.message.startsWith(API_MESSAGE_404) ||
          error.message.startsWith(API_MESSAGE_403)
        ) {
          await dispatch(UserActions._handleResponse(null, isCurrentUser, true))
        } else {
          throw error
        }
      }
    },

  _logErrorAndLogout:
    (error: Error): AsyncAction =>
    async dispatch => {
      await dispatch(ErrorActions.show(error, `${error.message} | Logging out`))
      await dispatch(UserActions.logout())
      throw error
    },

  _handleResponse:
    (responseData: any, isCurrentUser = true, notFound = false): AsyncAction =>
    async dispatch => {
      const data = notFound ? {} : responseData
      if (isCurrentUser) {
        await dispatch(UserActions.receive(data))
        await dispatch(UserActions.cache())
      } else {
        await dispatch(UserActions.receiveViewingUser(data))
      }
    },
}

export default UserActions
