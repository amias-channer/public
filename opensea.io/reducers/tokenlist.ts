import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { buildToken, Token } from "./tokens"

export interface Tokens {
  tokens: Token[]
}

const initialState: Tokens = {
  tokens: [],
}

const TokenListReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TOKEN_LIST:
      return {
        ...state,
        tokens: action.data.map((item: any) => {
          return buildToken(item)
        }),
      }

    case ActionTypes.SELECT_TOKEN:
      return {
        ...state,
        tokens: [
          ...state.tokens.filter(t => t.symbol !== action.token.symbol),
          action.token,
        ],
      }

    default:
      return state
  }
}

export default TokenListReducer
