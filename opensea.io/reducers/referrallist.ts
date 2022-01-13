import _ from "lodash"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { Referral, buildReferral } from "./referrals"

export interface Referrals {
  referrals: Required<Referral>[]
  filter: object
  count: number
}

const INITIAL_FILTER = {}
const initialState: Referrals = {
  referrals: [],
  filter: INITIAL_FILTER,
  count: 0,
}

const ReferralListReducer = (
  state = initialState,
  action: AnyAction,
): Referrals => {
  switch (action.type) {
    case ActionTypes.APPEND_REFERRAL_LIST: {
      const appendedReferrals = action.referrals.map((item: any) => {
        return buildReferral(item)
      })
      return {
        referrals: _.uniqBy(state.referrals.concat(appendedReferrals), "id"),
        filter: state.filter,
        count: action.count,
      }
    }
    case ActionTypes.RESET_REFERRAL_LIST:
      return initialState

    case ActionTypes.RECEIVE_REFERRAL_LIST:
      return {
        referrals: action.referrals.map((item: any) => {
          return buildReferral(item)
        }),
        filter: state.filter,
        count: action.count,
      }

    case ActionTypes.SET_REFERRAL_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.filter,
        },
      }

    case ActionTypes.RESET_REFERRAL_FILTER:
      return {
        ...state,
        filter: INITIAL_FILTER,
      }

    default:
      return state
  }
}

export default ReferralListReducer
