import Transport from "../lib/transport"
import { Tokens } from "../reducers/tokenlist"
import { Token } from "../reducers/tokens"
import { Action, AsyncAction } from "../store"
import * as ActionTypes from "./index"

const PREFETCH_LIMIT = 100

const TokenActions = {
  find:
    (symbol: string): AsyncAction<Token> =>
    async (dispatch, getState) => {
      if (!getState().tokens.tokens.length) {
        await dispatch(TokenActions.findAll())
      }
      const {
        tokens: { tokens },
      } = getState()
      const token = tokens.find(t => t.symbol === symbol)
      if (!token) {
        throw new Error("Token symbol doesn't match any known tokens.")
      }
      dispatch({ type: ActionTypes.SELECT_TOKEN, token })
      return token
    },

  findAll:
    (request?: Request): AsyncAction<Tokens> =>
    async (dispatch, getState) => {
      const { tokens } = getState()
      if (tokens.tokens.length) {
        return tokens
      }
      const data = await Transport.fetch(`/tokens/?limit=${PREFETCH_LIMIT}`, {
        request,
      })
      dispatch(TokenActions.receiveAll(data))
      return getState().tokens
    },

  receiveAll: (data: any): Action => ({
    type: ActionTypes.RECEIVE_TOKEN_LIST,
    data,
  }),

  reset: (): Action => ({
    type: ActionTypes.RESET_TOKEN,
  }),
}

export default TokenActions
