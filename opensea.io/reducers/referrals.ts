import BigNumber from "bignumber.js"
import moment, { Moment } from "moment"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { bn } from "../lib/helpers/numberUtils"
import { buildAsset, Asset } from "./assets"
import { Bundle, buildBundle } from "./bundles"
import { buildEvent, Event } from "./events"
import { buildToken, Token } from "./tokens"
import { buildTransaction, Transaction } from "./transactions"

export interface PendingReferral {
  referrerAddress?: string
  data: any
}

export interface Referral {
  id?: number
  createdDate?: Moment
  referredAddress?: string
  referredUsername?: string
  matchedSale?: Event
  asset?: Asset
  assetBundle?: Bundle
  reward?: BigNumber
  paymentToken?: Token

  // DEPRECATE
  referrerId?: number
  visitorCount?: number
  paymentTransaction?: Transaction
}

// For NFTv1 referrals,
// will also become a mapping of tokenAddress-tokenId to userId
const initialState = {
  referrerAddress: undefined,
  data: {},
}

const ReferralsReducer = (
  state: PendingReferral = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_PENDING_REFERRAL:
      if (!action.referral) {
        return initialState
      } else {
        return {
          ...state,
          ...action.referral,
        }
      }

    // REFERRAL NFTv3
    case ActionTypes.SET_REFERRER_ADDRESS:
      return {
        ...state,
        referrerAddress: action.referrerAddress,
        data: action.data || {},
      }

    case ActionTypes.RESET_PENDING_REFERRAL:
      return initialState

    default:
      return state
  }
}

/**
 * Build a referral object using data from the API
 * @param data Data from the API
 */
export function buildReferral(data: any): Referral {
  const paymentToken = buildToken(data["payment_token"])
  const referral: Referral = {
    id: data["id"],
    createdDate: moment.utc(data["created_date"]),
    referredAddress: data["referred_account"]
      ? data["referred_account"]["address"]
      : undefined,
    referredUsername:
      data["referred_account"] && data["referred_account"]["user"]
        ? data["referred_account"]["user"]["username"]
        : undefined,
    matchedSale: data["matched_sale"]
      ? buildEvent(data["matched_sale"])
      : undefined,
    asset: data["asset"] ? buildAsset(data["asset"]) : undefined,
    assetBundle: data["asset_bundle"]
      ? buildBundle(data["asset_bundle"])
      : undefined,
    reward: bn(data["reward"], paymentToken.decimals),
    paymentToken,

    // DEPRECATE
    referrerId: data["user"],
    visitorCount: data["visitor_count"],
    paymentTransaction: data["payment_transaction"]
      ? buildTransaction(data["payment_transaction"])
      : undefined,
  }
  return referral
}

export default ReferralsReducer
