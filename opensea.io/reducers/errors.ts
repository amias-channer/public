import { AnyAction } from "redux"
import * as ActionTypes from "../actions"

export type Error = string | null

const ErrorsReducer = (state: Error = null, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SHOW_ERROR:
      if (!action.error) {
        return null
      }
      return action.error
    case ActionTypes.RESET_ERROR:
      return null
    default:
      return state
  }
}

export default ErrorsReducer
