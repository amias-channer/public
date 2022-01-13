import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { Asset, buildAsset } from "./assets"

export type Filter = Record<string, number | string>

export interface Assets {
  assets: Asset[]
  filter: Filter
  count: number
}

const INITIAL_FILTER: Filter = {
  order_by: "created_date",
  order_direction: "desc",
}
const INITIAL_STATE: Assets = {
  assets: [],
  filter: INITIAL_FILTER,
  count: 0,
}

const AssetListReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ASSET_LIST:
      return Object.assign({}, state, {
        assets: action.data.assets.map((item: any) => {
          return buildAsset(item)
        }),
        count: action.data.count,
      })

    case ActionTypes.RESET_ASSET_LIST:
      return Object.assign({}, state, {
        assets: [],
        filter: INITIAL_FILTER,
        count: 0,
      })

    case ActionTypes.APPEND_ASSET_LIST:
      return Object.assign({}, state, {
        assets: state.assets.concat(
          action.data.assets.map((item: any) => {
            return buildAsset(item)
          }),
        ),
        count: action.data.count,
      })

    case ActionTypes.SET_ASSET_FILTER:
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, action.filter),
      })

    case ActionTypes.RESET_ASSET_FILTER:
      return Object.assign({}, state, { filter: INITIAL_FILTER })

    default:
      return state
  }
}

export default AssetListReducer
