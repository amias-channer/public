import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import {
  EscrowAuction,
  ExtendedOrder,
  buildAuction,
  buildOrder,
} from "./auctions"

const ORDER_PAGE_SIZE = 20

const INITIAL_FILTER = {
  // For orders
  maker: undefined,
  owner: undefined,
  side: undefined,
  include_invalid: false,
  // for auctions and orders
  // order_by: "started_at",
  // order_direction: "desc"
}

const INITIAL_STATE = {
  auctions: [],
  bids: [],
  filter: INITIAL_FILTER,
  offset: 0,
  hasMore: true,
}

export interface Auctions {
  auctions: EscrowAuction[]
  bids: ExtendedOrder[]
  count?: number
  filter: object
  hasMore: boolean
  offset: number
}

const AuctionListReducer = (
  state = INITIAL_STATE,
  action: AnyAction,
): Auctions => {
  let bids

  switch (action.type) {
    case ActionTypes.RECEIVE_AUCTION_LIST:
      return {
        ...state,
        auctions: action.data.auctions.map((item: any) => {
          return buildAuction(item, true)
        }),
        filter: state.filter,
        count: action.data.count,
      }

    case ActionTypes.RESET_BID_LIST:
      return {
        ...state,
        bids: [],
        offset: 0,
        hasMore: true,
      }

    case ActionTypes.PAGINATE_BIDS:
      return {
        ...state,
        offset: state.offset + ORDER_PAGE_SIZE,
      }

    case ActionTypes.RECEIVE_BID_LIST:
      bids = action.data.orders.map(buildOrder)
      return {
        ...state,
        bids,
        filter: state.filter,
        count: action.data.count,
        hasMore: bids.length >= ORDER_PAGE_SIZE,
      }

    case ActionTypes.APPEND_BID_LIST:
      bids = action.data.orders.map((item: any) => {
        return buildOrder(item)
      })
      return {
        ...state,
        bids: state.bids.concat(bids),
        filter: state.filter,
        count: action.data.count,
        hasMore: bids.length >= ORDER_PAGE_SIZE,
      }

    case ActionTypes.RESET_AUCTION_LIST:
      return {
        ...state,
        auctions: [],
        filter: state.filter,
        count: 0,
      }

    case ActionTypes.APPEND_AUCTION_LIST:
      return {
        ...state,
        auctions: state.auctions.concat(
          action.data.auctions.map((item: any) => {
            return buildAuction(item, true)
          }),
        ),
        filter: state.filter,
        count: action.data.count,
      }

    case ActionTypes.SET_AUCTION_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.filter,
        },
      }

    case ActionTypes.RESET_AUCTION_FILTER:
      return Object.assign({}, state, { filter: INITIAL_FILTER })

    default:
      return state
  }
}

export default AuctionListReducer
