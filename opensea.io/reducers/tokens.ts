import { OpenSeaFungibleToken } from "opensea-js/lib/types"
import { tokenFromJSON } from "opensea-js/lib/utils"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { NULL_ACCOUNT } from "../constants"

export interface Token extends OpenSeaFungibleToken {
  ethPrice?: string
  usdPrice?: string
  imageUrl?: string
}

export const EMPTY_TOKEN_FOR_ETH: Token = {
  name: "Ether",
  address: NULL_ACCOUNT,
  symbol: "ETH",
  ethPrice: "1",
  decimals: 18,
}
const DEFAULT_TOKEN_ETH_PRICE = "0"

const initialState = EMPTY_TOKEN_FOR_ETH

const TokensReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SELECT_TOKEN:
      return action.token

    case ActionTypes.RESET_TOKEN:
      return initialState

    default:
      return state
  }
}

/**
 * Build a payment token using API data
 * @param tokenData data
 */
export function buildToken(tokenData: any): Token {
  if (!tokenData) {
    return EMPTY_TOKEN_FOR_ETH
  }
  const token = tokenFromJSON(tokenData)

  return {
    ...token,
    usdPrice: tokenData.usd_price,
    ethPrice: token.ethPrice
      ? token.ethPrice.toString()
      : DEFAULT_TOKEN_ETH_PRICE,
    imageUrl: token.imageUrl || `/static/images/icons/${token.symbol}.png`,
  }
}

export default TokensReducer
