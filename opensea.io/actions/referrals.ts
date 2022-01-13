import { isValidAddress } from "ethereumjs-util"
import localForage from "localforage"
import qs from "qs"
import { AnyAction } from "redux"
import { IS_SERVER } from "../constants"
import { captureWarning } from "../lib/analytics/analytics"
import Router from "../lib/helpers/router"
import Transport from "../lib/transport"
import { PendingReferral } from "../reducers/referrals"
import { AsyncAction } from "../store"
import AccountActions from "./accounts"
import ErrorActions from "./errors"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"

const REFERRAL_STORE_KEY = "referral"

interface Filter {
  limit?: number
  offset?: number
}

const ReferralActions = {
  findByAddress:
    (
      address: string,
      { limit = 10, offset = 0 }: Filter = {},
    ): AsyncAction<void> =>
    async dispatch => {
      try {
        dispatch(FetchingActions.start("Getting referrals"))
        const path = `/referrals/${address}/?${qs.stringify({ limit, offset })}`
        const data = await Transport.fetch(path)

        if (offset !== 0) {
          dispatch(ReferralActions.appendAll(data))
        } else {
          dispatch(ReferralActions.receiveAll(data))
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  parseReferrer: async (refString: string): Promise<string | undefined> => {
    if (isValidAddress(refString)) {
      console.info(`Registering referrer address: ${refString}`)
      return refString
    } else if (refString) {
      const account = await AccountActions._findByUsername(refString)
      if (account) {
        console.info(
          `Registering referrer user: ${refString} (${account.address})`,
        )
        return account.address
      }
    }
    return undefined
  },

  // NFTv3
  /**
   * @param referrerAddress The address of the referrer
   * @param data Metadata to include with this referrer, like tokenID and address
   */
  setReferrerAddress:
    (referrerAddress: string, data = {}): AsyncAction<void> =>
    async dispatch => {
      dispatch({
        type: ActionTypes.SET_REFERRER_ADDRESS,
        referrerAddress,
        data,
      })
      await dispatch(ReferralActions._cache())
    },

  // NFTv3
  getLastReferral:
    (): AsyncAction<PendingReferral> => async (dispatch, getState) => {
      await dispatch(ReferralActions._loadCached())
      const { referrerAddress, data } = getState().referral
      const currentQuery = Router.getQueryParams()
      let referrer = referrerAddress
      if (!referrer && currentQuery.ref) {
        // Browsers like Brave block localstorage
        referrer = await ReferralActions.parseReferrer(
          currentQuery.ref as string,
        )
      }
      return {
        referrerAddress: referrer,
        data,
      }
    },

  reset: (): AsyncAction<void> => async dispatch => {
    await dispatch({ type: ActionTypes.RESET_PENDING_REFERRAL })
    await dispatch(ReferralActions._cache())
  },

  receive: (referral: any): AnyAction => ({
    type: ActionTypes.RECEIVE_PENDING_REFERRAL,
    referral,
  }),

  appendAll: (data: any): AnyAction => ({
    type: ActionTypes.APPEND_REFERRAL_LIST,
    referrals: data.referrals || data, // DEPRECATE array after BE deploy
    count: data.count || data.length,
  }),

  receiveAll: (data: any): AnyAction => ({
    type: ActionTypes.RECEIVE_REFERRAL_LIST,
    referrals: data.referrals || data, // DEPRECATE array after BE deploy
    count: data.count || data.length,
  }),

  /**
   * Call ReferralActions.cache if you want to save referral data
   * to local storage
   */
  _cache: (): AsyncAction<void> => async (_dispatch, getState) => {
    if (IS_SERVER) {
      return
    }
    try {
      const referralData = getState().referral
      await localForage.setItem(REFERRAL_STORE_KEY, referralData)
    } catch (error) {
      // Browser probably blocked it, like Brave does for iframes.
      captureWarning(error)
    }
  },

  /**
   * Load the cached referral
   * Must be called before affiliate requests
   */
  _loadCached: (): AsyncAction<void> => async dispatch => {
    if (IS_SERVER) {
      return
    }
    try {
      const referral = await localForage.getItem(REFERRAL_STORE_KEY)
      await dispatch(ReferralActions.receive(referral))
    } catch (error) {
      console.error(error)
      dispatch(ReferralActions.reset())
    }
  },
}

export default ReferralActions
