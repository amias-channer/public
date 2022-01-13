import { AnyAction } from "redux"
import * as ActionTypes from "../actions"

export type Fetching = string | null

const FetchingReducer = (state = null, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.START_FETCHING:
      return action.message
    case ActionTypes.STOP_FETCHING:
      return null
    default:
      return state
  }
}

export default FetchingReducer
