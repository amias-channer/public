import BigNumber from "bignumber.js"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"

export interface ExchangeState {
  initializingProxy: boolean
  approvingAsset: boolean
  approvingAllAssets: boolean
  creatingOrder: boolean
  authorizingOrder: boolean
  cancellingOrder: boolean
  creatingTransaction: boolean
  fulfillingOrder: boolean

  approvingCurrency: boolean
  wrappingEth: boolean
  unwrappingWeth: boolean
  acceptingTerms: boolean

  transactionNotice: string | null
  transactionValue: string | BigNumber | null
  addressOfMissingToken: string | null
  isBuying: boolean
  pendingTransactionHash: string | null
}

const initialState: ExchangeState = {
  initializingProxy: false,
  approvingAsset: false,
  approvingAllAssets: false,
  creatingOrder: false,
  authorizingOrder: false,
  cancellingOrder: false,
  creatingTransaction: false,
  fulfillingOrder: false,

  approvingCurrency: false,
  wrappingEth: false,
  unwrappingWeth: false,
  acceptingTerms: false,

  transactionNotice: null,
  transactionValue: null,
  addressOfMissingToken: null,
  isBuying: false,
  pendingTransactionHash: null,
}

function ExchangeReducer(
  state = initialState,
  {
    type,
    transactionNotice,
    transactionValue,
    addressOfMissingToken,
    isBuying,
    hash,
  }: AnyAction,
): ExchangeState {
  switch (type) {
    case ActionTypes.INITIALIZE_PROXY:
      return {
        ...state,
        initializingProxy: true,
        transactionNotice,
      }
    case ActionTypes.APPROVE_ASSET:
      return {
        ...state,
        approvingAsset: true,
        transactionNotice,
      }
    case ActionTypes.APPROVE_ALL_ASSETS:
      return {
        ...state,
        approvingAllAssets: true,
        transactionNotice,
      }
    case ActionTypes.CREATE_TRANSACTION:
      return {
        ...state,
        creatingTransaction: true,
        transactionNotice,
        // Also remove authorizations,
        // which have no other way of knowing when they're all done
        approvingAsset: false,
        approvingAllAssets: false,
        approvingCurrency: false,
        authorizingOrder: false,
        // and any of those authorizations' txns:
        pendingTransactionHash: null,
      }
    case ActionTypes.CREATE_ORDER:
      return {
        ...state,
        creatingOrder: true,
        transactionNotice,
        // Also remove authorizations,
        // which have no other way of knowing when they're all done
        approvingAsset: false,
        approvingAllAssets: false,
        approvingCurrency: false,
        authorizingOrder: false,
        // and any of those authorizations' txns:
        pendingTransactionHash: null,
      }
    case ActionTypes.AUTHORIZE_ORDER:
      return {
        ...state,
        authorizingOrder: true,
        transactionNotice,
      }
    case ActionTypes.FULFILL_ORDER:
      return {
        ...state,
        acceptingTerms: false,
        fulfillingOrder: true,
        transactionNotice,
        transactionValue,
        addressOfMissingToken,
        isBuying,
      }
    case ActionTypes.CANCEL_ORDER:
      return {
        ...state,
        cancellingOrder: true,
        transactionNotice,
      }
    case ActionTypes.APPROVE_CURRENCY:
      return {
        ...state,
        approvingCurrency: true,
        transactionNotice,
      }
    case ActionTypes.WRAP_ETH:
      return {
        ...state,
        wrappingEth: true,
        transactionNotice,
      }
    case ActionTypes.UNWRAP_WETH:
      return {
        ...state,
        unwrappingWeth: true,
        transactionNotice,
      }
    case ActionTypes.PROMPT_TERMS_OF_SERVICE:
      return {
        ...state,
        acceptingTerms: true,
        transactionNotice,
      }
    case ActionTypes.SET_PENDING_TRANSACTION:
      return {
        ...state,
        creatingTransaction: false,
        pendingTransactionHash: hash,
        transactionNotice: transactionNotice || state.transactionNotice,
      }
    case ActionTypes.RESET_EXCHANGE:
      // Don't remove the last pending transaction so that the success page can
      // read it
      return {
        ...initialState,
        pendingTransactionHash: state.pendingTransactionHash,
      }
    default:
      return state
  }
}

export default ExchangeReducer
