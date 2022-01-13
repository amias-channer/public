import { AnyAction } from "redux"
import * as ActionTypes from "../actions"

export type Notice = string | null

const NoticesReducer = (state: Notice = null, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SHOW_NOTICE:
      return action.notice
    case ActionTypes.RESET_NOTICE:
      return null
    default:
      return state
  }
}

export default NoticesReducer
